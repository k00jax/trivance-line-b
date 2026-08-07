import type { PricePeriod, RatingSource } from './types';

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

/** '2026-08-07' -> 'August 7, 2026' (UTC-safe manual parse, no TZ drift) */
export function formatIsoDate(iso: string): string {
  const parts = iso.split('-').map((part) => Number(part));
  const [year, month, day] = parts;
  if (!year || !month || !day) return iso;
  return `${MONTHS[month - 1]} ${day}, ${year}`;
}

export function formatPrice(fromUsd: number | null, period: PricePeriod): string {
  if (fromUsd == null) return 'Not stated';
  const suffix = period === 'yr' ? '/yr' : period === 'mo' ? '/mo' : '';
  return `From $${fromUsd}${suffix}`;
}

export function formatCommission(
  pct: number | null,
  recurring: boolean,
  windowMonths: number | null
): string {
  if (pct == null) return 'Not stated';
  if (recurring) {
    const windowText = windowMonths != null ? ` - ${windowMonths}-month window` : '';
    return `${pct}% recurring${windowText}`;
  }
  return `${pct}% one-time`;
}

export function formatRating(rating: number | null, source: RatingSource): string {
  if (rating == null) return 'Not verified';
  const label =
    source === 'g2' ? 'G2' : source === 'capterra' ? 'Capterra' : source === 'taaft' ? 'TAAFT' : 'unknown source';
  return `${rating.toFixed(1)}/5 (${label})`;
}
