#!/usr/bin/env python3
"""Tracker CLI - one call per batch, one printed line per result. Backs the tracker up to _QA/ once per day before writing.

  trk.py FILE known                                   # company names already in the tracker (de-duplicate before applying)
  trk.py FILE list [status]                           # company | status | next step
  trk.py FILE upd '<json [[company_substr, status, next_step, note], ...]>'
  trk.py FILE add '<json [{date, company, role, location, type, channel, status, salary, documents, folder, link, next_step, notes}, ...]>'
"""
import openpyxl, sys, json, re, shutil, datetime, pathlib
from openpyxl.styles import Font, Alignment

f, cmd = sys.argv[1], sys.argv[2]
KEYS = ['date','company','role','location','type','channel','status','salary','documents','folder','link','next_step','notes']

def backup():
    p = pathlib.Path(f).resolve(); qa = p.parent / '_QA'; qa.mkdir(exist_ok=True)
    b = qa / f'{p.stem}_backup_{datetime.date.today().isoformat()}{p.suffix}'
    if not b.exists(): shutil.copyfile(p, b)

wb = openpyxl.load_workbook(f); ws = wb['Applications']
H = [c.value for c in ws[1]]; col = {h: i + 1 for i, h in enumerate(H)}
rows = {}
for r in range(2, ws.max_row + 1):
    k = ws.cell(r, col['Company']).value
    if k: rows.setdefault(k, []).append(r)

if cmd == 'upd':
    backup(); miss = []
    for co, st, nx, note in json.loads(sys.argv[3]):
        hit = [r for k, rs in rows.items() if co.lower() in k.lower() for r in rs]
        if not hit: miss.append(co); continue
        for r in hit:
            if st: ws.cell(r, col['Status']).value = st
            if nx: ws.cell(r, col['Next step / owner']).value = nx
            if note:
                o = ws.cell(r, col['Notes']).value or ''
                ws.cell(r, col['Notes']).value = (o + ' | ' if o else '') + note
    wb.save(f); print('updated; missing:', miss)
elif cmd == 'add':
    backup(); new = json.loads(sys.argv[3]); start = ws.max_row + 1
    for i, d in enumerate(new):
        rr = start + i; ws.cell(rr, 1).value = rr - 1
        for c, key in enumerate(KEYS, 2):
            cell = ws.cell(rr, c); cell.value = d.get(key, '')
            cell.font = Font(name='Arial', size=10); cell.alignment = Alignment(vertical='top', wrap_text=True)
    wb.save(f); print(f'added {len(new)}; rows now {ws.max_row - 1}')
elif cmd == 'list':
    st = sys.argv[3] if len(sys.argv) > 3 else None
    for k, rs in rows.items():
        for r in rs:
            s = ws.cell(r, col['Status']).value
            if not st or s == st: print(k, '|', s, '|', (ws.cell(r, col['Next step / owner']).value or '')[:70])
elif cmd == 'known':
    print(';'.join(sorted(re.sub(r'\s*\(.*?\)', '', k).strip() for k in rows)))
else:
    print(__doc__)
