import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllPathSegments, getRegisteredPage } from '@/lib/registry';
import FamilyAPageView from '@/components/FamilyAPageView';
import FamilyBPageView from '@/components/FamilyBPageView';
import FamilyCPageView from '@/components/FamilyCPageView';
import HubPageView from '@/components/HubPageView';

/**
 * Single data-driven catch-all route: the dataset registry is the source of
 * truth for every URL on the site (hubs + all three template families).
 * Adding a page = adding a dataset entry; this file does not change.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPathSegments().map((segments) => ({ slug: segments }));
}

export async function generateMetadata({ params }: { params: { slug: string[] } }): Promise<Metadata> {
  const registered = getRegisteredPage(params.slug);
  if (!registered) return {};
  const page = registered.page;
  const title = 'title' in page ? page.title : page.h1;
  return {
    title,
    description: 'metaDescription' in page ? page.metaDescription : undefined,
  };
}

export default function CatchAllPage({ params }: { params: { slug: string[] } }) {
  const registered = getRegisteredPage(params.slug);
  if (!registered) {
    notFound();
  }

  switch (registered.kind) {
    case 'familyA':
      return <FamilyAPageView page={registered.page} />;
    case 'familyB':
      return <FamilyBPageView page={registered.page} />;
    case 'familyC':
      return <FamilyCPageView page={registered.page} />;
    case 'hub':
      return <HubPageView page={registered.page} />;
    default:
      return null;
  }
}
