import Link from 'next/link';

export default function Header() {
  return (
    <header className="site-header">
      <Link href="/" className="brand">
        AI Tools Data
      </Link>
      <nav className="site-nav" aria-label="Primary">
        <Link href="/best/ai-tools/">Best AI Tools</Link>
        <Link href="/alternatives/">Alternatives</Link>
      </nav>
    </header>
  );
}
