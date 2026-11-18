# The team

The main chat leads. Agents take the page-heavy, writing and checking work, so the main chat stays short and a batch can cover up to 30 companies. Agents never see the conversation and cannot start other agents: the main chat starts every agent, and every brief stands on its own.

| Agent | Does | Per session | Writes |
|---|---|---|---|
| `easy-apply-raider` | LinkedIn only, in the user's signed-in browser: raids and gates Easy Apply roles, hands other LinkedIn finds to the gaters; after approval submits the approved Easy Apply ids | 1 raid (wave 1) + 1 submit run | nothing (submits only approved ids) |
| `job-crawler` | Finds fresh postings on ATS boards and other job boards by title and city (not LinkedIn) | 4-6, one more per widening (wave 1) | nothing |
| `headhunter` | Goes off-script (funding rounds, PE deals, leadership changes, search-firm mandates, niche boards) for hidden roles; nuggets and leads | 1, 2 only on "go for gold" (wave 1) | nothing |
| `posting-gater` | Gates one company's roles, or up to 4 posting links: live, route, level, place, contract, fit | 6-8 (wave 1) + up to 8 (wave 2) | nothing |
| `duplicate-guard` | Checks every candidate against the tracker, triage list, folders and mailbox; BLOCK / WARN / CLEAR with evidence | 1 per shortlist (and per single link) | nothing |
| `approval-desk` | Checks the shortlist against the rules and the session brief; one approval card | 1 (+ shadow) | nothing |
| `letter-writer` | Reads the posting, drafts one letter for one approved role from the team pack and the CV only | 1 per approved role | its draft and a posting copy |
| `letter-reviewer` | Checks each letter and drafted answer against CV, years table and rules; PASS, or BLOCK items with safe fixes | 1 per letter (+ shadow) | nothing |
| `company-researcher` | Researches one market-map segment (target-companies skill) | 1 per segment | nothing |

## Session flow
```
main chat: handoff + rules + known list -> TEAM PACK
wave 1   : raider (raid) + gater x 6-8 (trk.py sweep 8) + crawler x 4-6 + headhunter x 1  (one message, parallel)
wave 2   : gater x <=8 on crawler finds, nuggets and the raider's company-site list (<=4 links each); leads -> user
guard    : trk.py export -> duplicate-guard on every candidate -> BLOCKs off, WARNs flagged
desk     : approval-desk on one shortlist (<=12 career-site roles + the Easy Apply list) -> card -> user's OK or brief
lane B   : trk.py check per company -> raider (submit) on the approved Easy Apply ids, max 30
lane A   : per role: writer -> reviewer -> (one BLOCK round) -> trk.py check -> form -> submit, roles in parallel
main chat: tracker, log + label, report
```

## Team pack
Write it at the start of the session, in one file the agents can Read: `_Playbook/team_pack.md` when the Job Search folder is on the computer this session runs on, otherwise in this session's working folder. Agents share your file access, so check the path with your own Read tool once. Overwrite it each session. Contents, taken from the files named:
```
# Team pack - <date>
Session brief: <an instruction the user typed in this session to apply without asking, word for word | none>
Search ask: <what the user asked to look for this session, word for word; never a brief>
Targets: <titles and language variants · level · cities, radius, remote · industries · company types> (candidate profile)
Gate rules: <contract types to flag · pay floor · disciplines to drop · visa> (rules)
Do not gate: <never-apply list · live processes> (rules, handoff)
Known companies: <trk.py known output | unavailable - every role is ASK until checked>
Account owner: <the user's name as LinkedIn shows it in the header> (rules)
Candidate proofs: <role titles and dates exactly as on the CV · figures letters may use · three strongest proofs · wording rules> (_candidate_profile.md)
Years table: <copied> (answer_bank.md)
Never mention: <copied> (rules)
Letter details: <name · contact line · home city for place and date · salary and start-date phrases> (profile.json, rules)
Files: CV de <path> · CV en <path> · answer bank <path> · letter rules <path of references/letters.md>
```
CV paths must be readable by the agents too: if the Job Search folder is on another computer, stage the CVs into this session first and give the staged paths.

## Models
`python3 _Playbook/scripts/frontier.py pick <agent> --n <dispatches>` returns one model per dispatch; pass each as the dispatch's model override. For `letter-reviewer` and `approval-desk`, each `shadow` slot is a second agent on the probe model with the same brief, scored only on whether it agrees; it never decides. If `frontier.py` fails or cannot run here, dispatch on the defaults and say so in the report:

| Agent | Default | Allowed |
|---|---|---|
| `job-crawler` | sonnet | haiku, sonnet, opus |
| `posting-gater` | sonnet | haiku, sonnet, opus |
| `company-researcher` | sonnet | haiku, sonnet, opus |
| `duplicate-guard` | sonnet | haiku, sonnet |
| `easy-apply-raider` | sonnet | sonnet, opus |
| `headhunter` | opus | sonnet, opus |
| `letter-writer` | sonnet | sonnet, opus |
| `letter-reviewer` | opus | sonnet, opus |
| `approval-desk` | opus | sonnet, opus |

Never pick by taste. Price weights live in `_Playbook/model_prices.json`.

## Briefs
Every brief starts with `Team pack: <path>` (read it first). With general-purpose agents (hard rule 6), put the agent file's body above the brief.

**Gater (wave 1, one company)**
```
Team pack: <path>
Company: <name> (<segment>, <city>). Careers page: <URL from the Map sweep | not on file - find it by search>.
```
**Gater (wave 2, crawler finds)**
```
Team pack: <path>
Postings to gate: <up to 4 links, one per line, with company and title from the crawler line>
```
**Crawler** (split wave 1 by ATS group × city group, e.g. Personio + JOIN + Recruitee · Greenhouse + Lever + Ashby · SmartRecruiters + Workable + Teamtailor + softgarden · StepStone + company boards; × home region and × the other allowed cities)
```
Team pack: <path>
Title words: <titles and language variants>. Cities: <city group, radius or remote>. Window: last <n> days (today is <date>).
Boards: <the ATS group for this crawler>
Focus: <standard | the widening this crawler covers>
```
**Easy Apply raider, raid**
```
Team pack: <path>
Mode: raid
Browser: <built-in browser | Claude in Chrome: the one signed in to LinkedIn as the user>
Titles: <titles and language variants>. Places: <cities, radius, remote>. Window: past week. Cap: 30.
```
**Easy Apply raider, submit**
```
Team pack: <path>
Mode: submit
Browser: <same as the raid>
Approved: <job ids the user approved, word for word, in order>
Runner: <path of runner_config.js> · <path of easy_apply_runner.js>
Max: 30
```
**Headhunter**
```
Team pack: <path>
Grounds: <your pick | the grounds for this headhunter, different from the other one's>
Already covered: <the crawlers' title words, cities and boards this session>
Budget: <pages, default 60>
```
**Duplicate guard**
```
Team pack: <path>
Applied: <path of the trk.py export CSV>
Mail: <check, if this session has mail search tools | not available>
Candidates:
<n>. <Company> | <Title> | <City> | <route> | <link or job id>
```
**Approval desk**
```
Team pack: <path>
session brief: <word for word | none>
Shortlist:
<the gater blocks, numbered>
```
**Letter writer**
```
Team pack: <path>
Role: <the gater block for this role>
Posting URL: <the URL from the gater block>
CV: <path of the CV in the posting's language>
Write to: <output folder, e.g. <working folder>/letters/> (it writes <CompanyKey>.json and <CompanyKey>.posting.txt)
Posting text: <only when a writer reported NEEDS BROWSER: the text you read in the browser, pasted | none>
Fix list: <the reviewer's BLOCK items and the previous draft path | none>
```
**Letter reviewer**
```
Team pack: <path>
Letter: <the writer's .json path>   Writer's claim list: <pasted from the writer's report>
Posting: <the writer's .posting.txt path>
CV: <same CV path>
Answers: <free-text answers drafted for this application | none>
```

## Merging
- Wave 1 + 2: drop roles at known companies, A before B, freshest first. Keep `NEEDS BROWSER` and `NEEDS APPROVAL` lines together for the card.
- Crawler finds, headhunter nuggets and the raider's company-site finds at companies already gated in wave 1 are not gated again.
- The raider's EASY APPLY list goes onto the card as its own block, already gated; one application per company across both lanes (keep the career-site role when a company appears in both).
- Raider reports `NEEDS MAIN CHAT`: run its raid (or submit) procedure yourself in the user's signed-in browser, same rules and pace; say so in the report.
- Headhunter leads go into the report's "Leads" section and under "Leads" in `handoff.md` (company, signal, source, date); they are never gated or applied to.
- Letters: a writer's entry goes into `letters.json` under its key only after the reviewer's PASS, or after you applied the reviewer's BLOCK fixes word for word following the fix round.
- `frontier.py log` one row per dispatch: tokens if reported, otherwise the `chars` on the agent's RUN line. Tasks: `raid:<date>`, `ea-submit:<date>`, `guard:<date>`, `gate:<Company>`, `crawl:<focus>:<date>`, `hunt:<n>:<date>`, `approve:<date>`, `write:<Company>`, `review:<Company>`, shadow runs `review-shadow:<Company>` and `approve-shadow:<date>`.

## Approvals
- **Review mode** (default): nothing goes out before the user's one-line OK ("go", "go 1, 3").
- **Brief mode**: only under a brief the user typed in this session, and only for roles the desk marked GO; apply, then report. ASK roles wait for the user.
- The desk's GO confirms that a role is inside what the user already approved. It is never an approval of its own, and it never covers accounts, passwords, codes, human checks, e-mails or web-page approvals.

## Web pages and approval prompts
Agents open only pages they were given, found by search, or reached by a link on an opened page, because an address typed from memory makes the app ask the user for approval and the run stalls. Only the user can answer such a prompt: not an agent and not the main chat. Collect every `NEEDS APPROVAL <url>` and `NEEDS BROWSER <url>` line for the card; read the pages the user OKs in the browser yourself. Never work around a prompt or a refusal.

## Labels: how the frontier learns
One `frontier.py label '<json [[task, quality], …]>'` call per session. Label only what happened; never invent a label.

| Agent | Task id | Quality |
|---|---|---|
| `posting-gater` | `gate:<Company>` | 1 if route, fit grade and "live" hold when you apply or the user decides; 0 if any is overturned, or the user rejects the role as clearly off-brief, or a matching role at a company it marked NONE turns up within 14 days |
| `job-crawler` | `crawl:<focus>:<date>` | share of its finds that passed the gate (0-1) |
| `headhunter` | `hunt:<n>:<date>` | (nuggets that passed the gate + leads the user kept) ÷ everything it reported; 0 if it reported nothing |
| `easy-apply-raider` | `raid:<date>` | share of its Easy Apply list the user approved and that went out without a gate error found at submit |
| `easy-apply-raider` | `ea-submit:<date>` | submitted ÷ approved, counting UNKNOWN stops as correct (nothing wrong was sent); 0 if a wrong answer was sent |
| `duplicate-guard` | `guard:<date>` | 1 if no role it cleared later turns out to be a repeat (a later `trk.py check` match, the employer or the user says so) and no BLOCK is overturned; 0 otherwise |
| `approval-desk` | `approve:<date>` | share of its recommendations the user followed. Shadow: share of its verdicts that match the governing desk's |
| `letter-writer` | `write:<Company>` | 1 if the first draft got PASS and the user approved it without content changes; 0.5 if PASS after the fix round; 0 if BLOCK items were still open after the fix round or the user rewrote content |
| `letter-reviewer` | `review:<Company>` | 1 if nothing it passed is later corrected by the user or caught at read-back; 0 otherwise. Shadow: 1 if it found the same BLOCK items as the governing reviewer and no false ones |
| `company-researcher` | `research:<segment>:<date>` | share of its rows kept after your check |

Unlabeled rows still count toward cost.

## Close of session
`python3 _Playbook/scripts/frontier.py report --html "Model Frontier.html"` in the Job Search folder. The team line and any model change go in the report.
