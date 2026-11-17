# Release rules for this repository

This repository is the Gabis Job Hunter plugin. The Claude plugin directory tracks `main` and serves every passing commit as a new version.

- Every change that ships raises `version` in `.claude-plugin/plugin.json` (semver: fixes → patch, new behaviour → minor). Installed copies only see an update when the version rises.
- The plugin ships no code: scripts are specified in `skills/job-hunter-setup/references/tools.md` and written at setup. Never add script files; change the spec instead.
- Before pushing: `claude plugin validate .claude-plugin/plugin.json` must pass.
- Work on a branch, open a pull request, merge to `main` only after the owner says go.
