import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useFavorites } from '../../hooks/useFavorites';
import { TOOLS } from '../../data/tools';
import { Heart, Clock } from 'lucide-react';
import type { Tool } from '../../data/tools';

const MAX_RECENT = 8;

function ToolCard({ tool }: { tool: Tool }) {
  return (
    <a
      href={`/tools/${tool.slug}`}
      className="flex items-start gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition-all group"
    >
      <div
        className="shrink-0 w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center"
        aria-hidden="true"
      >
        <span className="text-blue-600 dark:text-blue-400 text-xs font-bold select-none">
          {tool.icon.slice(0, 2)}
        </span>
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
          {tool.name}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
          {tool.category}
        </p>
      </div>
    </a>
  );
}

export default function RecentFavorites() {
  const [recentSlugs] = useLocalStorage<string[]>('recentTools', []);
  const { favorites } = useFavorites();

  const recentTools = recentSlugs
    .slice(0, MAX_RECENT)
    .map((slug) => TOOLS.find((t) => t.slug === slug))
    .filter(Boolean) as Tool[];

  const favoriteTools = favorites
    .slice(0, MAX_RECENT)
    .map((slug) => TOOLS.find((t) => t.slug === slug))
    .filter(Boolean) as Tool[];

  if (recentTools.length === 0 && favoriteTools.length === 0) return null;

  return (
    <section className="py-12 px-4" aria-labelledby="recent-favorites-heading">
      <div className="max-w-7xl mx-auto">
        <h2
          id="recent-favorites-heading"
          className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6"
        >
          Your Activity
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Recently Used */}
          {recentTools.length > 0 && (
            <div>
              <h3 className="flex items-center gap-2 text-base font-semibold text-gray-800 dark:text-gray-200 mb-3">
                <Clock className="w-4 h-4 text-gray-400" aria-hidden="true" />
                Recently Used
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
            <div>
              <h3 className="flex items-center gap-2 text-base font-semibold text-gray-800 dark:text-gray-200 mb-3">
                <Heart className="w-4 h-4 text-red-400" aria-hidden="true" />
                Favourites
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
      </div>
    </section>
  );
}
