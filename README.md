# Pakistan Tools — 40 free tools, no sign-up

A static React + Vite + MUI website. Every tool runs in the visitor's browser —
there is no backend, no database, no login and no upload. File converters
(HEIC/AVIF/WebP/PNG/JPG/PDF) also run fully in the browser.

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
   be added later; it is not required.

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
