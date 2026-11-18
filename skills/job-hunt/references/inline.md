# Inline fallback (no agents)

Use this only when the Agent tool is missing from this session, or two dispatches in a row failed. With the Agent tool present, the team runs, even if the plugin's agent types are missing (start general-purpose agents with the agent file's body, hard rule 6). Open the report with `Team: none - <reason>`.

Batches stay at 15-20 companies, because every page now lands in the main chat.

## Find
- **Map sweep:** open each careers page; also search `<company> <title words> jobs`.
- **Title search:** `<title words> (<city> OR <city>) site:<ATS domain>` across Personio, JOIN, Ashby, Greenhouse, Lever, Recruitee, Teamtailor, SmartRecruiters, softgarden, Workable; posting-language variants too. Public LinkedIn job pages found by search may point to a role; confirm it on the company's own site.
- De-duplicate with `trk.py "Application Tracker.xlsx" known` before opening postings.

## Gate each role before any letter
Live on the company's own site · real apply route and class: OPEN (guest form) / LOGIN (Workday, SuccessFactors, Oracle, Eightfold, e-mail PIN → portal sitting: fill the sign-up or sign-in form, the user OKs the account and enters password and code, then finish the application) / HUMAN CHECK (fill, the user clicks) / E-MAIL (draft, the user sends) · level, location, contract type · fit against the real text (other discipline, far lower pay, visa → drop or flag). Postings go stale: gate and submit the same day.

## Approval check
Before showing the shortlist, run the approval desk's checks yourself (`agents/approval-desk.md`): rules, evidence, brief; GO only under a brief the user typed in this session.

## Duplicates
Before the card: `trk.py … check` for every candidate company, plus one mailbox search per company; drop every `APPLIED` match and show group or name look-alikes to the user. Again right before every submit.

## Easy Apply
Run `references/easy-apply.md` yourself in the user's signed-in browser: raid, put the list on the card, submit only approved ids.

## Letters
Write each letter per `letters.md`, then review it yourself against the letter reviewer's checks (`agents/letter-reviewer.md`) in a separate pass, quoting the source for every claim.
