#!/usr/bin/env python3
"""Create 'Application Tracker.xlsx' (Summary, Applications, Map sweep) or append rows to it.

  python3 build_tracker.py "Application Tracker.xlsx"              # create if missing
  python3 build_tracker.py "Application Tracker.xlsx" rows.json    # create if missing, then append rows

rows.json = list of objects with keys:
  date, company, role, location, type, channel, status, salary, documents, folder, link, next_step, notes
Status values: see STATUSES. Type values: see TYPES.
Summary counts are COUNTIF formulas; Excel and LibreOffice calculate them on open.
"""
import json, os, sys
from openpyxl import Workbook, load_workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.worksheet.datavalidation import DataValidation
from openpyxl.formatting.rule import FormulaRule

F, NAVY = 'Arial', '12233F'
COLS = [('#',5),('Date applied',12),('Company',24),('Role',40),('Location',20),('Type',14),('Channel / system',20),
        ('Status',22),('Salary stated',24),('Documents sent',30),('Folder',38),('Link',12),('Next step / owner',30),('Notes',48)]
KEYS = ['date','company','role','location','type','channel','status','salary','documents','folder','link','next_step','notes']
STATUSES = ['Submitted','In process','Interview','Offer','Rejected','Withdrawn','On hold','Docs ready – account needed','Not applied']
TYPES = ['Corporate','PE fund','Portfolio co','Advisory','Start-up','Recruiter','Public sector','Other']
COLORS = {'Submitted':'E3F2E7','Interview':'D6E4FF','Offer':'C8EFC9','Rejected':'F4D6D6','Docs ready – account needed':'FFF4CC',
          'Not applied':'EEEEEE','In process':'E6EEF7','On hold':'EEEEEE'}
MAP_COLS = [('Wave',7),('Segment',18),('Company',28),('City / HQ',18),('Owner / Fit',18),('Careers page',40),('ATS',14),
            ('Last checked',13),('Relevant open roles',40),('Action',24),('Notes',40)]
thin = Side(style='thin', color='D0D5DD')

def header(ws, cols):
    for c, (name, w) in enumerate(cols, 1):
        cell = ws.cell(row=1, column=c, value=name)
        cell.font = Font(name=F, bold=True, color='FFFFFF', size=10); cell.fill = PatternFill('solid', fgColor=NAVY)
        cell.alignment = Alignment(vertical='center', wrap_text=True); ws.column_dimensions[cell.column_letter].width = w

def create(path):
    wb = Workbook(); ws = wb.active; ws.title = 'Applications'
    header(ws, COLS); ws.freeze_panes = 'D2'; ws.auto_filter.ref = 'A1:N2000'
    dv = DataValidation(type='list', formula1='"' + ','.join(STATUSES) + '"', allow_blank=True); ws.add_data_validation(dv); dv.add('H2:H2000')
    tv = DataValidation(type='list', formula1='"' + ','.join(TYPES) + '"', allow_blank=True); ws.add_data_validation(tv); tv.add('F2:F2000')
    for st, col in COLORS.items():
        ws.conditional_formatting.add('H2:H2000', FormulaRule(formula=[f'$H2="{st}"'], fill=PatternFill('solid', fgColor=col)))
    s = wb.create_sheet('Summary', 0)
    s['A1'] = 'Application tracker – summary'; s['A1'].font = Font(name=F, bold=True, size=14, color=NAVY)
    s['A3'], s['B3'] = 'Status', 'Count'
    for i, st in enumerate(STATUSES, 4):
        s.cell(row=i, column=1, value=st); s.cell(row=i, column=2, value=f'=COUNTIF(Applications!$H:$H,A{i})')
    t = 4 + len(STATUSES)
    s.cell(row=t, column=1, value='Total'); s.cell(row=t, column=2, value=f'=SUM(B4:B{t-1})')
    s.cell(row=t+2, column=1, value='By type')
    for j, ty in enumerate(TYPES, t+3):
        s.cell(row=j, column=1, value=ty); s.cell(row=j, column=2, value=f'=COUNTIF(Applications!$F:$F,A{j})')
    for row in s.iter_rows():
        for c in row:
            if c.value is not None and c.row > 1: c.font = Font(name=F, size=10, bold=c.value in ('Status','Count','Total','By type'))
    s.column_dimensions['A'].width = 34
    m = wb.create_sheet('Map sweep'); header(m, MAP_COLS); m.freeze_panes = 'D2'; m.auto_filter.ref = 'A1:K2000'
    wb.save(path)

path = sys.argv[1]
if not os.path.exists(path):
    create(path); print(f'{path}: created')
if len(sys.argv) > 2:
    rows = json.load(open(sys.argv[2], encoding='utf-8'))
    wb = load_workbook(path); ws = wb['Applications']
    start = ws.max_row + 1
    for k, r in enumerate(rows):
        rr = start + k
        ws.cell(row=rr, column=1, value=rr - 1)
        for c, key in enumerate(KEYS, 2): ws.cell(row=rr, column=c, value=r.get(key, ''))
        for c in range(1, 15):
            cell = ws.cell(row=rr, column=c); cell.font = Font(name=F, size=10)
            cell.alignment = Alignment(vertical='top', wrap_text=True); cell.border = Border(bottom=thin)
        if r.get('link'):
            lc = ws.cell(row=rr, column=12); lc.value = 'Open'; lc.hyperlink = r['link']
            lc.font = Font(name=F, size=10, color='1F4E99', underline='single')
    wb.save(path); print(f'{path}: {ws.max_row - 1} rows')
