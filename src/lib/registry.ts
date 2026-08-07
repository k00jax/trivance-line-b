/**
 * Trivance LINE B - build-time page registry.
 *
 * Storage format (JSON in src/data) uses slug references so tools.json is the
 * single source of truth for every tool. The registry resolves those slugs into
 * the published, typed shapes (types.ts) that templates render.
 *
 * JSON imports are cast through `unknown`: TS widens JSON string literals to
 * `string`, which would otherwise fail the strict literal types in types.ts.
 * The runtime disclosure guard in lib/disclosure.ts catches dataset drift.
 */

import type {
  FamilyAPage,
  FamilyBPage,
  FamilyCPage,
  HubPage,
  RegisteredPage,
  ToolItem,
  ToolSide,
} from './types';

import toolsData from '@/data/tools.json';
import bestData from '@/data/pages/best.json';
import vsData from '@/data/pages/vs.json';
import alternativesData from '@/data/pages/alternatives.json';
import hubsData from '@/data/pages/hubs.json';

interface RelatedLinkRecord {
  label: string;
  href: string;
}

interface FaqRecord {
  question: string;
  answer: string;
}

interface FamilyAPageRecord {
  slug: string;
  title: string;
  h1: string;
  metaDescription: string;
  category: string;
  categorySlug: string;
  updatedAt: string;
  intro: string;
  itemSlugs: string[];
  comparisonCriteria: string[];
  faqs: FaqRecord[];
  relatedLinks: RelatedLinkRecord[];
  disclosure: true;
}

interface FamilyBPageRecord {
  slug: string;
  h1: string;
  metaDescription: string;
  toolASlug: string;
  toolBSlug: string;
  updatedAt: string;
  verdict: FamilyBPage['verdict'];
  comparisonTable: FamilyBPage['comparisonTable'];
  faqs: FaqRecord[];
  relatedLinks: RelatedLinkRecord[];
  disclosure: true;
}

interface FamilyCPageRecord {
  slug: string;
  h1: string;
  metaDescription: string;
  primaryToolSlug: string;
  alternativeSlugs: string[];
  reasonWhy: string[];
  switchEvidence: FamilyCPage['switchEvidence'];
  faqs: FaqRecord[];
  relatedLinks: RelatedLinkRecord[];
  updatedAt: string;
  disclosure: true;
}

interface HubPageRecord {
  slug: string;
  title: string;
  h1: string;
  metaDescription: string;
  intro: string;
  sections: {
    heading: string;
    links: { label: string; href: string; description: string }[];
    planned: string[];
  }[];
  updatedAt: string;
}

const tools = toolsData as unknown as Record<string, ToolItem>;
const bestPages = (bestData as unknown as { pages: FamilyAPageRecord[] }).pages;
const vsPages = (vsData as unknown as { pages: FamilyBPageRecord[] }).pages;
const alternativePages = (alternativesData as unknown as { pages: FamilyCPageRecord[] }).pages;
const hubPages = (hubsData as unknown as { pages: HubPageRecord[] }).pages;

function resolveTool(slug: string): ToolItem {
  const tool = tools[slug];
  if (!tool) {
    throw new Error(`Missing tool in dataset: ${slug}`);
  }
  return tool;
}

function toToolSide(item: ToolItem): ToolSide {
  return {
    toolName: item.toolName,
    priceFromUsd: item.priceFromUsd,
    pricePeriod: item.pricePeriod,
    // 'free'/'freemium' => true; 'paid' means no free tier was verified (null, not false)
    freeTier: item.priceTier === 'free' || item.priceTier === 'freemium' ? true : null,
    commissionPct: item.commissionPct,
    commissionRecurring: item.commissionRecurring,
    rating: item.rating,
    ratingSource: item.ratingSource,
    keyFeatures: item.keyFeatures,
    pros: item.pros,
    cons: item.cons,
    affiliateUrl: item.affiliateUrl,
  };
}

function resolveFamilyA(rec: FamilyAPageRecord): FamilyAPage {
  return {
    slug: rec.slug,
    title: rec.title,
    h1: rec.h1,
    metaDescription: rec.metaDescription,
    category: rec.category,
    categorySlug: rec.categorySlug,
    updatedAt: rec.updatedAt,
    intro: rec.intro,
    items: rec.itemSlugs.map(resolveTool),
    comparisonCriteria: rec.comparisonCriteria,
    faqs: rec.faqs,
    relatedLinks: rec.relatedLinks,
    disclosure: rec.disclosure,
  };
}

function resolveFamilyB(rec: FamilyBPageRecord): FamilyBPage {
  return {
    slug: rec.slug,
    h1: rec.h1,
    metaDescription: rec.metaDescription,
    toolA: toToolSide(resolveTool(rec.toolASlug)),
    toolB: toToolSide(resolveTool(rec.toolBSlug)),
    updatedAt: rec.updatedAt,
    verdict: rec.verdict,
    comparisonTable: rec.comparisonTable,
    faqs: rec.faqs,
    relatedLinks: rec.relatedLinks,
    disclosure: rec.disclosure,
  };
}

function resolveFamilyC(rec: FamilyCPageRecord): FamilyCPage {
  const primary = resolveTool(rec.primaryToolSlug);
  return {
    slug: rec.slug,
    h1: rec.h1,
    metaDescription: rec.metaDescription,
    primaryTool: {
      name: primary.toolName,
      priceFromUsd: primary.priceFromUsd,
      pricePeriod: primary.pricePeriod,
      affiliateUrl: primary.affiliateUrl,
    },
    alternatives: rec.alternativeSlugs.map(resolveTool),
    reasonWhy: rec.reasonWhy,
    switchEvidence: rec.switchEvidence,
    faqs: rec.faqs,
    relatedLinks: rec.relatedLinks,
    updatedAt: rec.updatedAt,
    disclosure: rec.disclosure,
  };
}

const REGISTRY = new Map<string, RegisteredPage>();

for (const rec of bestPages) {
  REGISTRY.set(`best/${rec.slug}`, { kind: 'familyA', page: resolveFamilyA(rec) });
}
for (const rec of vsPages) {
  REGISTRY.set(rec.slug, { kind: 'familyB', page: resolveFamilyB(rec) });
}
for (const rec of alternativePages) {
  REGISTRY.set(rec.slug, { kind: 'familyC', page: resolveFamilyC(rec) });
}
for (const rec of hubPages) {
  REGISTRY.set(rec.slug, { kind: 'hub', page: rec as unknown as HubPage });
}

/** All registered path segment arrays, for generateStaticParams. */
export function getAllPathSegments(): string[][] {
  return Array.from(REGISTRY.keys()).map((key) => key.split('/'));
}

/** Resolve a path (e.g. ['best', 'ai-writing-tools']) to its registered page. */
export function getRegisteredPage(segments: string[]): RegisteredPage | undefined {
  return REGISTRY.get(segments.join('/'));
}
