# sharadox-web-application

The Sharadox website — https://sharadox.com · "Technologies that simplify the world."

Built on the Sharadox engineering standard (see `template-web-application`): TypeScript, Next.js App Router, Turborepo with the Vercel Remote Cache, Sass modules, ESLint, Prettier, Vitest, Playwright, Husky, TypeDoc.

## Highlights

- EN/PT at `/en` and `/pt`, Geist type, black canvas.
- Interactive WebGL globe: `src/components/globe` (React Three Fiber). Land dots are precomputed into `public/globe/land.bin` by `pnpm globe:points` (`src/scripts/globe-points`).
- Contact form: server action `src/actions/send-contact` → AWS SES → email@sharadox.com, with honeypot, fill-time and rate-limit spam checks.
- SEO: per-locale metadata, share images (`src/components/share-image`), JSON-LD, sitemap, robots, manifest.

## Structure

One thing per file: `index.<ext>` named by its folder, with `type.ts`, `index.module.scss`, `unit-test.ts(x)`, `end-to-end-test.ts` and `benchmark-test.ts` beside it.

```
src/app/            routes (Next's own file names)
src/components/     hero, globe (+ world, dots, arc, marker, shader/*), services (+ card, *-visual), process (+ step), contact (+ form), …
src/hooks/          spotlight, in-view, land-points, globe-drag
src/utilities/      locale, translate, parse-contact, rate-limit, escape-html, lat-lng-to-vector, radians, horizon-dots, webgl-support
src/content/        copy per section
src/actions/        server actions
src/styles/         tokens (Sass helpers), global
```

## Commands

`pnpm dev` · `pnpm verify` (everything CI runs, cached by Turbo) · `pnpm exec playwright test --update-snapshots` (accept intended visual changes)

Visual regression tests freeze time with Playwright's clock, scroll through the page to trigger every reveal and mask the WebGL canvas.

## Environment (Vercel)

`SES_REGION`, `SES_ACCESS_KEY_ID`, `SES_SECRET_ACCESS_KEY` (IAM user limited to `ses:SendEmail`). Optional: `CONTACT_TO`, `CONTACT_FROM`. Turbo remote cache: `TURBO_REMOTE_CACHE_SIGNATURE_KEY`.

## Deploys

Pushing to `index` deploys to production.
