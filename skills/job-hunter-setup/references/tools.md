# Toolkit specs

The plugin ships no code. At setup, write each tool below into the user's `_Playbook/scripts/` (Python 3 with `openpyxl` and `pikepdf`; browser snippets as plain JavaScript), run it once on dummy data, then delete the dummy data. Keep each script short, with a usage line at the top, one printed line per result, and no network calls. Re-create a script from this spec whenever it is missing.

## build_tracker.py — create the tracker
`python3 build_tracker.py "Application Tracker.xlsx"` creates the workbook if missing (never overwrites).
- Sheet **Applications**, header row (navy fill, white bold Arial 10, frozen at D2, autofilter): `#`, `Date applied`, `Company`, `Role`, `Location`, `Type`, `Channel / system`, `Status`, `Salary stated`, `Documents sent`, `Folder`, `Link`, `Next step / owner`, `Notes`.
- Data validation on Status: `Submitted, In process, Interview, Offer, Rejected, Withdrawn, On hold, Docs ready – account needed, Not applied`; on Type: `Corporate, PE fund, Portfolio co, Advisory, Start-up, Recruiter, Public sector, Other`. Light fill per status (green submitted, blue interview, red rejected, yellow docs ready, grey not applied/on hold).
- Sheet **Summary** (first): one `COUNTIF(Applications!$H:$H, …)` per status, a total, and counts by type.
- Sheet **Map sweep**: `Wave`, `Segment`, `Company`, `City / HQ`, `Owner / Fit`, `Careers page`, `ATS`, `Last checked`, `Relevant open roles`, `Action`, `Notes`.

## trk.py — read and update the tracker
Before any write, copy the tracker once per day to `_QA/Application Tracker_backup_<YYYY-MM-DD>.xlsx`.
- `known` → company names in the tracker, `;`-separated (for de-duplication).
- `list [status]` → `company | status | next step`.
- `upd '<json [[company_substring, status, next_step, note], …]>'` → updates every matching row; appends the note to Notes with ` | `; prints names not found.
- `add '<json [{date, company, role, location, type, channel, status, salary, documents, folder, link, next_step, notes}, …]>'` → appends rows with a running `#`.

## sync_folders.py — tracker rows ↔ application folders
`python3 sync_folders.py <Job Search folder> [--write]`
- Folder name: `YYYY-MM-DD Company - Role (City)`, characters invalid in file names removed, max 120 characters. Rows with status `Not applied` get no folder.
- Report: rows without a folder, folders without a row (ignore names starting with `_`).
- `--write`: create missing folders with a `notes.md` (role, date, channel, status, salary, documents, next step, notes) and fill the Folder column (back up first).

## Letter renderer — make_letters.py
`python3 make_letters.py letters.json <output folder>` renders one PDF per letter with headless Chromium (Playwright), A4, margins 20/20/18/20 mm, `preferCSSPageSize`.
- Input JSON: `candidate` {name, tagline, contact_line, accent} and `letters` {key: {lang, recipient_html, place_date, subject, salutation, paragraphs[], signoff}}; the key is the PDF file name.
- Layout: name centred 18 pt semibold in the accent colour; tagline centred 10 pt semibold, letter-spaced; contact line centred 9 pt with a thin accent rule below; recipient block left and place/date right-aligned at the bottom of the same row; subject 26 px below in semibold accent; body 10 pt light, 16 px line height, 9 px between paragraphs, `hyphens: auto` with `lang` set; sign-off, then the name in semibold 30 px below.
- Font: Roboto Light/Medium if available (for example `npm pack @fontsource/roboto` once, files referenced locally), otherwise a clean system sans-serif. Embed fonts; never Type 3.
- After rendering, check each PDF with `pdfinfo` (exactly one page; warn and shorten the text otherwise, never shrink the font) and `pdffonts`.

## build_pack.py — one PDF for one upload slot
`python3 build_pack.py OUT.pdf --max-mb 5 letter.pdf cv.pdf [references.pdf …]` merges in order with pikepdf. If the result is above the cap, rasterise only heavy scanned pages (not the letter or CV) at 150 dpi as JPEG quality 72 and merge again; print the final size.

## runner_config.py — Easy Apply settings from the profile
`python3 runner_config.py _Playbook/profile.json _Playbook/runner_config.js` writes `window.__JH = {…};` from `profile.json` (`personal`, `standard`, `easy_apply`): resume file regex, city and its dropdown option, commute regex, visa regions, total years (from `total_experience_since` if not set), years table, unknown-topic regex, yes/no/unknown regexes, language levels, salary (number, text, band regex, monthly number and text, currency), start date (DD.MM.YYYY, MM/DD/YYYY, DD.MM.YY, notice text, dropdown regex), permit/nationality/gender option regexes, LinkedIn URL, phone, source answer. Print which fields are empty: those questions stay UNKNOWN.

## autofill.js — company forms (paste into the browser's JavaScript tool)
Precondition: `window.__P = <profile.json>`; otherwise return a message asking for it.
- Collect visible `input`, `select`, `textarea` (walk shadow roots and same-origin iframes); skip hidden, submit, file, checkbox and radio inputs.
- Never touch fields matching `password|user.?name|login|captcha|otp|verification code|iban|card|konto|ssn|steuer-?id|ausweis|passport`.
- Match each empty text field by its label, aria-label, placeholder, name or id (EN/DE/ES patterns) to: first, last, full name, e-mail (also "confirm e-mail"), phone, LinkedIn, street, postcode, city, current company, current title, salary (text; number-only fields get the number), start date (text or ISO for date inputs). Set values with the native value setter and fire `input`, `change`, `blur`.
- Store all fields in `window.__F`; return what was filled, then a numbered to-do list of every open field (label, type, required, options for selects). `window.__DRY = 1` reads only.

## easy_apply_runner.js — LinkedIn Easy Apply (mode B only)
Precondition: `window.__JH` from runner_config.js; LinkedIn signed in as the user; `window.__LOC` = job location read from the job page. Defines `window.__ea()`.
1. If no application dialog is open, click the Easy Apply button; if none, return the page's status ("Applied…", "No longer accepting applications", "Apply on company website").
2. Loop up to 14 dialog pages. On each page: select the résumé whose file name matches the resume regex (stop if none); fill the location autocomplete with the city and pick the matching option; then answer every field:
   - **Contact fields** (phone, e-mail, city, names, LinkedIn): keep a saved value; otherwise use the profile.
   - **Salary:** dropdown → band regex; monthly wording → monthly number/text; number-only → number; else text. If the page rejects the value, retry once with the plain number.
   - **Start / notice:** date pickers MM/DD/YYYY; `DD.MM.YY` when asked; otherwise the start text; dropdowns → start-option regex.
   - **Years of X:** parse the topic after "experience with/in/…"; topics matching the unknown-years regex → UNKNOWN; generic "total experience" → total years (unless it is about leading people); otherwise the first matching row of the years table; no match → UNKNOWN. For dropdown ranges pick the option containing the number.
   - **Yes/No:** previously worked/applied → UNKNOWN; sponsorship/visa and work authorisation from the visa regions; commute/on-site/hybrid → Yes only if `__LOC` matches the commute regex, else UNKNOWN; travel → the travel answer; languages from the language regexes; then the user's unknown, no and yes regexes in that order; nothing matched → UNKNOWN.
   - **Language level** dropdowns from the level lists; **disability** → "prefer not to say" option; **gender** only if required; **source** → the source answer.
   - **Checkboxes:** tick a required privacy/terms consent; never "follow company", marketing or talent pool; any other required checkbox → UNKNOWN.
   - A saved value that no rule supports → UNKNOWN (saved answers count only for contact fields).
3. Any UNKNOWN on a page → stop and return the list; nothing is sent.
4. On the review page untick "Follow company". Without `window.__AUTO = 1` return "READY (not submitted)". With it, click Submit, wait, and return SUBMITTED only when the confirmation text appears.
5. Return a log `question = answer ; …` for the tracker notes. Output stays under about 1,000 characters.
