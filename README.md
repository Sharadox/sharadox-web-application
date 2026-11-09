# sharadox-web-application

The Sharadox website — https://sharadox.com · "Technologies that simplify the world."

Built on the Sharadox engineering standard (see `template-web-application`): TypeScript, Next.js App Router, Turborepo with the Vercel Remote Cache, Sass modules, ESLint, Prettier, Vitest, Playwright, Husky, TypeDoc. Names are never abbreviated.

## Highlights

- English/Portuguese at `/en` and `/pt`, Geist type, black canvas.
- Interactive WebGL globe: `src/components/globe` (React Three Fiber). Land dots are precomputed into `public/globe/land.bin` by `pnpm globe-points` (`src/scripts/globe-points`).
- Contact form: server action `src/actions/send-contact` → [`@sharadox/email-web-library`](https://github.com/Sharadox/email-web-library) → Amazon SES (SMTP, sending subdomain mail.sharadox.com) → email@sharadox.com, with honeypot, fill-time and rate-limit spam checks.
- SEO: per-locale metadata, share images (`src/components/share-image`), JSON-LD, sitemap, robots, manifest.

## Structure

One thing per file: `index.<extension>` named by its folder, with `type.ts`, `index.module.scss`, `unit-test.ts(x)`, `end-to-end-test.ts` and `benchmark-test.ts` beside it.

```
src/app/            routes (Next's own file names)
src/components/     hero, globe (+ world, dots, arc, marker, shader/*), services (+ card, *-visual), process (+ step), contact (+ form), navigation, …
src/hooks/          spotlight, in-view, land-points, globe-drag
src/utilities/      locale, translate, parse-contact, rate-limit, escape-html, latitude-longitude-to-vector, radians, horizon-dots, web-gl-support
src/content/        copy per section
src/actions/        server actions
src/styles/         tokens (Sass helpers), global
```

## Commands

`pnpm development` · `pnpm verify` (everything continuous integration runs, cached by Turborepo) · `pnpm exec playwright test --update-snapshots` (accept intended visual changes)

Visual regression tests freeze time with Playwright's clock, scroll through the page to trigger every reveal and mask the WebGL canvas.

## Branches and addresses

| Branch                | Address                                  | Who can open it  |
| --------------------- | ---------------------------------------- | ---------------- |
| `index`               | https://sharadox.com                     | everyone         |
| `pre-production`      | https://pre-production.sharadox.com      | Vercel team only |
| `<thing>.development` | https://<thing>.development.sharadox.com | Vercel team only |

Work on `<thing>.development`, merge it into `pre-production` (squash), check it there, then merge `pre-production` into `index` (merge commit). The branch-domain workflow adds and removes each development branch's address.

## Environment (Vercel)

`EMAIL_SERVER_HOST`, `EMAIL_SERVER_PORT`, `EMAIL_SERVER_USERNAME`, `EMAIL_SERVER_PASSWORD` (Amazon SES SMTP credentials) and `EMAIL_SENDER_ADDRESS`; production and preview. Turborepo remote cache: `TURBO_REMOTE_CACHE_SIGNATURE_KEY`.
