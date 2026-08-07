import Link from 'next/link';
import type { HubPage } from '@/lib/types';
import UpdatedAtBadge from './UpdatedAtBadge';

/** Hub index page (Phase 1, brief section 5). Planned items render as text, not dead links. */
export default function HubPageView({ page }: { page: HubPage }) {
  return (
    <article className="page">
      <header className="page-header">
        <h1>{page.h1}</h1>
        <UpdatedAtBadge updatedAt={page.updatedAt} />
        <p className="lead">{page.intro}</p>
      </header>

      {page.sections.map((section) => (
        <section key={section.heading} aria-labelledby={`section-${section.heading}`}>
          <h2 id={`section-${section.heading}`}>{section.heading}</h2>
          <ul className="hub-links">
            {section.links.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
                {link.description && <p className="link-description">{link.description}</p>}
              </li>
            ))}
          </ul>
          {section.planned.length > 0 && (
            <p className="muted">
              <strong>Planned (Phase 2):</strong> {section.planned.join(', ')}.
            </p>
          )}
        </section>
      ))}
    </article>
  );
}
