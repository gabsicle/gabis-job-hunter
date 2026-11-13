# Gabis Job Hunter

An application engine for Claude. It finds matching roles (company career sites first, LinkedIn Easy Apply only when you ask), writes calm, true one-page cover letters from your CV, fills and submits applications after your OK, and keeps a tracker plus one folder per application. Built by Gabi from his own job search.

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

## Your files (all in your folder, nothing leaves it except what you apply with)
`Application Tracker.xlsx` (Applications, Summary, Map sweep) · `Applications/YYYY-MM-DD Company - Role (City)/` · `_Playbook/` with your profile, answer bank, rules, hand-off note and the scripts (letters, tracker, folders, packs, form autofill, Easy Apply runner).

## Where your data goes
- **Stays on your computer:** CV, profile, answer bank, tracker, letters and application folders, all in your Job Search folder.
- **Sent only where you approve:** your application details and documents go to the employer career sites and hiring portals (Workday, Personio, Greenhouse, SmartRecruiters, …) and, only if you ask for Easy Apply, LinkedIn, for the applications you OK in chat. E-mails go out only with your approval of the exact text.
- **Nothing else:** no server of the author, no analytics, no tracking. Details: [PRIVACY.md](PRIVACY.md).

## Tips
- Start in a fresh chat for each batch; say "continue applying" and it picks up from the hand-off note.
- Check the first five letters and answers closely; correct anything once and it is saved for next time.
- Easy Apply is for volume only. Career-site applications with a tailored letter get far better replies.

Fonts: Roboto (Apache License 2.0), bundled for the letter PDFs.
