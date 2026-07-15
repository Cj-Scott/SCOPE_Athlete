# SCOPE Athlete

SCOPE Athlete is a local-first planning workspace for student-athletes and families who are trying to understand school fit, stay organized, and keep the next best actions visible.

SCOPE stands for **School Comparison & Opportunity Planning Engine**.

The idea behind SCOPE Athlete is personal: the path toward being noticed by the right schools can feel scattered across profiles, video links, outreach notes, deadlines, visits, academic requirements, and changing rules. Families should not need to already know every step of that process just to give their athlete a fair chance to be seen.

SCOPE Athlete is meant to make that work clearer. It helps families organize the information they already manage, compare schools more thoughtfully, track conversations and follow-ups, and understand where more preparation is needed.

## What It Helps With

- Organizing athlete profile, readiness, and school-fit details.
- Tracking schools, contacts, outreach, follow-ups, camps, and visits.
- Keeping public video/reference links in one place without uploading private media.
- Reviewing source notes and update information before making decisions.
- Keeping planning records local to the device, with backup and privacy boundaries.

## Alpha Status

SCOPE Athlete is currently in private alpha review with trusted testers. The alpha focuses on workflow clarity, local data behavior, Windows packaging, and whether the tool helps families make a complicated process easier to act on.

Use only synthetic demo data during alpha review. Do not enter real player information, private notes, private school-contact details, or sensitive family information into feedback forms.

## Reviewer Hub

The private alpha reviewer hub is hosted through GitHub Pages from the `docs/` folder in this repository.

After GitHub Pages is enabled, the site will be available at:

https://cj-scott.github.io/SCOPE_Athlete/

## Downloads

Private-alpha Windows installer downloads are published through this repository's GitHub Releases:

https://github.com/Cj-Scott/SCOPE_Athlete/releases/tag/alpha-v0.1.10

The current alpha installers are intentionally unsigned. Windows may show a SmartScreen warning. Only install them if you are part of the trusted private alpha review group, and verify downloads with the published `SHA256SUMS.txt` file when possible.

For review, download the setup EXE, install SCOPE Athlete, load synthetic demo data from Settings, and uninstall afterward through Windows Settings -> Apps -> Installed apps.

## Release Verification

Before telling reviewers a new alpha download is ready, verify that the public site, updater manifest, data-pack manifest, and GitHub Release assets all point at the same version:

```powershell
npm run verify:alpha-release -- 0.1.10
npm run verify:alpha-release:live -- 0.1.10
```

Run the live check only after the GitHub Pages deployment for the public repo has completed.

## Data-Pack Updates

Public data-pack versions for school catalog, rules, and evidence-link updates are tracked in `DATA_PACK_CHANGELOG.md`.

The desktop application changelog is maintained separately in the private backend/source repository.

## Repository Boundary

This repository is public and only contains the public-facing site, data-pack mirror, and distribution materials. Application source and private release tooling are maintained separately in the private backend repository. Codex and contributor repo-boundary instructions are captured in `AGENTS.md`.

## License

The public-facing materials in this repository are distributed under the included license. The desktop application source code and internal build process are maintained separately.
