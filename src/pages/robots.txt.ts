import type { APIRoute } from 'astro';
import { getSiteUrl } from '../utils/site';

export const GET: APIRoute = ({ site, url }) => {
  const origin = (site ? site.origin : (url?.origin || getSiteUrl())).replace(/\/$/, '');
  return new Response(
    `User-agent: *
Allow: /
Sitemap: ${origin}/sitemap.xml
Sitemap: ${origin}/sitemap-index.xml
`,
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } }
  );
};
