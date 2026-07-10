# Codex Repository Instructions

This repository is the public SCOPE Athlete distribution and alpha-review repository.

## Repository Identity

- Repository: `Cj-Scott/SCOPE_Athlete`
- Visibility: public
- Purpose: public project description, GitHub Pages reviewer hub, public data-pack mirror, and public release/download surface.

## Private Backend Boundary

Application source and private implementation work belong in the separate private repository:

```text
Cj-Scott/SCOPE_Athlete_Backend
```

Do not copy backend source code, private release process details, local QA artifacts, signing docs, Bitwarden orchestration docs, or internal planning history into this public repository.

## Allowed Public Contents

This public repository may contain:

- public README and project intent
- copied public license file
- GitHub Pages site under `docs/`
- reviewer workflow walkthrough pages
- public image assets and favicon
- public data-pack mirror under `docs/data-packs/latest/`
- release notes, checksums, and public installer download links
- GitHub Release assets for reviewed public/alpha builds

## Not Allowed Public Contents

Do not commit:

- application source code
- private keys, certificates, access tokens, or secret IDs
- `.release-secrets/` contents
- Bitwarden setup material
- local databases, backups, or reviewer response exports
- internal architecture/compiler docs
- private GitHub Project planning exports
- unrevised installers with outdated product names

## Cross-Repo Rule

When a task changes public distribution, check whether the backend needs a matching source/config change. In particular:

- data-pack manifests must point at `https://cj-scott.github.io/SCOPE_Athlete/...`
- app source/update-channel defaults are maintained in `Cj-Scott/SCOPE_Athlete_Backend`
- installers should be built from backend source, then published here only after branding and release checks pass

If context is compacted or memory is unclear, re-read this file and the backend repository `AGENTS.md` before making repo-boundary decisions.
