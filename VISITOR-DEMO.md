# Database-backed visitor demo

The original React/Next.js application now has an explicit disposable visitor mode. Set both VISITOR_DEMO=true (server) and NEXT_PUBLIC_VISITOR_DEMO=true (build). Use only a dedicated empty demo database. Ordinary authenticated application behavior remains available when these flags are false.

Visitors start at /auth/signin and receive an opaque, HttpOnly, SameSite=Lax session cookie, Secure on HTTPS. Their three starter cards and five study boxes are real PostgreSQL records. Sessions expire after one hour without renewal. Reset deletes the user's groups, invitations, cards, attempts, boxes and session in a transaction. Expired visitors are removed when another visitor starts a demo; cleanup can be delayed when nobody visits.

API writes require the configured NEXTAUTH_URL origin. Each session permits at most 1,000 API requests and 500,000 bytes of submitted JSON, with a 16 KiB request limit. Capacity is limited to 100 stored visitor accounts using a database lock. Reset remains available after the request limit. These are portfolio bounds, not comprehensive denial-of-service protection.

Study groups and group cards remain isolated by visitor, including groups marked public. Uploads, automatic translation and invitation writes return an explicit unavailable response; no Google, Cloudinary or email credentials are configured. The interface explains these limits. The normal application's cross-user collaboration is tested separately in the existing recovery suite.

Concurrent answers lock the flashcard row before reading its current study box, so two accepted answers advance sequentially rather than overwriting progression. Account deletion removes owned groups and invitation references before deleting the user.

## Verification

- `yarn test:ci`: 307 existing unit/component tests.
- `yarn test:visitor`: desktop/mobile creation, reload persistence, study attempts, isolation, cross-origin rejection, reset, public-group isolation and concurrent answers.
- Local visitor tests also force expiry and request-limit exhaustion and inspect physical database cleanup. They refuse direct inspection of a hosted database.
- `VISITOR_URL=https://tofu-vocab-demo.vercel.app yarn test:visitor`: hosted checks; the direct database test is deliberately skipped.

Use `yarn local:setup` to update the disposable local schema. The new DemoVisit model is initialized on the dedicated Neon demo database; do not run schema push against historical or real-user databases. Existing production schema changes need separately reviewed migrations.

Hosted setup uses the personal Vercel Hobby project tofu-vocab-demo and Neon free_v3 resource tofu-vocab-demo-db. Server-only settings are DATABASE_URL, SECRET, NEXTAUTH_URL and VISITOR_DEMO. NEXT_PUBLIC_VISITOR_DEMO is the only demo flag exposed to the client. Never expose connection strings or SECRET through NEXT_PUBLIC_ variables.
