import JsonLd from './JsonLd';

export interface ItemListEntry {
  name: string;
  description?: string;
}

/**
 * schema.org ItemList for roundups (Family A) and comparisons (Family B).
 * URLs are intentionally omitted: the published pages are not live yet and
 * absolute URLs would depend on the deploy-time SITE_URL/basePath.
 */
export default function ItemListSchema({ entries }: { entries: ItemListEntry[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    numberOfItems: entries.length,
    itemListElement: entries.map((entry, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'SoftwareApplication',
        name: entry.name,
        ...(entry.description ? { description: entry.description } : {}),
      },
    })),
  };
  return <JsonLd data={schema} />;
}
