/* ===== shared constants & decode primitives (used by index.html + decode.html) ===== */
const QUESTIONS = [
  {icon:"🗳️", t:"Voting system — should the UK use proportional representation?"},
  {icon:"⚡", t:"Public ownership of infrastructure (energy, water, rail)?"},
  {icon:"🚆", t:"Rail automation — should more be automated?"},
  {icon:"📡", t:"5G & broadband — treat it as essential public infrastructure?"},
  {icon:"🌊", t:"Climate resilience — more investment in flood defences & insulation?"},
  {icon:"🪖", t:"Military spending — should it be reduced?"},
  {icon:"🏭", t:"Arms production — allow foreign-owned arms companies?"},
  {icon:"🏛️", t:"House of Commons — replace with a more collaborative chamber?"},
  {icon:"👑", t:"House of Lords — keep, reform or replace?"},
  {icon:"🇪🇺", t:"Europe — should the UK rejoin the EU Single Market?"},
];
const VALUES = [2,1,0,-1,-2];
const COLS = {2:"#128a26",1:"#7ed957",0:"#ffe11a","-1":"#ff9a1e","-2":"#f0141e"};
const LABELS = {2:"Strongly agree",1:"Generally agree",0:"No opinion","-1":"Generally disagree","-2":"Strongly disagree"};

/* card geometry + one-time-pad grid parameters
   11 columns × 3 rows of grey squares:
     col 0      = black calibration anchor (all rows)
     cols 1..9  = data columns (9)
     col 10     = white calibration anchor (all rows)
   row 0 = one-time pad (random 0..4 per column, fresh each seal)
   row 1 = cipher for payload digits 0..8   = (digit + pad[col]) mod 5
   row 2 = cipher for payload digits 9..17  = (digit + pad[col]) mod 5
   The pad randomises every square, so all three rows read as grey noise. */
const CARD_W=1080, CARD_H=1080;
const GRID={x0:140, x1:940, y0:745, cols:11, rows:3, rowH:20};
const EPOCH_UTC=Date.UTC(2020,0,1);
const LEVELS=[64,100,136,172,208];            // 5 data greys, ~36 apart
const ANCHOR_B=28, ANCHOR_W=236;              // calibration black & white
const NORM=LEVELS.map(l=>(l-ANCHOR_B)/(ANCHOR_W-ANCHOR_B));
const MAGIC = [0x42,0x49,0x4E,0x46];          // "BINF"
const gridCellW = ()=> (GRID.x1-GRID.x0)/GRID.cols;

/* payload (exact): 1 version + 4 ts(sec) + 3 answersInt(base-5) */
function unpackBytes(b){
  if(b[0]!==1) throw new Error("bad version");
  const ts = (b[1]<<24)|(b[2]<<16)|(b[3]<<8)|b[4];
  let ai = (b[5]<<16)|(b[6]<<8)|b[7];
  const vals = new Array(10);
  for(let i=9;i>=0;i--){ vals[i]=(ai%5)-2; ai=Math.floor(ai/5); }
  return {ts: ts>>>0, answers: vals};
}

/* LSB extraction (only survives a pristine, unresized PNG) */
function extract(imgData){
  const d = imgData.data;
  const bitsNeededMax = (4+2+64)*8;
  const bits=[];
  for(let p=0; p<d.length && bits.length<bitsNeededMax; p+=4){
    for(let c=0;c<3 && bits.length<bitsNeededMax;c++) bits.push(d[p+c]&1);
  }
  const byteAt = n => { let v=0; for(let k=0;k<8;k++) v=(v<<1)|bits[n*8+k]; return v; };
  for(let i=0;i<4;i++) if(byteAt(i)!==MAGIC[i]) return null;
  const len = (byteAt(4)<<8)|byteAt(5);
  if(len<1||len>64) return null;
  const payload = new Uint8Array(len);
  for(let i=0;i<len;i++) payload[i]=byteAt(6+i);
  return payload;
}

/* one-time-pad grid reader (robust to recompression / screenshots / resize) */
function readGrid(img){
  const c=document.createElement('canvas'); c.width=CARD_W; c.height=CARD_H;
  const cx=c.getContext('2d'); cx.drawImage(img,0,0,CARD_W,CARD_H);
  const colW=gridCellW();
  const sample=(col,row)=>{
    const x=GRID.x0+(col+0.5)*colW, y=GRID.y0+(row+0.5)*GRID.rowH;
    const w=Math.max(4,Math.round(colW*0.4)), h=Math.max(4,Math.round(GRID.rowH*0.5));
    const d=cx.getImageData(Math.round(x-w/2), Math.round(y-h/2), w, h).data;
    let s=0,n=0; for(let p=0;p<d.length;p+=4){ s+=0.299*d[p]+0.587*d[p+1]+0.114*d[p+2]; n++; }
    return s/n;
  };
  // calibrate from the black (col 0) and white (col 10) anchor columns
  let B=0,W=0; for(let r=0;r<3;r++){ B+=sample(0,r); W+=sample(GRID.cols-1,r); } B/=3; W/=3;
  if(W-B < 45) return null;                                   // no calibration span → not our grid
  const snap=lum=>{ const nrm=(lum-B)/(W-B); let best=0,bd=1e9;
    for(let k=0;k<5;k++){ const dd=Math.abs(nrm-NORM[k]); if(dd<bd){bd=dd;best=k;} } return best; };
  const pad=[], c1=[], c2=[];
  for(let d=0;d<9;d++){ pad.push(snap(sample(d+1,0))); c1.push(snap(sample(d+1,1))); c2.push(snap(sample(d+1,2))); }
  const payload=new Array(18);
  for(let d=0;d<9;d++){ payload[d]=(c1[d]-pad[d]+5)%5; payload[9+d]=(c2[d]-pad[d]+5)%5; }
  const data=payload.slice(0,17), extra=payload[17];
  if(data.slice(0,16).reduce((a,b)=>a+b,0)%5 !== data[16]) return null;   // checksum 1
  if(data.reduce((a,b)=>a+b,0)%5 !== extra) return null;                  // checksum 2
  const answersOut=[]; for(let i=0;i<10;i++) answersOut.push(data[i]-2);
  let days=0; for(let k=0;k<6;k++) days=days*5+data[10+k];
  return {answers:answersOut, ts:Math.floor((EPOCH_UTC+days*86400000)/1000), coarse:true};
}

/* base64url helpers for the opaque secret link */
function b64url(bytes){ let s=btoa(String.fromCharCode(...bytes)); return s.replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,''); }
function unb64url(s){ s=s.replace(/-/g,'+').replace(/_/g,'/'); const bin=atob(s); const b=new Uint8Array(bin.length); for(let i=0;i<bin.length;i++)b[i]=bin.charCodeAt(i); return b; }

/* remembered own answers for the alignment score */
function loadMine(){
  try{ return JSON.parse(localStorage.getItem('binface_mine')||'null'); }catch(e){ return null; }
}

/* deterministic short "Seal ID" over answers + timestamp (FNV-1a) — a verifiable
   fingerprint of the record, recomputed identically on decode. Not cryptographic. */
function sealId(answersArr, ts){
  let h=0x811c9dc5>>>0;
  const day = Math.floor(ts/86400);   // day-resolution → identical across grid/link/LSB decode paths
  const s = answersArr.map(a=>a==null?0:a).join(',')+'|'+day;
  for(let i=0;i<s.length;i++){ h^=s.charCodeAt(i); h=Math.imul(h,0x01000193)>>>0; }
  const hex=h.toString(16).toUpperCase().padStart(8,'0');
  return hex.slice(0,4)+'-'+hex.slice(4,8);
}
function fmtUTC(ts){ return new Date(ts*1000).toUTCString(); }
function fmtISO(ts){ return new Date(ts*1000).toISOString().slice(0,19)+'Z'; }
