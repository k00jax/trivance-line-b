#!/usr/bin/env node
/**
 * Trivance LINE B - sitemap generator (build-time, run after `next build`).
 *
 * Emits into out/:
 *   sitemap-index.xml         - index of the three family segments
 *   sitemap-best.xml          - Family A roundups + /best/ hub
 *   sitemap-vs.xml            - Family B comparisons
 *   sitemap-alternatives.xml  - Family C alternatives + /alternatives/ hub
 *   robots.txt                - references sitemap-index.xml
 *
 * Each URL carries <lastmod> = the page's updatedAt from the dataset.
 *
 * Env:
 *   SITE_URL       full origin INCLUDING basePath if any, e.g.
 *                  https://k00jax.github.io/trivance-line-b
 *                  TODO(kyle): set before first deployment. The default below
 *                  is a placeholder and must not ship.
 *   SITE_BASEPATH  base path if different from '/' (mirrors next.config.js).
 */

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'out');

if (!existsSync(outDir)) {
  console.error('out/ not found - run `next build` first.');
  process.exit(1);
}

const siteUrl = (process.env.SITE_URL || 'https://example.com').replace(/\/+$/, '');
if (!process.env.SITE_URL) {
  console.warn('WARN: SITE_URL not set - sitemaps will use https://example.com. Set SITE_URL before deploying.');
}
const basePath = (process.env.SITE_BASEPATH || '').replace(/\/+$/, '');
// SITE_URL may already include basePath (e.g. https://k00jax.github.io/trivance-line-b).
// Only append basePath when SITE_URL does not end with it — never double-prefix.
const originWithBase = siteUrl.endsWith(basePath) ? siteUrl : `${siteUrl}${basePath}`;
const loc = (path) => `${originWithBase}${path}`;

const readJson = (rel) => JSON.parse(readFileSync(join(root, rel), 'utf8'));

const bestPages = (readJson('src/data/pages/best.json').pages ?? []);
const vsPages = (readJson('src/data/pages/vs.json').pages ?? []);
const altPages = (readJson('src/data/pages/alternatives.json').pages ?? []);
const hubPages = (readJson('src/data/pages/hubs.json').pages ?? []);

const escapeXml = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

function sitemapXml(entries) {
  const body = entries
    .map((entry) => `  <url>\n    <loc>${escapeXml(entry.url)}</loc>\n    <lastmod>${escapeXml(entry.lastmod)}</lastmod>\n  </url>`)
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

const families = [
  {
    file: 'sitemap-best.xml',
    entries: [
      ...hubPages
        .filter((h) => h.slug.startsWith('best/'))
        .map((h) => ({ url: loc(`/${h.slug}/`), lastmod: h.updatedAt })),
      ...bestPages.map((p) => ({ url: loc(`/best/${p.slug}/`), lastmod: p.updatedAt })),
    ],
  },
  {
    file: 'sitemap-vs.xml',
    entries: vsPages.map((p) => ({ url: loc(`/${p.slug}/`), lastmod: p.updatedAt })),
  },
  {
    file: 'sitemap-alternatives.xml',
    entries: [
      ...hubPages
        .filter((h) => h.slug === 'alternatives')
        .map((h) => ({ url: loc(`/${h.slug}/`), lastmod: h.updatedAt })),
      ...altPages.map((p) => ({ url: loc(`/${p.slug}/`), lastmod: p.updatedAt })),
    ],
  },
];

for (const family of families) {
  writeFileSync(join(outDir, family.file), sitemapXml(family.entries));
  console.log(`wrote ${family.file} (${family.entries.length} URLs)`);
}

const index = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${families
  .map((f) => `  <sitemap>\n    <loc>${escapeXml(loc(`/${f.file}`))}</loc>\n  </sitemap>`)
  .join('\n')}\n</sitemapindex>\n`;
writeFileSync(join(outDir, 'sitemap-index.xml'), index);
console.log('wrote sitemap-index.xml');

const robots = `User-agent: *\nAllow: /\n\nSitemap: ${escapeXml(loc('/sitemap-index.xml'))}\n`;
writeFileSync(join(outDir, 'robots.txt'), robots);
console.log('wrote robots.txt');
