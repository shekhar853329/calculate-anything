import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useFavorites } from '../../hooks/useFavorites';
import { TOOLS } from '../../data/tools';
import { Heart, Clock, ArrowRight } from 'lucide-react';
import type { Tool } from '../../data/tools';
import { ToolIcon, getCategoryTheme } from '../common/IconHelper';

const MAX_RECENT = 6;

function ToolCard({ tool }: { tool: Tool }) {
  const theme = getCategoryTheme(tool.categorySlug);

  return (
    <a
      href={`/tools/${tool.slug}/`}
      className="group flex items-center gap-3.5 p-3.5 rounded-xl border border-gray-200/90 dark:border-gray-800 bg-white dark:bg-gray-850 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition-all"
    >
      <div
        className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 ${theme.bg} ${theme.text}`}
        aria-hidden="true"
      >
        <ToolIcon name={tool.icon} className="w-5 h-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
          {tool.name}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
          {tool.category}
        </p>
      </div>
      <ArrowRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all shrink-0" />
    </a>
  );
}

export default function RecentFavorites() {
  const [recentEntries] = useLocalStorage<any[]>('recentTools', []);
  const { favorites } = useFavorites();

  // Safely extract slug whether stored as raw string or { slug: '...' }
  const recentSlugs: string[] = (recentEntries || [])
    .map((item) => (typeof item === 'string' ? item : item?.slug))
    .filter(Boolean);

  const recentTools = Array.from(new Set(recentSlugs))
    .slice(0, MAX_RECENT)
    .map((slug) => TOOLS.find((t) => t.slug === slug))
    .filter(Boolean) as Tool[];

  const favoriteTools = favorites
    .slice(0, MAX_RECENT)
    .map((slug) => TOOLS.find((t) => t.slug === slug))
    .filter(Boolean) as Tool[];

  if (recentTools.length === 0 && favoriteTools.length === 0) return null;

  return (
    <section className="py-8" aria-labelledby="recent-favorites-heading">
      <div className="flex items-center gap-2 mb-6">
        <h2
          id="recent-favorites-heading"
          className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100"
        >
          Your Activity
        </h2>
        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-medium">
          Saved locally
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recently Used */}
        {recentTools.length > 0 && (
          <div className="bg-gray-50/70 dark:bg-gray-900/50 rounded-2xl p-5 border border-gray-200/80 dark:border-gray-800">
            <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-4">
              <Clock className="w-4 h-4 text-blue-500" aria-hidden="true" />
              Recently Visited
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {recentTools.map((tool) => (
                <li key={tool.slug}>
                  <ToolCard tool={tool} />
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Favourites */}
        {favoriteTools.length > 0 && (
          <div className="bg-gray-50/70 dark:bg-gray-900/50 rounded-2xl p-5 border border-gray-200/80 dark:border-gray-800">
            <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-4">
              <Heart className="w-4 h-4 text-red-500 fill-red-500" aria-hidden="true" />
              Bookmarked Tools
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {favoriteTools.map((tool) => (
                <li key={tool.slug}>
                  <ToolCard tool={tool} />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
