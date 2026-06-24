# Release Policy

Dwains Dashboard Next follows semantic versioning.

## Version Numbers

- Patch release, for example `1.2.1`: bug fixes, small styling fixes, compatibility fixes, regression fixes and documentation-only updates.
- Minor release, for example `1.3.0`: new features, new settings, new dashboard sections, new device views or other backwards-compatible improvements.
- Major release, for example `2.0.0`: breaking changes, configuration changes that need migration, changed install behavior or removed public behavior.
- Pre-release, for example `1.3.0-beta.1`: public testing before a stable release.

## Rules

- Do not overwrite or recreate a published tag or release.
- Every public release uses a `vX.Y.Z` Git tag.
- Keep `package.json`, `package-lock.json`, the built file in `dist/` and the README release notes in sync.
- HACS users receive published GitHub releases, so a release must include the built dashboard file.
- Use a minor release when user-facing features are added, even if bug fixes are included in the same release.
- Use a patch release only when there are no new user-facing features.

## Release Checklist

1. Decide the version number using the rules above.
2. Update `package.json` and `package-lock.json`.
3. Update `README.md` with the current release and release notes.
4. Run `npm run type-check`.
5. Run `npm run build`.
6. Confirm `dist/dwains-dashboard-next.js` changed when source changed.
7. Commit with `Release X.Y.Z`.
8. Create tag `vX.Y.Z`.
9. Push the commit and tag.
10. Create the GitHub release with English release notes.
