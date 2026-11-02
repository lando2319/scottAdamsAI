import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import react from '@vitejs/plugin-react';
import { SITE_URL, pages, getPageMetadata, getMetaTags, websiteSchema } from '../src/site.js';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = new URL('../dist/', import.meta.url);
const template = await readFile(new URL('index.html', output), 'utf8');
const headMarker = /<!--seo-head:start-->[\s\S]*?<!--seo-head:end-->/;
const rootMarker = '<div id="root"></div>';

if (!headMarker.test(template) || !template.includes(rootMarker)) {
  throw new Error('The HTML template is missing its metadata or React root marker.');
}

function escapeHtml(value) {
  return value.replaceAll('&', '&amp;').replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

function renderHead(pathname) {
  const page = getPageMetadata(pathname);
  const tags = [`<title>${escapeHtml(page.title)}</title>`];
  for (const [name, content] of Object.entries(getMetaTags(page))) {
    if (!content) continue;
    const attribute = name.startsWith('og:') ? 'property' : 'name';
    tags.push(`<meta ${attribute}="${name}" content="${escapeHtml(content)}" />`);
  }
  if (page.url) tags.push(`<link rel="canonical" href="${escapeHtml(page.url)}" />`);
  if (pathname === '/') {
    tags.push(`<script id="website-schema" type="application/ld+json">${JSON.stringify(websiteSchema).replaceAll('<', '\\u003c')}</script>`);
  }
  return tags.join('\n  ');
}

// Render the same React components used by the browser, with no Firebase calls.
const server = await createServer({
  root,
  configFile: false,
  plugins: [react()],
  server: { middlewareMode: true, hmr: false, ws: false, watch: null },
  appType: 'custom',
  logLevel: 'error',
});

try {
  const { render } = await server.ssrLoadModule('/src/entry-server.jsx');
  for (const pathname of [...Object.keys(pages), '/404']) {
    const filename = pathname === '/' ? 'index.html' : `${pathname.slice(1)}.html`;
    const html = template
      .replace(headMarker, () => renderHead(pathname))
      .replace(rootMarker, () => `<div id="root">${render(pathname)}</div>`);
    await writeFile(new URL(filename, output), html);
    console.log(`Prerendered ${pathname} → dist/${filename}`);
  }

  const urls = Object.keys(pages).map(pathname => `  <url><loc>${SITE_URL}${pathname}</loc></url>`);
  await writeFile(new URL('sitemap.xml', output),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`);
  await writeFile(new URL('robots.txt', output),
    `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);
} finally {
  await server.close();
}
