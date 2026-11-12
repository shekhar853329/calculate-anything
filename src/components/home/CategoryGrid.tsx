import { CATEGORIES } from '../../data/tools';

export default function CategoryGrid() {
  return (
    <section className="py-12 px-4" aria-labelledby="categories-heading">
      <div className="max-w-7xl mx-auto">
        <h2
          id="categories-heading"
          className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2"
        >
          Browse by Category
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
          Pick a category to explore all available tools.
        </p>

        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {CATEGORIES.map((cat) => (
            <li key={cat.slug}>
              <a
                href={`/category/${cat.slug}`}
                className="flex flex-col items-center gap-3 p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition-all group text-center"
                aria-label={`${cat.name} — ${cat.count} tools`}
              >
                {/* Icon placeholder styled by category */}
                <div
                  className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900 flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors"
                  aria-hidden="true"
                >
                  <span className="text-blue-600 dark:text-blue-400 text-lg font-bold select-none">
                    {cat.icon.slice(0, 2)}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">
                    {cat.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {cat.count} tools
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
