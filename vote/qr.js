/* qr.js — minimal QR encoder: byte mode, EC level M, versions 1–3 (single RS block),
   automatic best-mask selection per ISO/IEC 18004. No dependencies.
   qrMatrix(text) -> boolean[size][size], true = dark module. */
(function(root){
"use strict";

/* GF(256), reducing polynomial 0x11D */
const EXP=new Array(510), LOG=new Array(256);
(function(){ let x=1; for(let i=0;i<255;i++){ EXP[i]=x; LOG[x]=i; x<<=1; if(x&0x100) x^=0x11D; } for(let i=255;i<510;i++) EXP[i]=EXP[i-255]; })();
const gmul=(a,b)=>(a===0||b===0)?0:EXP[LOG[a]+LOG[b]];

function rsDivisor(degree){
  const result=new Array(degree).fill(0); result[degree-1]=1;
  let root=1;
  for(let i=0;i<degree;i++){
    for(let j=0;j<degree;j++){
      result[j]=gmul(result[j],root);
      if(j+1<degree) result[j]^=result[j+1];
    }
    root=gmul(root,2);
  }
  return result;
}
function rsRemainder(data,divisor){
  const result=new Array(divisor.length).fill(0);
  for(const b of data){
    const factor=b^result.shift();
    result.push(0);
    for(let i=0;i<divisor.length;i++) result[i]^=gmul(divisor[i],factor);
  }
  return result;
}

/* EC level M, versions 1–3: [total codewords, ecc codewords] — single block each */
const VER={1:[26,10],2:[44,16],3:[70,26]};

function qrMatrix(text){
  const bytes=Array.from(new TextEncoder().encode(text));
  let ver=0;
  for(const v of [1,2,3]){ if(bytes.length<=VER[v][0]-VER[v][1]-2){ ver=v; break; } }
  if(!ver) throw new Error("QR: text too long ("+bytes.length+" bytes, max 42)");
  const total=VER[ver][0], ecc=VER[ver][1], dataCap=total-ecc;

  /* bit stream: mode 0100, 8-bit count, data, terminator, pad bytes */
  const bits=[];
  const push=(val,len)=>{ for(let i=len-1;i>=0;i--) bits.push((val>>>i)&1); };
  push(4,4);
  push(bytes.length,8);
  for(const b of bytes) push(b,8);
  for(let i=0;i<4 && bits.length<dataCap*8;i++) bits.push(0);
  while(bits.length%8) bits.push(0);
  const data=[];
  for(let i=0;i<bits.length;i+=8){ let v=0; for(let j=0;j<8;j++) v=(v<<1)|bits[i+j]; data.push(v); }
  for(let p=0xEC; data.length<dataCap; p^=0xFD) data.push(p);
  const all=data.concat(rsRemainder(data,rsDivisor(ecc)));

  /* matrix + function-module map */
  const size=17+4*ver;
  const mod=Array.from({length:size},()=>new Array(size).fill(false));
  const fun=Array.from({length:size},()=>new Array(size).fill(false));
  const set=(x,y,dark)=>{ mod[y][x]=dark; fun[y][x]=true; };

  function finder(cx,cy){
    for(let dy=-4;dy<=4;dy++)for(let dx=-4;dx<=4;dx++){
      const x=cx+dx, y=cy+dy;
      if(x<0||y<0||x>=size||y>=size) continue;
      const dist=Math.max(Math.abs(dx),Math.abs(dy));
      set(x,y, dist!==2 && dist!==4);
    }
  }
  finder(3,3); finder(size-4,3); finder(3,size-4);
  for(let i=8;i<size-8;i++){ if(!fun[6][i]) set(i,6,i%2===0); if(!fun[i][6]) set(6,i,i%2===0); }
  if(ver>=2){
    const c=size-7;
    for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++)
      set(c+dx,c+dy, Math.max(Math.abs(dx),Math.abs(dy))!==1);
  }
  /* reserve format-info areas + dark module */
  for(let i=0;i<=8;i++){ if(i!==6){ set(8,i,false); set(i,8,false); } }
  for(let i=0;i<8;i++){ set(size-1-i,8,false); set(8,size-1-i,false); }
  set(8,size-8,true);

  /* zigzag data placement */
  let bi=0;
  for(let right=size-1; right>=1; right-=2){
    if(right===6) right=5;
    for(let vert=0; vert<size; vert++){
      for(let j=0;j<2;j++){
        const x=right-j;
        const upward=((right+1)&2)===0;
        const y=upward? size-1-vert : vert;
        if(!fun[y][x] && bi<all.length*8){
          mod[y][x]=((all[bi>>>3]>>>(7-(bi&7)))&1)===1;
          bi++;
        }
      }
    }
  }

  /* masking: try all 8, keep lowest penalty */
  const maskFns=[
    (x,y)=>(x+y)%2===0,
    (x,y)=>y%2===0,
    (x,y)=>x%3===0,
    (x,y)=>(x+y)%3===0,
    (x,y)=>(Math.floor(x/3)+Math.floor(y/2))%2===0,
    (x,y)=>x*y%2+x*y%3===0,
    (x,y)=>(x*y%2+x*y%3)%2===0,
    (x,y)=>((x+y)%2+x*y%3)%2===0,
  ];
  const applyMask=m=>{
    for(let y=0;y<size;y++)for(let x=0;x<size;x++)
      if(!fun[y][x]&&maskFns[m](x,y)) mod[y][x]=!mod[y][x];
  };
  function drawFormat(mask){
    const d=(0<<3)|mask;                     /* EC level M = 0b00 */
    let rem=d;
    for(let i=0;i<10;i++) rem=(rem<<1)^((rem>>>9)*0x537);
    const f=((d<<10)|rem)^0x5412;
    const bit=i=>((f>>>i)&1)===1;
    for(let i=0;i<=5;i++) set(8,i,bit(i));
    set(8,7,bit(6)); set(8,8,bit(7)); set(7,8,bit(8));
    for(let i=9;i<15;i++) set(14-i,8,bit(i));
    for(let i=0;i<8;i++) set(size-1-i,8,bit(i));
    for(let i=8;i<15;i++) set(8,size-15+i,bit(i));
    set(8,size-8,true);
  }
  function penalty(){
    let res=0;
    for(let y=0;y<size;y++){                          /* runs in rows */
      let rc=null,rl=0;
      for(let x=0;x<size;x++){
        if(mod[y][x]===rc){ rl++; if(rl===5)res+=3; else if(rl>5)res++; }
        else{ rc=mod[y][x]; rl=1; }
      }
    }
    for(let x=0;x<size;x++){                          /* runs in cols */
      let rc=null,rl=0;
      for(let y=0;y<size;y++){
        if(mod[y][x]===rc){ rl++; if(rl===5)res+=3; else if(rl>5)res++; }
        else{ rc=mod[y][x]; rl=1; }
      }
    }
    for(let y=0;y<size-1;y++)for(let x=0;x<size-1;x++){   /* 2x2 blocks */
      const c=mod[y][x];
      if(c===mod[y][x+1]&&c===mod[y+1][x]&&c===mod[y+1][x+1]) res+=3;
    }
    const P1=[1,0,1,1,1,0,1,0,0,0,0].map(Boolean);        /* finder-like */
    const P2=[0,0,0,0,1,0,1,1,1,0,1].map(Boolean);
    for(let y=0;y<size;y++)for(let x=0;x<=size-11;x++){
      let m1=true,m2=true;
      for(let k=0;k<11;k++){ if(mod[y][x+k]!==P1[k])m1=false; if(mod[y][x+k]!==P2[k])m2=false; }
      if(m1)res+=40; if(m2)res+=40;
    }
    for(let x=0;x<size;x++)for(let y=0;y<=size-11;y++){
      let m1=true,m2=true;
      for(let k=0;k<11;k++){ if(mod[y+k][x]!==P1[k])m1=false; if(mod[y+k][x]!==P2[k])m2=false; }
      if(m1)res+=40; if(m2)res+=40;
    }
    let dark=0;
    for(let y=0;y<size;y++)for(let x=0;x<size;x++) if(mod[y][x]) dark++;
    const tot=size*size;
    res+=(Math.ceil(Math.abs(dark*20-tot*10)/tot)-1)*10;  /* balance */
    return res;
  }
  let best=0,bestScore=Infinity;
  for(let m=0;m<8;m++){
    applyMask(m); drawFormat(m);
    const s=penalty();
    if(s<bestScore){ bestScore=s; best=m; }
    applyMask(m);                                        /* XOR undo */
  }
  applyMask(best); drawFormat(best);
  return mod;
}

if(typeof module!=="undefined"&&module.exports) module.exports={qrMatrix};
else root.qrMatrix=qrMatrix;
})(typeof self!=="undefined"?self:this);
