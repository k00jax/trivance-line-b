import Link from 'next/link';
import type { RelatedLink } from '@/lib/types';

/** Internal linking block required by brief section 2 (crawl-depth <= 3). */
export default function RelatedLinks({ links, heading = 'Related comparisons' }: { links: RelatedLink[]; heading?: string }) {
  if (links.length === 0) return null;
  return (
    <section className="related" aria-labelledby="related-heading">
      <h2 id="related-heading">{heading}</h2>
      <ul>
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href}>{link.label}</Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
