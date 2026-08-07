import type { FamilyBPage, ToolSide } from '@/lib/types';
import { formatCommission, formatPrice, formatRating } from '@/lib/format';
import { assertAffiliateDisclosure } from '@/lib/disclosure';
import UpdatedAtBadge from './UpdatedAtBadge';
import Disclosure from './Disclosure';
import AffiliateLink from './AffiliateLink';
import FaqSection from './FaqSection';
import ItemListSchema from './ItemListSchema';
import RelatedLinks from './RelatedLinks';

/** Family B - tool vs tool comparison (brief section 2, Family B). */
export default function FamilyBPageView({ page }: { page: FamilyBPage }) {
  assertAffiliateDisclosure(page);

  return (
    <article className="page">
      <header className="page-header">
        <h1>{page.h1}</h1>
        <UpdatedAtBadge updatedAt={page.updatedAt} />
        <p className="lead">{page.metaDescription}</p>
      </header>

      <Disclosure />
      <ItemListSchema entries={[{ name: page.toolA.toolName }, { name: page.toolB.toolName }]} />

      <section aria-labelledby="sides-heading">
        <h2 id="sides-heading">{page.toolA.toolName} vs {page.toolB.toolName}: the tools</h2>
        <SideCard side={page.toolA} />
        <SideCard side={page.toolB} />
      </section>

      <section aria-labelledby="table-heading">
        <h2 id="table-heading">{page.toolA.toolName} vs {page.toolB.toolName}: side-by-side</h2>
        <div className="table-wrap">
          <table className="compare-table">
            <thead>
              <tr>
                <th scope="col">Metric</th>
                <th scope="col">{page.toolA.toolName}</th>
                <th scope="col">{page.toolB.toolName}</th>
              </tr>
            </thead>
            <tbody>
              {page.comparisonTable.map((row) => (
                <tr key={row.rowLabel}>
                  <th scope="row">{row.rowLabel}</th>
                  <td>{row.toolAValue}</td>
                  <td>{row.toolBValue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="verdict-heading">
        <h2 id="verdict-heading">Which is better: {page.toolA.toolName} or {page.toolB.toolName}?</h2>
        <p className="verdict">
          <strong>Verdict (data-driven):</strong> {page.verdict.winner}
        </p>
        <p>{page.verdict.why}</p>
        <p>
          <strong>Best for {page.toolA.toolName}:</strong> {page.verdict.bestForA}
        </p>
        <p>
          <strong>Best for {page.toolB.toolName}:</strong> {page.verdict.bestForB}
        </p>
      </section>

      <RelatedLinks links={page.relatedLinks} />
      <FaqSection faqs={page.faqs} />
    </article>
  );
}

function SideCard({ side }: { side: ToolSide }) {
  return (
    <article className="tool-card">
      <h3>{side.toolName}</h3>
      <dl className="tool-meta">
        <div>
          <dt>Price</dt>
          <dd>{formatPrice(side.priceFromUsd, side.pricePeriod)}</dd>
        </div>
        <div>
          <dt>Free tier</dt>
          <dd>{side.freeTier === null ? 'Not stated' : side.freeTier ? 'Yes' : 'No'}</dd>
        </div>
        <div>
          <dt>Commission</dt>
          <dd>{formatCommission(side.commissionPct, side.commissionRecurring, null)}</dd>
        </div>
        <div>
          <dt>Rating</dt>
          <dd>{formatRating(side.rating, side.ratingSource)}</dd>
        </div>
      </dl>
      {side.keyFeatures.length > 0 && (
        <>
          <h4>Key features</h4>
          <ul className="feature-list">
            {side.keyFeatures.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </>
      )}
      {side.pros.length > 0 && (
        <>
          <h4>Pros</h4>
          <ul className="pros">
            {side.pros.map((pro) => (
              <li key={pro}>{pro}</li>
            ))}
          </ul>
        </>
      )}
      {side.cons.length > 0 && (
        <>
          <h4>Cons</h4>
          <ul className="cons">
            {side.cons.map((con) => (
              <li key={con}>{con}</li>
            ))}
          </ul>
        </>
      )}
      {side.affiliateUrl && <AffiliateLink href={side.affiliateUrl}>Visit {side.toolName}</AffiliateLink>}
    </article>
  );
}
