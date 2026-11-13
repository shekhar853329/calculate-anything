import type { Tool } from '../../data/tools';
import { ToolIcon, getCategoryTheme } from '../common/IconHelper';
import { ArrowUpRight } from 'lucide-react';

interface RelatedToolsProps {
  tools: Tool[];
}

export default function RelatedTools({ tools }: RelatedToolsProps) {
  if (tools.length === 0) return null;

  return (
    <section className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800" aria-labelledby="related-tools-heading">
      <h2
        id="related-tools-heading"
        className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4"
      >
        Related Tools You Might Need
      </h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((tool) => {
          const theme = getCategoryTheme(tool.categorySlug);
          return (
            <li key={tool.slug}>
              <a
                href={`/tools/${tool.slug}`}
                className="group flex items-start gap-3.5 p-4 rounded-2xl border border-gray-200/90 dark:border-gray-800 bg-white dark:bg-gray-850 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition-all"
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${theme.bg} ${theme.text}`}
                  aria-hidden="true"
                >
                  <ToolIcon name={tool.icon} className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                      {tool.name}
                    </p>
                    <ArrowUpRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 shrink-0" />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                    {tool.description}
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
