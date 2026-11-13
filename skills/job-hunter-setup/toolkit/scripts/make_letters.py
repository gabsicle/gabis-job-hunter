#!/usr/bin/env python3
"""Render tailored one-page cover letters to PDF.

Usage:
  python3 make_letters.py letters.json [OUT_DIR]   # writes <key>.pdf into OUT_DIR (default: next to letters.json)

letters.json:
{
  "candidate": {"name": "...", "tagline": "...", "contact_line": "City • +49 ... • mail • linkedin", "accent": "#12233f"},
  "letters": {
    "Lastname_Cover_Letter_Acme": {
      "lang": "en",                       # en | de | es ... (sets hyphenation)
      "recipient_html": "Acme Capital<br>Portfolio Operations",
      "place_date": "Berlin, 30 October 2026",
      "subject": "Application: Director Portfolio Operations",
      "salutation": "Dear Hiring Team,",
      "paragraphs": ["...", "..."],        # may contain &nbsp; or <br>
      "signoff": "Kind regards"
    }
  }
}
Needs: Node + Playwright (Chromium), pdfinfo (poppler). Fonts are bundled in ./fonts; the intermediate
HTML is written next to the template so they resolve, and removed afterwards.
Checks every PDF is exactly one page and prints a warning otherwise.
"""
import json, sys, subprocess, pathlib

here = pathlib.Path(__file__).resolve().parent
tpl = (here / 'letter_template.html').read_text(encoding='utf-8')
src = pathlib.Path(sys.argv[1]).resolve()
cfg = json.loads(src.read_text(encoding='utf-8'))
outdir = pathlib.Path(sys.argv[2]).resolve() if len(sys.argv) > 2 else src.parent
outdir.mkdir(parents=True, exist_ok=True)
cand = cfg['candidate']

def fill(t, d):
    for k, v in d.items():
        t = t.replace('{{' + k + '}}', v)
    return t

jobs = []
for key, L in cfg['letters'].items():
    paras = ''.join(f'<p>{p}</p>\n' for p in L['paragraphs'])
    page = fill(tpl, {**cand, **{k: v for k, v in L.items() if isinstance(v, str)}, 'paragraphs_html': paras})
    tmp = here / f'_tmp_{key}.html'
    tmp.write_text(page, encoding='utf-8')
    jobs.append((tmp, outdir / f'{key}.pdf'))

js = """
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const p = await b.newPage();
  for (const a of process.argv.slice(2)) { const [src, dst] = a.split('::');
    await p.goto('file://' + src); await p.evaluate(() => document.fonts.ready);
    await p.pdf({ path: dst, preferCSSPageSize: true, printBackground: true }); }
  await b.close(); })();
"""
runner = here / '_render.js'
runner.write_text(js)
try:
    subprocess.run(['node', str(runner), *[f'{a}::{b}' for a, b in jobs]], check=True)
finally:
    for tmp, _ in jobs:
        tmp.unlink(missing_ok=True)

for _, pdf in jobs:
    info = subprocess.run(['pdfinfo', str(pdf)], capture_output=True, text=True).stdout
    n = [l for l in info.splitlines() if l.startswith('Pages')]
    ok = bool(n) and n[0].split()[-1] == '1'
    print(pdf.name, n[0] if n else '?', '' if ok else '  <-- WARNING: not one page, shorten the text')
