#!/usr/bin/env node
/**
 * Trivance LINE B - build-time dataset validator.
 *
 * Catches data drift that TypeScript cannot see (JSON is imported through
 * `as unknown as` casts). Fails the build with a clear message when a required
 * field is missing or a slug reference is dangling. Runs before `next build`.
 */

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];

const readJson = (rel) => JSON.parse(readFileSync(join(root, rel), 'utf8'));

const tools = readJson('src/data/tools.json');
const bestPages = readJson('src/data/pages/best.json').pages;
const vsPages = readJson('src/data/pages/vs.json').pages;
const altPages = readJson('src/data/pages/alternatives.json').pages;
const hubPages = readJson('src/data/pages/hubs.json').pages;

const REQUIRE_STRING = ['toolSlug', 'toolName', 'bestFor', 'verdict', 'pricedAt'];
const REQUIRE_PAGE = ['slug', 'h1', 'metaDescription', 'updatedAt'];
const ISO_RE = /^\d{4}-\d{2}-\d{2}$/;

for (const [toolSlug, tool] of Object.entries(tools)) {
  if (!tool || typeof tool !== 'object') {
    errors.push(`tools.json: "${toolSlug}" is not an object`);
    continue;
  }
  for (const field of REQUIRE_STRING) {
    if (typeof tool[field] !== 'string' || tool[field].length === 0) {
      errors.push(`tools.json:${toolSlug} missing string field "${field}"`);
    }
  }
  if (typeof tool.commissionPct !== 'number' && tool.commissionPct !== null) {
    errors.push(`tools.json:${toolSlug} commissionPct must be number or null`);
  }
  if (typeof tool.affiliateUrl !== 'string' && tool.affiliateUrl !== null) {
    errors.push(`tools.json:${toolSlug} affiliateUrl must be string or null`);
  }
  if (tool.affiliateDisclosure !== true) {
    errors.push(`tools.json:${toolSlug} affiliateDisclosure must be true`);
  }
  for (const field of ['pricedAt']) {
    if (typeof tool[field] !== 'string' || !ISO_RE.test(tool[field])) {
      errors.push(`tools.json:${toolSlug} ${field} must be an ISO date (YYYY-MM-DD)`);
    }
  }
  if (tool.affiliateUrl && tool.affiliateUrl.includes('PLACEHOLDER')) {
    console.warn(`WARN: tools.json:${toolSlug} affiliateUrl is still a PLACEHOLDER (replace after program approval)`);
  }
}

const checkPages = (label, pages, requiredExtra, requireDisclosure) => {
  for (const page of pages) {
    for (const field of REQUIRE_PAGE) {
      if (typeof page[field] !== 'string' || page[field].length === 0) {
        errors.push(`${label}: page missing string field "${field}"`);
      }
    }
    for (const field of requiredExtra) {
      if (page[field] === undefined) {
        errors.push(`${label}: page missing field "${field}"`);
      }
    }
    if (typeof page.updatedAt !== 'string' || !ISO_RE.test(page.updatedAt)) {
      errors.push(`${label}: updatedAt must be an ISO date (YYYY-MM-DD)`);
    }
    if (requireDisclosure && page.disclosure !== true) {
      errors.push(`${label}: disclosure must be true on every page`);
    }
  }
};

checkPages('best.json', bestPages, ['category', 'categorySlug', 'intro', 'itemSlugs', 'comparisonCriteria', 'faqs'], true);
checkPages('vs.json', vsPages, ['toolASlug', 'toolBSlug', 'verdict', 'comparisonTable', 'faqs'], true);
checkPages('alternatives.json', altPages, ['primaryToolSlug', 'alternativeSlugs', 'reasonWhy', 'faqs'], true);
checkPages('hubs.json', hubPages, ['title', 'intro', 'sections'], false);

// slug references
for (const page of bestPages) {
  for (const slug of page.itemSlugs) {
    if (!tools[slug]) errors.push(`best.json:${page.slug} references unknown tool "${slug}"`);
  }
}
for (const page of vsPages) {
  for (const slug of [page.toolASlug, page.toolBSlug]) {
    if (!tools[slug]) errors.push(`vs.json:${page.slug} references unknown tool "${slug}"`);
  }
}
for (const page of altPages) {
  for (const slug of [page.primaryToolSlug, ...page.alternativeSlugs]) {
    if (!tools[slug]) errors.push(`alternatives.json:${page.slug} references unknown tool "${slug}"`);
  }
}

if (errors.length > 0) {
  console.error('DATA VALIDATION FAILED:');
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

console.log('data validation OK (tools:', Object.keys(tools).length, '| best:', bestPages.length, '| vs:', vsPages.length, '| alternatives:', altPages.length, '| hubs:', hubPages.length, ')');
