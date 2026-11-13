import { Heart } from 'lucide-react';
import { useFavorites } from '../../hooks/useFavorites';
import type { Tool } from '../../data/tools';
import { ToolIcon, getCategoryTheme } from '../common/IconHelper';
import ShareButtons from './ShareButtons';

interface ToolHeaderProps {
  tool: Tool;
}

export default function ToolHeader({ tool }: ToolHeaderProps) {
  const { toggle, isFavorite } = useFavorites();
  const fav = isFavorite(tool.slug);
  const theme = getCategoryTheme(tool.categorySlug);

  return (
    <div className="mb-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-3 min-w-0">
          {/* Compact Icon */}
          <div
            className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center shadow-xs ${theme.bg} ${theme.text}`}
            aria-hidden="true"
          >
            <ToolIcon name={tool.icon} className="w-5 h-5" />
          </div>

          {/* Name + Category Badge */}
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight truncate">
                {tool.name}
              </h1>
              <a
                href={`/category/${tool.categorySlug}`}
                className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full transition-opacity hover:opacity-80 shrink-0 ${theme.badgeBg}`}
              >
                {tool.category}
              </a>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-xl hidden sm:block">
              {tool.description}
            </p>
          </div>
        </div>

        {/* Share & Bookmark Actions */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
          <ShareButtons title={`Try ${tool.name} - Free online tool`} />
          <button
            onClick={() => toggle(tool.slug)}
            aria-label={fav ? `Remove ${tool.name} from bookmarks` : `Bookmark ${tool.name}`}
            aria-pressed={fav}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
              fav
                ? 'border-red-300 dark:border-red-900/60 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400'
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400'
            }`}
          >
            <Heart
              className={`w-3.5 h-3.5 transition-all ${fav ? 'fill-red-500 text-red-500' : ''}`}
              aria-hidden="true"
            />
            <span className="hidden sm:inline">{fav ? 'Saved' : 'Bookmark'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
