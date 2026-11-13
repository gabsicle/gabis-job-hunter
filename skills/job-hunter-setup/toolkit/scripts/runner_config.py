#!/usr/bin/env python3
"""Build runner_config.js (window.__JH) for easy_apply_runner.js from the user's profile.json.

  python3 runner_config.py _Playbook/profile.json _Playbook/runner_config.js

Only values from profile.json are used; anything empty stays empty, and the runner then lists that
question as UNKNOWN instead of guessing. Re-run after every profile change.
"""
import json, sys, datetime

p = json.load(open(sys.argv[1], encoding='utf-8'))
pe, st, ea = p.get('personal', {}), p.get('standard', {}), p.get('easy_apply', {})
start = st.get('start_date') or ''
mmdd = short = text = ''
if start:
    d = datetime.date.fromisoformat(start)
    mmdd, short, text = d.strftime('%m/%d/%Y'), d.strftime('%d.%m.%y'), d.strftime('%d.%m.%Y')
since = st.get('total_experience_since') or ''
total = ea.get('total_years') or None
if not total and since:
    y, m = map(int, since.split('-')[:2]); t = datetime.date.today()
    total = (t.year - y) - (1 if t.month < m else 0)

cfg = {
    'resume': ea.get('resume_file_regex', ''),
    'city': ea.get('city') or pe.get('city', ''),
    'cityOption': ea.get('city_option_regex', ''),
    'commute': ea.get('commute_regex', ''),
    'visa': ea.get('visa_regions_regex', ''),
    'needVisaDefault': bool(ea.get('need_visa_in_home_market', False)),
    'total': total,
    'years': ea.get('years', []),
    'yearsUnknown': ea.get('years_unknown_regex', ''),
    'yes': ea.get('yes_regex', ''), 'no': ea.get('no_regex', ''), 'unknown': ea.get('unknown_regex', ''),
    'levels': ea.get('language_levels', []),
    'langYes': ea.get('languages_yes_regex', ''), 'langNo': ea.get('languages_no_regex', ''),
    'travel': ea.get('travel_answer', ''), 'fullTime': ea.get('full_time_answer', 'Y'),
    'currency': (st.get('currency') or 'EUR').lower(),
    'salary': {'num': st.get('salary_number') or '', 'text': st.get('salary_text', ''),
               'band': ea.get('salary_band_regex', ''), 'monthNum': st.get('salary_monthly_number') or '',
               'monthText': st.get('salary_monthly_text', '')},
    'start': {'text': text, 'mmdd': mmdd, 'short': short,
              'notice': st.get('start_text', ''), 'within': ea.get('start_option_regex', '')},
    'permit': ea.get('permit_option_regex', ''), 'nationality': ea.get('nationality_option_regex', ''),
    'gender': ea.get('gender_option_regex', ''),
    'linkedin': pe.get('linkedin', ''), 'phone': pe.get('phone', ''),
    'source': ea.get('source_answer', 'LinkedIn'),
}
open(sys.argv[2], 'w', encoding='utf-8').write('window.__JH = ' + json.dumps(cfg, ensure_ascii=False, indent=1) + ';\n')
empty = [k for k, v in cfg.items() if v in ('', None, [], {})]
print('runner_config.js written; empty (answered as UNKNOWN):', ', '.join(empty) or 'none')
