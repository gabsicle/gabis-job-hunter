#!/usr/bin/env python3
"""Compare tracker rows with application folders.

  python3 sync_folders.py JOB_SEARCH_DIR            # report only
  python3 sync_folders.py JOB_SEARCH_DIR --write    # also create missing folders, write notes.md, fill the Folder column

Expects JOB_SEARCH_DIR/Application Tracker.xlsx and JOB_SEARCH_DIR/Applications/.
Folder name: 'YYYY-MM-DD Company - Role (City)' (characters not allowed in file names are dropped).
Rows with status 'Not applied' get no folder. Prints one summary line plus at most 15 detail lines.
"""
import sys, re, pathlib, datetime, shutil, openpyxl

base = pathlib.Path(sys.argv[1]).resolve(); write = '--write' in sys.argv
trk = base / 'Application Tracker.xlsx'; apps = base / 'Applications'; apps.mkdir(exist_ok=True)
wb = openpyxl.load_workbook(trk); ws = wb['Applications']
H = [c.value for c in ws[1]]; col = {h: i + 1 for i, h in enumerate(H)}
clean = lambda s: re.sub(r'[<>:"/\\|?*]+', '', str(s or '')).strip()
existing = {p.name for p in apps.iterdir() if p.is_dir()}
missing, made = [], []
for r in range(2, ws.max_row + 1):
    co = ws.cell(r, col['Company']).value
    if not co or ws.cell(r, col['Status']).value == 'Not applied': continue
    fol = ws.cell(r, col['Folder']).value
    if fol and clean(fol) in existing: continue
    d = ws.cell(r, col['Date applied']).value
    d = d.date().isoformat() if isinstance(d, datetime.datetime) else (str(d)[:10] if d else datetime.date.today().isoformat())
    city = clean(ws.cell(r, col['Location']).value).split(',')[0]
    name = clean(f"{d} {co} - {ws.cell(r, col['Role']).value or 'Role'}" + (f' ({city})' if city else ''))[:120]
    if name in existing:
        if write: ws.cell(r, col['Folder']).value = name
        continue
    missing.append(name)
    if write:
        p = apps / name; p.mkdir(exist_ok=True)
        notes = [f'# {co} – {ws.cell(r, col["Role"]).value or ""}', '']
        for h in ('Date applied', 'Location', 'Channel / system', 'Status', 'Salary stated', 'Documents sent', 'Next step / owner', 'Notes'):
            v = ws.cell(r, col[h]).value
            if v: notes.append(f'- **{h}:** {v}')
        (p / 'notes.md').write_text('\n'.join(notes) + '\n', encoding='utf-8')
        ws.cell(r, col['Folder']).value = name; made.append(name)
known = {clean(ws.cell(r, col['Folder']).value) for r in range(2, ws.max_row + 1) if ws.cell(r, col['Folder']).value}
orphans = sorted(n for n in existing if n not in known and not n.startswith('_'))
if write and made:
    qa = base / '_QA'; qa.mkdir(exist_ok=True)
    b = qa / f'Application Tracker_backup_{datetime.date.today().isoformat()}.xlsx'
    if not b.exists(): shutil.copyfile(trk, b)
    wb.save(trk)
print(f'rows without folder: {len(missing)} | created: {len(made)} | folders without row: {len(orphans)}')
for n in (missing[:10] if not write else []): print('  missing:', n)
for n in orphans[:5]: print('  no row:', n)
