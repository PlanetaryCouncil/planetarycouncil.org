# The War Crimes Safari

Documented war crimes and related repression — Gaza & the West Bank, 2023–2026.
Goal: **the most-documented war crimes record in history.** Every claim independently sourced.

## Files

- **`data.json`** — the canonical dataset. 20 incidents (17 main + 3 closers). The page is just a renderer; all curation happens here.
- **`index.html`** — static renderer, no dependencies. Serve the folder over HTTP (`python3 -m http.server 8315`) and open `localhost:8315`. Every card is deep-linkable: `/#hind-rajab`, `/#flour-massacre`, …
- `.claude/launch.json` — dev server config.

## Schema (per incident)

| field | meaning |
|---|---|
| `id` | stable slug, also the page anchor |
| `section` | `main` or `closers` |
| `title`, `date` | sober factual title; date or range |
| `summary` | 2 sentences, attributed ("according to…") |
| `links` | `[{url, source}]` — independent sources. **Add as many as you find; 3 is the floor, not the ceiling.** |
| `wikipedia` | most relevant Wikipedia article |
| `official` | `{url, label}` — the official Israeli response, primary source where one exists (gov.il / idf.il / official X) |
| `image` | `{src, page, credit, license}` — freely licensed embed (Wikimedia Commons only) |
| `photo` | `{url, source}` — link out to an iconic copyrighted photo when no free image exists |
| `verify` | open curation caveat, rendered as ⚠ on the card |

## Roadmap

1. **Curation pass** — resolve the ⚠ flags (the "rocket jump" clip identification; the malformed Doctors Under Fire full-film YouTube ID `iv3wpeJ6Ocos`); swap in your preferred video links from the sheet.
2. **The Docket (accountability section)** — the "prosecute the top 20" piece, grounded in documented proceedings, not our own accusations: ICC arrest warrants (Netanyahu, Gallant — 21 Nov 2024), the ICJ genocide case and the officials whose statements it cites, universal-jurisdiction complaints (Hind Rajab Foundation has filed against dozens of soldiers), commanders named in published investigations. Each person: role, documented acts/statements, proceeding, sources — same JSON discipline.
3. **Lebanon section** — from the sheet: villa, bridges, ambulance double-tap, solar panels, nun, Jesus smash, monastery. Same pipeline (one research agent per item).
4. **Evidence hardening** — add an `archive` field per link (archive.org snapshot of every source, so link-rot can't erase the record); tag sources by type (`news / un / ngo / primary / video`).
5. **Publish** — `git init`, GitHub Pages or a domain. The JSON-first structure means others can fork, verify, and extend the dataset.

## Method

Built with parallel research agents: every incident researched independently; every link appeared literally in search results (never constructed); images embedded only when freely licensed on Wikimedia Commons, with credit + license shown; official Israeli responses linked as primary sources wherever one exists.
