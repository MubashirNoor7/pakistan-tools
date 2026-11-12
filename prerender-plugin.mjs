// Build-time pre-rendering for SEO (no new dependency).
// After `vite build`, writes one static HTML file per route into dist/, e.g.
// dist/tools/loan-emi-calculator/index.html, so Google and AI crawlers get the real
// title, description, canonical, H1, text and FAQ in the raw HTML (no JavaScript needed).
// React still loads and replaces the fallback text, so the visitor sees the normal app.
// Titles are read from the TOOLS list in src/App.jsx; everything else from src/seo-data.js.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function readTitles(appSrc) {
  const out = {};
  const re = /\{ id: '([a-z0-9]+)', title: (?:'((?:[^'\\]|\\.)*)'|"((?:[^"\\]|\\.)*)")(?:, display: (?:'((?:[^'\\]|\\.)*)'|"((?:[^"\\]|\\.)*)"))?/g;
  let m;
  while ((m = re.exec(appSrc))) {
    const title = m[2] !== undefined ? m[2].replace(/\\'/g, "'") : m[3].replace(/\\"/g, '"');
    const display = m[4] !== undefined ? m[4].replace(/\\'/g, "'") : (m[5] !== undefined ? m[5].replace(/\\"/g, '"') : null);
    out[m[1]] = { title, display: display || title };
  }
  return out;
}

function page(tpl, { title, desc, url, h1, body, jsonld }) {
  let h = tpl;
  h = h.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`);
  h = h.replace(/(<meta name="description" content=")[^"]*(")/, `$1${esc(desc)}$2`);
  h = h.replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`);
  h = h.replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${esc(title)}$2`);
  h = h.replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${esc(desc)}$2`);
  h = h.replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`);
  if (jsonld) h = h.replace('</head>', `<script id="kalkio-faq-jsonld" type="application/ld+json">${JSON.stringify(jsonld)}</script>\n</head>`);
  h = h.replace('<div id="root"></div>', `<div id="root"><main style="font-family:Roboto,Arial,sans-serif;max-width:720px;margin:0 auto;padding:24px"><h1>${esc(h1)}</h1>${body}</main></div>`);
  return h;
}

export async function prerender(root, dist) {
  const seo = await import(pathToFileURL(path.join(root, 'src/seo-data.js')).href);
  const { SEO_BY_ID, BASE_URL, HOME_TITLE, HOME_DESC, seoTitle, toolUrl, pageUrl } = seo;
  const { CONTENT_BY_ID, CONTENT_UPDATED } = await import(pathToFileURL(path.join(root, 'src/content.js')).href);
  const { CONTENT_MORE } = await import(pathToFileURL(path.join(root, 'src/content-more.js')).href);
  const ALL_GUIDES = { ...CONTENT_BY_ID, ...CONTENT_MORE };
  // Guide paragraphs can link to other tools with [[id|label]] tokens.
  const linkify = (x) => {
    const parts = x.split(/\[\[([a-z0-9]+)\|([^\]]+)\]\]/);
    let out = '';
    for (let i = 0; i < parts.length; i++) {
      if (i % 3 === 0) out += esc(parts[i]);
      else if (i % 3 === 1) { const s = SEO_BY_ID[parts[i]]; out += s ? `<a href="/tools/${s.slug}/">${esc(parts[i + 1])}</a>` : esc(parts[i + 1]); }
    }
    return out;
  };
  const guide = (id) => (ALL_GUIDES[id] || []).map((s) => `<h2>${esc(s.h)}</h2>` + s.p.map((x) => `<p>${linkify(x)}</p>`).join('') + (s.table ? `<div style="overflow-x:auto"><table><tr>${s.table.head.map((c) => `<th>${esc(c)}</th>`).join('')}</tr>${s.table.rows.map((r) => `<tr>${r.map((c) => `<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</table></div>` : '')).join('');
  // Default calculator result, rendered as plain text in the static HTML so
  // crawlers see the result without JavaScript. Figures are verified from the
  // same slabs the calculator uses: Rs 150,000/mo is Rs 1,800,000 a year,
  // tax Rs 72,000 a year (Rs 6,000 a month), take-home Rs 144,000 a month,
  // effective rate 4%, Slab 3 at 11%.
  const DEFAULT_RESULT = {
    salarytax: '<h2>Calculator result: Rs 150,000 a month</h2><p>Monthly salary Rs 150,000: monthly tax Rs 6,000, monthly take-home Rs 144,000, yearly tax Rs 72,000. Effective rate 4%. Slab 3: Rs 1,200,001-2,200,000 at 11%.</p>',
  };
  const tpl = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
  const titles = readTitles(fs.readFileSync(path.join(root, 'src/App.jsx'), 'utf8'));
  const write = (rel, html) => { const f = path.join(dist, rel, 'index.html'); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, html); };
  // "More free tools" links use the display title (no country name), so the
  // static HTML shows the same clean titles the visitor sees in the app.
  // Per-page topical lists where one is defined (salarytax: tax tools only);
  // every other page keeps the full list, as before.
  const TOPICAL_RELATED = { salarytax: ['bps', 'freelancer', 'taxslab', 'salarycalc', 'zakat', 'pta'] };
  const linksFor = (id) => '<h2>More free tools</h2><ul>' + (TOPICAL_RELATED[id] || Object.keys(SEO_BY_ID)).filter((i) => titles[i]).map((i) => `<li><a href="/tools/${SEO_BY_ID[i].slug}/">${esc(titles[i].display)}</a></li>`).join('') + '</ul><p><a href="/">All Kalkio tools</a></p>';
  const allLinks = linksFor(null);
  let n = 0;
  for (const [id, s] of Object.entries(SEO_BY_ID)) {
    const t = titles[id];
    if (!t || !t.title) continue; // never invent a title
    const faqs = s.faqs || [];
    const body = `<p>${esc(s.desc)}</p><p>Guide last updated ${esc(CONTENT_UPDATED)}.</p>` + (DEFAULT_RESULT[id] || '') + guide(id) + (faqs.length ? '<h2>Common questions</h2>' + faqs.map(([q, a]) => `<h3>${esc(q)}</h3><p>${esc(a)}</p>`).join('') : '') + linksFor(id);
    const jsonld = faqs.length ? { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) } : null;
    write(`tools/${s.slug}`, page(tpl, { title: seoTitle(t.title), desc: s.desc, url: toolUrl(s.slug), h1: t.display, body, jsonld }));
    n++;
  }
  const statics = [
    ['about', 'About | Kalkio', 'About Kalkio', 'About Kalkio: 56 free calculators and converters that run in your browser. No sign-up, no accounts.'],
    ['contact', 'Contact | Kalkio', 'Contact Kalkio', 'Contact Kalkio by email. Tools run in your browser and no sign-up is needed.'],
    ['privacy', 'Privacy Policy | Kalkio', 'Privacy Policy', 'Kalkio privacy: tools run in your browser, file converters do not upload your files to a server, and no account is needed.'],
  ];
  for (const [p, title, h1, desc] of statics) { write(p, page(tpl, { title, desc, url: pageUrl(`/${p}/`), h1, body: `<p>${esc(desc)}</p><p><a href="/">All Kalkio tools</a></p>` })); n++; }
  // Home page: intro + FAQ + all 56 tool links in the raw HTML, so crawlers see it
  // without JavaScript (same words as the live home page in src/App.jsx).
  const homeFaqs = [['Are the tools free?', 'Yes. All 56 tools are free and no sign-up is needed.'], ['Does my data leave my device?', 'No. Every tool runs in your browser and does not ask you to create an account.'], ['Are tax results official?', 'No. Tax, bill and fuel results are estimates. Confirm official rates before a financial decision.']];
  const homeBody = `<p><img src="/images/hero.webp" alt="A large calculator on a bright desk" width="1440" height="960" loading="eager"></p><p>${esc(HOME_DESC)}</p><p>Free calculators and converters, including loan EMI, QR codes, BMI, GTA 6 price and file converters, plus Marla, salary tax, PTA tax, BPS, Zakat, gold and fuel tools. Everything runs in your browser.</p><p>Last updated 13 Nov 2026.</p><h2>Common questions</h2>` + homeFaqs.map(([q, a]) => `<h3>${esc(q)}</h3><p>${esc(a)}</p>`).join('') + allLinks + `<p><a href="/about/">About</a> · <a href="/contact/">Contact</a> · <a href="/privacy/">Privacy Policy</a> · <a href="mailto:sammykhanmalng@gmail.com">sammykhanmalng@gmail.com</a></p>`;
  const homeJsonld = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: homeFaqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) };
  write('', page(tpl, { title: HOME_TITLE, desc: HOME_DESC, url: pageUrl('/'), h1: '56 free calculators and converters.', body: homeBody, jsonld: homeJsonld }));
  n++;
  return n;
}

export default function prerenderPlugin() {
  let root = process.cwd(); let outDir = 'dist';
  return {
    name: 'kalkio-prerender',
    apply: 'build',
    configResolved(c) { root = c.root; outDir = path.resolve(c.root, c.build.outDir); },
    async closeBundle() { const n = await prerender(root, outDir); console.log(`kalkio-prerender: wrote ${n} static pages`); },
  };
}
