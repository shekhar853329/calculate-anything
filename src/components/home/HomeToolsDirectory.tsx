import { useState, useMemo, useRef, useEffect } from 'react';
import { Search, X, Flame, Clock, Heart, ArrowRight, ArrowLeft } from 'lucide-react';
import { TOOLS, CATEGORIES } from '../../data/tools';
import type { Tool } from '../../data/tools';
import { ToolIcon, getCategoryTheme } from '../common/IconHelper';
import { searchTools } from '../../lib/search';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useFavorites } from '../../hooks/useFavorites';

export default function HomeToolsDirectory() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Recents and Favorites from storage
  const [recentEntries] = useLocalStorage<any[]>('recentTools', []);
  const { favorites } = useFavorites();

  const recentSlugs: string[] = useMemo(() => {
    return (recentEntries || [])
      .map((item) => (typeof item === 'string' ? item : item?.slug))
      .filter(Boolean);
  }, [recentEntries]);

  const recentTools = useMemo(() => {
    return Array.from(new Set(recentSlugs))
      .slice(0, 8)
      .map((slug) => TOOLS.find((t) => t.slug === slug))
      .filter(Boolean) as Tool[];
  }, [recentSlugs]);

  const favoriteTools = useMemo(() => {
    return favorites
      .map((slug) => TOOLS.find((t) => t.slug === slug))
      .filter(Boolean) as Tool[];
  }, [favorites]);

  const popularTools = useMemo(() => {
    return TOOLS.filter((t) => t.popular);
  }, []);

  // Keyboard shortcut: '/' to focus search, 'Escape' to clear
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (
        e.key === '/' &&
        document.activeElement !== searchInputRef.current &&
        !['INPUT', 'TEXTAREA'].includes((document.activeElement?.tagName || ''))
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === 'Escape' && document.activeElement === searchInputRef.current) {
        setSearch('');
        searchInputRef.current?.blur();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter tools based on search query
  const searchResults = useMemo(() => {
    if (!search.trim()) return TOOLS;
    return searchTools(search, TOOLS);
  }, [search]);

  // Group search results by category
  const categoriesWithTools = useMemo(() => {
    return CATEGORIES.map((cat) => {
      const toolsInCat = searchResults.filter((tool) => tool.categorySlug === cat.slug);
      return {
        ...cat,
        tools: toolsInCat,
      };
    }).filter((cat) => cat.tools.length > 0);
  }, [searchResults]);

  // Handle single category or special tabs (popular, bookmarks, recent)
  const currentCategoryObj = useMemo(() => {
    return CATEGORIES.find((c) => c.slug === selectedCategory);
  }, [selectedCategory]);

  const activeFilteredList = useMemo(() => {
    if (selectedCategory === 'popular') {
      return search.trim() ? searchResults.filter((t) => t.popular) : popularTools;
    }
    if (selectedCategory === 'bookmarks') {
      return search.trim()
        ? searchResults.filter((t) => favorites.includes(t.slug))
        : favoriteTools;
    }
    if (selectedCategory === 'recent') {
      return search.trim()
        ? searchResults.filter((t) => recentSlugs.includes(t.slug))
        : recentTools;
    }
    if (selectedCategory !== 'all') {
      return searchResults.filter((t) => t.categorySlug === selectedCategory);
    }
    return searchResults;
  }, [selectedCategory, searchResults, popularTools, favorites, favoriteTools, recentSlugs, recentTools]);

  return (
    <div className="space-y-4">
      {/* Top Search & Filter Bar */}
      <div className="bg-white dark:bg-gray-850 rounded-2xl border border-gray-200/90 dark:border-gray-800 p-4 sm:p-5 shadow-sm space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800">
                🚀 Launched 13 Nov 2026
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Adding more tools regularly &bull; <a href="/contact" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">Drop a comment / feedback &rarr;</a>
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
              Online Calculators | Formatters | Generators | Editors | Tools
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {TOOLS.length} free, fast browser tools organized by category
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72 md:w-80">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <Search className="w-4 h-4" aria-hidden="true" />
            </div>
            <input
              ref={searchInputRef}
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter tools (Press '/' to focus)..."
              className="w-full pl-9 pr-8 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-800 text-xs sm:text-sm transition-all"
            />
            {search ? (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <kbd className="hidden sm:inline-block absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-mono text-gray-400 bg-gray-200/60 dark:bg-gray-700/60 rounded">
                /
              </kbd>
            )}
          </div>
        </div>

        {/* Category Pills Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-colors whitespace-nowrap shrink-0 ${selectedCategory === 'all'
              ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20 font-semibold'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
          >
            All Categories ({TOOLS.length})
          </button>

          {CATEGORIES.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-3 py-1.5 rounded-xl font-medium transition-colors whitespace-nowrap shrink-0 ${selectedCategory === cat.slug
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20 font-semibold'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
            >
              {cat.name.replace(' Calculators', '').replace(' Tools', '')} ({cat.count})
            </button>
          ))}

          <button
            onClick={() => setSelectedCategory('popular')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl font-medium transition-colors whitespace-nowrap shrink-0 ${selectedCategory === 'popular'
              ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20 font-semibold'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>Popular ({popularTools.length})</span>
          </button>

          {favoriteTools.length > 0 && (
            <button
              onClick={() => setSelectedCategory('bookmarks')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl font-medium transition-colors whitespace-nowrap shrink-0 ${selectedCategory === 'bookmarks'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20 font-semibold'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
            >
              <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
              <span>Bookmarks ({favoriteTools.length})</span>
            </button>
          )}

          {recentTools.length > 0 && (
            <button
              onClick={() => setSelectedCategory('recent')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl font-medium transition-colors whitespace-nowrap shrink-0 ${selectedCategory === 'recent'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20 font-semibold'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
            >
              <Clock className="w-3.5 h-3.5 text-blue-500" />
              <span>Recent ({recentTools.length})</span>
            </button>
          )}
        </div>

        {/* Compact Recent Strip (if not already viewing recent/bookmarks and user has recents) */}
        {recentTools.length > 0 && selectedCategory === 'all' && !search && (
          <div className="flex items-center gap-2 pt-2 border-t border-gray-100 dark:border-gray-800/80 text-xs overflow-x-auto no-scrollbar">
            <span className="flex items-center gap-1 text-gray-400 dark:text-gray-500 font-semibold shrink-0">
              <Clock className="w-3 h-3 text-blue-500" />
              Recent:
            </span>
            <div className="flex items-center gap-1.5 shrink-0">
              {recentTools.slice(0, 5).map((tool) => (
                <a
                  key={tool.slug}
                  href={`/tools/${tool.slug}`}
                  className="px-2 py-0.5 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-200/60 dark:border-gray-700/60 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 transition-colors"
                >
                  {tool.name}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Search results banner if searching */}
      {search && (
        <div className="flex items-center justify-between px-3 py-2 bg-blue-50/70 dark:bg-blue-950/30 rounded-xl border border-blue-100 dark:border-blue-900/40 text-xs text-blue-800 dark:text-blue-200">
          <span>
            Found <strong>{searchResults.length}</strong> matching tools for "<strong>{search}</strong>"
          </span>
          <button
            onClick={() => setSearch('')}
            className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
          >
            Clear search
          </button>
        </div>
      )}

      {/* Main Content View */}
      {selectedCategory === 'all' ? (
        /* ALL CATEGORIES: Dense Multi-Column Categorized Grid */
        categoriesWithTools.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 items-start">
            {categoriesWithTools.map((cat) => {
              const theme = getCategoryTheme(cat.slug);
              return (
                <section
                  key={cat.slug}
                  className="bg-white dark:bg-gray-850 rounded-xl border border-gray-200/90 dark:border-gray-800 p-3.5 shadow-sm hover:border-gray-300 dark:hover:border-gray-700 transition-all flex flex-col"
                  aria-labelledby={`cat-heading-${cat.slug}`}
                >
                  {/* Category Header */}
                  <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${theme.bg} ${theme.text}`}
                        aria-hidden="true"
                      >
                        <ToolIcon name={cat.icon} className="w-4 h-4" />
                      </div>
                      <h2
                        id={`cat-heading-${cat.slug}`}
                        className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate"
                        title={cat.name}
                      >
                        {cat.name}
                      </h2>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                        {cat.tools.length}
                      </span>
                      <a
                        href={`/category/${cat.slug}`}
                        title={`View all ${cat.name}`}
                        className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 p-0.5 rounded transition-colors text-xs font-bold"
                      >
                        &rarr;
                      </a>
                    </div>
                  </div>

                  {/* Tools List - High Density */}
                  <ul className="space-y-0.5">
                    {cat.tools.map((tool) => (
                      <li key={tool.slug}>
                        <a
                          href={`/tools/${tool.slug}`}
                          title={`${tool.name} — ${tool.description}`}
                          className="group flex items-center justify-between px-2 py-1.5 rounded-lg text-xs text-gray-700 dark:text-gray-300 hover:bg-blue-50/80 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <ToolIcon
                              name={tool.icon}
                              className="w-3.5 h-3.5 shrink-0 text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                            />
                            <span className="truncate group-hover:font-medium">
                              {tool.name}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 shrink-0 ml-1.5">
                            {tool.popular && (
                              <Flame
                                className="w-3 h-3 text-amber-500 fill-amber-500"
                                aria-label="Popular"
                              />
                            )}
                            <ArrowRight className="w-3 h-3 text-blue-500 opacity-0 group-hover:opacity-100 -translate-x-0.5 group-hover:translate-x-0 transition-all" />
                          </div>
                        </a>
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 px-4 bg-white dark:bg-gray-850 rounded-xl border border-gray-200 dark:border-gray-800">
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              No tools matched your search "{search}"
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-3">
              Try searching for something else like "Age", "JSON", "BMI", or "EMI".
            </p>
            <button
              onClick={() => setSearch('')}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              Clear search
            </button>
          </div>
        )
      ) : (
        /* SINGLE CATEGORY / SPECIAL FILTER: Compact Grid */
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white dark:bg-gray-850 p-3.5 rounded-xl border border-gray-200/90 dark:border-gray-800">
            <div className="flex items-center gap-2.5">
              {currentCategoryObj && (
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${getCategoryTheme(currentCategoryObj.slug).bg} ${getCategoryTheme(currentCategoryObj.slug).text}`}
                >
                  <ToolIcon name={currentCategoryObj.icon} className="w-4 h-4" />
                </div>
              )}
              <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">
                {selectedCategory === 'popular'
                  ? 'Popular Tools'
                  : selectedCategory === 'bookmarks'
                    ? 'Bookmarked Tools'
                    : selectedCategory === 'recent'
                      ? 'Recently Visited Tools'
                      : currentCategoryObj?.name || 'Tools'}
              </h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                {activeFilteredList.length} tools
              </span>
            </div>

            <button
              onClick={() => setSelectedCategory('all')}
              className="flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Show all categories
            </button>
          </div>

          {activeFilteredList.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {activeFilteredList.map((tool) => {
                const theme = getCategoryTheme(tool.categorySlug);
                return (
                  <a
                    key={tool.slug}
                    href={`/tools/${tool.slug}`}
                    className="group flex flex-col justify-between p-3.5 rounded-xl border border-gray-200/90 dark:border-gray-800 bg-white dark:bg-gray-850 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center ${theme.bg} ${theme.text}`}
                        >
                          <ToolIcon name={tool.icon} className="w-4 h-4" />
                        </div>
                        {tool.popular && (
                          <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                            <Flame className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                            Popular
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {tool.name}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
                        {tool.description}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs">
                      <span className="text-[10px] text-gray-400">
                        {tool.category.split(' ')[0]}
                      </span>
                      <span className="font-semibold text-blue-600 dark:text-blue-400 group-hover:underline flex items-center gap-0.5">
                        Open &rarr;
                      </span>
                    </div>
                  </a>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 px-4 bg-white dark:bg-gray-850 rounded-xl border border-gray-200 dark:border-gray-800">
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                No tools found
              </p>
              <button
                onClick={() => setSelectedCategory('all')}
                className="mt-3 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                Back to all categories
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

