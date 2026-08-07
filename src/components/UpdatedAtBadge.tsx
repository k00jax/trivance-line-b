import { formatIsoDate } from '@/lib/format';

/** Dated verification badge (AI-Overview freshness, brief section 2). */
export default function UpdatedAtBadge({ updatedAt }: { updatedAt: string }) {
  return (
    <p className="updated-badge">
      <time dateTime={updatedAt}>Data verified: {formatIsoDate(updatedAt)}</time>
      <span className="updated-note">(prices and commissions re-checked on this date)</span>
    </p>
  );
}
