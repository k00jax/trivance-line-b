import Link from 'next/link';

export default function NotFound() {
  return (
    <article className="page">
      <h1>Page not found</h1>
      <p>The page you are looking for does not exist in this dataset.</p>
      <p>
        <Link href="/">Back to home</Link>
      </p>
    </article>
  );
}
