# The team

The main chat leads the team. It talks to the user, staffs the agents, merges their results, writes letters, fills forms, submits and writes the tracker. Agents take the page-heavy and checking work so the main chat stays clean. Agents never see the conversation and cannot start other agents: every agent is started from the main chat, and every brief must stand on its own and name the files to read.

| Agent | Does | Writes |
|---|---|---|
| `posting-gater` | Gates one company's roles (or one posting link); 6 lines per role | nothing |
| `job-crawler` | Finds fresh postings on job boards and ATS domains by title and city | nothing |
| `approval-desk` | Checks the shortlist against the rules and the session brief; one approval card | nothing |
| `letter-reviewer` | Checks letters and drafted answers against CV, years table and rules; PASS or fixes | nothing |
| `company-researcher` | Researches one segment for the market map | nothing |

## Running a sweep (main chat)
1. `python3 _Playbook/scripts/frontier.py pick posting-gater --n <companies>` (and `pick job-crawler --n <crawlers>` when crawling).
2. Start the agents together so they run in parallel (up to 5 gaters at once), each with its slot's model as the model override.
3. Merge when they report: drop roles at known companies (`trk.py … known`), A before B, freshest first; keep `NEEDS BROWSER` and `NEEDS APPROVAL` lines in their own lists. Crawler finds at companies not yet gated go to a second wave of gaters, one per posting link (at most 10).
4. `frontier.py log` with one row per dispatch: the run's token count if it was reported, otherwise the `chars` on its RUN line.

## Gater brief
```
Company: <name> (<segment>, <city>). Careers page: <URL from the Map sweep | not on file - find it by search>.
   or: Posting to gate: <link>. Gate this one posting only.
Folder: <absolute path of the Job Search folder>. Candidate profile: <path>.
Search brief: <the user's search brief, word for word>
Gate rules: <level, places, contract types to flag, pay floor, disciplines to drop - from the rules file and the candidate profile>
```

## Crawler brief
```
Title words: <titles and language variants>. Cities: <cities, radius or remote>. Window: last <n> days (today is <date>).
Skip these companies: <the trk.py known output and the never-apply list, written out here - not as a file>
Level: <target level>.
```

## Approval-desk brief
```
Folder: <absolute path>. Rules: <path>. Candidate profile: <path>. Hand-off: <path>.
Known companies: <trk.py known output>
session brief: <the brief the user typed in this session, word for word | none>
Shortlist:
<the gater blocks, numbered>
```
Model: `frontier.py pick approval-desk`. Show the user the card together with the shortlist.
- **Review mode** (default): nothing goes out before the user's one-line OK ("go", "go 1, 3").
- **Brief mode**: only under a brief the user typed in this session, and only for roles the desk marked GO; apply, then report. ASK roles wait for the user.
- The desk's GO confirms that a role is inside what the user already approved. It is never an approval of its own, and it never covers accounts, passwords, codes, human checks, e-mails or web-page approvals.
- Without agents, apply the same checks yourself before showing the shortlist.

## Reviewer brief
```
Folder: <absolute path>
Files: CV <path of the CV in the letter's language> · candidate profile <path> · answer bank <path> · rules <path>
Letter: <path to letters.json and the entry key, or the rendered file>
Posting: <the posting text, pasted>
Answers: <free-text answers drafted for this application, or none>
```
Model: `frontier.py pick letter-reviewer --n <letters>`. Fix every FIX item or put it to the user; a letter enters the pack only with PASS.

## Web pages and approvals
Agents open only pages they were given or found by search, because an address typed from memory makes the app ask the user for approval and the run stalls. Nobody but the user can answer such a prompt: not an agent and not the main chat. Collect every `NEEDS APPROVAL <url>` and `NEEDS BROWSER <url>` line and put them to the user once, at the end of the sweep ("these pages need you"); read the ones the user OKs in the browser yourself. Never work around a prompt or a refusal.

## Models: code decides
`python3 _Playbook/scripts/frontier.py pick <agent> --n <dispatches>` returns one model per dispatch: the cheapest model on the cost-quality frontier whose quality holds, plus a few exploration slots that try a cheaper model. For `letter-reviewer` and `approval-desk` the cheaper model never decides: for each `shadow` slot, start a second agent on the probe model with the same brief and score only whether it agrees. Pass each slot's model as the dispatch's model override. Never pick by taste. Price weights live in `_Playbook/model_prices.json` (relative; update them when prices change).

## Labels: how the frontier learns
Label what actually happened, in one `frontier.py label '<json [[task, quality], …]>'` call per session:

| Agent | Task id | Quality |
|---|---|---|
| `posting-gater` | `gate:<Company>` | 1 if, when you open the posting to apply, route, fit grade and "live" hold; 0 if any is overturned or the user rejects the role as clearly off-brief; 0 if a matching role at a company it marked NONE turns up within 14 days |
| `job-crawler` | `crawl:<city or ATS>:<date>` | share of its finds that passed the gate (0-1) |
| `company-researcher` | `research:<segment>:<date>` | share of its rows kept after your check (fits targets, careers URL works) |
| `letter-reviewer` | `review:<Company>` | 1 if nothing it passed is later corrected by the user or caught at read-back; 0 otherwise. Shadow run (`review-shadow:<Company>`): 1 if it found the same FIX items as the governing reviewer and no false ones |
| `approval-desk` | `approve:<date>` | share of its recommendations the user followed. Shadow run (`approve-shadow:<date>`): share of its verdicts that match the governing desk's |

Unlabeled rows are fine; they count toward cost, not quality. Never invent a label.

## Close of session
`python3 _Playbook/scripts/frontier.py report --html "Model Frontier.html"` (in the Job Search folder). One line in the session report: models in use per agent and any change since last session.

## No agents here
If the Agent tool is missing, or a dispatch fails twice, run the steps in the main chat exactly as in the inline procedure in SKILL.md, keep batches to 15-20 companies, and say once that the team was not available.
