import React, { useState, useEffect, Suspense, lazy } from 'react';
import { AppBar, Toolbar, Typography, Container, Card, CardContent, Box, TextField, Button, Accordion, AccordionSummary, AccordionDetails, Table, TableBody, TableRow, TableCell, CssBaseline, Link, CircularProgress, InputAdornment, IconButton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CalculateIcon from '@mui/icons-material/Calculate';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { fmt } from './tools/shared.jsx';
// Tool components load on demand (one small chunk per module) so the home page
// never downloads calculator code the visitor has not opened yet.
const MarlaTool = lazy(() => import('./tools/property.jsx').then((m) => ({ default: m.MarlaTool })));
const KanalTool = lazy(() => import('./tools/property.jsx').then((m) => ({ default: m.KanalTool })));
const PlotSizeTool = lazy(() => import('./tools/property.jsx').then((m) => ({ default: m.PlotSizeTool })));
const SalaryTaxTool = lazy(() => import('./tools/tax.jsx').then((m) => ({ default: m.SalaryTaxTool })));
const BpsTool = lazy(() => import('./tools/tax.jsx').then((m) => ({ default: m.BpsTool })));
const PtaTool = lazy(() => import('./tools/tax.jsx').then((m) => ({ default: m.PtaTool })));
const FreelancerTool = lazy(() => import('./tools/tax.jsx').then((m) => ({ default: m.FreelancerTool })));
const ZakatTool = lazy(() => import('./tools/tax.jsx').then((m) => ({ default: m.ZakatTool })));
const FuelTool = lazy(() => import('./tools/utility.jsx').then((m) => ({ default: m.FuelTool })));
const PetrolPriceTool = lazy(() => import('./tools/utility.jsx').then((m) => ({ default: m.PetrolPriceTool })));
const Gta6PriceTool = lazy(() => import('./tools/gta.jsx').then((m) => ({ default: m.Gta6PriceTool })));
const Gta6DownloadTool = lazy(() => import('./tools/gta.jsx').then((m) => ({ default: m.Gta6DownloadTool })));
const Gta6CountdownTool = lazy(() => import('./tools/gta.jsx').then((m) => ({ default: m.Gta6CountdownTool })));
const Gta6PcCheckTool = lazy(() => import('./tools/gta.jsx').then((m) => ({ default: m.Gta6PcCheckTool })));
const Gta6TotalCostTool = lazy(() => import('./tools/gta.jsx').then((m) => ({ default: m.Gta6TotalCostTool })));
const Gta6PreorderTool = lazy(() => import('./tools/gta.jsx').then((m) => ({ default: m.Gta6PreorderTool })));
const Gta6StorageTool = lazy(() => import('./tools/gta.jsx').then((m) => ({ default: m.Gta6StorageTool })));
const Gta6NzTrickTool = lazy(() => import('./tools/gta.jsx').then((m) => ({ default: m.Gta6NzTrickTool })));
const Gta6PcDateTool = lazy(() => import('./tools/gta.jsx').then((m) => ({ default: m.Gta6PcDateTool })));
const HeicTool = lazy(() => import('./tools/utility.jsx').then((m) => ({ default: m.HeicTool })));
const WebpTool = lazy(() => import('./tools/utility.jsx').then((m) => ({ default: m.WebpTool })));
const RentVsBuyTool = lazy(() => import('./tools/newtools.jsx').then((m) => ({ default: m.RentVsBuyTool })));
const TaxSlabTool = lazy(() => import('./tools/newtools.jsx').then((m) => ({ default: m.TaxSlabTool })));
const GoldTool = lazy(() => import('./tools/newtools.jsx').then((m) => ({ default: m.GoldTool })));
const PrizeBondTool = lazy(() => import('./tools/newtools.jsx').then((m) => ({ default: m.PrizeBondTool })));
const JpgToPdfTool = lazy(() => import('./tools/newtools.jsx').then((m) => ({ default: m.JpgToPdfTool })));
const FuelAverageTool = lazy(() => import('./tools/newtools.jsx').then((m) => ({ default: m.FuelAverageTool })));
const CurrencyTool = lazy(() => import('./tools/newtools.jsx').then((m) => ({ default: m.CurrencyTool })));
const LoanEmiTool = lazy(() => import('./tools/globaltools.jsx').then((m) => ({ default: m.LoanEmiTool })));
const MortgageTool = lazy(() => import('./tools/globaltools.jsx').then((m) => ({ default: m.MortgageTool })));
const QrTool = lazy(() => import('./tools/globaltools.jsx').then((m) => ({ default: m.QrTool })));
const BmiTool = lazy(() => import('./tools/globaltools.jsx').then((m) => ({ default: m.BmiTool })));
const AgeTool = lazy(() => import('./tools/globaltools.jsx').then((m) => ({ default: m.AgeTool })));
const PercentageTool = lazy(() => import('./tools/globaltools.jsx').then((m) => ({ default: m.PercentageTool })));
const WordCounterTool = lazy(() => import('./tools/globaltools.jsx').then((m) => ({ default: m.WordCounterTool })));
const PasswordTool = lazy(() => import('./tools/globaltools.jsx').then((m) => ({ default: m.PasswordTool })));
const CgpaTool = lazy(() => import('./tools/globaltools.jsx').then((m) => ({ default: m.CgpaTool })));
const PngToJpgTool = lazy(() => import('./tools/globaltools.jsx').then((m) => ({ default: m.PngToJpgTool })));
const PdfToJpgTool = lazy(() => import('./tools/globaltools.jsx').then((m) => ({ default: m.PdfToJpgTool })));
const SalaryCalcTool = lazy(() => import('./tools/countrytools.jsx').then((m) => ({ default: m.SalaryCalcTool })));
const SipTool = lazy(() => import('./tools/countrytools.jsx').then((m) => ({ default: m.SipTool })));
const DateCalcTool = lazy(() => import('./tools/countrytools.jsx').then((m) => ({ default: m.DateCalcTool })));
const AreaCalcTool = lazy(() => import('./tools/countrytools.jsx').then((m) => ({ default: m.AreaCalcTool })));
const HomeLoanTool = lazy(() => import('./tools/countrytools.jsx').then((m) => ({ default: m.HomeLoanTool })));
const UnitConverterTool = lazy(() => import('./tools/countrytools.jsx').then((m) => ({ default: m.UnitConverterTool })));
const LoveTool = lazy(() => import('./tools/countrytools.jsx').then((m) => ({ default: m.LoveTool })));
const AttendanceTool = lazy(() => import('./tools/countrytools.jsx').then((m) => ({ default: m.AttendanceTool })));
const CarLoanTool = lazy(() => import('./tools/countrytools.jsx').then((m) => ({ default: m.CarLoanTool })));
const HtmlToVideoTool = lazy(() => import('./tools/htmltovideo.jsx').then((m) => ({ default: m.HtmlToVideoTool })));
const WhatsMyIpTool = lazy(() => import('./tools/iptool.jsx').then((m) => ({ default: m.WhatsMyIpTool })));
// Preload a tool's chunk on hover/focus so the tool opens without the
// "Loading calculator..." wait. The import is cached, so React.lazy reuses
// the same chunk - the home page still downloads nothing up front.
const MODULE_LOADERS = {
  property: () => import('./tools/property.jsx'),
  tax: () => import('./tools/tax.jsx'),
  utility: () => import('./tools/utility.jsx'),
  gta: () => import('./tools/gta.jsx'),
  newtools: () => import('./tools/newtools.jsx'),
  globaltools: () => import('./tools/globaltools.jsx'),
  countrytools: () => import('./tools/countrytools.jsx'),
  htmltovideo: () => import('./tools/htmltovideo.jsx'),
  iptool: () => import('./tools/iptool.jsx'),
};
const TOOL_MODULE = {
  marla: 'property', kanal: 'property', plotsize: 'property',
  salarytax: 'tax', bps: 'tax', pta: 'tax', freelancer: 'tax', zakat: 'tax',
  fuel: 'utility', petrolprice: 'utility', heic: 'utility', webp: 'utility',
  gta6price: 'gta', gta6download: 'gta', gta6countdown: 'gta', gta6pccheck: 'gta', gta6totalcost: 'gta', gta6preorder: 'gta', gta6storage: 'gta', gta6nztick: 'gta', gta6pcdate: 'gta',
  rentvsbuy: 'newtools', taxslab: 'newtools', gold: 'newtools', prizebond: 'newtools', jpgtopdf: 'newtools', fuelavg: 'newtools', currency: 'newtools',
  loanemi: 'globaltools', mortgage: 'globaltools', qr: 'globaltools', bmi: 'globaltools', age: 'globaltools', percentage: 'globaltools', wordcounter: 'globaltools', password: 'globaltools', cgpa: 'globaltools', pngtojpg: 'globaltools', pdftojpg: 'globaltools',
  salarycalc: 'countrytools', sip: 'countrytools', datecalc: 'countrytools', areacalc: 'countrytools', homeloan: 'countrytools', unitconv: 'countrytools', love: 'countrytools', attendance: 'countrytools', carloan: 'countrytools',
  htmltovideo: 'htmltovideo', whatsmyip: 'iptool',
};
const preloadedModules = new Set();
function preloadTool(id) {
  const mod = TOOL_MODULE[id];
  if (!mod || preloadedModules.has(mod)) return;
  preloadedModules.add(mod);
  MODULE_LOADERS[mod]().catch(() => {});
}
import { CONTENT_UPDATED, loadGuide } from './content.js';
import { SEO_BY_ID, BASE_URL, HOME_TITLE, HOME_DESC, seoTitle, toolUrl, pageUrl } from './seo-data.js';

const TOOLS = [
  { id: 'marla', title: 'Marla to Sq Ft Converter Pakistan (2026)', display: 'Marla to Sq Ft Converter (2026)', cat: 'Property', Component: MarlaTool },
  { id: 'kanal', title: 'Kanal to Marla Converter Pakistan', display: 'Kanal to Marla Converter', cat: 'Property', Component: KanalTool },
  { id: 'plotsize', title: 'Plot Size Calculator: Length × Width to Marla', cat: 'Property', Component: PlotSizeTool },
  { id: 'salarytax', title: 'Pakistan Salary Tax Calculator 2026-27', display: 'Salary Tax Calculator 2026-27', cat: 'Tax & salary', Component: SalaryTaxTool },
  { id: 'bps', title: 'BPS Salary Calculator Pakistan 2026-27', display: 'BPS Salary Calculator 2026-27', cat: 'Tax & salary', Component: BpsTool },
  { id: 'pta', title: 'PTA Tax Calculator Pakistan by Phone Model', display: 'PTA Tax Calculator by Phone Model', cat: 'Tax & salary', Component: PtaTool },
  { id: 'freelancer', title: 'Freelancer Tax Calculator Pakistan (154A, PSEB 0.25%)', display: 'Freelancer Tax Calculator (154A)', cat: 'Tax & salary', Component: FreelancerTool },
  { id: 'zakat', title: 'Zakat Calculator Pakistan 2026: Cash, Gold', display: 'Zakat Calculator 2026: Cash, Gold', cat: 'Tax & salary', Component: ZakatTool },
  { id: 'fuel', title: 'Fuel Trip Cost Calculator Pakistan (OGRA)', display: 'Fuel Trip Cost Calculator (OGRA)', cat: 'Utility', Component: FuelTool },
  { id: 'petrolprice', title: 'Petrol Price Pakistan Today: Petrol & Diesel Rates', display: 'Petrol Price Today: Petrol & Diesel Rates', cat: 'Prices', Component: PetrolPriceTool },
  { id: 'gta6price', title: 'How Much Is GTA 6? Price in USA & Canada', display: 'How Much Is GTA 6?', cat: 'Gaming', Component: Gta6PriceTool },
  { id: 'gta6download', title: 'GTA 6 Download Time Calculator (212 GB)', display: 'GTA 6 Download Time Calculator', cat: 'Gaming', Component: Gta6DownloadTool },
  { id: 'gta6countdown', title: 'GTA 6 Countdown: Release Date & Unlock Time', display: 'GTA 6 Countdown', cat: 'Gaming', Component: Gta6CountdownTool },
  { id: 'gta6pccheck', title: 'Can My PC Run GTA 6? System Requirements Checker', display: 'Can My PC Run GTA 6?', cat: 'Gaming', Component: Gta6PcCheckTool },
  { id: 'gta6totalcost', title: 'GTA 6 Total Cost: Console + Game Price', display: 'GTA 6 Total Cost', cat: 'Gaming', Component: Gta6TotalCostTool },
  { id: 'gta6preorder', title: 'GTA 6 Pre-Order: Editions, Price & Dates', display: 'GTA 6 Pre-Order: Editions & Dates', cat: 'Gaming', Component: Gta6PreorderTool },
  { id: 'gta6storage', title: 'Will GTA 6 Fit on My Console? Storage Checker', display: 'Will GTA 6 Fit on My Console?', cat: 'Gaming', Component: Gta6StorageTool },
  { id: 'gta6nztick', title: 'GTA 6 New Zealand Trick: Play Up to 19 Hours Early', display: 'Play GTA 6 Early: New Zealand Trick', cat: 'Gaming', Component: Gta6NzTrickTool },
  { id: 'gta6pcdate', title: 'GTA 6 PC Release Date: Reported Q1 2027 Window', display: 'GTA 6 on PC: When?', cat: 'Gaming', Component: Gta6PcDateTool },
  { id: 'heic', title: 'HEIC to JPG Converter Online (Free, Private)', cat: 'Files - private', Component: HeicTool },
  { id: 'webp', title: 'WebP to JPG Converter Online Free', cat: 'Files - private', Component: WebpTool },
  { id: 'rentvsbuy', title: 'Rent vs Buy Calculator Pakistan', display: 'Rent vs Buy Calculator', cat: 'Property', Component: RentVsBuyTool },
  { id: 'taxslab', title: 'FBR Pakistan Tax Slab 2026-27: Which Slab Are You In?', display: 'FBR Tax Slab 2026-27: Which Slab Are You In?', cat: 'Tax & salary', Component: TaxSlabTool },
  { id: 'gold', title: 'Gold Price Pakistan Today: 1 Tola Calculator', display: 'Gold Price Today: 1 Tola Calculator', cat: 'Prices', Component: GoldTool },
  { id: 'prizebond', title: 'Prize Bond Pakistan: Prize After Tax Calculator', display: 'Prize Bond: Prize After Tax Calculator', cat: 'Prices', Component: PrizeBondTool },
  { id: 'jpgtopdf', title: 'JPG to PDF Converter Online (Free, Private)', cat: 'Files - private', Component: JpgToPdfTool },
  { id: 'fuelavg', title: 'Fuel Average Calculator Pakistan (km per litre)', display: 'Fuel Average Calculator (km per litre)', cat: 'Utility', Component: FuelAverageTool },
  { id: 'currency', title: 'Currency Converter: USD to PKR & More', cat: 'Prices', Component: CurrencyTool },
  { id: 'loanemi', title: 'Loan EMI Calculator', cat: 'Finance - global', Component: LoanEmiTool },
  { id: 'mortgage', title: 'Mortgage Calculator: How Much House Can I Afford?', cat: 'Finance - global', Component: MortgageTool },
  { id: 'qr', title: 'QR Code Generator (Free, Private)', cat: 'Tools - global', Component: QrTool },
  { id: 'bmi', title: 'BMI Calculator', cat: 'Health - global', Component: BmiTool },
  { id: 'age', title: 'Age Calculator (Date of Birth)', cat: 'Tools - global', Component: AgeTool },
  { id: 'percentage', title: 'Percentage Calculator', cat: 'Tools - global', Component: PercentageTool },
  { id: 'wordcounter', title: 'Word Counter & Character Counter', cat: 'Tools - global', Component: WordCounterTool },
  { id: 'password', title: 'Password Generator (Secure, Private)', cat: 'Tools - global', Component: PasswordTool },
  { id: 'cgpa', title: 'CGPA Calculator (4.0 Scale)', cat: 'Study - global', Component: CgpaTool },
  { id: 'pngtojpg', title: 'PNG to JPG Converter Online (Free, Private)', cat: 'Files - global', Component: PngToJpgTool },
  { id: 'pdftojpg', title: 'PDF to JPG Converter Online (Free, Private)', cat: 'Files - global', Component: PdfToJpgTool },
  { id: 'salarycalc', title: 'Salary Calculator (Net Salary After Tax)', cat: 'Finance - global', Component: SalaryCalcTool },
  { id: 'sip', title: 'SIP Calculator (Monthly Investment + Step-up)', cat: 'Finance - India/global', Component: SipTool },
  { id: 'datecalc', title: 'Date Calculator: Days Between Dates & Weekday', cat: 'Tools - global', Component: DateCalcTool },
  { id: 'areacalc', title: 'Area Calculator (Room & Land Area)', cat: 'Tools - global', Component: AreaCalcTool },
  { id: 'homeloan', title: 'Home Loan Calculator (EMI + Total Interest)', cat: 'Finance - global', Component: HomeLoanTool },
  { id: 'unitconv', title: 'Unit Converter: Length, Weight & Temperature', cat: 'Tools - global', Component: UnitConverterTool },
  { id: 'love', title: 'Love Calculator (For Fun Only)', cat: 'Fun - global', Component: LoveTool },
  { id: 'attendance', title: 'Attendance Calculator (Students)', cat: 'Study - global', Component: AttendanceTool },
  { id: 'carloan', title: 'Car Loan Calculator (EMI + Total Interest)', cat: 'Finance - global', Component: CarLoanTool },
  { id: 'htmltovideo', title: 'HTML to Video & MP4 Converter Online (Code to Video)', cat: 'Files & converters', Component: HtmlToVideoTool },
  { id: 'whatsmyip', title: "What's My IP Address? (IP, Location & ISP)", cat: 'Everyday tools', Component: WhatsMyIpTool },
];
// Attach SEO data (slug, description, FAQs) from the single source in seo-data.js.
// No tool component, formula or rate is changed here.
TOOLS.forEach((t) => { const s = SEO_BY_ID[t.id]; if (s) { t.slug = s.slug; t.desc = s.desc; t.faqs = s.faqs; } });

// Home-page grouping: every tool sits in exactly one category; Most Popular is a
// Home page FAQs, shown in the accordion and as FAQ schema (same three answers).
const HOME_FAQS = [['Are the tools free?', 'Yes. All 50 tools are free and no sign-up is needed.'], ['Does my data leave my device?', 'No. Every tool runs in your browser and does not ask you to create an account.'], ['Are tax results official?', 'No. Tax, bill and fuel results are estimates. Confirm official rates before a financial decision.']];

// shortcut list (Trends evidence: JPG to PDF, loan, age, BMI, mortgage strongest
// worldwide; Marla/PTA/currency strongest in Pakistan). Category names are generic
// on purpose - no country name in any category label. No tool, rate or formula
// is changed here - only how the home page lists them.
const BY_ID = Object.fromEntries(TOOLS.map((t) => [t.id, t]));
const CATEGORIES = [
  { name: 'Home & Property', ids: ['marla', 'kanal', 'plotsize', 'rentvsbuy', 'areacalc'] },
  { name: 'Money & Tax', ids: ['salarytax', 'bps', 'pta', 'freelancer', 'taxslab', 'zakat', 'loanemi', 'mortgage', 'homeloan', 'carloan', 'sip', 'salarycalc'] },
  { name: 'Prices & Fuel', ids: ['gold', 'prizebond', 'currency', 'fuel', 'petrolprice', 'fuelavg'] },
  { name: 'Files & converters', ids: ['jpgtopdf', 'pdftojpg', 'pngtojpg', 'heic', 'webp', 'qr', 'unitconv', 'htmltovideo'] },
  { name: 'Everyday tools', ids: ['age', 'bmi', 'percentage', 'wordcounter', 'datecalc', 'password', 'cgpa', 'attendance', 'whatsmyip'] },
  { name: 'Fun & Entertainment', ids: ['love'] },
  { name: 'Gaming', ids: ['gta6price', 'gta6download', 'gta6countdown', 'gta6pccheck', 'gta6totalcost', 'gta6preorder', 'gta6storage', 'gta6nztick', 'gta6pcdate'] },
].map((c) => ({ name: c.name, tools: c.ids.map((id) => BY_ID[id]).filter(Boolean) }));
// One emoji per category - used as a visual anchor in sidebars, lists and headings
// so the page is easier to scan. Emojis never go in page titles or H1s.
const CAT_EMOJI = { 'Home & Property': '🏠', 'Money & Tax': '💰', 'Prices & Fuel': '⛽', 'Files & converters': '📁', 'Everyday tools': '🧮', 'Fun & Entertainment': '🎉', 'Gaming': '🎮' };
const ID_TO_CAT = {};
CATEGORIES.forEach((c) => c.tools.forEach((t) => { ID_TO_CAT[t.id] = c.name; }));
// Per-page topical related lists - must match prerender-plugin.mjs TOPICAL_RELATED.
// A page with a list here shows exactly those links; every other page shows
// the first 4 tools from its own category.
const TOPICAL_RELATED = { salarytax: ['bps', 'freelancer', 'taxslab', 'salarycalc', 'zakat', 'pta'] };
const POPULAR = ['jpgtopdf', 'loanemi', 'age', 'bmi', 'mortgage', 'marla', 'pta', 'currency'].map((id) => BY_ID[id]).filter(Boolean);
// Tiny pathname router - no new dependency. Trailing slashes are ignored.
function parseRoute(pathname) {
  const p = (pathname.replace(/\/+$/, '') || '/');
  if (p === '/') return { kind: 'home' };
  if (p === '/about') return { kind: 'about' };
  if (p === '/contact') return { kind: 'contact' };
  if (p === '/privacy') return { kind: 'privacy' };
  const m = p.match(/^\/tools\/([a-z0-9-]+)$/);
  if (m) return { kind: 'tool', slug: m[1] };
  return { kind: 'notfound' };
}

function setMetaTag(name, content) {
  let el = document.querySelector(`meta[name="${name}"]`);
  if (!el) { el = document.createElement('meta'); el.setAttribute('name', name); document.head.appendChild(el); }
  el.setAttribute('content', content);
}
function setCanonical(href) {
  let el = document.querySelector('link[rel="canonical"]');
  if (!el) { el = document.createElement('link'); el.setAttribute('rel', 'canonical'); document.head.appendChild(el); }
  el.setAttribute('href', href);
}
function setFaqJsonLd(faqs) {
  const old = document.getElementById('kalkio-faq-jsonld');
  if (old) old.remove();
  if (!faqs || !faqs.length) return;
  const script = document.createElement('script');
  script.id = 'kalkio-faq-jsonld'; script.type = 'application/ld+json';
  script.textContent = JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) });
  document.head.appendChild(script);
}

// Visible title shown on the site (cards, H1, search). The full `title` (with a
// country word) is kept only for the SEO <title> tag, so Google still finds the
// tool for that country's searches. No country name shows on the website itself.
const showTitle = (t) => (t && t.display) || (t && t.title) || '';

// A tool as a card (home grids, search results, related tools). Plain CSS grid
// on purpose: the installed MUI Grid is legacy v1 and ignores the `size` prop.
function ToolCard({ t, go }) {
  const emoji = CAT_EMOJI[ID_TO_CAT[t.id]] || '🔧';
  return (<Card elevation={0} sx={{ height: '100%', transition: 'box-shadow 0.15s ease, transform 0.15s ease', '&:hover': { boxShadow: '0 6px 24px rgba(0,0,0,0.10)', transform: 'translateY(-2px)' } }}>
    <CardContent component="a" href={`/tools/${t.slug}/`} onClick={(e) => go(e, `/tools/${t.slug}/`)} onMouseEnter={() => preloadTool(t.id)} onFocus={() => preloadTool(t.id)} sx={{ display: 'block', textDecoration: 'none', color: 'inherit', height: '100%' }}>
      <Box sx={{ width: 44, height: 44, borderRadius: 3, bgcolor: '#E6F4F2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, mb: 1.5 }}>{emoji}</Box>
      <Typography fontWeight={700} sx={{ lineHeight: 1.35, minHeight: '2.7em', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{showTitle(t)}</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{ID_TO_CAT[t.id] || t.cat}</Typography>
    </CardContent>
  </Card>);
}

function ToolGrid({ tools, go, mdCols = 3 }) {
  return (<Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', md: `repeat(${mdCols}, minmax(0, 1fr))` } }}>{tools.map((t) => (<ToolCard key={t.id} t={t} go={go} />))}</Box>);
}

export default function App() {
  const [route, setRoute] = useState(() => parseRoute(window.location.pathname));
  const [q, setQ] = useState('');
  const [openCat, setOpenCat] = useState(null);
  const navigate = (path) => { if (window.location.pathname !== path) { window.history.pushState(null, '', path); setRoute(parseRoute(path)); } window.scrollTo(0, 0); };
  const go = (e, path) => { e.preventDefault(); navigate(path); };
  // Guide paragraphs can link to other tools with [[id|label]] tokens
  // (used by the salary-tax guide). Unknown ids render as plain text.
  const renderGuideText = (text) => {
    const parts = text.split(/\[\[([a-z0-9]+)\|([^\]]+)\]\]/);
    if (parts.length === 1) return text;
    const out = [];
    for (let i = 0; i < parts.length; i++) {
      if (i % 3 === 0) { if (parts[i]) out.push(parts[i]); }
      else if (i % 3 === 1) { const label = parts[i + 1]; const t = TOOLS.find((x) => x.id === parts[i]); out.push(t ? (<Link key={i} href={`/tools/${t.slug}/`} onClick={(e) => go(e, `/tools/${t.slug}/`)}>{label}</Link>) : label); }
    }
    return out;
  };
  const query = q.trim().toLowerCase();
  // Hyphens count as spaces when matching, so "pre order" finds "Pre-Order".
  const norm = (s) => s.toLowerCase().replace(/-/g, ' ');
  const searchResults = query ? TOOLS.filter((t) => norm(t.title + ' ' + t.cat).includes(norm(query))) : [];

  useEffect(() => {
    const onPop = () => setRoute(parseRoute(window.location.pathname));
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  // Once the home page is idle, preload the Most Popular tools' chunks so
  // the first tool a visitor opens appears instantly. Only on the home page,
  // and only after the browser is idle, so the first paint is untouched.
  useEffect(() => {
    if (route.kind !== 'home') return;
    const preloadPopular = () => POPULAR.forEach((t) => preloadTool(t.id));
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(preloadPopular, { timeout: 3000 });
      return () => window.cancelIdleCallback(id);
    }
    const timer = setTimeout(preloadPopular, 2000);
    return () => clearTimeout(timer);
  }, [route.kind]);

  const cur = route.kind === 'tool' ? TOOLS.find((t) => t.slug === route.slug) : null;

  // Guide text loads on demand: the 8 core guides come from content.js, the
  // other 37 arrive as one small chunk the first time a tool page needs one.
  const [guide, setGuide] = useState(null);
  useEffect(() => {
    let alive = true;
    setGuide(null);
    if (cur) loadGuide(cur.id).then((g) => { if (alive) setGuide(g); });
    return () => { alive = false; };
  }, [cur]);

  // Per-route SEO: title, description, canonical and FAQ JSON-LD.
  useEffect(() => {
    setMetaTag('robots', (route.kind === 'notfound' || (route.kind === 'tool' && !cur)) ? 'noindex' : 'index, follow');
    if (route.kind === 'home') { document.title = HOME_TITLE; setMetaTag('description', HOME_DESC); setCanonical(BASE_URL + '/'); setFaqJsonLd(HOME_FAQS); }
    else if (route.kind === 'tool' && cur) { document.title = seoTitle(cur.title); setMetaTag('description', cur.desc); setCanonical(toolUrl(cur.slug)); setFaqJsonLd(cur.faqs); }
    else if (route.kind === 'about') { document.title = 'About | Kalkio'; setMetaTag('description', 'About Kalkio: 50 free calculators and converters that run in your browser. No sign-up, no accounts.'); setCanonical(pageUrl('/about/')); setFaqJsonLd(null); }
    else if (route.kind === 'contact') { document.title = 'Contact | Kalkio'; setMetaTag('description', 'Contact Kalkio by email. Tools run in your browser and no sign-up is needed.'); setCanonical(pageUrl('/contact/')); setFaqJsonLd(null); }
    else if (route.kind === 'privacy') { document.title = 'Privacy Policy | Kalkio'; setMetaTag('description', 'Kalkio privacy: tools run in your browser, file converters do not upload your files to a server, and no account is needed.'); setCanonical(pageUrl('/privacy/')); setFaqJsonLd(null); }
    else { document.title = 'Tool not found | Kalkio'; setMetaTag('description', 'That tool does not exist on Kalkio. Browse all 50 free tools on the home page.'); setCanonical(BASE_URL + '/'); setFaqJsonLd(null); }
  }, [route, cur]);

  const footer = (<Box component="footer" sx={{ mt: 6, pt: 3, borderTop: '1px solid #E7E5E4', textAlign: 'center' }}>
    <Typography variant="body2" color="text.secondary" gutterBottom sx={{ '& a': { color: 'primary.main' } }}>
      <Link href="/about/" onClick={(e) => go(e, '/about/')}>About</Link>{' · '}
      <Link href="/contact/" onClick={(e) => go(e, '/contact/')}>Contact</Link>{' · '}
      <Link href="/privacy/" onClick={(e) => go(e, '/privacy/')}>Privacy Policy</Link>
    </Typography>
    <Typography variant="caption" color="text.secondary">Kalkio - free tools, no sign-up.</Typography>
  </Box>);

  const notFound = (<Box sx={{ maxWidth: 720, mx: 'auto', py: 6 }}>
    <Typography variant="h4" component="h1" fontWeight={800} gutterBottom>Tool not found</Typography>
    <Typography variant="body1" color="text.secondary" gutterBottom>That tool does not exist on Kalkio.</Typography>
    <Button variant="contained" component="a" href="/" onClick={(e) => go(e, '/')} sx={{ mt: 2 }}>Browse all tools</Button>
  </Box>);

  const staticPage = (title, children) => (<Box sx={{ maxWidth: 720, mx: 'auto', py: 4 }}>
    <Button startIcon={<ArrowBackIcon />} component="a" href="/" onClick={(e) => go(e, '/')} sx={{ mb: 2 }}>All tools</Button>
    <Typography variant="h4" component="h1" fontWeight={800} gutterBottom>{title}</Typography>
    {children}
  </Box>);

  // Sticky white header: logo, search, nav. The search filters every tool;
  // typing shows the matches as cards in the main content below.
  const header = (<AppBar position="sticky" elevation={0} sx={{ bgcolor: '#fff', color: 'text.primary', borderBottom: '1px solid #E7E5E4' }}>
    <Toolbar sx={{ gap: 2, flexWrap: 'wrap', py: 1 }}>
      <Box component="a" href="/" onClick={(e) => go(e, '/')} sx={{ display: 'flex', alignItems: 'center', gap: 1, textDecoration: 'none', color: 'inherit' }}>
        <Box sx={{ bgcolor: 'primary.main', borderRadius: 2, p: 0.5, display: 'flex', color: 'white' }}><CalculateIcon /></Box>
        <Typography variant="h6" fontWeight={800}>Kalkio</Typography>
      </Box>
      <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', order: { xs: 3, md: 2 }, flexBasis: { xs: '100%', md: 'auto' } }}>
        <TextField size="small" fullWidth sx={{ maxWidth: 520 }} placeholder="Search a tool... e.g. JPG to PDF" value={q} onChange={(e) => setQ(e.target.value)} InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon color="action" /></InputAdornment>), endAdornment: q ? (<InputAdornment position="end"><IconButton size="small" onClick={() => setQ('')} aria-label="Clear search"><CloseIcon fontSize="small" /></IconButton></InputAdornment>) : null }} />
      </Box>
      <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2.5, alignItems: 'center', order: 3 }}>
        <Link href="/" onClick={(e) => go(e, '/')} underline="hover" color="text.primary" fontWeight={700}>All tools</Link>
        <Link href="/about/" onClick={(e) => go(e, '/about/')} underline="hover" color="text.primary" fontWeight={700}>About</Link>
        <Link href="/contact/" onClick={(e) => go(e, '/contact/')} underline="hover" color="text.primary" fontWeight={700}>Contact</Link>
      </Box>
    </Toolbar>
  </AppBar>);

  const searchView = (<Box sx={{ py: 4 }}>
    <Typography variant="h4" component="h1" fontWeight={800} gutterBottom>Results for "{q.trim()}"</Typography>
    {searchResults.length === 0 ? (<>
      <Typography variant="body1" color="text.secondary" gutterBottom>No tool found - try another word, e.g. PDF, loan or Marla.</Typography>
      <Typography variant="h6" component="h2" fontWeight={700} sx={{ mt: 3, mb: 2 }}>Try these popular tools</Typography>
      <ToolGrid tools={POPULAR} go={go} />
    </>) : (<ToolGrid tools={searchResults} go={go} />)}
  </Box>);

  const homeView = (<>
    <Box sx={{ textAlign: 'center', py: { xs: 5, md: 7 }, px: 1 }}>
      <Typography variant="h3" component="h1" fontWeight={800} gutterBottom sx={{ fontSize: { xs: '2rem', md: '2.75rem' } }}>50 free calculators and converters.</Typography>
      <Typography variant="h6" color="text.secondary" fontWeight={400} sx={{ maxWidth: 640, mx: 'auto' }}>From loan EMI and age to JPG to PDF and GTA 6 prices. Everything runs in your browser. No sign-up.</Typography>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 3 }}>Last updated 6 Nov 2026.</Typography>
    </Box>
    <Typography variant="body2" color="text.secondary" fontWeight={700} sx={{ mb: 1, textAlign: 'center' }}>Categories</Typography>
    <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 1, mb: 1, justifyContent: { xs: 'flex-start', md: 'center' } }}>
      {CATEGORIES.map((c) => (<Button key={c.name} variant={openCat === c.name ? 'contained' : 'outlined'} sx={{ borderRadius: 10, whiteSpace: 'nowrap', textTransform: 'none', fontWeight: 700 }} onClick={() => { setOpenCat(openCat === c.name ? null : c.name); document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' }); }}>{CAT_EMOJI[c.name]} {c.name}</Button>))}
    </Box>
    <Typography variant="h5" component="h2" fontWeight={800} gutterBottom>⭐ Most popular</Typography>
    <ToolGrid tools={POPULAR} go={go} />
    <Box id="categories" sx={{ mt: 5 }}>
      <Typography variant="h5" component="h2" fontWeight={800} gutterBottom>Browse all tools</Typography>
      {CATEGORIES.map((c) => (<Accordion key={c.name} expanded={openCat === c.name} onChange={() => setOpenCat(openCat === c.name ? null : c.name)} sx={{ mb: 1 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography fontWeight={700}>{CAT_EMOJI[c.name]} {c.name} <Typography component="span" variant="body2" color="text.secondary" fontWeight={400}>({c.tools.length} tool{c.tools.length === 1 ? '' : 's'})</Typography></Typography></AccordionSummary>
        <AccordionDetails><ToolGrid tools={c.tools} go={go} /></AccordionDetails>
      </Accordion>))}
    </Box>
    <Typography variant="h5" component="h2" fontWeight={800} sx={{ mt: 5 }} gutterBottom>❓ Common questions</Typography>
    {HOME_FAQS.map(([q, a]) => (<Accordion key={q} sx={{ mb: 1 }}><AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography fontWeight={700}>{q}</Typography></AccordionSummary><AccordionDetails><Typography variant="body2" color="text.secondary">{a}</Typography></AccordionDetails></Accordion>))}
    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 3, textAlign: 'center' }}>Tax, bill and fuel results are estimates - confirm official rates before a financial decision.</Typography>
  </>);

  const toolView = cur && (<Box sx={{ maxWidth: 720, mx: 'auto', py: 4 }}>
    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
      <Link href="/" onClick={(e) => go(e, '/')} underline="hover" color="inherit">Home</Link>{' / '}{ID_TO_CAT[cur.id] || cur.cat}
    </Typography>
    <Typography variant="h4" component="h1" fontWeight={800} gutterBottom>{showTitle(cur)}</Typography>
    <Typography variant="body1" color="text.secondary" gutterBottom>{CAT_EMOJI[ID_TO_CAT[cur.id]] || ''}{' '}{ID_TO_CAT[cur.id] || cur.cat}{' · No sign-up.'}</Typography>
    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>Guide last updated{' '}{CONTENT_UPDATED}.</Typography>
    {cur.id === 'salarytax' && (<Typography variant="body1" sx={{ mb: 2, fontWeight: 700 }}>Quick answer: Up to Rs 600,000 a year is tax-free; Rs 100,000 a month pays Rs 500 a month in tax.</Typography>)}
    <Suspense fallback={<Card elevation={2} sx={{ borderRadius: 3 }}><CardContent sx={{ py: 5, textAlign: 'center' }}><CircularProgress /><Typography color="text.secondary" sx={{ mt: 1 }}>Loading calculator...</Typography></CardContent></Card>}><cur.Component key={cur.id} /></Suspense>
    {cur.id === 'marla' && (<>
      <Box sx={{ bgcolor: '#fff8e1', borderRadius: 2, p: 2, mt: 2 }}><Typography variant="body2">225 sq ft is common in housing societies like DHA and Bahria Town. 250 sq ft is the CDA Islamabad standard. 272.25 sq ft is the revenue-record Marla. Confirm from your plot documents which one applies to you.</Typography></Box>
      <Accordion sx={{ mt: 2 }}><AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography fontWeight={700}>How it works</Typography></AccordionSummary><AccordionDetails><Typography variant="body2" color="text.secondary">Square feet = Marla × sq ft per Marla. Square yards = square feet ÷ 9. Square metres = square feet ÷ 10.7639. Kanal = Marla ÷ 20. Acre = Marla ÷ 160.</Typography></AccordionDetails></Accordion>
      <Accordion><AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography fontWeight={700}>225 vs 250 vs 272.25 - quick table</Typography></AccordionSummary><AccordionDetails><Box sx={{ overflowX: 'auto' }}><Table size="small" sx={{ minWidth: 480 }}><TableBody>{[[1, 225, 250, 272.25], [5, 1125, 1250, 1361.25], [10, 2250, 2500, 2722.5], [20, 4500, 5000, 5445]].map(([m, a, b, c]) => (<TableRow key={m}><TableCell>{m === 20 ? '20 = 1 Kanal' : `${m} Marla`}</TableCell><TableCell>{fmt(a)}</TableCell><TableCell>{fmt(b)}</TableCell><TableCell>{fmt(c)}</TableCell></TableRow>))}</TableBody></Table></Box></AccordionDetails></Accordion>
      <Accordion><AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography fontWeight={700}>❓ Common questions</Typography></AccordionSummary><AccordionDetails><Typography variant="body2" color="text.secondary" paragraph><b>How many Marla in 1 Kanal?</b> 20 Marla, under both standards.</Typography><Typography variant="body2" color="text.secondary"><b>Which standard should I use?</b> The one written in your plot documents.</Typography></AccordionDetails></Accordion>
    </>)}
    <Box sx={{ mt: 2 }}><Button variant="outlined" color="success" startIcon={<WhatsAppIcon />} component="a" href={`https://wa.me/?text=${encodeURIComponent(showTitle(cur) + ' - ' + toolUrl(cur.slug))}`} target="_blank" rel="noopener noreferrer">Share on WhatsApp</Button></Box>
    {guide && (<Box component="section" sx={{ mt: 4 }}>{guide.map((s) => (<Box key={s.h} sx={{ mb: 3 }}>
      <Typography variant="h5" component="h2" fontWeight={700} gutterBottom>{s.h}</Typography>
      {s.p.map((para, i) => (<Typography key={i} variant="body1" color="text.secondary" paragraph>{renderGuideText(para)}</Typography>))}
      {s.table && (<Box sx={{ overflowX: 'auto' }}><Table size="small" sx={{ minWidth: Math.max(320, s.table.head.length * 130) }}><TableBody><TableRow>{s.table.head.map((c) => (<TableCell key={c} sx={{ fontWeight: 700 }}>{c}</TableCell>))}</TableRow>{s.table.rows.map((r, ri) => (<TableRow key={ri}>{r.map((c, ci) => (<TableCell key={ci}>{c}</TableCell>))}</TableRow>))}</TableBody></Table></Box>)}
    </Box>))}</Box>)}
    {cur.id !== 'marla' && cur.faqs && cur.faqs.length > 0 && (<Accordion sx={{ mt: 2 }}><AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography fontWeight={700}>❓ Common questions</Typography></AccordionSummary><AccordionDetails>{cur.faqs.map(([fq, fa]) => (<Typography key={fq} variant="body2" color="text.secondary" paragraph><b>{fq}</b> {fa}</Typography>))}</AccordionDetails></Accordion>)}
    {(() => { const topical = TOPICAL_RELATED[cur.id]; const sib = topical ? topical.map((id) => BY_ID[id]).filter(Boolean) : (CATEGORIES.find((c) => c.name === ID_TO_CAT[cur.id]) || { tools: [] }).tools.filter((t) => t.id !== cur.id).slice(0, 4); return sib.length > 0 ? (<Box sx={{ mt: 5 }}><Typography variant="h6" component="h2" fontWeight={700} gutterBottom>🔗 More free tools</Typography><ToolGrid tools={sib} go={go} mdCols={2} /></Box>) : null; })()}
  </Box>);

  const aboutView = staticPage('About Kalkio', (<>
    <Typography variant="body1" paragraph>Kalkio is a collection of 50 free calculators and converters, covering property, tax and salary, prices, finance, files and everyday calculations.</Typography>
    <Typography variant="body1" paragraph>How to use it: search for a tool or browse a category, enter your numbers, and the result appears straight away. There is nothing to install and no account to create.</Typography>
    <Typography variant="body1" paragraph>Every tool runs in the visitor’s browser - there is no backend, no database, no login and no sign-up. File converters also run fully in the browser, so your files never leave your device.</Typography>
    <Typography variant="body1" paragraph>The tools cover everyday needs: converting Marla and Kanal, working out salary tax, Zakat and PTA tax, checking petrol and gold prices, converting files, and checking GTA 6 prices and release dates.</Typography>
    <Typography variant="body1" paragraph>Tax, bill and fuel results are estimates - confirm official rates before a financial decision.</Typography>
    <Typography variant="body1" paragraph>Questions or a tool to suggest? Email <Link href="mailto:sammykhanmalng@gmail.com">sammykhanmalng@gmail.com</Link>.</Typography>
  </>));
  const contactView = staticPage('Contact Kalkio', (<>
    <Typography variant="body1" paragraph>Questions about Kalkio? Email us at <Link href="mailto:sammykhanmalng@gmail.com">sammykhanmalng@gmail.com</Link>.</Typography>
    <Typography variant="body1" paragraph>Tools run in your browser and no sign-up is needed, so there is no account to recover.</Typography>
  </>));
  const privacyView = staticPage('Privacy Policy', (<>
    <Typography variant="body1" paragraph>The tools on Kalkio run in your browser. They do not ask you to create an account, and they do not send your calculator inputs to a server.</Typography>
    <Typography variant="body1" paragraph>File converters (HEIC, AVIF, WebP, PNG, JPG and PDF) also run fully in the browser - your files are never uploaded to a server.</Typography>
    <Typography variant="body1" paragraph>Passwords and QR codes are generated locally on your device and never sent anywhere.</Typography>
    <Typography variant="body1" paragraph>Tax, bill and fuel results are estimates. Confirm official rates before a financial decision.</Typography>
    <Typography variant="body1" paragraph>Questions about this policy: <Link href="mailto:sammykhanmalng@gmail.com">sammykhanmalng@gmail.com</Link>.</Typography>
  </>));

  return (<>
    <CssBaseline />
    <a href="#main-content" className="skip-link">Skip to main content</a>
    {header}
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pb: 4 }}>
      <Container maxWidth="lg">
        <Box component="main" id="main-content">
          {query ? searchView
            : route.kind === 'home' ? homeView
            : route.kind === 'tool' && cur ? toolView
            : route.kind === 'tool' && !cur ? notFound
            : route.kind === 'notfound' ? notFound
            : route.kind === 'about' ? aboutView
            : route.kind === 'contact' ? contactView
            : route.kind === 'privacy' ? privacyView
            : notFound}
          {footer}
        </Box>
      </Container>
    </Box>
  </>);
}
