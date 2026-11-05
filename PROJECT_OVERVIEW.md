# Kalkio - Project Overview (read this first)

## What this is
Kalkio is a free tools website. People come, use a calculator or converter, and
leave. No sign-up, no accounts, no backend, no database. Every tool runs fully
in the visitor's browser (React). The site earns money later through ads
(AdSense, NOT applied yet) and affiliate links on the owner's other site.

- Live site: https://kalkio.vercel.app/ (old domain https://pakistan-tools.vercel.app/ still works, same project)
- GitHub repo (public, main branch): https://github.com/MubashirNoor7/pakistan-tools
- Vercel project: `kalkio`, team `mncreative`, Vite preset, build `npm run build`, output `dist`
- Owner: Sammy. GitHub + Vercel + Google accounts are on his university Gmail
  24pwbcs1170@uetpeshawar.edu.pk. Contact email shown on the site:
  sammykhanmalng@gmail.com

## Tech stack
React 19 + Vite + Material UI (MUI) v6. No router library (a tiny pathname
router lives in `src/App.jsx`). No server code. `vercel.json` rewrites all
routes to `index.html` so per-tool URLs work.

Run it: `npm install` then `npm run dev` (local) / `npm run build` (production).
Deploy: upload changed files to GitHub via the browser (this VM has no git
push); Vercel auto-deploys on commit. Verify live after every deploy.

## File map
- `index.html` - page shell, title/meta, GA4 tag, favicon link, Search Console verification meta tag
- `src/App.jsx` - the whole layout + routing + all tool definitions + categories + footer. READ THIS FIRST.
- `src/seo-data.js` - single source of SEO truth: per-tool slug, description, FAQs; home title/description; `BASE_URL`
- `src/rates.js` + `public/rates.json` - fuel rates (petrol/diesel, OGRA notified) + gold defaults used by tools
- `src/tools/property.jsx` - Marla, Kanal, Plot Size, Rent vs Buy, Area
- `src/tools/tax.jsx` - Salary Tax, BPS, PTA, Freelancer, Zakat, Tax Slab
- `src/tools/utility.jsx` - Fuel Trip, HEIC, AVIF, WebP converters
- `src/tools/newtools.jsx` - Gold, Prize Bond, JPG to PDF, Fuel Average, Currency
- `src/tools/globaltools.jsx` - Loan EMI, Mortgage, QR, BMI, Age, Percentage, Word Counter, Password, CGPA, PNG to JPG, PDF to JPG
- `src/tools/countrytools.jsx` - Salary Calc, SIP, Date/Days, Area, Home Loan, Unit Converter, Font, Love, Attendance, Car Loan
- `src/tools/htmltovideo.jsx` - HTML to Video (html2canvas + MediaRecorder, outputs .webm, NOT .mp4)
- `src/tools/iptool.jsx` - What's My IP (fetches ipapi.co, falls back to api.ipify.org)
- `public/sitemap.xml` - 46 URLs (home + 42 tools + About/Contact/Privacy)
- `public/favicon.svg`, `public/google55b029916ea29a4f.html` - favicon + Search Console verification file. NEVER remove the verification file or the meta tag.
- `public/llms.txt`, `public/robots.txt` - crawler info
- `README.md` - short public readme

## The 42 tools and their 6 categories (every tool in exactly one category)
- Home & Property (5): Marla, Kanal, Plot Size, Rent vs Buy, Area
- Money & Tax (12): Salary Tax, BPS, PTA, Freelancer, Tax Slab, Zakat, Loan EMI, Mortgage, Home Loan, Car Loan, SIP, Salary Calc
- Prices & Fuel (5): Gold 1 Tola, Prize Bond, Currency, Fuel Trip, Fuel Average
- Files & converters (9): JPG to PDF, PDF to JPG, PNG to JPG, HEIC, AVIF, WebP, QR, Unit Converter, HTML to Video
- Everyday tools (9): Age, BMI, Percentage, Word Counter, Date, Password, CGPA, Attendance, What's My IP
- Fun & Entertainment (2): Love Calculator (labelled FOR FUN ONLY), Font/Stylish Text

"Most popular" (home shortcut, 8 tools): JPG to PDF, Loan EMI, Age, BMI,
Mortgage, Marla, PTA, Currency - chosen from Google Trends evidence.

## Layout (important - a real bug was fixed here, 5 Nov 2026)
The layout is a 3-pane CSS grid, built with a plain `Box` (`display: grid`,
`gridTemplateColumns: 300px minmax(0, 1fr) 280px` on desktop, one column on
phones). Left = tools of the selected category + search. Center = the selected
tool (or the home page). Right = Kalkio logo + all category names. Sidebars
are sticky on desktop. On phones the tool comes FIRST, then categories, then
the tools list.

DO NOT switch this back to MUI `Grid`. The installed MUI `Grid` is the legacy
v1 component: it reads `xs`/`md` props and silently IGNORES the `size` prop.
The site previously used `size={{ xs: 12, md: 3 }}` and the three panes sized
by content instead of columns - the center wrapped below the long left
sidebar, so a clicked tool opened below the fold and the page looked
squeezed/mixed. That is exactly what the plain CSS grid fixes. `minWidth: 0`
on each grid child is also required (prevents content from blowing the
columns out).

## SEO, Search Console, Analytics (done 5 Nov 2026)
- Google Search Console property https://kalkio.vercel.app/ VERIFIED (HTML file
  + meta tag both in place, never remove). Sitemap submitted, status Success,
  44 pages discovered at submission (now 46 URLs in the sitemap).
- GA4 property "Kalkio", Measurement ID G-3EPG6P6KC5, tag in index.html, data
  collection on. Sammy only wants to SEE the data himself; do not move the
  property to another account.
- Per-tool pages: `/tools/<slug>/`, per-tool title (format "Tool title | Kalkio",
  under 60 chars), meta description, canonical, FAQ JSON-LD (set by JS).
- Tool titles still contain the word "Pakistan" on purpose (people search
  "Marla Pakistan", "PTA Pakistan"). Category names have NO country name.
  Only remove "Pakistan" from titles if Sammy explicitly insists.
- Live does NOT mean traffic. Google indexing takes days to weeks. Never
  promise a ranking or a page-1 position.

## Fuel rates (OGRA, Pakistan)
Current (5 Nov 2026, two agreeing published sources): petrol Rs 362.00/L,
diesel Rs 387.81/L. History: 3 Nov 374.51/395.20, 4 Nov 369.06/391.52.
Rates live in `public/rates.json` + `src/rates.js` (with `fuelUpdated` date).
A daily cron checks OGRA rates each morning; if they change, update both
files, rebuild, verify, and tell Sammy in Roman Urdu. Never invent a rate.
Other verified facts in the code: FBR 2026-27 salary slabs, PTA fixed rupee
bands (SRO 1064(I)/2026), freelancer tax (Filer+PSEB 0.25%), BPS 2026 basic
pays, prize-bond withholding 15% filer / 30% non-filer.

## Rules the owner set (do not break these)
- Explanations to Sammy in very simple words (Roman Urdu), like explaining to
  a small child. Short, decision-ready answers. Do the work yourself; report
  only the result, no step lists.
- NEVER invent a price, title, rate, specification or number to fill a gap.
- NEVER use an em dash (-) or en dash (-) anywhere on the site; use a hyphen (-).
- MUI is the locked UI direction. Design must look professional (Apple/Meta
  calibre), clean, minimal text, easy to use.
- Tools are browser-only and private: no uploads to a server, no sign-up.
  MP4/MOV video converters are NOT built (need a server). YouTube/Instagram
  downloaders and AI writing tools are EXCLUDED (AdSense/cost risk).
- HTML to Video outputs .webm only. Say so on the tool; true .mp4 needs a server.
- One site, one feature in one place. Change the minimum files. Build must
  pass (`npm run build`) before any deploy. Verify live after every deploy.
- The owner's other project TechDealsGo (techdealsgo.com) is SEPARATE. Its
  Pinterest domain is blocked and its claim failed ("already claimed by another
  user") - that is a different problem, do not mix it into Kalkio work.

## Pending / not done yet (as of 5 Nov 2026, evening)
- Deploy the CSS-grid layout fix (built + measured locally, build PASS) after
  the running HTML-to-Video + What's My IP deploy finishes. Then verify live:
  tool page shows all three panes side by side, tool visible without scrolling.
- Sammy's verdict pending: remove "Pakistan" from tool titles or keep it.
- AdSense application: NOT started (needs the site live + some traffic first).
- kalkio.com domain: NOT bought (needs payment approval).
- Real-file tests still untested: a real iPhone HEIC photo and a real AVIF file
  through the converters.
- HTML to Video: live click-through test of the Record button still pending
  (the running deploy is supposed to do it).

## Pre-rendering (added 5 Nov 2026)
`prerender-plugin.mjs` (loaded in `vite.config.js`) writes a static HTML file per route into `dist/` after every build
(`dist/tools/<slug>/index.html`, about, contact, privacy) with real title, description, canonical, H1, text and FAQ JSON-LD
in the raw HTML. Titles are read from the TOOLS list in `src/App.jsx` - the reader handles both single- and double-quoted
titles (the What's My IP title uses double quotes because of its apostrophe). Every tool except Marla now also shows its
FAQ on the page (schema must match visible text). Unknown routes set robots noindex. Verify after deploy: open
view-source of a tool URL and look for the H1 and <title>.

## Written guides (added 5 Nov 2026)
`src/content.js` holds guide text + tables for Salary Tax, PTA, Freelancer 154A, BPS and Zakat. It shows under the calculator
and is also written into the pre-rendered HTML. Rule: only figures already in the tool code, or computed from it. All
figures in this batch were checked against the tool code on 5 Nov 2026 (slabs, PTA bands, freelancer rates, BPS grades,
Zakat nisab and examples). Add more tools by adding an entry keyed by tool id. Bug fixed: Gold tool "10 gram" unit was
10x too low (now q * 10 / 11.664).

## Growth additions (added 5 Nov 2026, later)
- Guides added for Gold, Fuel Trip, Fuel Average (no stale rates; examples say "not today's rate").
- WhatsApp share button + "More free tools" links on every tool page; pre-rendered HTML lists all tool links.
- `public/og.png` (1200x630) + og:image/twitter tags in `index.html` so shared links show a preview card.

## v4 (5 Nov 2026): guides for ALL 42 tools
`src/content-more.js` (merged into `src/content.js`) now holds guide text for every tool, so every tool page has real written content.
Bug fixes: Gold "10 gram" unit was 10x too low; Password generator had a small modulo bias and no length cap (now fixed, length 1 to 128).
Sitemap lastmod set to 2026-11-05 for all URLs.
