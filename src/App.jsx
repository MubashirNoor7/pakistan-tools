import React, { useState, useEffect, Suspense, lazy } from 'react';
import { AppBar, Toolbar, Typography, Container, Card, CardContent, Box, TextField, Button, List, ListItem, ListItemText, ListItemButton, Accordion, AccordionSummary, AccordionDetails, Table, TableBody, TableRow, TableCell, CssBaseline, Link, CircularProgress } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CalculateIcon from '@mui/icons-material/Calculate';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
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
import { CONTENT_UPDATED, loadGuide } from './content.js';
import { SEO_BY_ID, BASE_URL, HOME_TITLE, HOME_DESC, seoTitle, toolUrl, pageUrl } from './seo-data.js';

const TOOLS = [
  { id: 'marla', title: 'Marla to Sq Ft Converter Pakistan (2026)', cat: 'Property', Component: MarlaTool },
  { id: 'kanal', title: 'Kanal to Marla Converter Pakistan', cat: 'Property', Component: KanalTool },
  { id: 'plotsize', title: 'Plot Size Calculator: Length × Width to Marla', cat: 'Property', Component: PlotSizeTool },
  { id: 'salarytax', title: 'Pakistan Salary Tax Calculator 2026-27', cat: 'Tax & salary', Component: SalaryTaxTool },
  { id: 'bps', title: 'BPS Salary Calculator Pakistan 2026-27', cat: 'Tax & salary', Component: BpsTool },
  { id: 'pta', title: 'PTA Tax Calculator Pakistan by Phone Model', cat: 'Tax & salary', Component: PtaTool },
  { id: 'freelancer', title: 'Freelancer Tax Calculator Pakistan (154A, PSEB 0.25%)', cat: 'Tax & salary', Component: FreelancerTool },
  { id: 'zakat', title: 'Zakat Calculator Pakistan 2026: Cash, Gold', cat: 'Tax & salary', Component: ZakatTool },
  { id: 'fuel', title: 'Fuel Trip Cost Calculator Pakistan (OGRA)', cat: 'Utility', Component: FuelTool },
  { id: 'heic', title: 'HEIC to JPG Converter Online (Free, Private)', cat: 'Files - private', Component: HeicTool },
  { id: 'webp', title: 'WebP to JPG Converter Online Free', cat: 'Files - private', Component: WebpTool },
  { id: 'rentvsbuy', title: 'Rent vs Buy Calculator Pakistan', cat: 'Property', Component: RentVsBuyTool },
  { id: 'taxslab', title: 'FBR Pakistan Tax Slab 2026-27: Which Slab Are You In?', cat: 'Tax & salary', Component: TaxSlabTool },
  { id: 'gold', title: 'Gold Price Pakistan Today: 1 Tola Calculator', cat: 'Prices', Component: GoldTool },
  { id: 'prizebond', title: 'Prize Bond Pakistan: Prize After Tax Calculator', cat: 'Prices', Component: PrizeBondTool },
  { id: 'jpgtopdf', title: 'JPG to PDF Converter Online (Free, Private)', cat: 'Files - private', Component: JpgToPdfTool },
  { id: 'fuelavg', title: 'Fuel Average Calculator Pakistan (km per litre)', cat: 'Utility', Component: FuelAverageTool },
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
// shortcut list (Trends evidence: JPG to PDF, loan, age, BMI, mortgage strongest
// worldwide; Marla/PTA/currency strongest in Pakistan). Category names are generic
// on purpose - no country name in any category label. No tool, rate or formula
// is changed here - only how the home page lists them.
const BY_ID = Object.fromEntries(TOOLS.map((t) => [t.id, t]));
const CATEGORIES = [
  { name: 'Home & Property', ids: ['marla', 'kanal', 'plotsize', 'rentvsbuy', 'areacalc'] },
  { name: 'Money & Tax', ids: ['salarytax', 'bps', 'pta', 'freelancer', 'taxslab', 'zakat', 'loanemi', 'mortgage', 'homeloan', 'carloan', 'sip', 'salarycalc'] },
  { name: 'Prices & Fuel', ids: ['gold', 'prizebond', 'currency', 'fuel', 'fuelavg'] },
  { name: 'Files & converters', ids: ['jpgtopdf', 'pdftojpg', 'pngtojpg', 'heic', 'webp', 'qr', 'unitconv', 'htmltovideo'] },
  { name: 'Everyday tools', ids: ['age', 'bmi', 'percentage', 'wordcounter', 'datecalc', 'password', 'cgpa', 'attendance', 'whatsmyip'] },
  { name: 'Fun & Entertainment', ids: ['love'] },
].map((c) => ({ name: c.name, tools: c.ids.map((id) => BY_ID[id]).filter(Boolean) }));
// One emoji per category - used as a visual anchor in sidebars, lists and headings
// so the page is easier to scan. Emojis never go in page titles or H1s.
const CAT_EMOJI = { 'Home & Property': '🏠', 'Money & Tax': '💰', 'Prices & Fuel': '⛽', 'Files & converters': '📁', 'Everyday tools': '🧮', 'Fun & Entertainment': '🎉' };
const ID_TO_CAT = {};
CATEGORIES.forEach((c) => c.tools.forEach((t) => { ID_TO_CAT[t.id] = c.name; }));
const POPULAR = ['jpgtopdf', 'loanemi', 'age', 'bmi', 'mortgage', 'marla', 'pta', 'currency'].map((id) => BY_ID[id]).filter(Boolean);

function toolListItems(tools, go, selectedId) {
  return tools.map((t, i) => (<ListItem key={t.id} disablePadding divider={i < tools.length - 1}><ListItemButton component="a" href={`/tools/${t.slug}/`} selected={selectedId === t.id} onClick={(e) => go(e, `/tools/${t.slug}/`)}><ListItemText primary={`${CAT_EMOJI[ID_TO_CAT[t.id]] || ''} ${t.title}`} secondary={ID_TO_CAT[t.id] || t.cat} /></ListItemButton></ListItem>));
}

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

export default function App() {
  const [route, setRoute] = useState(() => parseRoute(window.location.pathname));
  const [q, setQ] = useState('');
  const [openCat, setOpenCat] = useState(CATEGORIES[0].name);
  const navigate = (path) => { if (window.location.pathname !== path) { window.history.pushState(null, '', path); setRoute(parseRoute(path)); } window.scrollTo(0, 0); };
  const go = (e, path) => { e.preventDefault(); navigate(path); };
  const query = q.trim().toLowerCase();
  const searchResults = query ? TOOLS.filter((t) => (t.title + ' ' + t.cat).toLowerCase().includes(query)) : [];

  useEffect(() => {
    const onPop = () => setRoute(parseRoute(window.location.pathname));
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const cur = route.kind === 'tool' ? TOOLS.find((t) => t.slug === route.slug) : null;

  // Guide text loads on demand: the 8 core guides come from content.js, the
  // other 32 arrive as one small chunk the first time a tool page needs one.
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
    if (route.kind === 'home') { document.title = HOME_TITLE; setMetaTag('description', HOME_DESC); setCanonical(BASE_URL + '/'); setFaqJsonLd(null); }
    else if (route.kind === 'tool' && cur) { document.title = seoTitle(cur.title); setMetaTag('description', cur.desc); setCanonical(toolUrl(cur.slug)); setFaqJsonLd(cur.faqs); }
    else if (route.kind === 'about') { document.title = 'About | Kalkio'; setMetaTag('description', 'About Kalkio: 40 free calculators and converters that run in your browser. No sign-up, no accounts.'); setCanonical(pageUrl('/about/')); setFaqJsonLd(null); }
    else if (route.kind === 'contact') { document.title = 'Contact | Kalkio'; setMetaTag('description', 'Contact Kalkio by email. Tools run in your browser and no sign-up is needed.'); setCanonical(pageUrl('/contact/')); setFaqJsonLd(null); }
    else if (route.kind === 'privacy') { document.title = 'Privacy Policy | Kalkio'; setMetaTag('description', 'Kalkio privacy: tools run in your browser, file converters do not upload your files to a server, and no account is needed.'); setCanonical(pageUrl('/privacy/')); setFaqJsonLd(null); }
    else { document.title = 'Tool not found | Kalkio'; setMetaTag('description', 'That tool does not exist on Kalkio. Browse all 40 free tools on the home page.'); setCanonical(BASE_URL + '/'); setFaqJsonLd(null); }
  }, [route, cur]);

  // Keep the sidebar on the open tool's category, so the user always sees where they are.
  useEffect(() => {
    if (cur) {
      const c = CATEGORIES.find((cat) => cat.tools.some((t) => t.id === cur.id));
      if (c) setOpenCat(c.name);
    }
  }, [cur]);

  // Three-pane layout (desktop): left = tools of the selected category, center =
  // the selected tool (or home), right = all category names + logo. Plain CSS grid
  // on purpose: MUI's legacy Grid ignores the `size` prop, so the three panes
  // sized by content and the center wrapped below the sidebar (tool opened below
  // the fold). On phones the panes stack with the tool first, then categories,
  // then the tools list. Sidebars stick while the center scrolls.
  const listTools = query ? searchResults : openCat === '__popular' ? POPULAR : (CATEGORIES.find((c) => c.name === openCat) || CATEGORIES[0]).tools;
  const listTitle = query ? `Results for "${q.trim()}"` : openCat === '__popular' ? '⭐ Most popular' : openCat;
  const listEmoji = query ? '' : openCat === '__popular' ? '' : (CAT_EMOJI[openCat] || '');
  const sidebarTools = (<Card elevation={1} sx={{ borderRadius: 3 }}>
    <Box sx={{ p: 2, pb: 1 }}><TextField fullWidth size="small" placeholder="Search a tool... e.g. JPG to PDF" value={q} onChange={(e) => setQ(e.target.value)} /></Box>
    <Typography variant="subtitle1" fontWeight={700} sx={{ px: 2, pt: 1 }}>{listEmoji}{listEmoji && ' '}{listTitle}{!query && ` (${listTools.length})`}</Typography>
    {listTools.length === 0
      ? (<Typography variant="body1" color="text.secondary" sx={{ px: 2, py: 2 }}>No tool found - try another word, e.g. PDF, loan or Marla.</Typography>)
      : (<List>{toolListItems(listTools, go, cur ? cur.id : null)}</List>)}
  </Card>);
  const sidebarCats = (<Card elevation={1} sx={{ borderRadius: 3 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 2, pb: 1 }}>
      <Box sx={{ bgcolor: 'primary.main', borderRadius: 2, p: 0.5, display: 'flex', color: 'white' }}><CalculateIcon /></Box>
      <Box><Typography fontWeight={800} lineHeight={1}>Kalkio</Typography><Typography variant="caption" color="text.secondary">Free tools, no sign-up</Typography></Box>
    </Box>
    <List>
      <ListItem disablePadding divider><ListItemButton selected={openCat === '__popular'} onClick={() => { setOpenCat('__popular'); setQ(''); }}><ListItemText primary="⭐ Most popular" secondary="Most searched tools" /></ListItemButton></ListItem>
      {CATEGORIES.map((c, i) => (<ListItem key={c.name} disablePadding divider={i < CATEGORIES.length - 1}><ListItemButton selected={openCat === c.name} onClick={() => { setOpenCat(c.name); setQ(''); }}><ListItemText primary={`${CAT_EMOJI[c.name]} ${c.name}`} secondary={`${c.tools.length} tools`} /></ListItemButton></ListItem>))}
    </List>
  </Card>);

  const footer = (<Box component="footer" sx={{ mt: 4, pt: 2, borderTop: '1px solid #e0e0e0', textAlign: 'center' }}>
    <Typography variant="body2" color="text.secondary" gutterBottom sx={{ '& a': { color: '#0d47a1' } }}>
      <Link href="/about/" onClick={(e) => go(e, '/about/')}>About</Link>{' · '}
      <Link href="/contact/" onClick={(e) => go(e, '/contact/')}>Contact</Link>{' · '}
      <Link href="/privacy/" onClick={(e) => go(e, '/privacy/')}>Privacy Policy</Link>
    </Typography>
    <Typography variant="caption" color="text.secondary">Kalkio - free tools, no sign-up.</Typography>
  </Box>);

  const notFound = (<>
    <Typography variant="h4" component="h1" fontWeight={800} gutterBottom>Tool not found</Typography>
    <Typography variant="body1" color="text.secondary" gutterBottom>That tool does not exist on Kalkio.</Typography>
    <Button variant="contained" component="a" href="/" onClick={(e) => go(e, '/')} sx={{ mt: 2 }}>Browse all tools</Button>
  </>);

  const staticPage = (title, children) => (<>
    <Button startIcon={<ArrowBackIcon />} component="a" href="/" onClick={(e) => go(e, '/')} sx={{ mb: 2 }}>All tools</Button>
    <Typography variant="h4" component="h1" fontWeight={800} gutterBottom>{title}</Typography>
    {children}
  </>);

  return (<>
    <CssBaseline />
    <a href="#main-content" className="skip-link">Skip to main content</a>
    <AppBar position="static" color="primary" elevation={0}><Toolbar><Box sx={{ bgcolor: 'rgba(255,255,255,0.2)', borderRadius: 2, p: 0.5, mr: 1.5, display: 'flex' }}><CalculateIcon /></Box><Typography variant="h6" fontWeight={700} component="a" href="/" onClick={(e) => go(e, '/')} sx={{ color: 'inherit', textDecoration: 'none' }}>Kalkio</Typography></Toolbar></AppBar>
    <Box sx={{ bgcolor: '#f5f7fa', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="xl">
      <Box sx={{ display: 'grid', gap: 3, alignItems: 'start', gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: '300px minmax(0, 1fr) 280px' } }}>
        <Box component="nav" aria-label="Tools in this category" sx={{ order: { xs: 3, md: 1 }, minWidth: 0, position: { md: 'sticky' }, top: { md: 24 } }}>{sidebarTools}</Box>
        <Box component="main" id="main-content" sx={{ order: { xs: 1, md: 2 }, minWidth: 0 }}>
        {route.kind === 'home' && (<>
          <Typography variant="h4" component="h1" fontWeight={800} gutterBottom>What do you want to calculate?</Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>{TOOLS.length} tools, one style. No sign-up. Pick a category on the right, or a tool on the left.</Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>Free Pakistan calculators (Marla, salary tax, PTA tax, BPS, Zakat, gold and fuel) plus file converters, QR codes, BMI and more. Everything runs in your browser.</Typography>
          <Typography variant="h6" component="h2" fontWeight={700} gutterBottom>⭐ Most popular</Typography>
          <Card elevation={1} sx={{ borderRadius: 3 }}><List>{toolListItems(POPULAR, go, null)}</List></Card>
          <Accordion sx={{ mt: 2 }}><AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography fontWeight={700}>❓ Common questions</Typography></AccordionSummary><AccordionDetails><Typography variant="body2" color="text.secondary" paragraph><b>Are the tools free?</b> Yes. All 40 tools are free and no sign-up is needed.</Typography><Typography variant="body2" color="text.secondary" paragraph><b>Does my data leave my device?</b> No. Every tool runs in your browser and does not ask you to create an account.</Typography><Typography variant="body2" color="text.secondary"><b>Are tax results official?</b> No. Tax, bill and fuel results are estimates. Confirm official rates before a financial decision.</Typography></AccordionDetails></Accordion>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 3, textAlign: 'center' }}>Tax, bill and fuel results are estimates - confirm official rates before a financial decision.</Typography>
        </>)}
        {route.kind === 'tool' && !cur && notFound}
        {route.kind === 'notfound' && notFound}
        {route.kind === 'tool' && cur && (<>
          <Button startIcon={<ArrowBackIcon />} component="a" href="/" onClick={(e) => go(e, '/')} sx={{ mb: 2 }}>All tools</Button>
          <Typography variant="h4" component="h1" fontWeight={800} gutterBottom>{cur.title}</Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>{CAT_EMOJI[ID_TO_CAT[cur.id]] || ''} {ID_TO_CAT[cur.id] || cur.cat} · No sign-up.</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>Guide last updated {CONTENT_UPDATED}.</Typography>
          {cur && (<Suspense fallback={<Box sx={{ py: 4, textAlign: 'center' }}><CircularProgress /><Typography color="text.secondary" sx={{ mt: 1 }}>Loading calculator...</Typography></Box>}><cur.Component /></Suspense>)}
          {cur.id === 'marla' && (<>
            <Box sx={{ bgcolor: '#fff8e1', borderRadius: 2, p: 2, mt: 2 }}><Typography variant="body2">225 sq ft is common in housing societies like DHA and Bahria Town. 250 sq ft is the CDA Islamabad standard. 272.25 sq ft is the revenue-record Marla. Confirm from your plot documents which one applies to you.</Typography></Box>
            <Accordion sx={{ mt: 2 }}><AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography fontWeight={700}>How it works</Typography></AccordionSummary><AccordionDetails><Typography variant="body2" color="text.secondary">Square feet = Marla × sq ft per Marla. Square yards = square feet ÷ 9. Square metres = square feet ÷ 10.7639. Kanal = Marla ÷ 20. Acre = Marla ÷ 160.</Typography></AccordionDetails></Accordion>
            <Accordion><AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography fontWeight={700}>225 vs 250 vs 272.25 - quick table</Typography></AccordionSummary><AccordionDetails><Table size="small"><TableBody>{[[1, 225, 250, 272.25], [5, 1125, 1250, 1361.25], [10, 2250, 2500, 2722.5], [20, 4500, 5000, 5445]].map(([m, a, b, c]) => (<TableRow key={m}><TableCell>{m === 20 ? '20 = 1 Kanal' : `${m} Marla`}</TableCell><TableCell>{fmt(a)}</TableCell><TableCell>{fmt(b)}</TableCell><TableCell>{fmt(c)}</TableCell></TableRow>))}</TableBody></Table></AccordionDetails></Accordion>
            <Accordion><AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography fontWeight={700}>❓ Common questions</Typography></AccordionSummary><AccordionDetails><Typography variant="body2" color="text.secondary" paragraph><b>How many Marla in 1 Kanal?</b> 20 Marla, under both standards.</Typography><Typography variant="body2" color="text.secondary"><b>Which standard should I use?</b> The one written in your plot documents.</Typography></AccordionDetails></Accordion>
          </>)}
        </>)}
        {route.kind === 'tool' && cur && (<Box sx={{ mt: 2 }}><Button variant="outlined" color="success" startIcon={<WhatsAppIcon />} component="a" href={`https://wa.me/?text=${encodeURIComponent(cur.title + ' - ' + toolUrl(cur.slug))}`} target="_blank" rel="noopener noreferrer">Share on WhatsApp</Button></Box>)}
        {route.kind === 'tool' && cur && guide && (<Box component="section" sx={{ mt: 4 }}>{guide.map((s) => (<Box key={s.h} sx={{ mb: 3 }}>
          <Typography variant="h5" component="h2" fontWeight={700} gutterBottom>{s.h}</Typography>
          {s.p.map((para, i) => (<Typography key={i} variant="body1" color="text.secondary" paragraph>{para}</Typography>))}
          {s.table && (<Box sx={{ overflowX: 'auto' }}><Table size="small"><TableBody><TableRow>{s.table.head.map((c) => (<TableCell key={c} sx={{ fontWeight: 700 }}>{c}</TableCell>))}</TableRow>{s.table.rows.map((r, ri) => (<TableRow key={ri}>{r.map((c, ci) => (<TableCell key={ci}>{c}</TableCell>))}</TableRow>))}</TableBody></Table></Box>)}
        </Box>))}</Box>)}
        {route.kind === 'tool' && cur && cur.id !== 'marla' && cur.faqs && cur.faqs.length > 0 && (<Accordion sx={{ mt: 2 }}><AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography fontWeight={700}>❓ Common questions</Typography></AccordionSummary><AccordionDetails>{cur.faqs.map(([fq, fa]) => (<Typography key={fq} variant="body2" color="text.secondary" paragraph><b>{fq}</b> {fa}</Typography>))}</AccordionDetails></Accordion>)}
        {route.kind === 'tool' && cur && (() => { const sib = (CATEGORIES.find((c) => c.name === ID_TO_CAT[cur.id]) || { tools: [] }).tools.filter((t) => t.id !== cur.id).slice(0, 5); return sib.length > 0 ? (<Box sx={{ mt: 4 }}><Typography variant="h6" component="h2" fontWeight={700} gutterBottom>🔗 More free tools</Typography><Card elevation={1} sx={{ borderRadius: 3 }}><List>{toolListItems(sib, go, null)}</List></Card></Box>) : null; })()}
        {route.kind === 'about' && staticPage('About Kalkio', (<>
          <Typography variant="body1" paragraph>Kalkio is a collection of 40 free calculators and converters, covering property, tax and salary, prices, finance, files and everyday calculations.</Typography>
          <Typography variant="body1" paragraph>Every tool runs in the visitor’s browser - there is no backend, no database, no login and no sign-up. File converters also run fully in the browser.</Typography>
          <Typography variant="body1" paragraph>Tax, bill and fuel results are estimates - confirm official rates before a financial decision.</Typography>
        </>))}
        {route.kind === 'contact' && staticPage('Contact Kalkio', (<>
          <Typography variant="body1" paragraph>Questions about Kalkio? Email us at <Link href="mailto:sammykhanmalng@gmail.com">sammykhanmalng@gmail.com</Link>.</Typography>
          <Typography variant="body1" paragraph>Tools run in your browser and no sign-up is needed, so there is no account to recover.</Typography>
        </>))}
        {route.kind === 'privacy' && staticPage('Privacy Policy', (<>
          <Typography variant="body1" paragraph>The tools on Kalkio run in your browser. They do not ask you to create an account, and they do not send your calculator inputs to a server.</Typography>
          <Typography variant="body1" paragraph>File converters (HEIC, AVIF, WebP, PNG, JPG and PDF) also run fully in your browser - your files are never uploaded to a server.</Typography>
          <Typography variant="body1" paragraph>Passwords and QR codes are generated locally on your device and never sent anywhere.</Typography>
          <Typography variant="body1" paragraph>Tax, bill and fuel results are estimates. Confirm official rates before a financial decision.</Typography>
          <Typography variant="body1" paragraph>Questions about this policy: <Link href="mailto:sammykhanmalng@gmail.com">sammykhanmalng@gmail.com</Link>.</Typography>
        </>))}
        {footer}
        </Box>
        <Box component="nav" aria-label="Tool categories" sx={{ order: { xs: 2, md: 3 }, minWidth: 0, position: { md: 'sticky' }, top: { md: 24 } }}>{sidebarCats}</Box>
      </Box>
    </Container>
    </Box>
  </>);
}
