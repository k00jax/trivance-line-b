import Link from 'next/link';

/** Homepage - Phase 1 engine preview. No affiliate links here. */
export default function HomePage() {
  return (
    <article className="page">
      <header className="page-header">
        <h1>AI Tools Data Engine</h1>
        <p className="lead">
          Programmatic SEO affiliate engine for AI tools with recurring-commission programs.
          Every page is rendered from a typed dataset of verified price and commission data
          (checked 2026-08-07). Verdicts are data-driven, not hands-on review claims.
        </p>
      </header>

      <section aria-labelledby="published-heading">
        <h2 id="published-heading">Published pages (Phase 1 seed)</h2>
        <ul className="hub-links">
          <li>
            <Link href="/best/ai-tools/">Best AI tools index</Link>
            <p className="link-description">Hub for best-of category roundups.</p>
          </li>
          <li>
            <Link href="/alternatives/">Alternatives index</Link>
            <p className="link-description">Hub for tool alternatives pages.</p>
          </li>
          <li>
            <Link href="/best/ai-writing-tools/">Best AI writing tools</Link>
            <p className="link-description">Family A: Jasper, Writesonic and Scalenut on verified data.</p>
          </li>
          <li>
            <Link href="/writesonic-vs-jasper/">Writesonic vs Jasper</Link>
            <p className="link-description">Family B: side-by-side comparison with comparison table.</p>
          </li>
          <li>
            <Link href="/jasper-ai-alternatives/">Jasper AI alternatives</Link>
            <p className="link-description">Family C: alternatives with documented reasons users switch.</p>
          </li>
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
