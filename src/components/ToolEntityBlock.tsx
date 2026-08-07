import type { ToolItem } from '@/lib/types';
import { formatCommission, formatPrice } from '@/lib/format';
import AffiliateLink from './AffiliateLink';

/**
 * Clean entity block for Family C alternatives (brief section 2):
 * name, price, best-for, one-line verdict. No review framing.
 */
export default function ToolEntityBlock({ item }: { item: ToolItem }) {
  return (
    <article className="entity-block">
      <h3>{item.toolName}</h3>
      <p className="entity-meta">
        <strong>Price:</strong> {formatPrice(item.priceFromUsd, item.pricePeriod)}
        <span aria-hidden="true"> | </span>
        <strong>Commission:</strong> {formatCommission(item.commissionPct, item.commissionRecurring, item.commissionWindowMonths)}
      </p>
      <p>
        <strong>Best for:</strong> {item.bestFor}
      </p>
      <p>
        <strong>Verdict (data-driven):</strong> {item.verdict}
      </p>
      {item.affiliateUrl && (
        <AffiliateLink href={item.affiliateUrl}>Visit {item.toolName}</AffiliateLink>
      )}
    </article>
  );
}
