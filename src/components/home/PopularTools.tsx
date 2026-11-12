import { TOOLS } from '../../data/tools';

const popularTools = TOOLS.filter((t) => t.popular).slice(0, 8);

export default function PopularTools() {
  if (popularTools.length === 0) return null;

  return (
    <section className="py-12 px-4 bg-gray-50 dark:bg-gray-950" aria-labelledby="popular-heading">
      <div className="max-w-7xl mx-auto">
        <h2
          id="popular-heading"
          className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2"
        >
          Popular Tools
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
          Most-used tools by our visitors.
        </p>

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {popularTools.map((tool) => (
            <li key={tool.slug}>
              <a
                href={`/tools/${tool.slug}`}
                className="flex items-start gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition-all group"
              >
                <div
                  className="shrink-0 w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center"
                  aria-hidden="true"
                >
                  <span className="text-blue-600 dark:text-blue-400 text-xs font-bold select-none">
                    {tool.icon.slice(0, 2)}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
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
      </div>
    </section>
  );
}
