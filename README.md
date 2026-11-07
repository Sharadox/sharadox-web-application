# sharadox-web-application

The Sharadox website — https://sharadox.com · "Technologies that simplify the world."

- Next.js (App Router), EN/PT at `/en` and `/pt`, Geist
- Interactive WebGL globe: `components/Globe.tsx` (React Three Fiber). Land dots are precomputed into `public/globe/land.bin` by `pnpm globe:points`
- Contact form: server action `app/actions.ts` → AWS SES → email@sharadox.com
- SEO: per-locale metadata, OG/Twitter images, JSON-LD, sitemap, robots, manifest

## Environment (Vercel)
`SES_REGION`, `SES_ACCESS_KEY_ID`, `SES_SECRET_ACCESS_KEY` (IAM user limited to ses:SendEmail). Optional: `CONTACT_TO`, `CONTACT_FROM`.

## Deploys
Pushing to `index` deploys to production.
