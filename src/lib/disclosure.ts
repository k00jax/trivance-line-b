/**
 * FTC affiliate disclosure guards.
 *
 * Rule (brief 2.6 + build spec): no affiliate link may render without the
 * disclosure block. The dataset types force `disclosure: true`, but JSON can
 * drift at edit time, so templates call assertAffiliateDisclosure() and fail
 * loudly at build if a page with affiliate links ever loses its flag.
 */

export const AFFILIATE_DISCLOSURE_TEXT =
  'Affiliate disclosure: Some links on this page are affiliate links. If you buy a product through one of these links, we may earn a commission at no extra cost to you. We only link to tools whose price and commission data we verified on the dates shown on this page.';

export const SITE_DISCLOSURE_TEXT =
  "This site participates in affiliate programs. We may earn commissions on purchases made through links on this site, at no additional cost to you. We do not publish commission rates that we have not verified against an official vendor page, and we do not publish 'we tested it' review claims.";

export function assertAffiliateDisclosure(page: { disclosure: boolean }): void {
  if (page.disclosure !== true) {
    throw new Error(
      'Affiliate disclosure guard: a page containing affiliate links has disclosure != true. Refusing to render.'
    );
  }
}
