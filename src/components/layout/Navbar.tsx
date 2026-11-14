import { useState, useRef, useEffect } from 'react';
import { Search, Moon, Sun, Menu, X, Wrench, Sparkles, Command } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { TOOLS } from '../../data/tools';
import { searchTools } from '../../lib/search';
import type { Tool } from '../../data/tools';
import { ToolIcon, getCategoryTheme } from '../common/IconHelper';
import AnnouncementBanner from './AnnouncementBanner';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'All Tools', href: '/tools' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

const SUGGESTED_QUICK = ['Age Calculator', 'BMI Calculator', 'JSON Formatter', 'EMI Calculator'];

export default function Navbar() {
  const { theme, toggle } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Tool[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Global Ctrl+K / Cmd+K shortcut
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
        setQuery('');
        setResults([]);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setMobileOpen(false);
        setQuery('');
        setResults([]);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close search modal on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
        setQuery('');
        setResults([]);
      }
    }
    if (searchOpen) {
      document.addEventListener('mousedown', handleClick);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [searchOpen]);

  function handleSearch(value: string) {
    setQuery(value);
    if (value.trim().length < 1) {
      setResults([]);
      return;
    }
    setResults(searchTools(value, TOOLS).slice(0, 8));
  }

  function openSearch() {
    setSearchOpen(true);
    setQuery('');
    setResults([]);
  }

  return (
    <>
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/90 dark:bg-gray-900/90 border-b border-gray-200/80 dark:border-gray-800 transition-colors">
        <AnnouncementBanner />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <a
            href="/"
            className="flex items-center gap-2.5 text-blue-600 dark:text-blue-400 font-extrabold text-lg sm:text-xl shrink-0 group"
            aria-label="CalculateAnything home"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Wrench className="w-5 h-5" aria-hidden="true" />
            </div>
            <span className="text-gray-900 dark:text-gray-100 font-black tracking-tight">
              Calculate<span className="text-blue-600 dark:text-blue-400">Anything</span>
            </span>
          </a>

          {/* Desktop Search Button */}
          <button
            onClick={openSearch}
            className="hidden sm:flex items-center gap-3 w-64 md:w-80 px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-800/80 text-gray-500 dark:text-gray-400 text-xs hover:border-blue-400 dark:hover:border-blue-500 transition-colors shadow-sm"
            aria-label="Quick search tools"
          >
            <Search className="w-4 h-4 text-gray-400" />
            <span className="flex-1 text-left">Quick search tools...</span>
            <kbd className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-semibold text-gray-500 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded">
              <Command className="w-3 h-3" /> K
            </kbd>
          </button>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-6" aria-label="Main navigation">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={openSearch}
              aria-label="Open search"
              className="sm:hidden p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Search className="w-5 h-5" aria-hidden="true" />
            </button>
            <button
              onClick={toggle}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="p-2.5 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-amber-400" aria-hidden="true" />
              ) : (
                <Moon className="w-5 h-5 text-gray-700" aria-hidden="true" />
              )}
            </button>
            <button
              onClick={() => setMobileOpen((o) => !o)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              className="lg:hidden p-2.5 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {mobileOpen ? (
                <X className="w-5 h-5" aria-hidden="true" />
              ) : (
                <Menu className="w-5 h-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <nav
            className="lg:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-4 flex flex-col gap-2 shadow-xl"
            aria-label="Mobile navigation"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
        )}
      </header>

      {/* Search Modal */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm pt-16 sm:pt-24 px-4 animate-in fade-in duration-150"
          role="dialog"
          aria-modal="true"
          aria-label="Search tools"
        >
          <div
            ref={searchRef}
            className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden"
          >
            <div className="flex items-center px-5 py-4 border-b border-gray-200 dark:border-gray-800 gap-3">
              <Search className="w-5 h-5 text-gray-400 shrink-0" aria-hidden="true" />
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search tools, formulas, converters..."
                className="flex-1 bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 outline-none text-base"
                aria-label="Search tools"
              />
              <kbd className="hidden sm:inline-block px-2 py-0.5 text-xs text-gray-400 bg-gray-100 dark:bg-gray-800 rounded">
                ESC
              </kbd>
              <button
                onClick={() => { setSearchOpen(false); setQuery(''); setResults([]); }}
                aria-label="Close search"
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            {results.length > 0 && (
              <ul role="listbox" aria-label="Search results" className="max-h-96 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800">
                {results.map((tool) => {
                  const theme = getCategoryTheme(tool.categorySlug);
                  return (
                    <li key={tool.slug} role="option" aria-selected="false">
                      <a
                        href={`/tools/${tool.slug}`}
                        onClick={() => { setSearchOpen(false); setQuery(''); setResults([]); }}
                        className="flex items-center gap-3.5 px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors"
                      >
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${theme.bg} ${theme.text}`}>
                          <ToolIcon name={tool.icon} className="w-4.5 h-4.5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{tool.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">{tool.description}</p>
                        </div>
                        <span className={`shrink-0 text-[11px] font-medium px-2 py-0.5 rounded-full ${theme.badgeBg}`}>
                          {tool.category.split(' ')[0]}
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            )}

            {query.trim().length > 0 && results.length === 0 && (
              <p className="px-6 py-12 text-sm text-center text-gray-500 dark:text-gray-400">
                No tools found matching "{query}"
              </p>
            )}

            {query.trim().length === 0 && (
              <div className="px-6 py-6 space-y-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                  Quick Suggestions
                </p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED_QUICK.map((name) => {
                    const tool = TOOLS.find((t) => t.name === name);
                    if (!tool) return null;
                    return (
                      <a
                        key={tool.slug}
                        href={`/tools/${tool.slug}`}
                        onClick={() => setSearchOpen(false)}
                        className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:text-blue-600 text-xs font-medium text-gray-700 dark:text-gray-300 transition-colors"
                      >
                        {tool.name}
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
