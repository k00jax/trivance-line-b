import type { FamilyAPage } from '@/lib/types';
import { formatCommission, formatPrice } from '@/lib/format';
import { assertAffiliateDisclosure } from '@/lib/disclosure';
import UpdatedAtBadge from './UpdatedAtBadge';
import Disclosure from './Disclosure';
import AffiliateLink from './AffiliateLink';
import ToolReviewCard from './ToolReviewCard';
import FaqSection from './FaqSection';
import ItemListSchema from './ItemListSchema';
import RelatedLinks from './RelatedLinks';

/** Family A - best-of category list (brief section 2, Family A). */
export default function FamilyAPageView({ page }: { page: FamilyAPage }) {
  assertAffiliateDisclosure(page);
  const year = page.updatedAt.slice(0, 4);

  return (
    <article className="page">
      <header className="page-header">
        <h1>{page.h1}</h1>
        <UpdatedAtBadge updatedAt={page.updatedAt} />
        <p className="lead">{page.intro}</p>
      </header>

      <Disclosure />
      <ItemListSchema entries={page.items.map((item) => ({ name: item.toolName, description: item.bestFor }))} />

      <section aria-labelledby="at-a-glance">
        <h2 id="at-a-glance">The best {page.category} at a glance</h2>
        <div className="table-wrap">
          <table className="compare-table">
            <thead>
              <tr>
                <th scope="col">Tool</th>
                <th scope="col">Starting price</th>
                <th scope="col">Commission</th>
                <th scope="col">Rating</th>
              </tr>
            </thead>
            <tbody>
              {page.items.map((item) => (
                <tr key={item.toolSlug}>
                  <th scope="row">{item.toolName}</th>
                  <td>{formatPrice(item.priceFromUsd, item.pricePeriod)}</td>
                  <td>{formatCommission(item.commissionPct, item.commissionRecurring, item.commissionWindowMonths)}</td>
                  <td>{item.rating == null ? 'Not verified' : `${item.rating}/5`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="best-question">
        <h2 id="best-question">What are the best {page.category} in {year}?</h2>
        <p>
          Based on the verified price, plan and commission data in this dataset (checked on{' '}
          {page.updatedAt}), here are the {page.category} included on this page, with the data-driven
          verdict for each one.
        </p>
      </section>

      <section aria-labelledby="compare-heading">
        <h2 id="compare-heading">How do we compare {page.category}?</h2>
        <ul className="criteria">
          {page.comparisonCriteria.map((criterion) => (
            <li key={criterion}>{criterion}</li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="list-heading" className="tool-list">
        <h2 id="list-heading">{page.category} in detail</h2>
        {page.items.map((item, index) => (
          <ToolReviewCard key={item.toolSlug} item={item} position={index + 1} />
        ))}
      </section>

      <section aria-labelledby="cost-heading">
        <h2 id="cost-heading">How much do {page.category} cost?</h2>
        <p>Starting prices from each vendor's official pricing page, verified on {page.updatedAt}:</p>
        <ul className="criteria">
          {page.items.map((item) => (
            <li key={item.toolSlug}>
              {item.toolName}: {formatPrice(item.priceFromUsd, item.pricePeriod)}
              {item.affiliateUrl ? (
                <>
                  {' '}
                  (<AffiliateLink href={item.affiliateUrl} className="text-link">
                    pricing page
                  </AffiliateLink>
                  )
                </>
              ) : null}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="commission-heading">
        <h2 id="commission-heading">Which {page.category} pay recurring affiliate commissions?</h2>
        <p>Commission terms from each vendor's official affiliate page, verified on {page.updatedAt}:</p>
        <ul className="criteria">
          {page.items.map((item) => (
            <li key={item.toolSlug}>
              {item.toolName}: {formatCommission(item.commissionPct, item.commissionRecurring, item.commissionWindowMonths)}
            </li>
          ))}
        </ul>
      </section>

      <RelatedLinks links={page.relatedLinks} />
      <FaqSection faqs={page.faqs} />
    </article>
  );
}
