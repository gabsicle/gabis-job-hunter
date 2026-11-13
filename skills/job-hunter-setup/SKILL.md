---
name: job-hunter-setup
description: Sets up Gabis Job Hunter for a new person in one sitting - links their job-search folder, reads their CV, asks one round of questions, and creates their profile, answer bank, rules, tracker and toolkit. Use when the user says "set me up", "start Gabis Job Hunter", "onboard me", "set up my job search", "update my profile", or when another Job Hunter skill finds no profile.
---

# Job Hunter setup

Turn the user's CV and a few answers into the files every other Job Hunter skill reads. Apply for nothing during setup. Keep the conversation plain: talk about "your folder", "your profile", never about paths or JSON.

## 1. Folder
1. Ask which folder on the user's computer should hold the job search; suggest a new folder named `Job Search`. It must be reachable in this session (a folder connected through the Claude desktop app). If none is reachable, explain how to connect one (open the chat in the desktop app, connect or link the folder) and stop.
2. Create this layout (skip what exists):
```
Job Search/
  Application Tracker.xlsx
  _candidate_profile.md          letter facts and wording rules
  _Playbook/
    profile.json  answer_bank.md  rules.md  handoff.md  runner_config.js
    scripts/  (copied from this skill's toolkit/scripts)
  CV/                            CVs per language, references, certificates
  Applications/                  one folder per application: YYYY-MM-DD Company - Role (City)
  _Upload/                       files to upload by hand (e.g. to the LinkedIn resume library)
```
3. Copy everything in this skill's `toolkit/scripts/` to `_Playbook/scripts/` (fonts included).
4. Check the tools the scripts need where this session runs code: Python 3 with `openpyxl` and `pikepdf`; `pdfinfo`/`pdffonts` (poppler); Node with Playwright and Chromium for letter PDFs. Install missing ones only with the user's OK. If letters cannot render on their computer, render them in the cloud workspace and copy the PDFs into the folder.

## 2. Documents
Ask the user to put their CV (PDF; one per language they apply in) into `CV/`, plus references or certificates if they have them. Read every CV completely before asking anything.

## 3. One question round
First ask the user to describe the job they want in their own words (two or three sentences); save it as the **search brief** in `_candidate_profile.md`; job-hunt matches postings against it. Then pre-fill everything the CV answers and ask only what is missing, with AskUserQuestion (at most two rounds of four questions). Needed:
- **Targets:** role titles, seniority, industries, company types (corporates, PE portfolio companies, consultancies, start-ups), languages they will work in.
- **Places:** home city, commute radius, remote/hybrid, relocation per region (yes / no / ask).
- **Pay:** annual fixed figure and the exact phrase to write, the band to pick in dropdowns, currency, monthly figure if forms ask monthly; lower rule for start-ups if any.
- **Timing:** earliest start date, notice period, current employment status. The current role stays in present tense until its end date.
- **Work authorisation:** where they may work without a visa, where they need sponsorship.
- **Languages and levels.**
- **Boundaries:** topics never to mention (for example reasons for leaving, health, conflicts), companies never to apply to, people never to cite as a source, whether to give date of birth and gender (default: only when mandatory, never optional).
- **Approval:** default "shortlist approval" (they OK each batch). Offer "session brief" (they state a brief such as "apply to everything in Berlin that passes the gate" and the session applies to clear matches only).
- **Browsers and identity:** which browsers Claude can drive here (built-in browser pane, Claude in Chrome) and which LinkedIn or portal accounts each one is signed in with. Never assume a signed-in account is theirs.

## 4. Write the files
Use the templates in `references/`:
- `profile.json` from `profile-template.json`: contact, standard answers, languages, roles with exact titles and dates from the CV, education, easy-apply block.
- `answer_bank.md` from `answer-bank-template.md`: standard answers, the **years table** (count years per topic only from CV dates; a topic with no CV evidence is "ask"), stories S1… from CV bullets with their real figures, motivation lines, open questions. Mark nothing OK until the user confirms it.
- `rules.md` from `rules-template.md`: the fixed limits plus the user's boundaries, exclusions, salary and start-date phrases.
- `_candidate_profile.md`: role titles exactly as on the CV, the figures letters may use, wording rules (what was co-led stays co-led, no inflated scope), the user's strongest three proofs.
- Tracker: `python3 _Playbook/scripts/build_tracker.py "Application Tracker.xlsx"` (creates Applications, Summary and Map sweep sheets).
- `handoff.md`: date of setup, targets, "last inbox sweep: never", empty lists for live processes and items waiting on the user.
- Easy Apply config: `python3 _Playbook/scripts/runner_config.py _Playbook/profile.json _Playbook/runner_config.js`.

## 5. Confirm and hand over
1. Show a short summary: targets, places, pay phrase, start date, boundaries, the years table and the stories. Ask the user to correct or OK it; mark confirmed answer-bank entries "OK".
2. Tell them what to say next: "build my target company list" (target-companies), "find me jobs" (job-hunt), "any news on my applications?" (application-inbox).
3. Mention once that a mail connector (Gmail or Outlook) lets Job Hunter check for duplicates and replies, and that Claude in Chrome is needed for career-site forms with file uploads.
4. Offer a daily job feed: a weekday scheduled task that sweeps the inbox and the next Map sweep companies and leaves a shortlist (it never submits on its own). Create it only if the user says yes, at the time they choose.

Re-running setup later updates the profile: read the existing files first and change only what the user changes.
