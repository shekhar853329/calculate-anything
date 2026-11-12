import { Heart } from 'lucide-react';
import { useFavorites } from '../../hooks/useFavorites';
import type { Tool } from '../../data/tools';

interface ToolHeaderProps {
  tool: Tool;
}

export default function ToolHeader({ tool }: ToolHeaderProps) {
  const { toggle, isFavorite } = useFavorites();
  const fav = isFavorite(tool.slug);

  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div className="flex items-start gap-4">
        {/* Icon area */}
        <div
          className="shrink-0 w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900 flex items-center justify-center"
          aria-hidden="true"
        >
          <span className="text-blue-600 dark:text-blue-400 text-lg font-bold select-none">
            {tool.icon.slice(0, 2)}
          </span>
        </div>

        {/* Name + description */}
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
              {tool.name}
            </h1>
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
              {tool.category}
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed max-w-2xl">
            {tool.description}
          </p>
        </div>
      </div>

      {/* Favourite button */}
      <button
        onClick={() => toggle(tool.slug)}
        aria-label={fav ? `Remove ${tool.name} from favourites` : `Add ${tool.name} to favourites`}
        aria-pressed={fav}
        className={`shrink-0 p-2 rounded-full border transition-colors ${
          fav
            ? 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-950 text-red-500'
            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-400 hover:text-red-500 dark:hover:text-red-400'
        }`}
      >
        <Heart
          className={`w-5 h-5 transition-all ${fav ? 'fill-red-500' : ''}`}
          aria-hidden="true"
        />
      </button>
    </div>
  );
}
