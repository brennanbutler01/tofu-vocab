# Tofu.Vocab

A Vietnamese vocabulary learning application with personal flashcards, spaced review using five Leitner boxes, study history, and collaborative study groups. Built with Next.js, React, TypeScript, Mantine, Prisma, and PostgreSQL.

This repository is being recovered from its original 2023 implementation. The `portfolio-refresh` branch has a working local build and automated browser coverage. The hosted visitor version at **https://tofu-vocab-demo.vercel.app** uses the original application and a dedicated PostgreSQL database. Real-user authentication and external provider integrations remain outside the verified demo scope. See [RECOVERY.md](RECOVERY.md) for verification and remaining release work.

## Local setup

Requires Node 24.13.0, Corepack, Python 3, Docker, and Google Chrome for browser tests.

```sh
nvm use
corepack yarn install --frozen-lockfile
corepack yarn local:setup
corepack yarn test:browser
```

Setup creates a gitignored `.env.local` with a fresh local session secret and starts a disposable PostgreSQL database on `127.0.0.1:5193`. It refuses to initialize any other database. Browser tests start the app on `127.0.0.1:5192`, create synthetic accounts and temporary sessions, exercise the real app and API, then delete their own fixtures. They never sign into a real Google account or call paid translation/upload services.

For interactive development:

```sh
corepack yarn dev --hostname 127.0.0.1 --port 5192
```

The homepage works without credentials. Normal Google sign-in requires your own development `GOOGLE_ID` and `GOOGLE_SECRET` in `.env.local`; these are not provided by setup. Image upload requires `CLOUDINARY_URL`. The word-discovery feature uses external dictionary and translation services and has not been verified in this recovery pass.

## Checks

```sh
corepack yarn typecheck
corepack yarn test:ci
corepack yarn build
corepack yarn test:browser
```

Run the production build after stopping a development server that shares `.next`, rather than writing build output concurrently. Browser screenshots are saved under gitignored `test-results/`.

The browser command runs the new local recovery suite. Older browser specifications remain as historical coverage to migrate; they are not included in the passing count. The old Google-login setup and captured browser session were removed.

Stop local services with `docker compose stop`. Use `docker compose down` to remove containers while retaining the disposable database volume.

## Hosted portfolio demo

https://tofu-vocab-demo.vercel.app runs on the personal Vercel Hobby project `tofu-vocab-demo`.

Start a private one-hour session without signing up. Create and edit flashcards, study them, see saved progress, and manage your own study groups. Records survive reloads until expiry or **Reset demo**. Only invented information belongs in this demonstration.

The app runs on the personal Vercel Hobby project with a dedicated Neon free database. Google sign-in, Cloudinary uploads, automatic translation and cross-user invitations are unavailable in visitor mode. Groups remain isolated even when marked public. See [VISITOR-DEMO.md](VISITOR-DEMO.md) for cleanup behavior, limits and verification.

```sh
corepack yarn test:visitor
corepack yarn deploy:visitor
VISITOR_URL=https://tofu-vocab-demo.vercel.app corepack yarn test:visitor
```

Deployment uses a gitignored `.vercel/project.json` linked to the dedicated personal project. The script uploads tracked source from a temporary directory outside Git; it does not upload local environment files, history, or build artifacts. Hosted secrets stay in Vercel server settings. Commit new source files before deploying.

The earlier in-memory demo remains available through `build:portfolio` and `test:portfolio` for offline frontend review. The live database-backed application is verified through `test:visitor`.

This public edition starts from clean source without the original Git history or historical screenshots. The affected original repository remains private. See DEPENDENCIES.md and RECOVERY.md for the remaining work before running a real multi-user service.
