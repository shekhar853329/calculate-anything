interface BreadcrumbProps {
  category: string;
  categorySlug: string;
  toolName: string;
}

export default function Breadcrumb({ category, categorySlug, toolName }: BreadcrumbProps) {
  const items = [
    { label: 'Home', href: '/' },
    { label: category, href: `/category/${categorySlug}/` },
    { label: toolName, href: undefined },
  ];

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
