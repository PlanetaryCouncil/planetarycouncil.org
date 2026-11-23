#!/usr/bin/env node
// Build one bio page per person: people/data/<id>.json -> people/<id>.html, plus people/index.html.
//   node build-people.mjs
// The JSON is the source of truth; the HTML is generated — edit the JSON and rebuild.
// Every fact on a page must be traceable to an entry in its `sources`.
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const dataDir = join(here, "people", "data");
const CAP = 1; // US$ billions

const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const usd = b => "$" + (b >= 100 ? b.toFixed(0) : b >= 10 ? b.toFixed(1) : b.toFixed(2).replace(/0$/, "")) + "B";

const people = readdirSync(dataDir).filter(f => f.endsWith(".json")).map(f => {
  const p = JSON.parse(readFileSync(join(dataDir, f), "utf8"));
  if (p.id !== f.replace(/\.json$/, "")) throw new Error(`${f}: id "${p.id}" must match the filename`);
  for (const k of ["name", "tagline", "list", "bio", "sources"]) if (!p[k]) throw new Error(`${f}: missing ${k}`);
  if (!p.sources.length) throw new Error(`${f}: a page with no sources does not get built`);
  return p;
}).sort((a, b) => (b.net_worth_usd_b ?? 0) - (a.net_worth_usd_b ?? 0) || a.name.localeCompare(b.name));

const worth = p => p.net_worth_usd_b != null ? usd(p.net_worth_usd_b) : esc(p.net_worth_text || "—");
const above = p => p.net_worth_usd_b != null ? usd(Math.max(0, p.net_worth_usd_b - CAP)) : "—";

const head = (title, desc) => `<!DOCTYPE html>
<html lang="en">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wght@500;600;800;900&family=IBM+Plex+Mono:wght@400;500;600&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600&display=swap">
<style>
  :root { --ground:#eceef1; --panel:#fbfcfd; --ink:#101a2b; --ink-soft:#4d5a70; --ink-faint:#7f8a9d; --rule:#c8d0dc; --rule-soft:#dfe4ec; --gold:#8a6a12; --living:#1f6b4f; }
  @media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { --ground:#0a0f18; --panel:#111826; --ink:#e6ebf2; --ink-soft:#97a4b8; --ink-faint:#6d7b90; --rule:#26313f; --rule-soft:#1a2331; --gold:#d7a53f; --living:#5cc39a; } }
  :root[data-theme="dark"] { --ground:#0a0f18; --panel:#111826; --ink:#e6ebf2; --ink-soft:#97a4b8; --ink-faint:#6d7b90; --rule:#26313f; --rule-soft:#1a2331; --gold:#d7a53f; --living:#5cc39a; }
  * { box-sizing: border-box; }
  body { margin:0; background:var(--ground); color:var(--ink); font-family:"Source Serif 4",Georgia,serif; font-size:17px; line-height:1.6; -webkit-font-smoothing:antialiased; }
  .wrap { max-width:760px; margin:0 auto; padding:0 20px 72px; }
  .mono, .slug, .k, .figs dt, .src, .note { font-family:"IBM Plex Mono",ui-monospace,Menlo,monospace; font-variant-numeric:tabular-nums; }
  .slug { display:flex; flex-wrap:wrap; gap:6px 18px; padding:22px 0 0; font-size:12px; letter-spacing:.08em; text-transform:uppercase; color:var(--ink-faint); }
  a { color:inherit; text-decoration-color:var(--rule); text-underline-offset:3px; }
  a:hover { text-decoration-color:currentColor; }
  h1 { font-family:"Archivo",sans-serif; font-weight:900; font-size:clamp(38px,9vw,64px); line-height:1; letter-spacing:-.02em; margin:34px 0 10px; text-wrap:balance; }
  .tag { margin:0; font-size:19px; color:var(--ink-soft); max-width:46ch; }
  .figs { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:0; margin:30px 0 0; border:1px solid var(--rule); background:var(--panel); }
  .figs div { padding:16px 18px; border-right:1px solid var(--rule-soft); }
  .figs div:last-child { border-right:0; }
  .figs dt { font-size:11px; letter-spacing:.08em; text-transform:uppercase; color:var(--ink-faint); }
  .figs dd { margin:6px 0 0; font-family:"Archivo",sans-serif; font-weight:800; font-size:26px; }
  .figs .gold { color:var(--gold); } .figs .living { color:var(--living); }
  .facts { display:grid; grid-template-columns:max-content minmax(0,1fr); gap:6px 20px; margin:26px 0 0; padding:18px 0; border-top:1px solid var(--rule); border-bottom:1px solid var(--rule); font-size:15.5px; }
  .facts dt { color:var(--ink-faint); } .facts dd { margin:0; }
  .bio p { margin:22px 0 0; max-width:66ch; }
  h2 { font-family:"IBM Plex Mono",monospace; font-weight:500; font-size:12px; letter-spacing:.12em; text-transform:uppercase; color:var(--gold); margin:40px 0 0; }
  .treaty { margin:12px 0 0; padding:18px 20px; border:1px solid var(--rule); border-left:3px solid var(--gold); background:var(--panel); }
  .treaty p { margin:0; } .treaty p + p { margin-top:10px; color:var(--ink-soft); font-size:15.5px; }
  .src { margin:12px 0 0; padding:0; list-style:none; font-size:13px; color:var(--ink-soft); }
  .src li { margin:6px 0; overflow-wrap:anywhere; }
  .note { margin:34px 0 0; font-size:12px; color:var(--ink-faint); }
  .roll { list-style:none; margin:30px 0 0; padding:0; border-top:1px solid var(--rule); }
  .roll li { display:grid; grid-template-columns:minmax(0,1fr) auto; gap:2px 16px; padding:16px 0; border-bottom:1px solid var(--rule-soft); }
  .roll a { font-family:"Archivo",sans-serif; font-weight:800; font-size:20px; text-decoration:none; }
  .roll a:hover { text-decoration:underline; }
  .roll .w { font-family:"IBM Plex Mono",monospace; font-size:15px; color:var(--gold); text-align:right; }
  .roll .t { grid-column:1 / -1; color:var(--ink-soft); font-size:15.5px; }
  @media (max-width:520px) { .figs { grid-template-columns:1fr; } .figs div { border-right:0; border-bottom:1px solid var(--rule-soft); } .figs div:last-child { border-bottom:0; } }
</style>
`;

const DISCLAIMER = "This page describes a public figure from published sources. They have not been asked to sign the treaty, have not signed it, and nothing here speaks for them.";

for (const p of people) {
  const html = head(`${p.name} — Billionaire Non-Proliferation Treaty`, p.tagline) + `
<div class="wrap">
  <div class="slug">
    <span><a href="../">&larr; The Treaty</a></span>
    <span><a href="./">The register</a></span>
    <span>Not yet asked &middot; not signed</span>
  </div>

  <h1>${esc(p.name)}</h1>
  <p class="tag">${esc(p.tagline)}</p>

  <dl class="figs">
    <div><dt>Net worth</dt><dd class="gold">${worth(p)}</dd></div>
    <div><dt>Above the cap</dt><dd class="living">${above(p)}</dd></div>
    <div><dt>Rank</dt><dd>${p.rank != null ? "#" + Number(p.rank).toLocaleString("en-US") : "&mdash;"}</dd></div>
  </dl>

  <dl class="facts">
${(p.facts || []).map(f => `    <dt>${esc(f.k)}</dt><dd>${esc(f.v)}</dd>`).join("\n")}
    <dt>Listed by</dt><dd>${esc(p.list)}</dd>
  </dl>

  <div class="bio">
${p.bio.map(t => `    <p>${esc(t)}</p>`).join("\n")}
  </div>

  <h2>Under the treaty</h2>
  <div class="treaty">
    <p>${esc(p.treaty_note || "")}</p>
    <p>${DISCLAIMER}</p>
  </div>

  <h2>Sources</h2>
  <ul class="src">
${p.sources.map(s => `    <li><a href="${esc(s.url)}" rel="noopener noreferrer">${esc(s.label || s.url)}</a></li>`).join("\n")}
  </ul>

  <p class="note">Corrections: <a href="https://t.me/planetarycouncil">t.me/planetarycouncil</a></p>
</div>
`;
  writeFileSync(join(here, "people", `${p.id}.html`), html);
}

const index = head("The register — Billionaire Non-Proliferation Treaty", "One page per person, from published sources.") + `
<div class="wrap">
  <div class="slug">
    <span><a href="../">&larr; The Treaty</a></span>
    <span>${people.length} of 3,385 written up</span>
  </div>
  <h1>The register</h1>
  <p class="tag">One page per person, from published sources. Nobody here has been asked to sign, and nobody has.</p>
  <ul class="roll">
${people.map(p => `    <li><a href="./${p.id}.html">${esc(p.name)}</a><span class="w">${worth(p)}</span><span class="t">${esc(p.tagline)}</span></li>`).join("\n")}
  </ul>
</div>
`;
writeFileSync(join(here, "people", "index.html"), index);
console.log(`Built ${people.length} page(s) + people/index.html`);
