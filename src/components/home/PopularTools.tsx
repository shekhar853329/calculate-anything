import { TOOLS } from '../../data/tools';
import { ToolIcon, getCategoryTheme } from '../common/IconHelper';
import { ArrowUpRight, Flame } from 'lucide-react';

const popularTools = TOOLS.filter((t) => t.popular).slice(0, 8);

export default function PopularTools() {
  if (popularTools.length === 0) return null;

  return (
    <section className="py-6" aria-labelledby="popular-heading">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Flame className="w-4 h-4 fill-amber-500 text-amber-500" aria-hidden="true" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Trending & Most Used
            </span>
          </div>
          <h2
            id="popular-heading"
            className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100"
          >
            Popular Tools
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
            Hand-picked utilities used by thousands of visitors every day.
          </p>
        </div>
        <a
          href="/tools"
          className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors inline-flex items-center gap-1 self-start sm:self-auto"
        >
          All 110+ tools &rarr;
        </a>
      </div>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {popularTools.map((tool) => {
          const theme = getCategoryTheme(tool.categorySlug);
          return (
            <li key={tool.slug}>
              <a
                href={`/tools/${tool.slug}`}
                className="group relative flex flex-col justify-between h-full p-5 rounded-2xl border border-gray-200/90 dark:border-gray-800 bg-white dark:bg-gray-850 hover:bg-gradient-to-b hover:from-white hover:to-blue-50/20 dark:hover:bg-gray-800 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/5 hover:-translate-y-0.5 transition-all duration-200"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 duration-200 ${theme.bg} ${theme.text}`}
                      aria-hidden="true"
                    >
                      <ToolIcon name={tool.icon} className="w-5 h-5" />
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-1.5">
                    {tool.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                    {tool.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between">
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${theme.badgeBg}`}>
                    {tool.category.split(' ')[0]}
                  </span>
                  <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 group-hover:underline">
                    Use tool &rarr;
                  </span>
                </div>
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
