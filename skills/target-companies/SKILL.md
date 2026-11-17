---
name: target-companies
description: Builds and maintains the user's target-company map for Gabis Job Hunter - researches employers that fit their profile (corporates, PE funds and their portfolio companies, consultancies, start-ups) in their cities and industries, ranks them by fit, and loads them into the tracker's Map sweep sheet so job-hunt can work through each careers page methodically. Use when the user says "build my target company list", "market map", "which companies should I target", "add companies to my sweep", or "refresh my target list".
---

# Target companies

## 1. Inputs
Read `_Playbook/handoff.md`, `_Playbook/rules.md` and the targets in `_candidate_profile.md` (titles, industries, company types, cities, commute radius, remote). Ask only what is missing, in one AskUserQuestion round.

## 2. Research
**With the team:** split the research by segment (corporates · PE funds and their portfolio companies · advisory firms and start-ups; a large region also by city cluster). Get the models with `python3 _Playbook/scripts/frontier.py pick company-researcher --n <segments>` and start one `company-researcher` per segment together, each with its slot's model. Brief: segment, cities and radius, industries, company types, exclusions (never-apply list, live processes, written out), target count. Agents cannot start other agents, so start each one from this chat. Merge their rows: de-duplicate by company, drop exclusions, keep only rows with a source link, and log each run (`frontier.py log`, task `research:<segment>:<date>`). Pages listed as `NEEDS APPROVAL` go to the user once, at the end. **Without agents** (no Agent tool, or a dispatch fails twice), research inline as below and say so once.

Look things up; do not list companies from memory alone. Use web search and the companies' own sites:
- **Corporates:** largest employers in the user's cities and industries (company lists, regional rankings, stock-index members, family-owned leaders).
- **Private equity:** funds active in the user's country and ticket size; then their current portfolio companies near the user (fund websites' portfolio pages).
- **Advisory and others:** consultancies, transaction-services and restructuring firms, holdings, scale-ups and start-ups with funding in the last two years - as far as they fit the targets.
For each company record: name, segment, city / HQ, why it fits (one line), careers page URL, ATS if visible (Personio, Workday, SuccessFactors, …), owner or fund if PE-backed, a source link.

Drop companies on the user's "never apply" list and any with a live process in the tracker.

## 3. Rank and load
- **Fit A:** strong match on role type, industry and place. **Fit B:** plausible. Leave out the rest.
- Waves: 1 = Fit-A corporates in the home region · 2 = Fit-B corporates · 3 = Fit-A funds and advisory firms · 4 = portfolio companies.
- Save the full list as `Market Map.xlsx` in the `Job Search` folder (sheets per segment plus Sources), then append the rows to the tracker's **Map sweep** sheet (columns: Wave, Segment, Company, City / HQ, Owner / Fit, Careers page, ATS, Last checked, Relevant open roles, Action, Notes) with an empty "Last checked". Use a short Python script with openpyxl; back up the tracker first.

After loading, label each researcher run with the share of its rows you kept (fits the targets, careers URL works): `python3 _Playbook/scripts/frontier.py label '[["research:<segment>:<date>", <0-1>], …]'`.

## 4. Hand over
Tell the user how many companies landed in each wave and the top ten Fit-A names; job-hunt sweeps them 15–20 per session, oldest "Last checked" first, and re-checks every 7–10 days. Update `handoff.md` with the map's date and wave counts.
