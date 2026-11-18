# Gabis Job Hunter

An application engine for Claude. It finds matching roles on company career sites and LinkedIn (two lanes every session: tailored career-site applications and LinkedIn Easy Apply), writes calm, true one-page cover letters from your CV, fills and submits applications after your OK, and keeps a tracker plus one folder per application. Built by Gabi from his own job search.

## What you need
- The **Claude desktop app** with a folder on your computer connected (your "Job Search" folder).
- **Claude in Chrome** (browser extension) for career-site forms with file uploads. The built-in browser pane is enough for reading postings and LinkedIn.
- Optional: a **Gmail or Outlook connector** (checks for duplicates, confirmations, rejections and interview invitations) and a calendar connector.

## Install
- **Claude app (claude.ai / desktop):** add it from the plugin directory once listed, or upload the `.plugin` file via **Customize → Plugins → Add → Upload plugin**.
- **Claude Code:**
  ```
  /plugin marketplace add gabsicle/gabis-job-hunter
  /plugin install gabis-job-hunter@gabis-job-hunter
  ```

## Start in 4 steps
1. Install the plugin (see above).
2. Say **"set me up"**. Pick or create your Job Search folder, drop your CV(s) into it, describe the job you want in two or three sentences, and answer one round of questions (targets, cities, salary phrase, start date, languages, topics never to mention, companies to avoid).
3. Say **"build my target company list"**. Claude researches employers that fit you and loads them into the tracker's "Map sweep" sheet.
4. Say **"find me jobs"**. You get a shortlist with a fit score and reasons; reply "go 1, 3, 4", or give a brief for the session ("apply to every A-match in Berlin, report after").

Then, any time: **"continue applying"**, **"any news on my applications?"**, **"apply to <link>"**.

## What it does on its own, and what it never does
| Does | Never does |
|---|---|
| Searches career pages and ATS boards, de-duplicates against your tracker | Type your passwords or verification codes |
| Fills portal sign-up forms (Workday & co.) and creates the account after your OK; you type password and code, it finishes the application | Create an account you haven't OK'd |
| Writes letters only from facts on your CV | Solve CAPTCHAs or "I am human" checks, or work around bot detection |
| Fills forms, uploads letter and CV, reads everything back | Submit without your OK in the same chat (shortlist or session brief) |
| Answers screening questions from your approved answer bank | Guess years or claims it cannot back with your CV |
| Asks unanswered questions in one batch and remembers your answers | Mention anything on your "never mention" list |
| Records every submission with all answers in the tracker and folder | Tick marketing, talent-pool or "follow company" boxes |

When something needs you (a portal login, a human check, an e-mail to send), it is collected and done together while you are at the computer.

## Skills inside
- **job-hunter-setup** – onboarding; re-run to update your profile.
- **target-companies** – builds your market map (corporates, PE funds and portfolio companies, advisory firms, start-ups).
- **job-hunt** – the application loop: find → gate → shortlist → letter → apply → record.
- **application-inbox** – mailbox sweep that updates the tracker and lists what you need to do.

## The team (agents)
Every session runs as a team. Your main chat leads: it talks to you, starts the agents, merges their results, fills forms, submits and keeps the tracker. The agents do the page-heavy, writing and checking work in parallel, so a batch can cover up to 30 companies.
| Agent | What it does |
|---|---|
| **job-crawler** | Finds fresh postings on job boards and ATS sites (StepStone, Personio, Greenhouse and others) by title and city, beyond your target list; LinkedIn is the raider's. "Search wider" means more crawlers |
| **easy-apply-raider** | Works only on LinkedIn, in your signed-in browser: finds and checks Easy Apply roles every session, hands the other LinkedIn finds to the gaters, and after your OK submits the approved Easy Apply roles one by one (max 30, nothing it can't answer from your rules) |
| **headhunter** | Goes off-script: funding rounds, PE deals, leadership changes, search-firm mandates, niche boards. Follows trails to hidden roles and brings back a few gold nuggets, plus leads where a role is about to open (never applied to; you decide) |
| **posting-gater** | Checks one company's careers page (or a few links from the crawlers) and gates each role: live, apply route, level, place, contract, fit |
| **duplicate-guard** | Checks every role against everything you've applied to (tracker, dropped roles, folders, your mailbox) with your re-apply rules: the same role never again, from any source; another role at the same company only after 30 days, or earlier only if it's clearly more interesting and you say yes. Matches reworded titles, short forms and group brands; a final check runs right before every submission |
| **approval-desk** | Checks the shortlist against your rules and the brief you gave, and hands you one card: recommended, not recommended, dropped. You approve with one line |
| **letter-writer** | Drafts one letter per role you approved, only from your CV, in the posting's language |
| **letter-reviewer** | Independent check of every letter and drafted answer against your CV and rules before you see it |
| **company-researcher** | Researches one segment of your market map with verified careers pages and sources |

**A session:** the LinkedIn raider, crawlers, gaters and the headhunter run together → more gaters on their finds → approval desk → your OK → letter writers → letter reviewers → forms, submissions and tracker in your main chat.

**How you see it:** the agents show up in the chat while they run, and every report opens with a team line, e.g. `Team: raider ×2 · crawler ×5 · headhunter ×1 · gater ×14 · approval-desk ×1 · letter-writer ×2 · letter-reviewer ×2`. If it says `Team: none`, the reason follows; only a Claude without agent support runs the work in the main chat.

**Approvals stay yours.** No agent can give your OK or answer a permission prompt from the Claude app. Agents avoid such prompts by opening only pages they found by search; whatever still needs you (a page to approve, a job board that needs a browser, a portal account, a human check) is collected into one list.

**Model frontier.** Each agent runs on the cheapest model that holds quality. A small script Claude writes at setup (`frontier.py`) logs every agent run (cost) and what happened next (quality: did the gate hold, did the letter need a fix), plots cost against quality per agent, and picks from the efficient frontier, Markowitz-style, with a few low-risk test runs on cheaper models. The letter reviewer and the approval desk only test cheaper models in parallel with the main one, so a weaker check never decides. Open `Model Frontier.html` in your folder to see the chart.

## Your files (all in your folder, nothing leaves it except what you apply with)
`Application Tracker.xlsx` (Applications, Summary, Map sweep) · `Applications/YYYY-MM-DD Company - Role (City)/` · `_Playbook/` with your profile, answer bank, rules, hand-off note, the agent run log (`model_runs.csv`) and small scripts Claude writes for you at setup (letters, tracker, folders, packs, form autofill, Easy Apply runner, model frontier) · `Model Frontier.html`. The plugin itself contains only instructions and templates, no code.

## Where your data goes
- **Stays on your computer:** CV, profile, answer bank, tracker, letters and application folders, all in your Job Search folder.
- **Sent only where you approve:** your application details and documents go to the employer career sites and hiring portals (Workday, Personio, Greenhouse, SmartRecruiters, …) and LinkedIn Easy Apply, for the applications you OK in chat. You can switch the Easy Apply lane off for a session ("career sites only"). E-mails go out only with your approval of the exact text.
- **Nothing else:** no server of the author, no analytics, no tracking. Details: [PRIVACY.md](PRIVACY.md).

## Tips
- Start in a fresh chat for each batch; say "continue applying" and it picks up from the hand-off note.
- Check the first five letters and answers closely; correct anything once and it is saved for next time.
- Easy Apply brings volume; career-site applications with a tailored letter get more replies per application. Running both is the default.
- LinkedIn's user agreement does not allow automated applying. The Easy Apply lane runs in your own account at your own risk: it keeps a slow pace, stops at any warning or check, and you can switch it off per session ("career sites only").

