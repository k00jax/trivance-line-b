import { AFFILIATE_DISCLOSURE_TEXT } from '@/lib/disclosure';

/** FTC affiliate disclosure paragraph. Rendered above the first affiliate link. */
export default function Disclosure() {
  return <p className="disclosure">{AFFILIATE_DISCLOSURE_TEXT}</p>;
}
