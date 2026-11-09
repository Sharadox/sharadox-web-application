# sharadox-web-application

The Sharadox website — https://sharadox.com · "Technologies that simplify the world."

Built on the Sharadox engineering standard (see `template-web-application`): TypeScript, Next.js App Router, Turborepo with the Vercel Remote Cache, Sass modules, ESLint, Prettier, Vitest, Playwright, Husky, TypeDoc. Names are never abbreviated.

## Structure

This application is thin: routes (`src/app`), global styles (`src/style/global`), configuration, the contact form's server action (`src/action/send-contact`) and the globe land-points generator (`src/script/globe-points`). Everything the site is made of lives in [`@sharadox/sharadox-web-library`](https://github.com/Sharadox/sharadox-web-library); generic pieces come from [`@sharadox/web-library`](https://github.com/Sharadox/web-library) and email from [`@sharadox/email-web-library`](https://github.com/Sharadox/email-web-library).

- English/Portuguese at `/en` and `/pt`; the interactive WebGL globe's land dots are precomputed into `public/globe/land.bin` by `pnpm globe-points`.
- Contact form: Amazon SES (SMTP, sending subdomain email.sharadox.com) → email@sharadox.com, with honeypot, fill-time and rate-limit spam checks.
- Search engines: per-locale metadata, share images, JSON-LD, sitemap, robots, manifest.

## Commands

`pnpm development` · `pnpm verify` (everything continuous integration runs, cached by Turborepo) · `pnpm exec playwright test --update-snapshots` (accept intended visual changes)

Visual regression tests freeze time with Playwright's clock, scroll through the page to trigger every reveal and mask the WebGL canvas.

## Branches and addresses

| Branch              | Address                                | Who can open it  |
| ------------------- | -------------------------------------- | ---------------- |
| `index`             | https://sharadox.com                   | everyone         |
| `preview`           | https://preview.sharadox.com           | Vercel team only |
| `<feature>.preview` | https://<feature>.preview.sharadox.com | Vercel team only |

Work on `<feature>.preview`, merge it into `preview` (squash), check it there, then merge `preview` into `index` (merge commit). The branch-domain workflow adds and removes each feature branch's address.

## Environment (Vercel)

`EMAIL_SERVER_HOST`, `EMAIL_SERVER_PORT`, `EMAIL_SERVER_USERNAME`, `EMAIL_SERVER_PASSWORD` (Amazon SES SMTP credentials) and `EMAIL_SENDER_ADDRESS`; production and preview. Turborepo remote cache: `TURBO_REMOTE_CACHE_SIGNATURE_KEY`.

## Licence

The source is public so anyone can read and verify it, but it is **not open source**: Licença Sharadox de Código Verificável, versão 0.1.0 ([português](LICENCA.md), the binding text · [English translation](LICENSE.md)). The Sharadox name, brand and design are reserved.
