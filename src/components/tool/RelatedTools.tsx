import type { Tool } from '../../data/tools';

interface RelatedToolsProps {
  tools: Tool[];
}

// Dynamically render a simple icon placeholder using the tool's icon name
// (lucide icons are tree-shaken at build; a lightweight fallback covers all cases)
function IconPlaceholder({ name }: { name: string }) {
  return (
    <span
      className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-xs font-bold"
      aria-hidden="true"
    >
      {name.slice(0, 2)}
    </span>
  );
}

export default function RelatedTools({ tools }: RelatedToolsProps) {
  if (tools.length === 0) return null;

  return (
    <section className="mt-10" aria-labelledby="related-tools-heading">
      <h2
        id="related-tools-heading"
        className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4"
      >
        Related Tools
      </h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((tool) => (
          <li key={tool.slug}>
            <a
              href={`/tools/${tool.slug}`}
              className="flex items-start gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition-all group"
            >
              <IconPlaceholder name={tool.icon} />
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                  {tool.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
                  {tool.description}
                </p>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
