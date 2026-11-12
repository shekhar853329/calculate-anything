import { useState, useRef, useEffect } from 'react';
import { Search, ArrowRight } from 'lucide-react';
import { TOOLS } from '../../data/tools';
import { searchTools } from '../../lib/search';
import type { Tool } from '../../data/tools';

export default function HeroSection() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Tool[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  function handleSearch(value: string) {
    setQuery(value);
    if (value.trim().length < 1) {
      setResults([]);
      setShowDropdown(false);
      return;
    }
    const found = searchTools(value, TOOLS).slice(0, 8);
    setResults(found);
    setShowDropdown(found.length > 0);
  }

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <section
      className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 py-20 px-4"
      aria-labelledby="hero-heading"
    >
      <div className="max-w-3xl mx-auto text-center">
        <h1
          id="hero-heading"
          className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4 leading-tight"
        >
          Free Online Tools for Everyone
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-10 max-w-xl mx-auto">
          110+ calculators, converters, and utilities for students, professionals, and developers.
          No sign-up. No ads in the way. Just results.
        </p>

        {/* Search */}
        <div ref={containerRef} className="relative max-w-xl mx-auto mb-8">
          <label htmlFor="hero-search" className="sr-only">
            Search tools
          </label>
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
              aria-hidden="true"
            />
            <input
              id="hero-search"
              type="search"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => { if (results.length > 0) setShowDropdown(true); }}
              placeholder="Search for a tool…"
              autoComplete="off"
              className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              aria-autocomplete="list"
              aria-controls="hero-search-results"
              aria-expanded={showDropdown}
            />
          </div>

          {/* Dropdown results */}
          {showDropdown && results.length > 0 && (
            <ul
              id="hero-search-results"
              role="listbox"
              aria-label="Search suggestions"
              className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden z-20"
            >
              {results.map((tool) => (
                <li key={tool.slug} role="option" aria-selected="false">
                  <a
                    href={`/tools/${tool.slug}`}
                    onClick={() => setShowDropdown(false)}
                    className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {tool.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                        {tool.description}
                      </p>
                    </div>
                    <span className="shrink-0 mt-0.5 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full whitespace-nowrap">
                      {tool.category}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* CTA */}
        <a
          href="/tools"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors shadow-sm text-sm"
        >
          Browse All Tools
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
