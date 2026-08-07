import type { Faq } from '@/lib/types';
import JsonLd from './JsonLd';

/** FAQ section with FAQPage JSON-LD (AI-Overview readiness, brief section 2). */
export default function FaqSection({ faqs }: { faqs: Faq[] }) {
  if (faqs.length === 0) return null;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };

  return (
    <section aria-labelledby="faq-heading" className="faq">
      <JsonLd data={schema} />
      <h2 id="faq-heading">Frequently asked questions</h2>
      {faqs.map((faq) => (
        <details key={faq.question} className="faq-item">
          <summary>{faq.question}</summary>
          <p>{faq.answer}</p>
        </details>
      ))}
    </section>
  );
}
