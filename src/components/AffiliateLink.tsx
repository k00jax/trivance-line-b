import type { ReactNode } from 'react';

/**
 * Affiliate CTA link. Google compliance: rel="sponsored nofollow",
 * always opens in a new tab. Never renders without a disclosure block
 * on the page (enforced by the dataset's disclosure flag + build guard).
 */
export default function AffiliateLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <a href={href} rel="sponsored nofollow" target="_blank" className={className ?? 'affiliate-cta'}>
      {children}
    </a>
  );
}
