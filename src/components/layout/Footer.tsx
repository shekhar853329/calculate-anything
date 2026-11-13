import { Wrench } from 'lucide-react';

const CATEGORIES = [
  { name: 'Date & Age', href: '/category/date-age' },
  { name: 'Mathematics', href: '/category/mathematics' },
  { name: 'Text & Formatting', href: '/category/text-formatting' },
  { name: 'Developer Tools', href: '/category/developer' },
  { name: 'Unit Conversion', href: '/category/unit-conversion' },
  { name: 'Finance & Business', href: '/category/finance' },
  { name: 'Image & File', href: '/category/image-file' },
  { name: 'Productivity', href: '/category/productivity' },
];

const LINKS = [
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Sitemap', href: '/sitemap' },
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms & Conditions', href: '/terms' },
  { label: 'Disclaimer', href: '/disclaimer' },
];

export default function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <a
              href="/"
              className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-lg mb-3"
              aria-label="CalculateAnything home"
            >
              <Wrench className="w-5 h-5" aria-hidden="true" />
              <span>CalculateAnything</span>
            </a>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              Free online calculators, converters, and tools for everyone. No sign-up required.
            </p>
          </div>

          {/* Quick Links */}
          <nav aria-label="Footer quick links">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-4">
              Quick Links
            </h2>
            <ul className="space-y-2">
              {LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Categories */}
          <nav aria-label="Tool categories">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-4">
              Categories
            </h2>
            <ul className="space-y-2">
              {CATEGORIES.map((cat) => (
                <li key={cat.href}>
                  <a
                    href={cat.href}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {cat.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-800 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-500">
            &copy; 2024 CalculateAnything. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
