import Link from 'next/link';

/**
 * Homepage — full site index rendered from the dataset at build time.
 * No affiliate links here (hub page). Lists every registered page so
 * crawlers entering at / discover the whole site.
 */
import bestData from '@/data/pages/best.json';
import vsData from '@/data/pages/vs.json';
import alternativesData from '@/data/pages/alternatives.json';
import hubsData from '@/data/pages/hubs.json';

interface LinkRec {
  label: string;
  href: string;
  description: string;
}

interface BestRec { slug: string; title: string; category: string; }
interface VsRec { slug: string; h1: string; }
interface AltRec { slug: string; h1: string; }

const bestPages = (bestData as unknown as { pages: BestRec[] }).pages;
const vsPages = (vsData as unknown as { pages: VsRec[] }).pages;
const altPages = (alternativesData as unknown as { pages: AltRec[] }).pages;
const hubPages = (hubsData as unknown as { pages: { slug: string; title: string; h1: string; sections: { heading: string; links: LinkRec[]; planned: string[] }[] }[] }).pages;

export default function HomePage() {
  return (
    <article className="page">
      <header className="page-header">
        <h1>AI Tools Data Engine</h1>
        <p className="lead">
          Programmatic SEO affiliate engine for AI tools with recurring-commission programs.
          Every page is rendered from a typed dataset of verified price and commission data
          (checked 2026-08-08). Verdicts are data-driven, not hands-on review claims.
        </p>
      </header>

      <section aria-labelledby="hubs-heading">
        <h2 id="hubs-heading">Category hubs</h2>
        <ul className="hub-links">
          {hubPages.map((h) => (
            <li key={h.slug}>
              <Link href={`/${h.slug}/`}>{h.title || h.h1}</Link>
              <p className="link-description">
                {h.sections?.[0]?.links?.length ? `${h.sections[0].links.length} linked pages` : 'Category hub'}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="best-heading">
        <h2 id="best-heading">Best-of roundups ({bestPages.length})</h2>
        <ul className="hub-links">
          {bestPages.map((p) => (
            <li key={p.slug}>
              <Link href={`/best/${p.slug}/`}>{p.title}</Link>
              <p className="link-description">{p.category}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="vs-heading">
        <h2 id="vs-heading">Comparisons ({vsPages.length})</h2>
        <ul className="hub-links">
          {vsPages.map((p) => (
            <li key={p.slug}>
              <Link href={`/${p.slug}/`}>{p.h1}</Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="alt-heading">
        <h2 id="alt-heading">Alternatives ({altPages.length})</h2>
        <ul className="hub-links">
          {altPages.map((p) => (
            <li key={p.slug}>
              <Link href={`/${p.slug}/`}>{p.h1}</Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="how-heading">
        <h2 id="how-heading">How this engine works</h2>
        <ul className="criteria">
          <li>All pages are static exports driven by one typed JSON dataset (src/data).</li>
          <li>Every page shows a dated verification badge and FAQPage JSON-LD schema.</li>
          <li>Roundups and comparisons emit schema.org ItemList structured data.</li>
          <li>Affiliate links carry rel=&quot;sponsored nofollow&quot; and never render without the FTC disclosure block.</li>
          <li>Sitemaps are segmented per template family (best / vs / alternatives) at build time.</li>
        </ul>
      </section>
    </article>
  );
}
