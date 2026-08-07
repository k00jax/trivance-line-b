import type { FamilyCPage } from '@/lib/types';
import { formatPrice } from '@/lib/format';
import { assertAffiliateDisclosure } from '@/lib/disclosure';
import UpdatedAtBadge from './UpdatedAtBadge';
import Disclosure from './Disclosure';
import AffiliateLink from './AffiliateLink';
import ToolEntityBlock from './ToolEntityBlock';
import FaqSection from './FaqSection';
import RelatedLinks from './RelatedLinks';

/** Family C - alternatives page (brief section 2, Family C). */
export default function FamilyCPageView({ page }: { page: FamilyCPage }) {
  assertAffiliateDisclosure(page);
  const primaryName = page.primaryTool.name;

  return (
    <article className="page">
      <header className="page-header">
        <h1>{page.h1}</h1>
        <UpdatedAtBadge updatedAt={page.updatedAt} />
        <p className="lead">{page.metaDescription}</p>
      </header>

      <Disclosure />

      <section aria-labelledby="switch-heading">
        <h2 id="switch-heading">Why do people switch from {primaryName}?</h2>
        {page.reasonWhy.map((reason, index) => (
          <p key={index}>{reason}</p>
        ))}
        {page.switchEvidence.length > 0 && (
          <ul className="evidence">
            {page.switchEvidence.map((evidence) => (
              <li key={evidence.url}>
                <blockquote>{evidence.quote}</blockquote>
                <a href={evidence.url} rel="nofollow" target="_blank" className="source-link">
                  {evidence.source}
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="alternatives-heading">
        <h2 id="alternatives-heading">{primaryName} alternatives in this dataset</h2>
        {page.alternatives.map((alternative) => (
          <ToolEntityBlock key={alternative.toolSlug} item={alternative} />
        ))}
      </section>

      <section aria-labelledby="primary-heading">
        <h2 id="primary-heading">About {primaryName}</h2>
        <p>
          Starting price: {formatPrice(page.primaryTool.priceFromUsd, page.primaryTool.pricePeriod)}.
          This page does not rank {primaryName}; it lists tools that are commonly compared as alternatives.
        </p>
        {page.primaryTool.affiliateUrl && (
          <AffiliateLink href={page.primaryTool.affiliateUrl}>Visit {primaryName}</AffiliateLink>
        )}
      </section>

      <RelatedLinks links={page.relatedLinks} />
      <FaqSection faqs={page.faqs} />
    </article>
  );
}
