import { useState, useRef, useEffect } from 'react';
import { Search, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { TOOLS } from '../../data/tools';
import { searchTools } from '../../lib/search';
import type { Tool } from '../../data/tools';
import { ToolIcon, getCategoryTheme } from '../common/IconHelper';

const TRENDING_SEARCHES = [
  { name: 'Age Calculator', slug: 'age-calculator' },
  { name: 'Percentage', slug: 'percentage-calculator' },
  { name: 'BMI Calculator', slug: 'bmi-calculator' },
  { name: 'EMI Calculator', slug: 'emi-calculator' },
  { name: 'JSON Formatter', slug: 'json-formatter' },
  { name: 'QR Code Generator', slug: 'qr-code-generator' },
];

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
      className="relative overflow-hidden bg-gradient-to-b from-blue-50/60 via-white to-transparent dark:from-blue-950/20 dark:via-gray-900 dark:to-gray-900 pt-16 pb-12 px-4 sm:px-6 lg:px-8 border-b border-gray-100 dark:border-gray-800"
      aria-labelledby="hero-heading"
    >
      {/* Background ambient glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-64 bg-gradient-to-r from-blue-400/10 via-indigo-400/10 to-teal-400/10 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative max-w-4xl mx-auto text-center">
        {/* Value Proposition Pills */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-6 border border-blue-200/60 dark:border-blue-800">
          <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
          <span>110+ Free Precision Calculators, Converters & Utilities</span>
        </div>

        <h1
          id="hero-heading"
          className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 dark:text-gray-100 mb-5 tracking-tight leading-[1.12]"
        >
          Calculate, Convert & Format{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
            Instantly
          </span>
        </h1>
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
          High-performance, privacy-first tools running directly in your browser.
          No sign-ups, no paywalls, zero friction.
        </p>

        {/* Search */}
        <div ref={containerRef} className="relative max-w-2xl mx-auto mb-6">
          <label htmlFor="hero-search" className="sr-only">
            Search tools
          </label>
          <div className="relative shadow-lg shadow-blue-500/5 rounded-2xl">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
              <Search className="w-5 h-5" aria-hidden="true" />
            </div>
            <input
              id="hero-search"
              type="search"
              role="combobox"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => { if (results.length > 0) setShowDropdown(true); }}
              placeholder="Search 110+ tools (e.g. Age, BMI, JSON, EMI, Base64)..."
              autoComplete="off"
              className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 text-base transition-all"
              aria-autocomplete="list"
              aria-haspopup="listbox"
              aria-controls={showDropdown && results.length > 0 ? 'hero-search-results' : undefined}
              aria-expanded={showDropdown}
            />
          </div>

          {/* Dropdown results */}
          {showDropdown && results.length > 0 && (
            <ul
              id="hero-search-results"
              role="listbox"
              aria-label="Search suggestions"
              className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl overflow-hidden z-30 text-left divide-y divide-gray-100 dark:divide-gray-800 max-h-96 overflow-y-auto"
            >
              {results.map((tool) => {
                const theme = getCategoryTheme(tool.categorySlug);
                return (
                  <li key={tool.slug} role="option" aria-selected="false">
                    <a
                      href={`/tools/${tool.slug}/`}
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-3.5 px-4.5 py-3 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                    >
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${theme.bg} ${theme.text}`}>
                        <ToolIcon name={tool.icon} className="w-4.5 h-4.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                          {tool.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                          {tool.description}
                        </p>
                      </div>
                      <span className={`shrink-0 text-[11px] font-medium px-2 py-0.5 rounded-full ${theme.badgeBg}`}>
                        {tool.category}
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex items-center justify-center gap-2 flex-wrap text-xs text-gray-500 dark:text-gray-400 mb-8">
          <span className="font-semibold text-gray-700 dark:text-gray-300">Popular:</span>
          {TRENDING_SEARCHES.map((item) => (
            <a
              key={item.slug}
              href={`/tools/${item.slug}/`}
              className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-gray-700 dark:hover:text-blue-400 transition-colors"
            >
              {item.name}
            </a>
          ))}
        </div>

        {/* Feature Checkmarks */}
        <div className="flex items-center justify-center gap-6 sm:gap-8 text-xs sm:text-sm text-gray-500 dark:text-gray-400 pt-2">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>100% Free Forever</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Private & Browser-Based</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Instant Calculations</span>
          </div>
        </div>
      </div>
    </section>
  );
}
