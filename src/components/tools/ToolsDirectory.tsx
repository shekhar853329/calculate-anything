import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, ArrowUpRight, X } from 'lucide-react';
import { TOOLS, CATEGORIES } from '../../data/tools';
import type { Tool } from '../../data/tools';
import { ToolIcon, getCategoryTheme } from '../common/IconHelper';

export default function ToolsDirectory() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredTools = useMemo(() => {
    return TOOLS.filter((tool) => {
      const matchesCategory =
        selectedCategory === 'all' || tool.categorySlug === selectedCategory;

      if (!matchesCategory) return false;

      if (!search.trim()) return true;

      const q = search.toLowerCase().trim();
      const nameMatch = tool.name.toLowerCase().includes(q);
      const descMatch = tool.description.toLowerCase().includes(q);
      const kwMatch = tool.keywords.some((k) => k.toLowerCase().includes(q));

      return nameMatch || descMatch || kwMatch;
    });
  }, [search, selectedCategory]);

  return (
    <div className="space-y-8">
      {/* Search and Filters Bar */}
      <div className="bg-white dark:bg-gray-850 p-4 sm:p-6 rounded-2xl border border-gray-200/90 dark:border-gray-800 shadow-sm space-y-4">
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
            <Search className="w-5 h-5" aria-hidden="true" />
          </div>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by tool name, purpose, or keywords (e.g. 'EMI', 'tax', 'binary', 'resize')..."
            className="w-full pl-12 pr-10 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-800 text-sm transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar text-xs">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-colors whitespace-nowrap shrink-0 ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            All Categories ({TOOLS.length})
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-3 py-1.5 rounded-xl font-medium transition-colors whitespace-nowrap shrink-0 ${
                selectedCategory === cat.slug
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {cat.name.replace(' Calculators', '').replace(' Tools', '')} ({cat.count})
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <p>
          Showing <span className="font-semibold text-gray-900 dark:text-gray-100">{filteredTools.length}</span> tools
          {selectedCategory !== 'all' && (
            <span> in <span className="font-semibold text-blue-600 dark:text-blue-400">{CATEGORIES.find(c => c.slug === selectedCategory)?.name}</span></span>
          )}
          {search && <span> matching "<span className="font-semibold">{search}</span>"</span>}
        </p>
        {(search || selectedCategory !== 'all') && (
          <button
            onClick={() => { setSearch(''); setSelectedCategory('all'); }}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            Reset filters
          </button>
        )}
      </div>

      {/* Grid of Tools */}
      {filteredTools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTools.map((tool) => {
            const theme = getCategoryTheme(tool.categorySlug);
            return (
              <a
                key={tool.slug}
                href={`/tools/${tool.slug}/`}
                className="group relative flex flex-col justify-between p-5 rounded-2xl border border-gray-200/90 dark:border-gray-800 bg-white dark:bg-gray-850 hover:bg-gradient-to-b hover:from-white hover:to-blue-50/20 dark:hover:bg-gray-800 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/5 hover:-translate-y-0.5 transition-all duration-200"
              >
                <div>
                  <div className="flex items-center justify-between mb-3.5">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 duration-200 ${theme.bg} ${theme.text}`}
                      aria-hidden="true"
                    >
                      <ToolIcon name={tool.icon} className="w-5 h-5" />
                    </div>
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${theme.badgeBg}`}>
                      {tool.category.split(' ')[0]}
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {tool.name}
                    </h3>
                    <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 mt-0.5" />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                    {tool.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-gray-400 dark:text-gray-500">
                    Client-side
                  </span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400 group-hover:underline">
                    Open Tool &rarr;
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 px-4 bg-gray-50 dark:bg-gray-850 rounded-2xl border border-gray-200 dark:border-gray-800">
          <p className="text-gray-700 dark:text-gray-300 font-semibold mb-1">
            No tools found for "{search}"
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Try a different search term or category filter.
          </p>
          <button
            onClick={() => { setSearch(''); setSelectedCategory('all'); }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-colors"
          >
            Show all tools
          </button>
        </div>
      )}
    </div>
  );
}

