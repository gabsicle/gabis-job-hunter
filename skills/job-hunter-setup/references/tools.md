# Toolkit specs

The plugin ships no code. At setup, write each tool below into the user's `_Playbook/scripts/` (Python 3 with `openpyxl` and `pikepdf`; browser snippets as plain JavaScript), run it once on dummy data, then delete the dummy data. Keep each script short, with a usage line at the top, one printed line per result, and no network calls. Re-create a script from this spec whenever it is missing.

## build_tracker.py — create the tracker
`python3 build_tracker.py "Application Tracker.xlsx"` creates the workbook if missing (never overwrites).
- Sheet **Applications**, header row (navy fill, white bold Arial 10, frozen at D2, autofilter): `#`, `Date applied`, `Company`, `Role`, `Location`, `Type`, `Channel / system`, `Status`, `Salary stated`, `Documents sent`, `Folder`, `Link`, `Next step / owner`, `Notes`.
- Data validation on Status: `Submitted, In process, Interview, Offer, Rejected, Withdrawn, On hold, Docs ready – account needed, Not applied`; on Type: `Corporate, PE fund, Portfolio co, Advisory, Start-up, Recruiter, Public sector, Other`. Light fill per status (green submitted, blue interview, red rejected, yellow docs ready, grey not applied/on hold).
- Sheet **Summary** (first): one `COUNTIF(Applications!$H:$H, …)` per status, a total, and counts by type.
- Sheet **Map sweep**: `Wave`, `Segment`, `Company`, `City / HQ`, `Owner / Fit`, `Careers page`, `ATS`, `Last checked`, `Relevant open roles`, `Action`, `Notes`.

## trk.py — read and update the tracker
The second line of the script is exactly `# trk-spec: 2`; a `trk.py` without that line is out of date: write it again from this spec. Before any write, copy the tracker once per day to `_QA/Application Tracker_backup_<YYYY-MM-DD>.xlsx`.
- `known` → company names in the tracker, `;`-separated (for de-duplication).
- `list [status]` → `company | status | next step`.
- `sweep [N]` (default 20) → the next N rows of the Map sweep sheet, empty "Last checked" first, then oldest first: `company | segment | city | careers page | ATS`, one per line.
- `checked '<json [[company, relevant_open_roles, action], …]>'` → on the Map sweep rows whose Company matches exactly, sets Last checked to today, Relevant open roles and Action; prints names not found.
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

## frontier.py — which model each agent runs on
`python3 frontier.py <command> [--file PATH]`; default file `_Playbook/model_runs.csv` (relative to the Job Search folder). The second line of the script is exactly `# frontier-spec: 3`; a `frontier.py` without that line is out of date: write it again from this spec and keep `model_runs.csv`. CSV columns: `date, agent, model, task, tokens, chars, cost_units, quality`. Write the CSV through a temp file in the same folder and rename it (keep normal read permissions).
- Models, cheapest first: `haiku, sonnet, opus` (normalise any model name containing one of these words; skip a row whose model contains none of them and say so). Price weights (relative cost per token) default `{"haiku": 1, "sonnet": 3, "opus": 5}`; `model_prices.json` in the same folder as the log file, if present, overrides individual weights.
- Agents (default model · allowed models · quality floor): `job-crawler` sonnet · all · 0.30 — `posting-gater` sonnet · all · 0.85 — `company-researcher` sonnet · all · 0.70 — `headhunter` opus · sonnet, opus · 0.20 — `letter-writer` sonnet · sonnet, opus · 0.80 — `letter-reviewer` opus · sonnet, opus · 0.95 — `approval-desk` opus · sonnet, opus · 0.95. Unknown agent → exit with the list (`log` skips such a row and says so).
- Constants: MIN_N 5 labeled runs before a model can replace the default; SHRINK_K 5; TOLERANCE 0.03; EVERY 10 (5 while the probe model has fewer than MIN_N labels).
- Per agent and model: runs, labeled n, mean cost_units, raw mean quality, sd (risk: sample standard deviation, 0 when n < 2), lower bound = raw mean − sd/√n. Shrunk quality, only for models with at least one label (else none, shown as `-`) = (sum of labels + SHRINK_K × pooled mean of all the agent's labels) ÷ (n + SHRINK_K).
- Efficient frontier: among the agent's allowed models with ≥ MIN_N labels and a known mean cost, those no other such model dominates (mean cost ≤ and shrunk quality ≥, one strictly).
- Choice: no model ready → default ("cold start"). Else the frontier model with the lowest mean cost whose shrunk quality ≥ best shrunk quality − TOLERANCE and whose lower bound ≥ floor; else the ready model with the lowest mean cost whose lower bound ≥ floor; else the most expensive allowed model (fixed order) with a warning to review the agent's brief. Probe = the next cheaper allowed model than the choice in the fixed order haiku < sonnet < opus; none if the choice is already the cheapest allowed.
- `pick AGENT [--n N]` (N defaults to 1) → one JSON line `{agent, plan: [model per dispatch], shadow: [{slot, model}], choice, explore, why}`. Exploration slots: let `done` = logged rows of this agent whose model is the choice; plan index `i` (0-based) is an exploration slot when a probe exists and `(done + i) % EVERY == EVERY − 1`. Exploration slots put the probe in `plan`, except for `letter-reviewer` and `approval-desk`, whose plan stays on the choice and lists `{slot: i, model: probe}` under `shadow` (the probe runs alongside; its verdict never governs). `explore` = the probe if any slot explores, else null.
- `log '<json [{agent, model, task, chars | tokens, quality?}, …]>'` → appends rows; cost_units = (tokens, else chars ÷ 4) ÷ 1000 × price weight, 3 decimals. Prints `logged <n>; total rows <m>`.
- `label '<json [[task, quality 0-1], …]>'` → sets quality on the latest unlabeled row of each task (clamped 0-1); prints tasks not found.
- `report [--html PATH]` → per agent one line `use <model> - <why>` and one line per model (runs, labeled, cost, shrunk and raw quality, sd, "frontier"). With `--html`, a self-contained page: one card per agent with an inline SVG scatter (x = cost per task, y = shrunk quality from just below the lowest point or floor up to 1.0), ±1 sd bars, dashed line through the frontier points, dotted floor line, the chosen model as a dark dot, labels under each dot, and the "use …" sentence. Plain system font, no external files.
