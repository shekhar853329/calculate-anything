import { useEffect } from 'react';

interface BreadcrumbProps {
  category: string;
  categorySlug: string;
  toolName: string;
}

export default function Breadcrumb({ category, categorySlug, toolName }: BreadcrumbProps) {
  const items = [
    { label: 'Home', href: '/' },
    { label: category, href: `/category/${categorySlug}` },
    { label: toolName, href: undefined },
  ];

  // Inject JSON-LD breadcrumb structured data
  useEffect(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: item.label,
        ...(item.href ? { item: `${origin}${item.href}` } : {}),
      })),
    };
    const existing = document.getElementById('breadcrumb-ld');
    if (existing) existing.remove();
    const script = document.createElement('script');
    script.id = 'breadcrumb-ld';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
    return () => { document.getElementById('breadcrumb-ld')?.remove(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, categorySlug, toolName]);

  return (
      <nav aria-label="Breadcrumb" className="mb-1.5">
        <ol
          className="flex flex-wrap items-center gap-1 text-sm text-gray-500 dark:text-gray-400"
          itemScope
          itemType="https://schema.org/BreadcrumbList"
        >
          {items.map((item, idx) => (
            <li
              key={idx}
              className="flex items-center gap-1"
              itemScope
              itemType="https://schema.org/ListItem"
              itemProp="itemListElement"
            >
              {idx > 0 && (
                <span className="text-gray-400 dark:text-gray-600 select-none" aria-hidden="true">
                  /
                </span>
              )}
              {item.href ? (
                <a
                  href={item.href}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  itemProp="item"
                >
                  <span itemProp="name">{item.label}</span>
                </a>
              ) : (
                <span
                  className="text-gray-700 dark:text-gray-300 font-medium"
                  aria-current="page"
                  itemProp="name"
                >
                  {item.label}
                </span>
              )}
              <meta itemProp="position" content={String(idx + 1)} />
            </li>
          ))}
        </ol>
      </nav>
      );
}
