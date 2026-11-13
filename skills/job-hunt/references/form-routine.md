# Career-site form routine (mode A)

1. **Open:** `navigate` on its own (cross-site navigation inside a batch can fail); decline non-essential cookies.
2. **Fill:** paste `window.__P = <contents of profile.json>;` then `_Playbook/scripts/autofill.js` into the browser's JavaScript tool. It fills the text fields it recognises (contact, current role, salary, start date), walks shadow DOM, never touches passwords, IDs, bank fields, files, checkboxes or dropdowns, stops at login forms, and returns a numbered to-do list. Fields stay in `window.__F[n]`.
3. **Finish the to-do list:** facts from `profile.json`; free-text answers only from answer-bank entries marked OK; dropdowns by setting the value and dispatching `change`; clicks only for custom widgets. A question with no OK answer: draft from the closest story, ask the user once, store the approved answer in the bank.
4. **Uploads (Claude in Chrome):** copy the files into the session's uploads folder, give the file input an `aria-label`, `find` it, then `file_upload`. Hidden inputs often appear after clicking the visible "upload" area; never click a native file dialog open.
5. **Custom widgets:** masked date fields need real keystrokes (focus, ctrl+a, Backspace, type `DD/MM/YYYY` or the shown mask); custom checkboxes may need a visual click even when `input.checked` is true; react-select = click, type, Enter. Read the page's "missing fields" summary before submitting.
6. **Read back** every value, file slot and consent box once, fix, submit, read the confirmation. Every screening answer goes into the tracker notes.

## Browser glitches
- "Couldn't determine which page" → get the tab context again, then retry.
- "Navigated to a different domain" → `navigate` on its own, then run the script.
- Aggregator redirects that need a login (StepStone, Indeed, appcast): search the company's own careers page for the same posting.

## ATS notes
- **Ashby:** no letter slot → combined PDF as résumé; dates MM/DD/YYYY; yes/no buttons.
- **Greenhouse:** embed URL `job-boards.greenhouse.io/embed/job_app?for=<slug>&token=<id>`; react-select dropdowns.
- **Lever:** location autocomplete clears itself; often a captcha → user.
- **Personio:** salary often required; Cloudflare Turnstile on many pages → user clicks.
- **JOIN:** salary as a plain number, then Review; AGB radio required.
- **SmartRecruiters:** follow the "I'm interested" link; shadow DOM; the required privacy checkbox can have an empty label (tick the one whose block mentions privacy, never talent pool or SMS).
- **softgarden:** three guest steps, ends with a human check → user.
- **Recruitee:** separate slots; one merged certificates file.
- **Teamtailor:** screening questions first; values can vanish on re-render, so read back.
- **Workable:** start date is a date picker (MM/DD/YYYY); photo input comes before the résumé.
- **HiBob:** language entries; the file input appears on click.
- **Factorial:** cookie banner covers the send button.
- **Workday, SuccessFactors, Oracle, Eightfold, Taleo:** portal sitting while the user is at the computer. Fill the sign-up form (name, e-mail from the profile), ask "create the account at <portal>?" in chat, let the user type the password and the e-mail or SMS code (or their password manager), then fill the application in the same tab. Batch several portals into one sitting. One account per portal; note the portal and the e-mail used in the tracker row (never the password).
- **E-mail applications:** draft the mail with the pack attached; the user sends it (or approves sending in chat when a mail connector can send).
