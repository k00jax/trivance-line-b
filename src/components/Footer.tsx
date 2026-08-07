import { SITE_DISCLOSURE_TEXT } from '@/lib/disclosure';

/** Site-wide footer with the required FTC disclosure (brief section 2.6). */
export default function Footer() {
  return (
    <footer className="site-footer">
      <p className="footer-disclosure">{SITE_DISCLOSURE_TEXT}</p>
      <p className="footer-note">
        All pricing and commission data on this site was verified on 2026-08-07 and is refreshed quarterly.
        Affiliate links carry rel=&quot;sponsored nofollow&quot; per Google&apos;s link guidelines.
      </p>
    </footer>
  );
}
