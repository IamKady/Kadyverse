import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { build as bundle } from 'esbuild';

const root = path.dirname(fileURLToPath(import.meta.url));
const output = path.join(root, 'dist');
const source = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
const shell = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

const routes = [
  '/', '/explore', '/explore/the-mind', '/explore/the-heart',
  '/explore/the-world', '/explore/the-imagination', '/explore/the-journey',
  '/journal', '/about', '/archive', '/search'
];

function renderRoute(route) {
  const url = new URL(route, 'https://kadyverse.com');
  const attributes = new Map();
  const meta = selector => ({
    setAttribute(name, value) { attributes.set(`${selector}:${name}`, String(value)); },
    getAttribute(name) { return attributes.get(`${selector}:${name}`) || ''; }
  });
  const classList = { add() {}, remove() {}, toggle() {} };
  const main = { innerHTML: '', addEventListener() {} };
  const nav = { classList, addEventListener() {} };
  const screenReader = { textContent: '' };
  const menuToggle = { setAttribute() {}, getAttribute() { return 'false'; }, querySelector() { return screenReader; }, addEventListener() {} };
  const structuredData = { textContent: '' };
  const currentYear = { textContent: '' };
  const searchInput = { focus() {} };
  const selectors = new Map([
    ['#main', main], ['.primary-navigation', nav], ['.menu-toggle', menuToggle],
    ['#structured-data', structuredData], ['#current-year', currentYear], ['#site-search', searchInput],
    ['meta[name="description"]', meta('description')],
    ['meta[property="og:title"]', meta('og:title')],
    ['meta[property="og:description"]', meta('og:description')],
    ['meta[property="og:type"]', meta('og:type')],
    ['meta[property="og:image"]', meta('og:image')],
    ['meta[property="og:url"]', meta('og:url')],
    ['link[rel="canonical"]', meta('canonical')],
    ['meta[name="robots"]', meta('robots')]
  ]);
  const document = {
    title: '', body: { classList },
    querySelector(selector) { return selectors.get(selector) || null; },
    querySelectorAll() { return []; },
    addEventListener() {}
  };
  const window = { addEventListener() {}, scrollTo() {} };
  const location = { origin: url.origin, pathname: url.pathname, search: url.search, href: url.href };
  const context = {
    document, window, location, history: { pushState() {} }, navigator: {},
    URL, URLSearchParams, Intl, JSON, Date, Math, Map, String, Number, Object, Array,
    encodeURIComponent, decodeURI, decodeURIComponent, console
  };
  vm.runInNewContext(`${source}\n;globalThis.__KADYVERSE_ARTICLES = articles;`, context, { filename: 'app.js', timeout: 3000 });
  const replacements = {
    '<title>KadyVerse — A universe within a human</title>': `<title>${document.title}</title>`,
    '<meta name="description" content="KadyVerse is a living archive of thoughts, experiences, questions and fragments of a life still unfolding.">': `<meta name="description" content="${escapeAttr(attributes.get('description:content') || '')}">`,
    '<meta property="og:title" content="KadyVerse — A universe within a human">': `<meta property="og:title" content="${escapeAttr(attributes.get('og:title:content') || '')}">`,
    '<meta property="og:description" content="Thoughts, experiences, questions and fragments of a life still unfolding.">': `<meta property="og:description" content="${escapeAttr(attributes.get('og:description:content') || '')}">`,
    '<meta property="og:type" content="website">': `<meta property="og:type" content="${escapeAttr(attributes.get('og:type:content') || 'website')}">`,
    '<meta property="og:url" content="https://kadyverse.com/">': `<meta property="og:url" content="${escapeAttr(attributes.get('og:url:content') || 'https://kadyverse.com/')}">`,
    '<meta property="og:image" content="https://kadyverse.com/assets/inner-landscape.svg">': `<meta property="og:image" content="${escapeAttr(attributes.get('og:image:content') || 'https://kadyverse.com/assets/inner-landscape.svg')}">`,
    '<link rel="canonical" href="https://kadyverse.com/">': `<link rel="canonical" href="${escapeAttr(attributes.get('canonical:href') || 'https://kadyverse.com/')}">`,
    '<meta name="robots" content="index,follow">': `<meta name="robots" content="${escapeAttr(attributes.get('robots:content') || 'index,follow')}">`,
    '<main id="main" tabindex="-1"></main>': `<main id="main" tabindex="-1">${main.innerHTML}</main>`,
    '<script type="application/ld+json" id="structured-data"></script>': `<script type="application/ld+json" id="structured-data">${structuredData.textContent.replace(/</g, '\\u003c')}</script>`,
    '<span id="current-year"></span>': `<span id="current-year">${new Date().getFullYear()}</span>`
  };
  let html = shell;
  for (const [before, after] of Object.entries(replacements)) html = html.replace(before, after);
  return { html, articles: context.__KADYVERSE_ARTICLES || [] };
}

function escapeAttr(value) {
  return String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}

const firstRender = renderRoute('/');
const publishedArticles = firstRender.articles.filter(article => article.status === 'published');
const allRoutes = [...routes, ...publishedArticles.map(article => `/article/${article.slug}`)];
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';
if (Boolean(supabaseUrl) !== Boolean(supabaseAnonKey)) {
  throw new Error('Set both SUPABASE_URL and SUPABASE_ANON_KEY, or leave both unset.');
}

fs.rmSync(output, { recursive: true, force: true });
for (const route of allRoutes) {
  const directory = route === '/' ? output : path.join(output, route.slice(1));
  fs.mkdirSync(directory, { recursive: true });
  const rendered = route === '/' ? firstRender : renderRoute(route);
  fs.writeFileSync(path.join(directory, 'index.html'), rendered.html);
}
for (const file of ['app.js', 'styles.css', 'robots.txt']) {
  fs.copyFileSync(path.join(root, file), path.join(output, file));
}
fs.cpSync(path.join(root, 'assets'), path.join(output, 'assets'), { recursive: true });
fs.writeFileSync(path.join(output, 'supabase-config.js'), `window.KADYVERSE_SUPABASE = ${JSON.stringify({ url: supabaseUrl, anonKey: supabaseAnonKey })};\n`);
const studioOutput = path.join(output, 'studio');
fs.mkdirSync(studioOutput, { recursive: true });
fs.copyFileSync(path.join(root, 'studio.html'), path.join(studioOutput, 'index.html'));
await bundle({
  entryPoints: [path.join(root, 'studio.js')],
  bundle: true,
  format: 'iife',
  target: ['es2020'],
  outfile: path.join(studioOutput, 'studio.js')
});
const articleFallback = renderRoute('/article');
fs.mkdirSync(path.join(output, 'article'), { recursive: true });
fs.writeFileSync(path.join(output, 'article', 'index.html'), articleFallback.html);
const notFound = renderRoute('/__not-found__');
fs.writeFileSync(path.join(output, '404.html'), notFound.html);
const sitemapEntries = allRoutes.filter(route => route !== '/search').map(route => {
  const article = publishedArticles.find(item => route === `/article/${item.slug}`);
  const lastmod = article ? `<lastmod>${article.date}</lastmod>` : '';
  return `  <url><loc>https://kadyverse.com${route}</loc>${lastmod}</url>`;
}).join('\n');
fs.writeFileSync(path.join(output, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapEntries}\n</urlset>\n`);
console.log(`Built ${allRoutes.length} pre-rendered routes (${publishedArticles.length} published articles) into ${output}`);
