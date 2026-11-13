# LinkedIn Easy Apply runner (mode B, only when the user asks)

Use only in a browser where LinkedIn is signed in as **the user** (check the name in the header). Never call LinkedIn's logged-in API; never work around a blocked fetch.

## Run
1. Résumé: the user uploads their CV once to the LinkedIn résumé library (`linkedin.com/jobs/application-settings`); `easy_apply_runner.js` selects it by the file name in `runner_config.js`.
2. Open a LinkedIn job page. Paste `_Playbook/runner_config.js`, then `_Playbook/scripts/easy_apply_runner.js` (LinkedIn blocks eval, so paste the code itself). This defines `window.__ea()`.
3. Dry run first: `await window.__ea()` with `window.__AUTO` unset fills and stops at the review page ("READY"). With `window.__AUTO=1` it submits only when every question was answered by a rule; anything else is listed as UNKNOWN and nothing is sent.
4. Move between jobs without reloading (keeps the runner in the page):
   `history.pushState({},'','/jobs/search-results/?currentJobId='+id); dispatchEvent(new PopStateEvent('popstate',{state:{}}))`.
5. Find jobs: guest search `/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords=<title>&location=<city>&f_AL=true&f_TPR=r604800&start=0` from a linkedin.com page (10 per page; `jobPosting:(\d+)` ids).

## Before every submit (the runner cannot see these reliably)
- Location and on-site days from the **job page**, not the search list; outside `commute_regex` → skip unless the user agreed.
- Contract type from the job text: fixed-term, interim, parental cover, junior → skip and flag.
- Every years answer must come from the years table; industry-specific "years in X" without evidence stays UNKNOWN.
- One application per company: check the tracker first.

## Record
One tracker row per submission with channel "LinkedIn Easy Apply" and all answers the runner logged; add a short folder only if a letter or custom answer was used.
