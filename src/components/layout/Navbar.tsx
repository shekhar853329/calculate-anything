import { useState, useRef, useEffect } from 'react';
import { Search, Moon, Sun, Menu, X, Wrench } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { TOOLS } from '../../data/tools';
import { searchTools } from '../../lib/search';
import type { Tool } from '../../data/tools';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Tools', href: '/tools' },
  { label: 'About', href: '/about' },
];

export default function Navbar() {
  const { theme, toggle } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Tool[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
      inputRef.current?.focus();
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [searchOpen]);

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setMobileOpen(false);
        setQuery('');
        setResults([]);
      }
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

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
      <header className="sticky top-0 z-40 w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          {/* Logo */}
          <a
            href="/"
            className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-lg shrink-0"
            aria-label="CalculateAnything home"
          >
            <Wrench className="w-5 h-5" aria-hidden="true" />
            <span>CalculateAnything</span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={openSearch}
              aria-label="Open search"
              className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Search className="w-5 h-5" aria-hidden="true" />
            </button>
            <button
              onClick={toggle}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5" aria-hidden="true" />
              ) : (
                <Moon className="w-5 h-5" aria-hidden="true" />
              )}
            </button>
            <button
              onClick={() => setMobileOpen((o) => !o)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              className="md:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
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
            className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-3 flex flex-col gap-3"
            aria-label="Mobile navigation"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-1"
              >
                {link.label}
              </a>
            ))}
          </nav>
        )}
      </header>

      {/* Search modal */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 pt-20 px-4"
          role="dialog"
          aria-modal="true"
          aria-label="Search tools"
        >
          <div
            ref={searchRef}
            className="w-full max-w-xl bg-white dark:bg-gray-900 rounded-xl shadow-2xl overflow-hidden"
          >
            <div className="flex items-center px-4 py-3 border-b border-gray-200 dark:border-gray-800 gap-3">
              <Search className="w-5 h-5 text-gray-400 shrink-0" aria-hidden="true" />
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search tools…"
                className="flex-1 bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 outline-none text-sm"
                aria-label="Search tools"
              />
              <button
                onClick={() => { setSearchOpen(false); setQuery(''); setResults([]); }}
                aria-label="Close search"
                className="p-1 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            {results.length > 0 && (
              <ul role="listbox" aria-label="Search results" className="max-h-80 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800">
                {results.map((tool) => (
                  <li key={tool.slug} role="option" aria-selected="false">
                    <a
                      href={`/tools/${tool.slug}`}
                      onClick={() => { setSearchOpen(false); setQuery(''); setResults([]); }}
                      className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{tool.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">{tool.description}</p>
                      </div>
                      <span className="shrink-0 mt-0.5 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full">
                        {tool.category}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            )}

            {query.trim().length > 0 && results.length === 0 && (
              <p className="px-4 py-6 text-sm text-center text-gray-500 dark:text-gray-400">
                No tools found for "{query}"
              </p>
            )}

            {query.trim().length === 0 && (
              <p className="px-4 py-4 text-xs text-center text-gray-400 dark:text-gray-500">
                Start typing to search all tools…
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
