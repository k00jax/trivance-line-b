/**
 * Trivance LINE B - data model.
 * Authoritative field spec: Niche Brief (2026-08-07), section 2.
 *
 * Extensions vs the brief, documented:
 *  - ToolSide.freeTier is `boolean | null` (null = "not stated") so we never
 *    print a false "No free tier" claim for unverified data.
 *  - FamilyA/B/C pages carry `relatedLinks` (spec-implied by the internal
 *    linking rules in brief section 2).
 *  - FamilyC carries `switchEvidence` (spec-implied by "quoted and linked"
 *    complaint copy in brief section 1.2).
 */

export type PricePeriod = 'mo' | 'yr' | null;
export type RatingSource = 'g2' | 'capterra' | 'taaft' | null;
export type PriceTier = 'free' | 'freemium' | 'paid';

export interface Faq {
  question: string;
  answer: string;
}

export interface RelatedLink {
  label: string;
  href: string;
}

/** Brief section 2, Family A - ToolItem */
export interface ToolItem {
  toolSlug: string;
  toolName: string;
  priceTier: PriceTier;
  priceFromUsd: number | null;
  pricePeriod: PricePeriod;
  commissionPct: number | null;
  commissionRecurring: boolean;
  commissionWindowMonths: number | null;
  rating: number | null;
  ratingSource: RatingSource;
  bestFor: string;
  keyFeatures: string[];
  pros: string[];
  cons: string[];
  verdict: string;
  affiliateUrl: string | null;
  affiliateDisclosure: true;
  pricedAt: string; // ISO date
}

/** Brief section 2, Family B - ToolSide */
export interface ToolSide {
  toolName: string;
  priceFromUsd: number | null;
  pricePeriod: PricePeriod;
  freeTier: boolean | null; // null = not stated (never invent)
  commissionPct: number | null;
  commissionRecurring: boolean;
  rating: number | null;
  ratingSource: RatingSource;
  keyFeatures: string[];
  pros: string[];
  cons: string[];
  affiliateUrl: string | null;
}

/** Brief section 2, Family A page */
export interface FamilyAPage {
  slug: string;
  title: string;
  h1: string;
  metaDescription: string;
  category: string;
  categorySlug: string;
  updatedAt: string; // ISO date
  intro: string;
  items: ToolItem[];
  comparisonCriteria: string[];
  faqs: Faq[];
  relatedLinks: RelatedLink[];
  disclosure: true;
}

/** Brief section 2, Family B page */
export interface FamilyBPage {
  slug: string;
  h1: string;
  metaDescription: string;
  toolA: ToolSide;
  toolB: ToolSide;
  updatedAt: string; // ISO date
  verdict: {
    winner: string;
    why: string;
    bestForA: string;
    bestForB: string;
  };
  comparisonTable: {
    rowLabel: string;
    toolAValue: string;
    toolBValue: string;
  }[];
  faqs: Faq[];
  relatedLinks: RelatedLink[];
  disclosure: true;
}

/** Brief section 2, Family C page */
export interface FamilyCPage {
  slug: string;
  h1: string;
  metaDescription: string;
  primaryTool: {
    name: string;
    priceFromUsd: number | null;
    pricePeriod: PricePeriod;
    affiliateUrl: string | null;
  };
  alternatives: ToolItem[];
  reasonWhy: string[];
  switchEvidence: { quote: string; source: string; url: string }[];
  faqs: Faq[];
  relatedLinks: RelatedLink[];
  updatedAt: string; // ISO date
  disclosure: true;
}

/** Hub index pages (Phase 1 per brief section 5) */
export interface HubLink {
  label: string;
  href: string;
  description: string;
}

export interface HubSection {
  heading: string;
  links: HubLink[];
  planned: string[]; // planned-but-unpublished items (rendered without dead links)
}

export interface HubPage {
  slug: string;
  title: string;
  h1: string;
  metaDescription: string;
  intro: string;
  sections: HubSection[];
  updatedAt: string; // ISO date
}

/** Discriminated union used by the catch-all router + sitemap registry */
export interface RegisteredPageBase {
  kind: 'familyA' | 'familyB' | 'familyC' | 'hub';
}

export type RegisteredPage =
  | ({ kind: 'familyA' } & { page: FamilyAPage })
  | ({ kind: 'familyB' } & { page: FamilyBPage })
  | ({ kind: 'familyC' } & { page: FamilyCPage })
  | ({ kind: 'hub' } & { page: HubPage });
