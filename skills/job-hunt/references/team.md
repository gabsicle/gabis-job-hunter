# The team

The main chat is the client lead. It talks to the user, approves, writes letters, fills forms, submits and writes the tracker. Agents take the fan-out work so the main chat stays clean. Agents never see the conversation: every brief must stand on its own and name the files to read.

| Agent | Does | Started by | Writes |
|---|---|---|---|
| `project-lead` | Runs the find-and-gate sweep (or target-companies research): picks models with `frontier.py`, staffs workers, merges, logs runs | main chat | `_Playbook/model_runs.csv` only |
| `job-crawler` | Finds fresh postings on job boards and ATS domains by title and city | project lead | nothing |
| `posting-gater` | Gates one company's roles; 6 lines per role | project lead (or main chat for one link) | nothing |
| `letter-reviewer` | Checks letters and drafted answers against CV, years table and rules; PASS or fixes | main chat | nothing |
| `company-researcher` | Researches one segment for the market map | project lead | nothing |

## Sweep brief (main chat → project-lead)
```
mode: sweep
folder: <absolute path of the Job Search folder>
batch: <company | careers URL | ATS>, … (next 15-30 Map sweep rows, oldest "Last checked" first)
crawl: <yes: title words + language variants, cities, last 30 days | no>
session brief: <the user's brief for this session, if any>
```
The lead returns the shortlist in gater format, "needs browser" roles, drops, and a TEAM line. Show the user the shortlist as in step 4; gate "needs browser" roles yourself in the browser before they go on it.

A single link from the user ("apply to <link>"): start one `posting-gater` directly with the company, the link, the folder path, the search brief and the gate rules.

## Reviewer brief (main chat → letter-reviewer)
```
folder: <absolute path>
letter: <path to letters.json and the entry key, or the rendered file>
posting: <the posting text, pasted>
answers: <free-text answers drafted for this application, or none>
```
Model: `frontier.py pick letter-reviewer --n <letters>`. For each `shadow` slot, also start a second reviewer on the probe model with the same brief; its verdict never governs, only its agreement is scored. Fix every FIX item or put it to the user; a letter enters the pack only with PASS.

## Models: code decides
`python3 _Playbook/scripts/frontier.py pick <agent> --n <dispatches>` returns one model per dispatch: the cheapest model on the cost-quality frontier whose quality holds, plus a few exploration slots that try a cheaper model (shadow runs for the reviewer). Pass each slot's model as the dispatch's model override. Never pick by taste. Price weights live in `_Playbook/model_prices.json` (relative; update them when prices change).

## Labels: how the frontier learns
Log every dispatch you start yourself (`frontier.py log`, same row format the lead uses). Then label what actually happened, in one `frontier.py label '<json [[task, quality], …]>'` call per session:

| Agent | Task id | Quality |
|---|---|---|
| `posting-gater` | `gate:<Company>` | 1 if, when you open the posting to apply, route, fit grade and "live" hold; 0 if any is overturned or the user rejects the role as clearly off-brief; 0 if a matching role at a company it marked NONE turns up within 14 days |
| `job-crawler` | `crawl:<city or ATS>:<date>` | share of its finds that passed the gate (0-1) |
| `company-researcher` | `research:<segment>:<date>` | share of its rows kept after your check (fits targets, careers URL works) |
| `letter-reviewer` | `review:<Company>` | 1 if nothing it passed is later corrected by the user or caught at read-back; 0 otherwise. Shadow run (`review-shadow:<Company>`): 1 if it found the same FIX items as the governing reviewer and no false ones |
| `project-lead` | `lead:<date>` | share of its shortlisted roles that the user approved or that held at apply time |

Unlabeled rows are fine; they count toward cost, not quality. Never invent a label.

## Close of session
`python3 _Playbook/scripts/frontier.py report --html "Model Frontier.html"` (in the Job Search folder). One line in the session report: models in use per agent and any change since last session.

## No agents here
If the Agent tool is missing, or a dispatch fails twice, run the steps in the main chat exactly as in the inline procedure in SKILL.md, keep batches to 15-20 companies, and say once that the team was not available.
