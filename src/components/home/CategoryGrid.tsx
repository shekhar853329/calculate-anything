import { CATEGORIES } from '../../data/tools';
import { ToolIcon, getCategoryTheme } from '../common/IconHelper';

export default function CategoryGrid() {
  return (
    <section className="py-6" aria-labelledby="categories-heading">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-2">
        <div>
          <h2
            id="categories-heading"
            className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100"
          >
            Browse by Category
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
            Explore 110+ high-precision utilities organized for your workflow.
          </p>
        </div>
        <a
          href="/tools"
          className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors inline-flex items-center gap-1 self-start sm:self-auto"
        >
          View all tools &rarr;
        </a>
      </div>

      <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {CATEGORIES.map((cat) => {
          const theme = getCategoryTheme(cat.slug);
          return (
            <li key={cat.slug}>
              <a
                href={`/category/${cat.slug}`}
                className="group relative flex flex-col p-5 rounded-2xl border border-gray-200/90 dark:border-gray-800 bg-white dark:bg-gray-850 hover:bg-gradient-to-b hover:from-white hover:to-gray-50/80 dark:hover:bg-gray-800 hover:border-blue-400 dark:hover:border-blue-500/80 hover:shadow-lg hover:shadow-blue-500/5 hover:-translate-y-0.5 transition-all duration-200 text-left"
                aria-label={`${cat.name} — ${cat.count} tools`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 duration-200 ${theme.bg} ${theme.text}`}
                    aria-hidden="true"
                  >
                    <ToolIcon name={cat.icon} className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                    {cat.count}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {cat.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Free calculators & utilities
                  </p>
                </div>
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
