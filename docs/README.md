# SCOPE Athlete Private Alpha Hub

This folder contains the GitHub Pages source for the private alpha review hub.

## Configure

1. Use `google-form-blueprint.md` as the source of truth for the feedback form sections, question types, and privacy language.
2. Current live feedback form: `https://docs.google.com/forms/d/e/1FAIpQLScRYH-lcCNCXhK4kjWCGD9XIHYNmTmkrWpeJSGXx6BVQUF82w/viewform`.
3. Enable GitHub Pages for the repository using the `main` branch and `/docs` folder.
4. Public compliance pages:
   - `privacy.html` covers local-first storage, backups, diagnostics, update checks, external processors, feedback retention, deletion/contact path, and the synthetic-data-only alpha boundary.
   - `terms.html` covers alpha-only use, no real private data, unsigned installer warning, no redistribution without permission, no school-attention guarantee, no legal/NCAA/compliance advice, and non-affiliation language.

The page intentionally keeps feedback outside the SCOPE Athlete desktop app. Use `feedback-triage-playbook.md` to review Google Form responses manually before creating GitHub issues or project cards. Alpha feedback has a 90-day deletion or review target, and reviewers should not submit real athlete/family data or under-13 responses.

## Data-Pack Versions

Public data-pack version history is tracked in `../DATA_PACK_CHANGELOG.md`.

Application and installer version history is tracked in the private backend/source repository.
