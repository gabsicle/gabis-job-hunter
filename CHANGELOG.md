# Changelog

## 0.5.0 – 19 Nov 2026
Two lanes every session, a LinkedIn agent, a duplicate filter and a faster letter path, from the first live agent sessions.
- New `easy-apply-raider` agent: works only on LinkedIn in the user's signed-in browser; raids and gates Easy Apply roles, hands other LinkedIn finds to the gaters, and after approval submits only the approved job ids (dry run per job, auto-submit reset after every job, max 30 a session). Easy Apply is now lane B in every session; the user can switch it off.
- New `duplicate-guard` agent: checks every candidate against the tracker, triage list, application folders and mailbox, matching names across legal forms, spellings and group brands; BLOCK / WARN / CLEAR. A `trk.py check` runs again right before every submission.
- Letters: reviewer verdicts BLOCK / NOTE, one fix round, the main chat applies remaining BLOCK fixes, each role submitted as soon as its letter passes, closed postings caught before writing.
- Sweep: 6-8 gaters (fund pages monthly, companies with open roles first), 4-6 crawlers split by job-board group, 1 headhunter (2 on "go for gold"); wave 2 starts as finds arrive.
- One numbered approval card with job ids: up to 12 career-site roles plus the Easy Apply list.
- Specs: `trk.py` 4 (`sweep`, `checked`, `export`, `check`), `frontier.py` 5, Easy Apply runner 2.
- Fix: the job-hunt skill description no longer breaks YAML parsing (unquoted colon).

## 0.4.1 – 18 Nov 2026
Fixes from the first live team run: gaters read the known-company list, crawlers run at least 12 queries, the letter writer reads postings word for word, start date and salary only when the posting asks.

## 0.4.0 – 18 Nov 2026
Agents first: every session runs as a team led by the main chat (agents cannot start agents). Team pack file for the agents; new `letter-writer` and `headhunter` agents; crawlers, gaters, approval desk and letter reviewer made mandatory; inline work only without an Agent tool.

## 0.3.2 – 17 Nov 2026
Main chat leads the team (project-lead agent removed); new `approval-desk` agent; search-first web rule against approval prompts.

## 0.3.0 – 17 Nov 2026
Token savings and inbox hygiene, from running the plugin on a real search.
- job-hunt: one workstream per chat, hand-off under one page with an archive, scripts instead of reading large files, capped mail and browser output, progress kept in files so a new chat can resume, one long timer instead of polling.
- application-inbox: summary views and 20-result pages; files application mail under the user's job-search label and archives it, keeping only mails that need a reply or action in the inbox; suggests a portal sender filter.
- form-routine: notes for Phenom alerts, Manatal shadow-root uploads, Workday guest apply, cookie banners covering submit, custom-element shadow roots.
- tools: `trk.py summary` and `trk.py find` so the tracker is never opened whole.
- setup: `handoff_archive.md`.

## 0.2.0 – 13 Nov 2026
Docs-only plugin (instructions and templates, no code), privacy policy, marketplace manifest.
