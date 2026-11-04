# Kalkio — 40 free tools, no sign-up

A static React + Vite + MUI website. Every tool runs in the visitor's browser —
there is no backend, no database, no login and no upload. File converters
(HEIC/AVIF/WebP/PNG/JPG/PDF) also run fully in the browser.

Brand: Kalkio (renamed from Pakistan Tools, 4 Nov 2026). Target address:
https://kalkio.vercel.app/ (to be confirmed at Vercel rename).

## SEO (client-rendered SPA)
- Each tool has its own URL: `/tools/<slug>/`, plus `/about/`, `/contact/`,
  `/privacy/`. Home links are real `<a href>` links; a tiny pathname router
  (no new dependency) renders the tool, sets document title / meta description /
  canonical, and injects FAQ JSON-LD per tool page. Unknown slugs show a
  "Tool not found" page, not a crash.
- `public/sitemap.xml` (44 URLs: home + 40 tools + 3 pages),
  `public/robots.txt`, `public/llms.txt` are generated from `src/seo-data.js`
  and the TOOLS list in `src/App.jsx` by `/tmp/gen-seo.mjs` — regenerate them
  if a tool title or slug changes.
- `vercel.json` rewrites every route to `/index.html` so clean URLs work on
  Vercel (it lives at the project root and is NOT copied into `dist/`).
- Note: titles/descriptions/canonicals are set by JavaScript after load, so
  they are visible to JS-capable crawlers (including Google) but not in the
  raw static HTML. If server-rendered meta is ever needed, that is a separate
  step (e.g. pre-rendering), not part of this build.

## Run locally
```
npm install
npm run dev        # or: npm run build && npm run preview
```

## Deploy free (GitHub + Vercel)
1. Push this folder to a **public GitHub repo** (free).
2. On [vercel.com](https://vercel.com) (free Hobby plan), **Add New → Project →
   Import** that repo. Vercel auto-detects Vite: build command `npm run build`,
   output directory `dist`. No environment variables needed.
3. Vercel gives a free address like `your-site.vercel.app`. A custom domain can
   be added later; it is not required. For this site the target is the rename
   to `kalkio.vercel.app`, then Search Console verification + sitemap submit
   (see SEO_BUILD_REPORT.md for the exact remaining steps — none of that is
   done by this build).

## Updating fuel rates (no rebuild needed)
`public/rates.json` holds the OGRA petrol/diesel defaults used by the Fuel
tools. Editing that one file on the live site updates every visitor. The Fuel
tool also warns visitors when the rate is more than 15 days old.

## Notes
- Tax/PTA/electricity/fuel tools are **estimates** with editable rates and
  on-page disclaimers; official rates (FBR, OGRA, NEPRA, DIRBS) are final.
- Salary Calculator is generic: users enter their own tax rate. No country's
  tax bands are hard-coded.
- Love Calculator is entertainment only. Passwords and QR codes are generated
  locally and never sent anywhere.
