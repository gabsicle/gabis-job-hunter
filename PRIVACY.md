# Privacy – Gabis Job Hunter

Gabis Job Hunter is a set of instructions and local scripts for Claude. The author runs no server and collects nothing.

**What the plugin reads:** your CV, the answers you give during setup, your application tracker and, if you connect one, your mailbox (only messages about applications).

**Where it is stored:** only in the Job Search folder you choose on your own computer (profile, answer bank, tracker, letters, application folders). Delete the folder and everything is gone.

**Where it goes:** your details are entered only into the employer application forms and portals you approve in chat, and e-mails are sent only when you approve the exact text. There is no tracking, analytics or other third-party service in the plugin.

**Helper agents:** the plugin's agents run inside your own Claude session. They read public job pages, a short team pack your main chat writes for the session (targets, rules, CV facts) and the CV files it names. Only the letter writer writes, one draft letter file each. The Easy Apply raider works in your own signed-in LinkedIn browser and submits only the Easy Apply roles you approved in the chat; no agent sends e-mails, signs in or edits your tracker. Your main chat keeps a local log of which model ran which task (`_Playbook/model_runs.csv`: agent, model, task name, size, quality score; no personal data).

**Claude:** processing by Claude follows Anthropic's own privacy policy for your account.

**Passwords and codes:** the plugin never types passwords or verification codes; you enter them yourself.

Questions: open an issue at https://github.com/gabsicle/gabis-job-hunter/issues
