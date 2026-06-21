import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PAGE_SEO, SITE_URL } from './seo-pages.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function generateSitemap(pages) {
  const lastmod = new Date().toISOString().split('T')[0];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
    .map(
      (page) => `  <url>
    <loc>${SITE_URL}${page.path === '/' ? '' : page.path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${page.changefreq || 'weekly'}</changefreq>
    <priority>${page.priority ?? 0.8}</priority>
  </url>`
    )
    .join('\n')}
</urlset>`;
}

const sitemap = generateSitemap(PAGE_SEO);
const outPath = path.join(__dirname, '../public/sitemap.xml');
fs.writeFileSync(outPath, sitemap);
console.log(`Sitemap generated with ${PAGE_SEO.length} URLs at`, outPath);