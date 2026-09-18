# Recovery notes

September 17, 2026. Personal repository `brennanbutler01/tv`, branch `portfolio-refresh`.

## Implemented

-   Pinned Node, Next.js, NextAuth, Prisma, TypeScript, and Playwright to compatible versions; migrated the session API and font imports, and fixed the local Prisma import collision.
-   Removed tracked environment files, captured browser authentication, and the browser setup containing embedded Google credentials. Local configuration is ignored and an example is provided. A later September 17 pass cleaned the affected branch histories; retained GitHub commits and provider revocation remain separate follow-ups.
-   Fixed study scheduling so a nonempty collection cannot recurse indefinitely while repeatedly selecting an empty box. Due cards take priority; populated boxes retain weighted selection; malformed box numbers are rejected.
-   Made failed HTTP responses reject instead of being treated as successful results. Flashcard forms retain input on failed saves; profile success appears only after a completed save.
-   Required authenticated ownership for individual flashcards, duplicate lookup, and user endpoints. Profile writes cannot mutate Prisma relationships or account identity.
-   Added strict group-edit and membership input validation, owner-only group edits/deletion, and recipient-only invitation responses. Accepting an invitation and adding membership occur in one database transaction.
-   Derived flashcard ownership, study box initialization, bulk import ownership, invitation sender, and study-attempt timestamps on the server.
-   Added authentication gates for translation and upload, upload size/type limits, parser-generated temporary filenames, and file cleanup.
-   Repaired stale test imports, data fixtures and expectations, a mislabeled invitation button, and inaccessible study-side grouping.
-   Added isolated PostgreSQL setup and a browser suite using synthetic data with no production credentials.

## Verification

Final verification passed: isolated local setup, TypeScript checking, 307 unit/component tests across 113 files, the production build, and all 7 browser/database checks. Browser coverage includes real database persistence, cross-account rejection, group ownership, invitation acceptance, study answers, mobile overflow, and failed-save retry.

Original browser specifications outside `__e2e__/recovery` are not claimed as passing. Google OAuth, Cloudinary upload, translation providers, existing-database migrations, production traffic, and high-concurrency updates were not exercised.

## Still required before public release

1. Provider revocation and retained-commit cleanup in the private original remain separate incident follow-up. This independent public edition does not import its old history or screenshots.
2. See DEPENDENCIES.md for the current three advisories in Prisma development tooling. Earlier dependency counts are superseded by the September 18 upgrade.

3. The disposable portfolio mode is now implemented as a separate static export at https://tofu-vocab-demo.vercel.app. Keep the original backend out of that deployment.
4. Review the remaining API behavior, rate limits, account deletion with owned groups, external-provider errors, and concurrent answer/streak consistency before allowing real users. Current regression tests cover specific repaired paths, not a complete security audit.
5. Continue improving the original authenticated UI. The static portfolio demo has its own responsive layout and a smaller client bundle, and reuses the tested study-domain functions.

## Static portfolio deployment

The dedicated Hobby project publishes only static HTML, CSS and browser JavaScript. It uses no server functions, secrets, accounts or external services. Four browser workflows cover card editing and deletion, answer grading and box progression, per-tab isolation/reload/reset, mobile layout, and rejection of backend/credential paths. Static files were also checked against local environment values before upload.

All four static-demo browser workflows also passed against the public Vercel URL on September 17, 2026. The Vercel team plan was verified as Hobby before deployment.

## September 18 dependency and publication pass

Upgraded to Next.js 16.3.4 and Prisma 7.10.0 with its PostgreSQL adapter. Both the original app and static demo build. Historical screenshots were removed from the publication source. See `DEPENDENCIES.md` for the current three Prisma development-tool advisories, which supersede earlier dependency counts. Public hosting remains a separate static demo with synthetic data and no backend credentials. The authenticated legacy app is for local review; the remaining backend and external-provider limitations above still apply.

Public source is published from an independent clean snapshot. Affected original repositories remain private, and their cached historical commits are not imported. Credential revocation is separate from source cleanup.

## Database-backed visitor recovery

Implemented one-hour, non-renewing visitor sessions, transactional account cleanup, global capacity and per-session request/write limits, same-origin write checks and isolated study groups. External uploads, translation and invitation writes are unavailable without provider credentials. Fixed nested modal headings and serialized concurrent answers so box progression cannot lose an accepted answer. All 307 existing tests and four local visitor/database scenarios passed. Hosted verification passed: desktop and mobile visitor workflows, private-group isolation and concurrent answer progression. The direct-database expiry test is intentionally local only. Existing seven authenticated recovery browser scenarios also pass.
