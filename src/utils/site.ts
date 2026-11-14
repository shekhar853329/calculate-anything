/**
 * Dynamic site and domain helper for CalculateAnything.
 * Ensures the app works seamlessly on localhost (dev), custom local ports/domains,
 * preview environments, and production without hardcoding domain names.
 */

export const DEFAULT_PROD_DOMAIN = 'calculate-anything.in';
export const DEFAULT_PROD_URL = `https://${DEFAULT_PROD_DOMAIN}`;
export const DEFAULT_DEV_URL = 'http://localhost:4321';
export const CONTACT_EMAIL = `contact@${DEFAULT_PROD_DOMAIN}`;

/**
 * Returns the effective base URL (without trailing slash).
 * Priority:
 * 1. window.location.origin (client-side in browser)
 * 2. import.meta.env.SITE (Astro config site URL)
 * 3. process.env.SITE_URL
 * 4. Mode-based fallback (dev -> localhost:4321, prod -> calculate-anything.in)
 */
export function getSiteUrl(): string {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin.replace(/\/$/, '');
  }

  if (import.meta.env?.SITE) {
    return String(import.meta.env.SITE).replace(/\/$/, '');
  }

  if (typeof process !== 'undefined' && process.env?.SITE_URL) {
    return process.env.SITE_URL.replace(/\/$/, '');
  }

  const isDev = Boolean(import.meta.env?.DEV);
  return isDev ? DEFAULT_DEV_URL : DEFAULT_PROD_URL;
}

/**
 * Returns the display hostname (e.g. 'localhost:4321' or 'calculate-anything.in')
 */
export function getSiteHostname(fallbackOrigin?: string): string {
  try {
    const raw = fallbackOrigin || getSiteUrl();
    const url = new URL(raw.startsWith('http') ? raw : `https://${raw}`);
    return url.host; // includes port for non-standard ports like localhost:4321
  } catch {
    return DEFAULT_PROD_DOMAIN;
  }
}

/**
 * Formats a canonical URL given a path (relative or absolute) and optional origin override.
 * Always ensures the canonical URL is clean and includes a trailing slash (unless referencing a static file like .xml or .txt).
 */
export function getCanonicalUrl(pathOrUrl?: string, originOverride?: string): string {
  const base = (originOverride || getSiteUrl()).replace(/\/$/, '');
  if (!pathOrUrl || pathOrUrl === '/') {
    return `${base}/`;
  }
  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
    try {
      const u = new URL(pathOrUrl);
      if (!u.pathname.endsWith('/') && !u.pathname.match(/\.[a-zA-Z0-9]+$/)) {
        u.pathname = `${u.pathname}/`;
      }
      return u.toString();
    } catch {
      return pathOrUrl;
    }
  }
  const cleanPath = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
  const hasExt = Boolean(cleanPath.match(/\.[a-zA-Z0-9]+$/));
  const withTrailingSlash = cleanPath.endsWith('/') || hasExt ? cleanPath : `${cleanPath}/`;
  return `${base}${withTrailingSlash}`;
}

