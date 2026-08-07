import type { ToolItem } from '@/lib/types';
import { formatCommission, formatPrice, formatRating } from '@/lib/format';
import AffiliateLink from './AffiliateLink';

/** Full tool card for Family A best-of lists. Verdicts are labeled data-driven. */
export default function ToolReviewCard({ item, position }: { item: ToolItem; position: number }) {
  return (
    <article className="tool-card">
      <h3>
        <span className="position">{position}.</span> {item.toolName}
      </h3>
      <dl className="tool-meta">
        <div>
          <dt>Price</dt>
          <dd>{formatPrice(item.priceFromUsd, item.pricePeriod)}</dd>
        </div>
        <div>
          <dt>Commission</dt>
          <dd>{formatCommission(item.commissionPct, item.commissionRecurring, item.commissionWindowMonths)}</dd>
        </div>
        <div>
          <dt>Rating</dt>
          <dd>{formatRating(item.rating, item.ratingSource)}</dd>
        </div>
        <div>
          <dt>Best for</dt>
          <dd>{item.bestFor}</dd>
        </div>
      </dl>
      {item.keyFeatures.length > 0 && (
        <>
          <h4>Key features</h4>
          <ul className="feature-list">
            {item.keyFeatures.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </>
      )}
      {item.pros.length > 0 && (
        <>
          <h4>Pros</h4>
          <ul className="pros">
            {item.pros.map((pro) => (
              <li key={pro}>{pro}</li>
            ))}
          </ul>
        </>
      )}
      {item.cons.length > 0 && (
        <>
          <h4>Cons</h4>
          <ul className="cons">
            {item.cons.map((con) => (
              <li key={con}>{con}</li>
            ))}
          </ul>
        </>
      )}
      <p className="verdict">
        <strong>Data-driven verdict:</strong> {item.verdict}
      </p>
      {item.affiliateUrl && (
        <AffiliateLink href={item.affiliateUrl}>Visit {item.toolName}</AffiliateLink>
      )}
    </article>
  );
}
