import { getSiteUrl } from './site';
import type { Tool } from '../data/tools';

export const SITE_LAUNCH_DATE = '2026-11-13T00:00:00+00:00';
export const SITE_MODIFIED_DATE = '2026-11-14T00:00:00+00:00';

export function getDefaultAuthor(origin: string) {
  return [
    {
      '@type': 'Organization',
      name: 'CalculateAnything Team',
      url: `${origin}/about/`,
    },
  ];
}

export function getDefaultPublisher(origin: string) {
  return {
    '@type': 'Organization',
    name: 'CalculateAnything',
    url: `${origin}/`,
    logo: {
      '@type': 'ImageObject',
      url: `${origin}/favicon.svg`,
    },
  };
}

export function getDefaultImages(origin: string, customImage?: string): string[] {
  if (customImage) {
    const full = customImage.startsWith('http')
      ? customImage
      : `${origin}${customImage.startsWith('/') ? customImage : `/${customImage}`}`;
    return [full];
  }
  return [`${origin}/og-default.png`];
}

export function buildWebSiteSchema(origin: string) {
  return {
    '@type': 'WebSite',
    '@id': `${origin}/#website`,
    url: `${origin}/`,
    name: 'CalculateAnything',
    description: 'Free online calculators, converters, and tools organized by category.',
    publisher: getDefaultPublisher(origin),
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${origin}/tools/?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function buildOrganizationSchema(origin: string) {
  return {
    '@type': 'Organization',
    '@id': `${origin}/#organization`,
    name: 'CalculateAnything',
    url: `${origin}/`,
    logo: {
      '@type': 'ImageObject',
      url: `${origin}/favicon.svg`,
    },
    description: 'Free online calculators, converters, formatters, and browser tools.',
  };
}

/**
 * Schema for Home Page (/)
 */
export function buildHomeSchema(origin: string) {
  const url = `${origin}/`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      buildWebSiteSchema(origin),
      buildOrganizationSchema(origin),
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: 'CalculateAnything - 110+ Free Online Calculators & Tools',
        headline: 'CalculateAnything - 110+ Free Online Calculators & Tools',
        description: 'Free online calculators, converters, and tools organized by category. Fast, private, client-side utilities with no sign-up required.',
        isPartOf: { '@id': `${origin}/#website` },
        about: { '@id': `${origin}/#organization` },
        datePublished: SITE_LAUNCH_DATE,
        dateModified: SITE_MODIFIED_DATE,
        inLanguage: 'en-US',
        image: getDefaultImages(origin),
        author: getDefaultAuthor(origin),
        publisher: getDefaultPublisher(origin),
      },
    ],
  };
}

/**
 * Schema for Category Pages (/category/[category]/)
 */
export function buildCategorySchema(
  origin: string,
  category: { name: string; slug: string; count?: number },
  tools: Array<{ name: string; slug: string }>
) {
  const categoryUrl = `${origin}/category/${category.slug}/`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${categoryUrl}#webpage`,
        url: categoryUrl,
        name: `${category.name} - Free Online Tools | CalculateAnything`,
        headline: `${category.name} Online Tools and Calculators`,
        description: `Browse free ${category.name.toLowerCase()} calculators and online converters. Fast, browser-based, no sign-up required.`,
        isPartOf: { '@id': `${origin}/#website` },
        datePublished: SITE_LAUNCH_DATE,
        dateModified: SITE_MODIFIED_DATE,
        inLanguage: 'en-US',
        image: getDefaultImages(origin),
        author: getDefaultAuthor(origin),
        publisher: getDefaultPublisher(origin),
        mainEntity: {
          '@type': 'ItemList',
          name: `${category.name} Tools`,
          numberOfItems: tools.length,
          itemListElement: tools.map((tool, idx) => ({
            '@type': 'ListItem',
            position: idx + 1,
            name: tool.name,
            url: `${origin}/tools/${tool.slug}/`,
          })),
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${categoryUrl}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: `${origin}/`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Categories',
            item: `${origin}/tools/`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: category.name,
            item: categoryUrl,
          },
        ],
      },
    ],
  };
}

/**
 * Schema for Tools Directory Page (/tools/)
 */
export function buildAllToolsSchema(origin: string, tools: Array<{ name: string; slug: string }>) {
  const toolsUrl = `${origin}/tools/`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${toolsUrl}#webpage`,
        url: toolsUrl,
        name: 'All 110+ Free Online Calculators & Tools | CalculateAnything',
        headline: 'Complete Directory of 110+ Free Online Tools',
        description: 'Explore the complete collection of 110+ free calculators, converters, formatters, and utilities. Fast, responsive, and 100% private in your browser.',
        isPartOf: { '@id': `${origin}/#website` },
        datePublished: SITE_LAUNCH_DATE,
        dateModified: SITE_MODIFIED_DATE,
        inLanguage: 'en-US',
        image: getDefaultImages(origin),
        author: getDefaultAuthor(origin),
        publisher: getDefaultPublisher(origin),
        mainEntity: {
          '@type': 'ItemList',
          name: 'All Available Tools',
          numberOfItems: tools.length,
          itemListElement: tools.map((tool, idx) => ({
            '@type': 'ListItem',
            position: idx + 1,
            name: tool.name,
            url: `${origin}/tools/${tool.slug}/`,
          })),
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${toolsUrl}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: `${origin}/`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'All Tools',
            item: toolsUrl,
          },
        ],
      },
    ],
  };
}

/**
 * Schema for Individual Tool Pages (/tools/[slug]/)
 */
export function buildToolSchema(origin: string, tool: Tool, pageTitle: string) {
  const toolUrl = `${origin}/tools/${tool.slug}/`;
  const categoryUrl = `${origin}/category/${tool.categorySlug}/`;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        '@id': `${toolUrl}#webapp`,
        name: tool.name,
        headline: tool.name,
        description: tool.description,
        url: toolUrl,
        applicationCategory: 'UtilityApplication',
        operatingSystem: 'All',
        browserRequirements: 'Requires JavaScript. Requires HTML5.',
        datePublished: SITE_LAUNCH_DATE,
        dateModified: SITE_MODIFIED_DATE,
        inLanguage: 'en-US',
        image: getDefaultImages(origin),
        author: getDefaultAuthor(origin),
        publisher: getDefaultPublisher(origin),
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
      },
      {
        '@type': 'WebPage',
        '@id': `${toolUrl}#webpage`,
        url: toolUrl,
        name: pageTitle,
        headline: tool.name,
        description: tool.description,
        isPartOf: { '@id': `${origin}/#website` },
        datePublished: SITE_LAUNCH_DATE,
        dateModified: SITE_MODIFIED_DATE,
        inLanguage: 'en-US',
        image: getDefaultImages(origin),
        author: getDefaultAuthor(origin),
        publisher: getDefaultPublisher(origin),
      },
      {
        '@type': 'FAQPage',
        '@id': `${toolUrl}#faq`,
        mainEntity: [
          {
            '@type': 'Question',
            name: `What is ${tool.name}?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `${tool.name} is a free online tool that helps you ${tool.description.charAt(0).toLowerCase()}${tool.description.slice(1)} It runs entirely in your browser — no sign-up or installation required.`,
            },
          },
          {
            '@type': 'Question',
            name: `Is ${tool.name} free to use?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `Yes, ${tool.name} is completely free. There are no hidden charges, subscriptions, or account requirements. You can use it as many times as you like.`,
            },
          },
          {
            '@type': 'Question',
            name: `How accurate is ${tool.name}?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `${tool.name} uses industry-standard algorithms and formulas to ensure accurate results. All calculations are performed locally in your browser for speed and privacy. If you spot an issue, please let us know via the Contact page.`,
            },
          },
        ],
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${toolUrl}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: `${origin}/`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: tool.category,
            item: categoryUrl,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: tool.name,
            item: toolUrl,
          },
        ],
      },
    ],
  };
}

export interface StaticPageSchemaOptions {
  title: string;
  headline: string;
  description: string;
  path: string;
  type?: 'AboutPage' | 'ContactPage' | 'WebPage';
  datePublished?: string;
  dateModified?: string;
  breadcrumbLabel: string;
}

/**
 * Schema for Static Pages (About, Contact, Privacy, Terms, Disclaimer, Sitemap)
 */
export function buildStaticPageSchema(origin: string, options: StaticPageSchemaOptions) {
  const cleanPath = options.path.startsWith('/') ? options.path : `/${options.path}`;
  const pageUrl = `${origin}${cleanPath.endsWith('/') ? cleanPath : `${cleanPath}/`}`;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': options.type || 'WebPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: options.title,
        headline: options.headline,
        description: options.description,
        isPartOf: { '@id': `${origin}/#website` },
        datePublished: options.datePublished || SITE_LAUNCH_DATE,
        dateModified: options.dateModified || SITE_MODIFIED_DATE,
        inLanguage: 'en-US',
        image: getDefaultImages(origin),
        author: getDefaultAuthor(origin),
        publisher: getDefaultPublisher(origin),
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${pageUrl}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: `${origin}/`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: options.breadcrumbLabel,
            item: pageUrl,
          },
        ],
      },
    ],
  };
}
