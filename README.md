# Trivance LINE B - AI Tools Affiliate Engine (Phase 1)

Programmatic SEO affiliate engine for AI tools with recurring-commission programs.
Static Next.js 14 App Router site (TypeScript), pure static export for GitHub Pages.
Spec: `C:\Users\black\trivance\line-b-niche-brief-ai-tools-affiliate.md` (2026-08-07).

## Stack

- Next.js 14 (App Router) + React 18 + TypeScript, `output: 'export'`
- No server code, no native node modules - deploys to any static host (GitHub Pages)
- Data: typed JSON dataset in `src/data/` (`src/lib/types.ts` is the authoritative schema)
- Routing: one catch-all route (`src/app/[...slug]/page.tsx`) driven by the dataset
  registry (`src/lib/registry.ts`) - adding a page = adding a dataset entry

## Quickstart

```bash
npm install
npm run typecheck   # tsc --noEmit
npm run build       # next build + sitemap generation into out/
npm run preview     # serve out/ at http://localhost:8080
```

## Environment variables

| Var | Purpose | Example |
|---|---|---|
| `SITE_BASEPATH` | Base path for the deployment. Leave unset for a custom domain or GH Pages user-site (default `/`). | `/trivance-line-b` |
| `SITE_URL` | Full origin INCLUDING basePath, used by the sitemap script. MUST be set before first deploy. | `https://k00jax.github.io/trivance-line-b` |

## Data pipeline

- `src/data/tools.json` - canonical ToolItem records (single source of truth). Verified
  commission terms come from the brief section 4 table (corrected 2026-08-07 values).
- `src/data/pages/best.json` - Family A pages (itemSlugs reference tools.json)
- `src/data/pages/vs.json` - Family B pages (toolASlug / toolBSlug)
- `src/data/pages/alternatives.json` - Family C pages (primaryToolSlug / alternativeSlugs)
- `src/data/pages/hubs.json` - hub index pages

The registry resolves slug references into the published types at build time.
Rule: never invent values. Unknown data stays `null`/empty with a `PLACEHOLDER` or
README TODO; ratings only from G2 / Capterra / TAAFT with `ratingSource` recorded.

## Compliance

- Every page with affiliate links renders the FTC disclosure block above the first
  affiliate link AND the site-wide footer disclosure (brief 2.6).
- All affiliate CTAs render `rel="sponsored nofollow" target="_blank"`.
- No "we tested" / "we reviewed" framing - verdicts are labeled data-driven.
- Affiliate URLs in the seed data are placeholders (`?aff=PLACEHOLDER`) - replace
  with real tracking links after program approvals.

## SEO

- Dated `updatedAt` badge on every page; question-style H2s; FAQPage JSON-LD;
  ItemList JSON-LD on Family A/B; comparison tables (Family B); entity blocks (Family C).
- Build-time sitemaps: `sitemap-best.xml`, `sitemap-vs.xml`, `sitemap-alternatives.xml`,
  `sitemap-index.xml`, plus `robots.txt` (script: `scripts/generate-sitemaps.mjs`).

## GitHub Pages deploy (after Director review)

```bash
# GH Pages project site
SITE_URL=https://<user>.github.io/<repo> SITE_BASEPATH=/<repo> npm run build
# then publish the out/ directory to the gh-pages branch
```

## TODO for Kyle (before production go-live)

1. Replace every `?aff=PLACEHOLDER` affiliate URL with real tracking links after
   program approval (Jasper, Writesonic, Scalenut, Pictory, Surfer, Brand24,
   KrispCall, MeetGeek).
2. Apply to programs that need identity/manual approval: Jasper (PartnerStack),
   Writesonic (Impact), Brand24 (PartnerStack), MeetGeek (PartnerStack), Surfer
   (in-house application with audience review). Signup-only: Scalenut, KrispCall,
   Pictory.
3. Confirm Merlin AI (30% recurring, official page 403s bots) before adding; keep
   RocketReach out until confirmed via application.
4. Set `SITE_URL` + `SITE_BASEPATH` before the first deploy.
5. Verify named-source ratings (G2 / Capterra / TAAFT) for every tool - currently
   all `rating: null` because no named-source value exists in the brief.
6. Verify MeetGeek pricing (`meetgeek.ai/pricing`) - currently `null`.
7. Verify free tiers (Writesonic, Jasper) - currently "Not stated".
8. Confirm Scalenut limited pricing ($24/mo) before quoting it in paid media.
9. Choose the domain name; the Director reviews before any deploy.
