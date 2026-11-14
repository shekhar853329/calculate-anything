import type { Tool } from '../../data/tools';
import { ToolIcon, getCategoryTheme } from '../common/IconHelper';
import { ArrowUpRight } from 'lucide-react';

interface RelatedToolsProps {
  tools: Tool[];
}

export default function RelatedTools({ tools }: RelatedToolsProps) {
  const displayTools = tools.slice(0, 4);
  if (displayTools.length === 0) return null;

  return (
    <section className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800" aria-labelledby="related-tools-heading">
      <div className="flex items-center justify-between mb-4">
        <h2
          id="related-tools-heading"
          className="text-xl font-bold text-gray-900 dark:text-gray-100"
        >
          Related Tools You Might Need
        </h2>
        <span className="text-xs text-gray-500 dark:text-gray-400">4 recommended tools</span>
      </div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {displayTools.map((tool) => {
          const theme = getCategoryTheme(tool.categorySlug);
          return (
            <li key={tool.slug}>
              <a
                href={`/tools/${tool.slug}/`}
                className="group flex flex-col justify-between h-full p-4 rounded-2xl border border-gray-200/90 dark:border-gray-800 bg-white dark:bg-gray-850 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${theme.bg} ${theme.text}`}
                      aria-hidden="true"
                    >
                      <ToolIcon name={tool.icon} className="w-4.5 h-4.5" />
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 shrink-0" />
                  </div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                    {tool.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 leading-relaxed">
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
