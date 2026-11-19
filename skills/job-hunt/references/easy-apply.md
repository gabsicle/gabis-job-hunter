# LinkedIn Easy Apply (lane B, every session)

The main chat runs this lane: a raid while finding, a submit run after approval. Use only a browser where LinkedIn is signed in as **the user** (check the name in the header). Never call LinkedIn's internal or guest APIs (`/voyager/`, `/jobs-guest/`); they are blocked for scripts and agents. Open LinkedIn pages normally.

## Find (raid)
- Normal job search page, one title × place at a time: `https://www.linkedin.com/jobs/search/?keywords=<title>&location=<place>&f_TPR=r604800`, plus an Easy Apply-only pass with `&f_AL=true`. Read the result list as page text.
- Open each candidate's job page and gate it: place and on-site days, contract type, level, years asked, pay if stated, company not on the never-apply list, and the re-apply rules (same role never again; another role at the same company only after 30 days). One role per company per raid.
- Easy Apply roles go on the EASY APPLY list; "Apply on company website" roles go to the gaters (lane A).
- Pace: one page at a time, a few seconds apart, no parallel tabs. Stop at any CAPTCHA, security check or limit message.

## Résumé
The user uploads their current CV once to the LinkedIn résumé library (`linkedin.com/jobs/application-settings`). The runner selects it by the file pattern in `runner_config.js`. No match → nothing is sent and the user is asked to upload it.

## Submit (approved ids only)
Needs `_Playbook/runner_config.js` (written by `runner_config.py` from `profile.json`) and `_Playbook/scripts/easy_apply_runner.js`; job-hunt's start re-creates both when missing or out of date.
1. Open `https://www.linkedin.com/jobs/view/<id>/`. Check place and contract on the job page again.
2. Paste `_Playbook/runner_config.js`, then `_Playbook/scripts/easy_apply_runner.js` (the code itself; LinkedIn blocks eval). For every job: `delete window.__AUTO`, set `window.__LOC` to the job's place, and check the job id in the page address is the approved id.
3. Dry run with `window.__AUTO` unset: fills and stops at the review page ("READY"). Every question answered by a rule → set `window.__AUTO=1`, run again to submit, and `delete window.__AUTO` straight after. Any UNKNOWN → nothing is sent; the questions go to the question queue. A job that now sends you to the company's website is not applied to here.
4. Read the confirmation ("Application submitted"). About half a minute between submissions; at most 30 a session.
5. Moving between jobs without a reload keeps the runner in the page: `history.pushState({},'','/jobs/search-results/?currentJobId='+id); dispatchEvent(new PopStateEvent('popstate',{state:{}}))`.

## Before every submit (the runner cannot see these reliably)
- Location and on-site days from the **job page**, not the search list; outside `commute_regex` → skip unless the user agreed.
- Contract type from the job text: fixed-term, interim, parental cover, junior → skip and flag.
- Every years answer comes from the years table; industry-specific "years in X" without evidence stays UNKNOWN.
- Re-apply rules across both lanes: `trk.py … check "<company>" "<title>"` must say OK, or ASK with the user's yes for that role by name or number.

## Record
One tracker row per submission (`trk.py add`) with channel "LinkedIn Easy Apply" and every answer the runner logged; add a short folder only if a letter or custom answer was used.
