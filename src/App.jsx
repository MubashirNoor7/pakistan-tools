import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { AppBar, Toolbar, Typography, Container, Card, CardContent, Box, TextField, Button, Accordion, AccordionSummary, AccordionDetails, Table, TableBody, TableRow, TableCell, CssBaseline, Link, CircularProgress, InputAdornment, IconButton } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
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
const PlotPriceTool = lazy(() => import('./tools/property.jsx').then((m) => ({ default: m.PlotPriceTool })));
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
const ElectricityTool = lazy(() => import('./tools/utility.jsx').then((m) => ({ default: m.ElectricityTool })));
const GasTool = lazy(() => import('./tools/utility.jsx').then((m) => ({ default: m.GasTool })));
const TokenTool = lazy(() => import('./tools/tax.jsx').then((m) => ({ default: m.TokenTool })));
const DailyWageTool = lazy(() => import('./tools/wage.jsx').then((m) => ({ default: m.DailyWageTool })));
const EobiTool = lazy(() => import('./tools/benefits.jsx').then((m) => ({ default: m.EobiTool })));
const GratuityTool = lazy(() => import('./tools/benefits.jsx').then((m) => ({ default: m.GratuityTool })));
const ProvidentFundTool = lazy(() => import('./tools/benefits.jsx').then((m) => ({ default: m.ProvidentFundTool })));
const WebpTool = lazy(() => import('./tools/utility.jsx').then((m) => ({ default: m.WebpTool })));
const JpgToWebpTool = lazy(() => import('./tools/utility.jsx').then((m) => ({ default: m.JpgToWebpTool })));
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
  wage: () => import('./tools/wage.jsx'),
  benefits: () => import('./tools/benefits.jsx'),
};
const TOOL_MODULE = {
  marla: 'property', kanal: 'property', plotsize: 'property', plotprice: 'property',
  salarytax: 'tax', bps: 'tax', pta: 'tax', freelancer: 'tax', zakat: 'tax', tokentax: 'tax',
  fuel: 'utility', petrolprice: 'utility', heic: 'utility', webp: 'utility', jpgtowebp: 'utility', electricity: 'utility', gasbill: 'utility',
  gta6price: 'gta', gta6download: 'gta', gta6countdown: 'gta', gta6pccheck: 'gta', gta6totalcost: 'gta', gta6preorder: 'gta', gta6storage: 'gta', gta6nztick: 'gta', gta6pcdate: 'gta',
  rentvsbuy: 'newtools', taxslab: 'newtools', gold: 'newtools', prizebond: 'newtools', jpgtopdf: 'newtools', fuelavg: 'newtools', currency: 'newtools',
  loanemi: 'globaltools', mortgage: 'globaltools', qr: 'globaltools', bmi: 'globaltools', age: 'globaltools', percentage: 'globaltools', wordcounter: 'globaltools', password: 'globaltools', cgpa: 'globaltools', pngtojpg: 'globaltools', pdftojpg: 'globaltools',
  salarycalc: 'countrytools', sip: 'countrytools', datecalc: 'countrytools', areacalc: 'countrytools', homeloan: 'countrytools', unitconv: 'countrytools', love: 'countrytools', attendance: 'countrytools', carloan: 'countrytools',
  htmltovideo: 'htmltovideo', whatsmyip: 'iptool', dailywage: 'wage',
  eobi: 'benefits', gratuity: 'benefits', providentfund: 'benefits',
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
  { id: 'plotprice', title: 'Plot Price Calculator: Price per Marla, Kanal & Sq Ft', cat: 'Property', Component: PlotPriceTool },
  { id: 'salarytax', title: 'Pakistan Salary Tax Calculator 2026-27', display: 'Salary Tax Calculator 2026-27', cat: 'Tax & salary', Component: SalaryTaxTool },
  { id: 'bps', title: 'BPS Salary Calculator Pakistan 2026-27', display: 'BPS Salary Calculator 2026-27', cat: 'Tax & salary', Component: BpsTool },
  { id: 'pta', title: 'PTA Tax Calculator Pakistan by Phone Model', display: 'PTA Tax Calculator by Phone Model', cat: 'Tax & salary', Component: PtaTool },
  { id: 'freelancer', title: 'Freelancer Tax Calculator Pakistan (154A, PSEB 0.25%)', display: 'Freelancer Tax Calculator (154A)', cat: 'Tax & salary', Component: FreelancerTool },
  { id: 'zakat', title: 'Zakat Calculator Pakistan 2026: Cash, Gold', display: 'Zakat Calculator 2026: Cash, Gold', cat: 'Tax & salary', Component: ZakatTool },
  { id: 'tokentax', title: 'Car Token Tax Calculator Pakistan 2026-27', display: 'Car Token Tax Calculator 2026-27', cat: 'Money & Tax', Component: TokenTool },
  { id: 'dailywage', title: 'Daily Wage Calculator Pakistan (2026)', display: 'Daily Wage Calculator (2026)', cat: 'Money & Tax', Component: DailyWageTool },
  { id: 'eobi', title: 'EOBI Pension Calculator Pakistan', display: 'EOBI Pension Calculator', cat: 'Money & Tax', Component: EobiTool },
  { id: 'gratuity', title: 'Gratuity Calculator Pakistan', display: 'Gratuity Calculator', cat: 'Money & Tax', Component: GratuityTool },
  { id: 'providentfund', title: 'Provident Fund Calculator Pakistan', display: 'Provident Fund Calculator', cat: 'Money & Tax', Component: ProvidentFundTool },
  { id: 'fuel', title: 'Fuel Trip Cost Calculator Pakistan (OGRA)', display: 'Fuel Trip Cost Calculator (OGRA)', cat: 'Utility', Component: FuelTool },
  { id: 'petrolprice', title: 'Petrol Price Pakistan Today: Petrol & Diesel Rates', display: 'Petrol Price Today: Petrol & Diesel Rates', cat: 'Prices', Component: PetrolPriceTool },
  { id: 'electricity', title: 'Electricity Bill Calculator Pakistan (2026)', display: 'Electricity Bill Calculator (2026)', cat: 'Prices & Fuel', Component: ElectricityTool },
  { id: 'gasbill', title: 'Sui Gas Bill Calculator Pakistan (2026)', display: 'Sui Gas Bill Calculator (2026)', cat: 'Prices & Fuel', Component: GasTool },
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
  { id: 'jpgtowebp', title: 'JPG to WebP Converter Online (Free, Private)', cat: 'Files - private', Component: JpgToWebpTool },
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
const HOME_FAQS = [['Are the tools free?', 'Yes. All 59 tools are free and no sign-up is needed.'], ['Does my data leave my device?', 'No. Every tool runs in your browser and does not ask you to create an account.'], ['Are tax results official?', 'No. Tax, bill and fuel results are estimates. Confirm official rates before a financial decision.']];

// shortcut list (Trends evidence: JPG to PDF, loan, age, BMI, mortgage strongest
// worldwide; Marla/PTA/currency strongest in Pakistan). Category names are generic
// on purpose - no country name in any category label. No tool, rate or formula
// is changed here - only how the home page lists them.
const BY_ID = Object.fromEntries(TOOLS.map((t) => [t.id, t]));
const CATEGORIES = [
  { name: 'Home & Property', ids: ['marla', 'kanal', 'plotsize', 'plotprice', 'rentvsbuy', 'areacalc'] },
  { name: 'Money & Tax', ids: ['salarytax', 'bps', 'pta', 'freelancer', 'taxslab', 'zakat', 'tokentax', 'dailywage', 'eobi', 'gratuity', 'providentfund', 'loanemi', 'mortgage', 'homeloan', 'carloan', 'sip', 'salarycalc'] },
  { name: 'Prices & Fuel', ids: ['gold', 'prizebond', 'currency', 'fuel', 'petrolprice', 'fuelavg', 'electricity', 'gasbill'] },
  { name: 'Files & converters', ids: ['jpgtopdf', 'pdftojpg', 'pngtojpg', 'heic', 'webp', 'jpgtowebp', 'qr', 'unitconv', 'htmltovideo'] },
  { name: 'Everyday tools', ids: ['age', 'bmi', 'percentage', 'wordcounter', 'datecalc', 'password', 'cgpa', 'attendance', 'whatsmyip'] },
  { name: 'Fun & Entertainment', ids: ['love'] },
  { name: 'Gaming', ids: ['gta6price', 'gta6download', 'gta6countdown', 'gta6pccheck', 'gta6totalcost', 'gta6preorder', 'gta6storage', 'gta6nztick', 'gta6pcdate'] },
].map((c) => ({ name: c.name, tools: c.ids.map((id) => BY_ID[id]).filter(Boolean) }));
// One real photo per category - shown as a wide banner at the top of the
// category when it is opened, and as a slim banner on tool pages (see
// CAT_ALT below). Photos live in public/images/ (see CREDITS.md there);
// none is hotlinked or AI-made. Tool cards themselves are text-only.
const CAT_IMAGE = {
  'Home & Property': '/images/home-property.webp',
  'Money & Tax': '/images/money-tax.webp',
  'Prices & Fuel': '/images/prices-fuel.webp',
  'Files & converters': '/images/files-converters.webp',
  'Everyday tools': '/images/everyday-tools.webp',
  'Fun & Entertainment': '/images/fun-entertainment.webp',
  'Gaming': '/images/gaming.webp',
};
const CAT_ALT = {
  'Home & Property': 'A modern house exterior',
  'Money & Tax': 'A calculator with coins on a desk',
  'Prices & Fuel': 'Fuel pumps at a petrol station at night',
  'Files & converters': 'Paperwork being scanned at a desk',
  'Everyday tools': 'A person writing in a notebook at a desk',
  'Fun & Entertainment': 'Three friends laughing together outdoors',
  'Gaming': 'A person playing a video game with a controller',
};
// One short human line per category, shown under the heading when the
// category is opened (TheCalculatorSite pattern).
const CAT_DESC = {
  'Home & Property': 'Marla, Kanal and plot sizes — work out your land and home numbers.',
  'Money & Tax': 'Tax, salary, loans and everyday money, worked out in seconds.',
  'Prices & Fuel': 'Gold, fuel and currency prices — and what a trip will cost.',
  'Files & converters': 'Convert files and images in your browser. Nothing is uploaded.',
  'Everyday tools': 'Age, BMI, words, dates and passwords — the small tools you use most.',
  'Fun & Entertainment': 'Just for fun — try it, then share it.',
  'Gaming': 'GTA 6 prices, downloads and release dates, all in one place.',
};
// One real photo per Most Popular tool, keyed by tool id (not category),
// so no photo repeats across cards. Wide 3:2 photo on top, title below.
const POPULAR_IMAGE = {
  jpgtopdf: { src: '/images/pop-jpgtopdf.webp', alt: 'A contract document with a fountain pen' },
  loanemi: { src: '/images/pop-loanemi.webp', alt: 'A calculator next to receipts and papers on a desk' },
  age: { src: '/images/pop-age.webp', alt: 'A first-birthday cake with a number 1 candle' },
  bmi: { src: '/images/pop-bmi.webp', alt: 'Feet on a bathroom weighing scale' },
  mortgage: { src: '/images/pop-mortgage.webp', alt: 'A hand holding house keys with a house-shaped keyring' },
  marla: { src: '/images/pop-marla.webp', alt: 'An empty plot of land in a neighbourhood' },
  pta: { src: '/images/pop-pta.webp', alt: 'A hand holding a smartphone' },
  currency: { src: '/images/pop-currency.webp', alt: 'Banknotes and coins from different countries' },
  gta6price: { src: '/images/pop-gta6.webp', alt: 'A man holding two game controllers in front of a TV' },
  htmltovideo: { src: '/images/pop-htmltovideo.webp', alt: 'Students editing video at a desk with monitors showing a timeline' },
};
// In dark mode the bright photos glare against the near-black page, so dim
// them slightly (hero, popular cards, banners, About photo).
const dimDark = (theme) => (theme.palette.mode === 'dark' ? 'brightness(0.88)' : 'none');
const ID_TO_CAT = {};
CATEGORIES.forEach((c) => c.tools.forEach((t) => { ID_TO_CAT[t.id] = c.name; }));
// Per-page topical related lists - must match prerender-plugin.mjs TOPICAL_RELATED.
// A page with a list here shows exactly those links; every other page shows
// the first 4 tools from its own category.
const TOPICAL_RELATED = { salarytax: ['bps', 'freelancer', 'taxslab', 'salarycalc', 'zakat', 'pta'], eobi: ['gratuity', 'providentfund', 'salarytax', 'bps', 'salarycalc'], gratuity: ['eobi', 'providentfund', 'dailywage', 'salarytax', 'bps'], providentfund: ['eobi', 'gratuity', 'salarytax', 'salarycalc', 'bps'] };
const POPULAR = ['gta6price', 'jpgtopdf', 'loanemi', 'age', 'bmi', 'mortgage', 'marla', 'pta', 'currency', 'htmltovideo'].map((id) => BY_ID[id]).filter(Boolean);
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
// Cards are text-only - the photo lives on the Most Popular cards, the
// category banner and the tool-page banner instead.
function ToolCard({ t, go, hideCat }) {
  return (<Card elevation={0} sx={{ height: '100%', transition: 'box-shadow 0.15s ease, transform 0.15s ease', '&:hover': { boxShadow: (theme) => (theme.palette.mode === 'dark' ? '0 6px 24px rgba(0,0,0,0.55)' : '0 6px 24px rgba(0,0,0,0.10)'), transform: 'translateY(-2px)' } }}>
    <CardContent component="a" href={`/tools/${t.slug}/`} onClick={(e) => go(e, `/tools/${t.slug}/`)} onMouseEnter={() => preloadTool(t.id)} onFocus={() => preloadTool(t.id)} sx={{ display: 'block', textDecoration: 'none', color: 'inherit', height: '100%' }}>
      <Typography fontWeight={700} sx={{ lineHeight: 1.35, minHeight: '2.7em', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{showTitle(t)}</Typography>
      {!hideCat && (<Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{ID_TO_CAT[t.id] || t.cat}</Typography>)}
    </CardContent>
  </Card>);
}

function ToolGrid({ tools, go, mdCols = 3, hideCat }) {
  return (<Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', md: `repeat(${mdCols}, minmax(0, 1fr))` } }}>{tools.map((t) => (<ToolCard key={t.id} t={t} go={go} hideCat={hideCat} />))}</Box>);
}

// Most Popular card: wide 3:2 photo on top, title below, never overlaid
// (Omni / Investopedia editorial-card pattern).
function PopularCard({ t, go }) {
  const img = POPULAR_IMAGE[t.id];
  return (<Card elevation={0} sx={{ height: '100%', overflow: 'hidden', transition: 'box-shadow 0.15s ease, transform 0.15s ease', '&:hover': { boxShadow: (theme) => (theme.palette.mode === 'dark' ? '0 6px 24px rgba(0,0,0,0.55)' : '0 6px 24px rgba(0,0,0,0.10)'), transform: 'translateY(-2px)' } }}>
    <CardContent component="a" href={`/tools/${t.slug}/`} onClick={(e) => go(e, `/tools/${t.slug}/`)} onMouseEnter={() => preloadTool(t.id)} onFocus={() => preloadTool(t.id)} sx={{ display: 'block', textDecoration: 'none', color: 'inherit', height: '100%', p: 0, '&:last-child': { pb: 0 } }}>
      {img && (<Box component="img" src={img.src} alt={img.alt} loading="lazy" sx={{ width: '100%', aspectRatio: '3 / 2', objectFit: 'cover', display: 'block', filter: dimDark }} />)}
      <Box sx={{ p: 2 }}>
        <Typography fontWeight={700} sx={{ lineHeight: 1.35, minHeight: '2.7em', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{showTitle(t)}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{ID_TO_CAT[t.id] || t.cat}</Typography>
      </Box>
    </CardContent>
  </Card>);
}

function PopularGrid({ tools, go }) {
  return (<Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', md: 'repeat(3, minmax(0, 1fr))' } }}>{tools.map((t) => (<PopularCard key={t.id} t={t} go={go} />))}</Box>);
}

export default function App({ mode = 'light', onToggleMode = () => {} }) {
  const theme = useTheme();
  const [route, setRoute] = useState(() => parseRoute(window.location.pathname));
  const [q, setQ] = useState('');
  const [openCat, setOpenCat] = useState(null);
  // Refs so scroll fixes can find the open category accordion even from
  // handlers registered once (popstate): the header a click just opened,
  // and the category to return to on Back.
  const accordionRefs = useRef({});
  const openCatRef = useRef(null);
  useEffect(() => { openCatRef.current = openCat; }, [openCat]);
  // Navigating clears the search text, so a tool clicked from the search
  // results renders the tool at once instead of the results view.
  const navigate = (path) => { setQ(''); if (window.location.pathname !== path) { window.history.pushState(null, '', path); setRoute(parseRoute(path)); } window.scrollTo(0, 0); };
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
    const onPop = () => { const p = parseRoute(window.location.pathname); setRoute(p); if (p.kind === 'home' && openCatRef.current) setTimeout(() => accordionRefs.current[openCatRef.current]?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60); };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  // Keep the browser chrome (theme-color) in step with the mode.
  useEffect(() => {
    setMetaTag('theme-color', theme.palette.background.default);
  }, [theme]);

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
  // other 51 arrive as one small chunk the first time a tool page needs one.
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
    else if (route.kind === 'about') { document.title = 'About | Kalkio'; setMetaTag('description', 'About Kalkio: 59 free calculators and converters that run in your browser. No sign-up, no accounts.'); setCanonical(pageUrl('/about/')); setFaqJsonLd(null); }
    else if (route.kind === 'contact') { document.title = 'Contact | Kalkio'; setMetaTag('description', 'Contact Kalkio by email. Tools run in your browser and no sign-up is needed.'); setCanonical(pageUrl('/contact/')); setFaqJsonLd(null); }
    else if (route.kind === 'privacy') { document.title = 'Privacy Policy | Kalkio'; setMetaTag('description', 'Kalkio privacy: tools run in your browser, file converters do not upload your files to a server, and no account is needed.'); setCanonical(pageUrl('/privacy/')); setFaqJsonLd(null); }
    else { document.title = 'Tool not found | Kalkio'; setMetaTag('description', 'That tool does not exist on Kalkio. Browse all 59 free tools on the home page.'); setCanonical(BASE_URL + '/'); setFaqJsonLd(null); }
  }, [route, cur]);

  // Footer category link: go home, open that category, scroll to it.
  const goCategory = (e, name) => {
    e.preventDefault();
    if (route.kind !== 'home') navigate('/');
    setOpenCat(name);
    setTimeout(() => document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' }), 60);
  };

  const footer = (<Box component="footer" sx={{ mt: 6, pt: 4, pb: 2, borderTop: '1px solid', borderColor: 'divider' }}>
    <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', md: '2fr 1fr 1fr 1fr 1.5fr' } }}>
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Box component="img" src={mode === 'dark' ? '/logo-dark.svg' : '/logo.svg'} alt="Kalkio" sx={{ height: 28, width: 'auto', display: 'block' }} />
        </Box>
        <Typography variant="body2" color="text.secondary">Free calculators and converters. No sign-up.</Typography>
      </Box>
      <Box>
        <Typography variant="subtitle2" fontWeight={700} gutterBottom>Categories</Typography>
        {CATEGORIES.map((c) => (<Typography key={c.name} variant="body2" sx={{ mb: 0.5 }}><Link href="/" onClick={(e) => goCategory(e, c.name)} underline="hover" color="text.secondary">{c.name}</Link></Typography>))}
      </Box>
      <Box>
        <Typography variant="subtitle2" fontWeight={700} gutterBottom>Kalkio</Typography>
        <Typography variant="body2" sx={{ mb: 0.5 }}><Link href="/about/" onClick={(e) => go(e, '/about/')} underline="hover" color="text.secondary">About</Link></Typography>
        <Typography variant="body2" sx={{ mb: 0.5 }}><Link href="/contact/" onClick={(e) => go(e, '/contact/')} underline="hover" color="text.secondary">Contact</Link></Typography>
        <Typography variant="body2" sx={{ mb: 0.5 }}><Link href="/privacy/" onClick={(e) => go(e, '/privacy/')} underline="hover" color="text.secondary">Privacy Policy</Link></Typography>
        <Typography variant="body2" sx={{ mb: 0.5 }}><Link href="/about/#photo-credits" underline="hover" color="text.secondary">Photo credits</Link></Typography>
      </Box>
      <Box>
        <Typography variant="subtitle2" fontWeight={700} gutterBottom>Our other sites</Typography>
        <Typography variant="body2" sx={{ mb: 0.5 }}><Link href="https://techdealsgo.com/" target="_blank" rel="noopener noreferrer" underline="hover" color="text.secondary">TechDealsGo</Link> - Amazon deals and discounts</Typography>
        <Typography variant="body2" sx={{ mb: 0.5 }}><Link href="https://freeforall-offers.vercel.app/" target="_blank" rel="noopener noreferrer" underline="hover" color="text.secondary">FreeForAll</Link> - Free trials and offers</Typography>
      </Box>
      <Box>
        <Typography variant="subtitle2" fontWeight={700} gutterBottom>Contact</Typography>
        <Typography variant="body2"><Link href="mailto:sammykhanmalng@gmail.com" underline="hover" color="text.secondary">sammykhanmalng@gmail.com</Link></Typography>
      </Box>
    </Box>
    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 3, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>© 2026 Kalkio · Last updated 13 Nov 2026. · Tax, bill and fuel results are estimates.</Typography>
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

  // Sticky header: logo, search, nav, dark-mode toggle. The search filters
  // every tool; typing shows the matches as cards in the main content below.
  const header = (<AppBar position="sticky" elevation={0} sx={{ bgcolor: 'background.paper', color: 'text.primary', borderBottom: '1px solid', borderColor: 'divider' }}>
    <Toolbar sx={{ gap: 2, flexWrap: 'wrap', py: 0.5, minHeight: 56 }}>
      <Box component="a" href="/" onClick={(e) => go(e, '/')} sx={{ display: 'flex', alignItems: 'center', gap: 1, textDecoration: 'none', color: 'inherit' }}>
        <Box component="img" src={mode === 'dark' ? '/logo-dark.svg' : '/logo.svg'} alt="Kalkio" sx={{ height: 32, width: 'auto', display: 'block' }} />
      </Box>
      <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', order: { xs: 3, md: 2 }, flexBasis: { xs: '100%', md: 'auto' } }}>
        <TextField size="small" fullWidth sx={{ maxWidth: 520 }} placeholder="Search a tool... e.g. JPG to PDF" value={q} onChange={(e) => setQ(e.target.value)} InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon color="action" /></InputAdornment>), endAdornment: q ? (<InputAdornment position="end"><IconButton size="small" onClick={() => setQ('')} aria-label="Clear search"><CloseIcon fontSize="small" /></IconButton></InputAdornment>) : null }} />
      </Box>
      <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2.5, alignItems: 'center', order: 3 }}>
        <Link href="/" onClick={(e) => go(e, '/')} underline="hover" color="text.primary" fontWeight={700}>All tools</Link>
        <Link href="/about/" onClick={(e) => go(e, '/about/')} underline="hover" color="text.primary" fontWeight={700}>About</Link>
        <Link href="/contact/" onClick={(e) => go(e, '/contact/')} underline="hover" color="text.primary" fontWeight={700}>Contact</Link>
      </Box>
      <IconButton onClick={onToggleMode} aria-label={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'} title={mode === 'dark' ? 'Light mode' : 'Dark mode'} sx={{ order: { xs: 2, md: 4 }, ml: { xs: 'auto', md: 0 } }}>
        {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>
    </Toolbar>
  </AppBar>);

  const searchView = (<Box sx={{ py: 4 }}>
    <Typography variant="h4" component="h1" fontWeight={800} gutterBottom>Results for "{q.trim()}"</Typography>
    {searchResults.length === 0 ? (<>
      <Typography variant="body1" color="text.secondary" gutterBottom>No tool found - try another word, e.g. PDF, loan or Marla.</Typography>
      <Typography variant="h6" component="h2" fontWeight={700} sx={{ mt: 3, mb: 2 }}>Try these popular tools</Typography>
      <PopularGrid tools={POPULAR} go={go} />
    </>) : (<ToolGrid tools={searchResults} go={go} />)}
  </Box>);

  const homeView = (<>
    {/* Bankrate-style hero: one bright real photo, full width, dark gradient
        with the headline overlaid in white. The H1 text is unchanged (SEO). */}
    <Box sx={{ position: 'relative', width: '100vw', ml: 'calc(50% - 50vw)', mt: { xs: 2, md: 3 }, mb: 3 }}>
      <Box component="img" src="/images/hero.webp" alt="A large calculator on a bright desk" fetchPriority="high" sx={{ width: '100%', height: { xs: 300, md: 380 }, objectFit: 'cover', objectPosition: 'center', display: 'block', filter: (theme) => (theme.palette.mode === 'dark' ? 'brightness(0.82)' : 'none') }} />
      <Box sx={{ position: 'absolute', inset: 0, background: { xs: 'linear-gradient(180deg, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.42) 50%, rgba(0,0,0,0.72) 100%)', md: 'linear-gradient(90deg, rgba(0,0,0,0.68) 0%, rgba(0,0,0,0.38) 55%, rgba(0,0,0,0.08) 100%), linear-gradient(0deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 50%)' } }} />
      <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center' }}>
        <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto', px: 3 }}>
          <Typography variant="h3" component="h1" fontWeight={800} sx={{ color: '#fff', fontSize: { xs: '1.75rem', md: '2.25rem' }, lineHeight: 1.2, maxWidth: 640 }}>59 free calculators and converters.</Typography>
          <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.93)', fontWeight: 400, mt: 1, maxWidth: 640 }}>From loan EMI and age to JPG to PDF and GTA 6 prices. Everything runs in your browser. No sign-up.</Typography>
        </Box>
      </Box>
    </Box>
    <Typography variant="body2" color="text.secondary" fontWeight={700} sx={{ mb: 1, textAlign: 'center' }}>Categories</Typography>
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, pb: 1, mb: 1, justifyContent: 'center' }}>
      {CATEGORIES.map((c) => (<Button key={c.name} variant={openCat === c.name ? 'contained' : 'outlined'} sx={{ borderRadius: 10, whiteSpace: 'nowrap', textTransform: 'none', fontWeight: 700 }} onClick={() => { setOpenCat(openCat === c.name ? null : c.name); document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' }); }}>{c.name}</Button>))}
    </Box>
    <Typography variant="h5" component="h2" fontWeight={800} gutterBottom>Most popular</Typography>
    <PopularGrid tools={POPULAR} go={go} />
    <Box id="categories" sx={{ mt: 5, scrollMarginTop: '80px' }}>
      <Typography variant="h5" component="h2" fontWeight={800} gutterBottom>Browse all tools</Typography>
      {CATEGORIES.map((c) => (<Accordion key={c.name} ref={(el) => { if (el) { accordionRefs.current[c.name] = el; } }} expanded={openCat === c.name} onChange={() => { const next = openCat === c.name ? null : c.name; setOpenCat(next); if (next) setTimeout(() => accordionRefs.current[next]?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 350); }} sx={{ mb: 1, scrollMarginTop: '80px' }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography fontWeight={700}>{c.name} <Typography component="span" variant="body2" color="text.secondary" fontWeight={400}>({c.tools.length} tool{c.tools.length === 1 ? '' : 's'})</Typography></Typography></AccordionSummary>
        <AccordionDetails>
          {openCat === c.name && (<>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{CAT_DESC[c.name]}</Typography>
            <Box component="img" src={CAT_IMAGE[c.name]} alt={CAT_ALT[c.name]} loading="lazy" sx={{ width: '100%', aspectRatio: '16 / 9', maxHeight: { xs: 180, md: 320 }, objectFit: 'cover', borderRadius: 2, display: 'block', mb: 2, filter: dimDark }} />
          </>)}
          <ToolGrid tools={c.tools} go={go} hideCat />
        </AccordionDetails>
      </Accordion>))}
    </Box>
    <Typography variant="h5" component="h2" fontWeight={800} sx={{ mt: 5 }} gutterBottom>Common questions</Typography>
    {HOME_FAQS.map(([q, a]) => (<Accordion key={q} sx={{ mb: 1 }}><AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography fontWeight={700}>{q}</Typography></AccordionSummary><AccordionDetails><Typography variant="body2" color="text.secondary">{a}</Typography></AccordionDetails></Accordion>))}
  </>);

  const toolView = cur && (<Box sx={{ maxWidth: 720, mx: 'auto', py: 4 }}>
    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
      <Link href="/" onClick={(e) => go(e, '/')} underline="hover" color="inherit">Home</Link>{' / '}{ID_TO_CAT[cur.id] || cur.cat}
    </Typography>
    {CAT_IMAGE[ID_TO_CAT[cur.id]] && (<Box component="img" src={CAT_IMAGE[ID_TO_CAT[cur.id]]} alt={CAT_ALT[ID_TO_CAT[cur.id]]} loading="lazy" sx={{ width: '100%', height: { xs: 110, md: 140 }, objectFit: 'cover', borderRadius: 2, display: 'block', mb: 2, filter: dimDark }} />)}
    <Typography variant="h4" component="h1" fontWeight={800} gutterBottom>{showTitle(cur)}</Typography>
    <Typography variant="body1" color="text.secondary" gutterBottom>{ID_TO_CAT[cur.id] || cur.cat}{' · No sign-up.'}</Typography>
    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>Guide last updated{' '}{CONTENT_UPDATED}.</Typography>
    {cur.id === 'salarytax' && (<Typography variant="body1" sx={{ mb: 2, fontWeight: 700 }}>Quick answer: Up to Rs 600,000 a year is tax-free; Rs 100,000 a month pays Rs 500 a month in tax.</Typography>)}
    <Suspense fallback={<Card elevation={2} sx={{ borderRadius: 3 }}><CardContent sx={{ py: 5, textAlign: 'center' }}><CircularProgress /><Typography color="text.secondary" sx={{ mt: 1 }}>Loading calculator...</Typography></CardContent></Card>}><cur.Component key={cur.id} /></Suspense>
    {cur.id === 'marla' && (<>
      <Box sx={{ bgcolor: (theme) => alpha(theme.palette.secondary.main, 0.12), borderRadius: 2, p: 2, mt: 2 }}><Typography variant="body2">225 sq ft is common in housing societies like DHA and Bahria Town. 250 sq ft is the CDA Islamabad standard. 272.25 sq ft is the revenue-record Marla. Confirm from your plot documents which one applies to you.</Typography></Box>
      <Accordion sx={{ mt: 2 }}><AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography fontWeight={700}>How it works</Typography></AccordionSummary><AccordionDetails><Typography variant="body2" color="text.secondary">Square feet = Marla × sq ft per Marla. Square yards = square feet ÷ 9. Square metres = square feet ÷ 10.7639. Kanal = Marla ÷ 20. Acre = Marla ÷ 160.</Typography></AccordionDetails></Accordion>
      <Accordion><AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography fontWeight={700}>225 vs 250 vs 272.25 - quick table</Typography></AccordionSummary><AccordionDetails><Box sx={{ overflowX: 'auto' }}><Table size="small" sx={{ minWidth: 480 }}><TableBody>{[[1, 225, 250, 272.25], [5, 1125, 1250, 1361.25], [10, 2250, 2500, 2722.5], [20, 4500, 5000, 5445]].map(([m, a, b, c]) => (<TableRow key={m}><TableCell>{m === 20 ? '20 = 1 Kanal' : `${m} Marla`}</TableCell><TableCell>{fmt(a)}</TableCell><TableCell>{fmt(b)}</TableCell><TableCell>{fmt(c)}</TableCell></TableRow>))}</TableBody></Table></Box></AccordionDetails></Accordion>
      <Accordion><AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography fontWeight={700}>Common questions</Typography></AccordionSummary><AccordionDetails><Typography variant="body2" color="text.secondary" paragraph><b>How many Marla in 1 Kanal?</b> 20 Marla, under both standards.</Typography><Typography variant="body2" color="text.secondary"><b>Which standard should I use?</b> The one written in your plot documents.</Typography></AccordionDetails></Accordion>
    </>)}
    <Box sx={{ mt: 2 }}><Button variant="outlined" color="success" startIcon={<WhatsAppIcon />} component="a" href={`https://wa.me/?text=${encodeURIComponent(showTitle(cur) + ' - ' + toolUrl(cur.slug))}`} target="_blank" rel="noopener noreferrer">Share on WhatsApp</Button></Box>
    {guide && (<Box component="section" sx={{ mt: 4 }}>{guide.map((s) => (<Box key={s.h} sx={{ mb: 3 }}>
      <Typography variant="h5" component="h2" fontWeight={700} gutterBottom>{s.h}</Typography>
      {s.p.map((para, i) => (<Typography key={i} variant="body1" color="text.secondary" paragraph>{renderGuideText(para)}</Typography>))}
      {s.table && (<Box sx={{ overflowX: 'auto' }}><Table size="small" sx={{ minWidth: Math.max(320, s.table.head.length * 130) }}><TableBody><TableRow>{s.table.head.map((c) => (<TableCell key={c} sx={{ fontWeight: 700 }}>{c}</TableCell>))}</TableRow>{s.table.rows.map((r, ri) => (<TableRow key={ri}>{r.map((c, ci) => (<TableCell key={ci}>{c}</TableCell>))}</TableRow>))}</TableBody></Table></Box>)}
    </Box>))}</Box>)}
    {cur.id !== 'marla' && cur.faqs && cur.faqs.length > 0 && (<Accordion sx={{ mt: 2 }}><AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography fontWeight={700}>Common questions</Typography></AccordionSummary><AccordionDetails>{cur.faqs.map(([fq, fa]) => (<Typography key={fq} variant="body2" color="text.secondary" paragraph><b>{fq}</b> {fa}</Typography>))}</AccordionDetails></Accordion>)}
    {(() => { const topical = TOPICAL_RELATED[cur.id]; const sib = topical ? topical.map((id) => BY_ID[id]).filter(Boolean) : (CATEGORIES.find((c) => c.name === ID_TO_CAT[cur.id]) || { tools: [] }).tools.filter((t) => t.id !== cur.id).slice(0, 4); return sib.length > 0 ? (<Box sx={{ mt: 5 }}><Typography variant="h6" component="h2" fontWeight={700} gutterBottom>More free tools</Typography><ToolGrid tools={sib} go={go} mdCols={2} /></Box>) : null; })()}
  </Box>);

  const aboutView = staticPage('About Kalkio', (<>
    <Box component="img" src="/images/about.webp" alt="A bright home office desk with a laptop" sx={{ width: '100%', height: { xs: 180, md: 260 }, objectFit: 'cover', objectPosition: 'center', borderRadius: 3, display: 'block', mb: 3, filter: dimDark }} />
    <Typography variant="body1" paragraph>Kalkio is a collection of 59 free calculators and converters, covering property, tax and salary, prices, finance, files and everyday calculations.</Typography>
    <Typography variant="body1" paragraph>How to use it: search for a tool or browse a category, enter your numbers, and the result appears straight away. There is nothing to install and no account to create.</Typography>
    <Typography variant="body1" paragraph>Every tool runs in the visitor’s browser - there is no backend, no database, no login and no sign-up. File converters also run fully in the browser, so your files never leave your device.</Typography>
    <Typography variant="body1" paragraph>The tools cover everyday needs: converting Marla and Kanal, working out salary tax, Zakat and PTA tax, checking petrol and gold prices, converting files, and checking GTA 6 prices and release dates.</Typography>
    <Typography variant="body1" paragraph>Tax, bill and fuel results are estimates - confirm official rates before a financial decision.</Typography>
    <Typography variant="body1" paragraph>Kalkio is made by the same team behind <Link href="https://techdealsgo.com/" target="_blank" rel="noopener noreferrer">TechDealsGo</Link>, a site for Amazon deals and discounts, and <Link href="https://freeforall-offers.vercel.app/" target="_blank" rel="noopener noreferrer">FreeForAll</Link>, a site for free trials and offers.</Typography>
    <Typography variant="body1" paragraph>Questions or a tool to suggest? Email <Link href="mailto:sammykhanmalng@gmail.com">sammykhanmalng@gmail.com</Link>.</Typography>
    <Typography id="photo-credits" variant="h5" component="h2" fontWeight={700} gutterBottom sx={{ mt: 4 }}>Photo credits</Typography>
    <Typography variant="body2" color="text.secondary" paragraph>Photos on this site are real photographs. The fun and gaming photos, the gaming-controllers photo and the calculator-and-receipts photo are public domain. The photos below are shared under Creative Commons licences, credited here as the licences require:</Typography>
    <Typography variant="body2" color="text.secondary" paragraph>Calculator (home page) — Hayden Schiff, <Link href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer">CC BY 4.0</Link>. Contract and pen — Blogtrepreneur, <Link href="https://creativecommons.org/licenses/by/2.0/" target="_blank" rel="noopener noreferrer">CC BY 2.0</Link>. First-birthday cake — JIP, <Link href="https://creativecommons.org/licenses/by-sa/3.0/" target="_blank" rel="noopener noreferrer">CC BY-SA 3.0</Link>. Bathroom scale — Frank C. Müller, <Link href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener noreferrer">CC BY-SA 4.0</Link>. House keys — Shixart1985, <Link href="https://creativecommons.org/licenses/by/2.0/" target="_blank" rel="noopener noreferrer">CC BY 2.0</Link>. Empty plot of land — Kambai Akau, <Link href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener noreferrer">CC BY-SA 4.0</Link>. Hand holding a phone — Santeri Viinamäki, <Link href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener noreferrer">CC BY-SA 4.0</Link>. Banknotes and coins — Santeri Viinamäki, <Link href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener noreferrer">CC BY-SA 4.0</Link>. Video editing — Faculty of Dramatic Arts in Belgrade, <Link href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener noreferrer">CC BY-SA 4.0</Link>. Home office (this page) — Shixart1985, <Link href="https://creativecommons.org/licenses/by/2.0/" target="_blank" rel="noopener noreferrer">CC BY 2.0</Link>. Modern house exterior — Shixart1985, <Link href="https://creativecommons.org/licenses/by/2.0/" target="_blank" rel="noopener noreferrer">CC BY 2.0</Link>. Calculator with coins — Images of Money, <Link href="https://creativecommons.org/licenses/by/2.0/" target="_blank" rel="noopener noreferrer">CC BY 2.0</Link>. Petrol station at night — Harrison Keely, <Link href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer">CC BY 4.0</Link>. Scanning documents — NAVFAC, <Link href="https://creativecommons.org/licenses/by/2.0/" target="_blank" rel="noopener noreferrer">CC BY 2.0</Link>. Writing in a notebook — Shixart1985, <Link href="https://creativecommons.org/licenses/by/2.0/" target="_blank" rel="noopener noreferrer">CC BY 2.0</Link>.</Typography>
  </>));
  const contactView = staticPage('Contact Kalkio', (<>
    <Typography variant="body1" paragraph>Questions about Kalkio? Email us at <Link href="mailto:sammykhanmalng@gmail.com">sammykhanmalng@gmail.com</Link>.</Typography>
    <Typography variant="body1" paragraph>Tools run in your browser and no sign-up is needed, so there is no account to recover.</Typography>
  </>));
  const privacyView = staticPage('Privacy Policy', (<>
    <Typography variant="body1" paragraph>The tools on Kalkio run in your browser. They do not ask you to create an account, and they do not send your calculator inputs to a server.</Typography>
    <Typography variant="body1" paragraph>File converters (HEIC, WebP, PNG, JPG and PDF) also run fully in the browser - your files are never uploaded to a server.</Typography>
    <Typography variant="body1" paragraph>Passwords and QR codes are generated locally on your device and never sent anywhere.</Typography>
    <Typography variant="body1" paragraph>Tax, bill and fuel results are estimates. Confirm official rates before a financial decision.</Typography>
    <Typography variant="body1" paragraph>Questions about this policy: <Link href="mailto:sammykhanmalng@gmail.com">sammykhanmalng@gmail.com</Link>.</Typography>
  </>));

  return (<>
    <CssBaseline />
    <a href="#main-content" className="skip-link">Skip to main content</a>
    {header}
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pb: 4, overflowX: 'clip' }}>
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
