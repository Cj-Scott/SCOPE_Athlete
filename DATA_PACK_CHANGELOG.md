# SCOPE Athlete Data-Pack Change Log

This file tracks public data-pack versions for the SCOPE Athlete alpha update channel.

Application and installer versions are tracked separately in the private backend/source repository.

Public update channel:

```text
https://cj-scott.github.io/SCOPE_Athlete/data-packs/latest/recruiting-os-data-manifest.v1.json
```

## [2026.7.14.8] - 2026-07-14

### Published
- Re-published the alpha data-pack mirror after app release `0.1.8` accidentally generated lower `2026.7.14` pack versions over the existing `2026.7.14.1` public packs.
- Restored monotonic data-pack versioning so already-updated alpha clients can detect and apply the current catalog, rules, and evidence packs.
- Manifest schema version: `1`.
- Minimum compatible app version: `0.1.0`.
- Latest app version reported by manifest: `0.1.8`.

### Packs
- `school-catalog` version `2026.7.14.8`
  - Records: `13` schools.
- `rules` version `2026.7.14.8`
  - Records: `3` compliance rules, `3` task templates, `8` milestones.
- `evidence-links` version `2026.7.14.8`
  - Records: `0` evidence links.

### Notes
- This update is data-only; it does not install a new app binary.
- Existing installed app versions that already applied `2026.7.14.1` should now see this as a newer data-pack update.

## [2026.7.14.1] - 2026-07-14

### Published
- Refreshed the alpha school catalog from the richer demo school set.
- Expanded the school catalog to `13` schools, including Greensboro College, Wingate University, and College of Charleston.
- Added catalog logo metadata for the demo-backed schools so alpha clients can test school-logo updates through the data-pack channel.
- Manifest schema version: `1`.
- Minimum compatible app version: `0.1.0`.
- Latest app version reported by manifest: `0.1.7`.

### Packs
- `school-catalog` version `2026.7.14.1`
  - Records: `13` schools.
  - SHA-256: `6d67b7564a1b4d3c2d30835085d5ae6f862dc01a520e57b167aae9847b766f6b`.
- `rules` version `2026.7.14.1`
  - Records: `3` compliance rules, `3` task templates, `8` milestones.
  - SHA-256: `24ac5f80ce4522a799f9ecfafc6f3771b2514db47e9ef145a6a6e86b76a807ff`.
- `evidence-links` version `2026.7.14.1`
  - Records: `0` evidence links.
  - SHA-256: `b8bf7c415c9676efe24d7073a71c7e2b4feaec7e4d866c8e29bae848e9894722`.

### Notes
- Existing installed app version `0.1.6` should detect this as newer than `2026.7.14`.
- This update is data-only; it does not install a new app binary.
- Manifest signature was refreshed for app release `0.1.7`; pack versions and pack checksums did not change.

## [2026.7.14] - 2026-07-14

### Published
- Refreshed public alpha data packs from the current backend source.
- Added NCAA eligibility timeline milestone data to the rules pack.
- Added rules-bound task-template counts to the public manifest record counts.
- Manifest schema version: `1`.
- Minimum compatible app version: `0.1.0`.
- Latest app version reported by manifest: `0.1.6`.

### Packs
- `school-catalog` version `2026.7.14`
  - Records: `10` schools.
  - SHA-256: `f7f75d13f877b1661bf5a4850032f9426b62f47a5ee88e2422bb580961f7777d`.
- `rules` version `2026.7.14`
  - Records: `3` compliance rules, `3` task templates, `8` milestones.
  - SHA-256: `86bb08234e768745d8a0c9294391a22be0c53ad215b72473b3b7619de34b68db`.
- `evidence-links` version `2026.7.14`
  - Records: `0` evidence links.
  - SHA-256: `f1ac8ab2fbe2d055059f36425056946c3bb0827dec4f707e285231fcb5a38d04`.

### Notes
- Existing installed app version `0.1.2` can detect these as newer than `2026.7.10`.
- The rules pack update is data-only; it does not install a new app binary.

## [2026.7.10] - 2026-07-10

### Published
- Initial signed public alpha data-pack release.
- Published through the public GitHub Pages data-pack mirror.
- Manifest schema version: `1`.
- Minimum compatible app version: `0.1.0`.
- Latest app version reported by manifest: `0.1.6`.

### Packs
- `school-catalog` version `2026.7.10`
  - Records: `10` schools.
  - SHA-256: `510512108ba6a35c4ab5ba09d2afca2b910883f51f22f59529c91c8bff3e3d53`.
- `rules` version `2026.7.10`
  - Records: `3` compliance rules.
  - SHA-256: `916ce4911a8b9fc5eeab023d819b2971974856428557e932fc3b80853996778c`.
- `evidence-links` version `2026.7.10`
  - Records: `0` evidence links.
  - SHA-256: `e4a7b94978b7e2d666d6c6aef812e4d5d83aaf0b2a350362f86ee1b3597cab51`.

### Notes
- This release keeps data-pack updates separate from signed app installer updates.
- The manifest and pack checksums are mirrored under `docs/data-packs/latest/`.

## [2026.7.5] - Built-In Baseline

### Added
- First built-in app baseline for local school catalog, rules, and evidence data before public data-pack publishing.
- Used by the desktop app when no public data pack has been applied.

### Notes
- This baseline is not a public downloadable data-pack release.
- It remains listed here so alpha testers and release notes can distinguish built-in data from public data-pack updates.

