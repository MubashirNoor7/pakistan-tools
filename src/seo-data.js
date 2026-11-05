// SEO data for Kalkio - single source of truth for slugs, meta descriptions and
// FAQ schema. Descriptions and FAQ answers use ONLY facts already present in the
// tool code/notes (inputs, outputs, on-page disclaimers). No rates, prices or
// official rules are invented here. Tool calculations are untouched.
export const BASE_URL = 'https://kalkio.vercel.app';
export const BRAND = 'Kalkio';
export const HOME_TITLE = 'Kalkio - Free Pakistan Calculators & Converters';
export const HOME_DESC = 'Kalkio: 40 free calculators and converters - Marla, salary tax, PTA tax, SIP, loan EMI, QR codes, BMI, file converters and more. No sign-up, everything runs in your browser.';

// Universal FAQ answers (true for every tool on this site).
const FREE = ['Is this tool free?', 'Yes. It is free and no sign-up is needed.'];
const BROWSER = ['Does my data leave my device?', 'No. The tool runs in your browser and does not ask you to create an account.'];
const FILE_PRIVATE = ['Is my file uploaded to a server?', 'No. Conversion runs in your browser only, nothing is uploaded to a server.'];
const ESTIMATE = ['Is the result exact?', 'No, it is an estimate. Confirm official rates before a financial decision.'];

// slug, desc, faqs (at most 3 per tool) keyed by tool id from src/App.jsx.
export const SEO_BY_ID = {
  marla: { slug: 'marla-to-sq-ft-converter-pakistan', desc: 'Convert Marla to square feet using the 225 and 272.25 sq ft standards, with square yards, Kanal and acre shown too. Free, no sign-up, and it runs in your browser.', faqs: [FREE, ['How many Marla in 1 Kanal?', '20 Marla, under both standards.'], ['Which standard should I use?', 'The one written in your plot documents.']] },
  kanal: { slug: 'kanal-to-marla-converter-pakistan', desc: 'Convert Kanal to Marla, square feet, square yards and acre, using the 225 or 272.25 sq ft Marla standard. Free, no sign-up, and it runs in your browser.', faqs: [FREE, BROWSER] },
  plotsize: { slug: 'plot-size-calculator-length-width-to-marla', desc: 'Enter a plot’s length and width in feet to get its area in Marla, Kanal, square feet and square yards. Free, no sign-up, and it runs in your browser.', faqs: [FREE, BROWSER] },
  salarytax: { slug: 'pakistan-salary-tax-calculator-2026-27', desc: 'Estimate Pakistan salaried income tax for 2026-27 from a monthly salary, with monthly deduction and take-home pay. An estimate only - allowances and payslip figures can change the final amount.', faqs: [FREE, ['Did salary tax go down in 2026-27?', 'Yes, for most salaries. The 20% slab was 23% and the 25% slab was 30% in 2025-26, and the surcharge above Rs 10 million a year was abolished. Tax on Rs 300,000 a month fell from Rs 466,000 to Rs 416,000 a year.'], BROWSER] },
  bps: { slug: 'bps-salary-calculator-pakistan-2026-27', desc: 'Estimate BPS take-home pay from basic pay and the allowances on your payslip. Allowances vary by grade, city and department, so enter your own figures; the result is an estimate.', faqs: [FREE, ['Why do I enter allowances myself?', 'BPS allowances vary by grade, city and department, so there is no single fixed table. Enter the allowances from your payslip.'], BROWSER] },
  pta: { slug: 'pta-tax-calculator-pakistan-by-phone-model', desc: 'Estimate PTA tax from a phone’s customs value in USD, the exchange rate, and filer or non-filer status. An estimate only - confirm the final amount before paying.', faqs: [FREE, ['Is PTA tax cheaper on a passport than on a CNIC?', 'Yes, by the income tax only. Registering on a passport within 60 days of arrival skips the income tax line, which saves up to Rs 11,500 on phones above $500. The other charges are the same.'], BROWSER] },
  freelancer: { slug: 'freelancer-tax-calculator-pakistan-154a', desc: 'Estimate freelancer tax under Section 154A from annual export receipts, with PSEB-registered and filer options. The result is an estimate - confirm from FBR or your tax adviser.', faqs: [FREE, ESTIMATE, BROWSER] },
  zakat: { slug: 'zakat-calculator-pakistan-cash-gold', desc: 'Work out Zakat at 2.5% of zakatable wealth from cash, gold, silver, stocks and debts. For religious rulings, confirm with a scholar.', faqs: [FREE, ['What rate does this use?', 'Zakat is 2.5% of zakatable wealth held for a lunar year, above nisab.'], BROWSER] },
  fuel: { slug: 'fuel-trip-cost-calculator-pakistan-ogra', desc: 'Work out a trip’s fuel cost and litres needed from distance, mileage and the fuel rate, which you can edit. Fuel rates change often, so check today’s OGRA rate for an exact cost.', faqs: [FREE, ['Why can I edit the fuel rate?', 'Fuel rates change often. Editing the rate to today’s OGRA rate gives an exact trip cost.'], BROWSER] },
  heic: { slug: 'heic-to-jpg-converter-online', desc: 'Convert HEIC photos to JPG in your browser. Your file is never uploaded to a server. Free, no sign-up.', faqs: [FREE, FILE_PRIVATE] },
  webp: { slug: 'webp-to-jpg-converter-online', desc: 'Convert WebP images to JPG in your browser. Your file is never uploaded to a server. Free, no sign-up.', faqs: [FREE, FILE_PRIVATE] },
  rentvsbuy: { slug: 'rent-vs-buy-calculator-pakistan', desc: 'Compare the cost of renting versus buying a home in Pakistan. An estimate only, to help you weigh the two options.', faqs: [FREE, ESTIMATE, BROWSER] },
  taxslab: { slug: 'pakistan-tax-slab-2026-27-which-slab-are-you-in', desc: 'Find which Pakistan salary tax slab for 2026-27 your annual salary falls in. An estimate tool - confirm from FBR before filing.', faqs: [FREE, ESTIMATE, BROWSER] },
  gold: { slug: 'gold-price-pakistan-today-1-tola-calculator', desc: 'Work out the value of gold in tolas from the price you enter. You enter the current price, so the result follows the price you type in.', faqs: [FREE, BROWSER] },
  prizebond: { slug: 'prize-bond-pakistan-prize-after-tax-calculator', desc: 'Work out a prize bond prize after tax from the prize amount. Free, no sign-up, and it runs in your browser.', faqs: [FREE, BROWSER] },
  jpgtopdf: { slug: 'jpg-to-pdf-converter-online', desc: 'Turn JPG images into a PDF in your browser, without uploading your files. Free, no sign-up.', faqs: [FREE, FILE_PRIVATE] },
  fuelavg: { slug: 'fuel-average-calculator-pakistan-km-per-litre', desc: 'Work out your vehicle’s fuel average in km per litre from distance and fuel used. Free, no sign-up, and it runs in your browser.', faqs: [FREE, BROWSER] },
  currency: { slug: 'currency-converter-usd-to-pkr', desc: 'Convert between currencies, including USD to PKR. Exchange rates move during the day, so the result is an estimate.', faqs: [FREE, ESTIMATE, BROWSER] },
  loanemi: { slug: 'loan-emi-calculator', desc: 'Work out a loan’s monthly EMI from amount, interest rate and duration. An estimate only, not a bank offer.', faqs: [FREE, ESTIMATE, BROWSER] },
  mortgage: { slug: 'mortgage-calculator-how-much-house-can-i-afford', desc: 'Estimate how much house you can afford from income, deposit and loan terms. An estimate only, not a bank offer.', faqs: [FREE, ESTIMATE, BROWSER] },
  qr: { slug: 'qr-code-generator', desc: 'Generate a QR code in your browser from text or a link. QR codes are generated locally and never sent anywhere. Free, no sign-up.', faqs: [FREE, ['Is the QR code sent anywhere?', 'No. QR codes are generated locally and never sent anywhere.']] },
  bmi: { slug: 'bmi-calculator', desc: 'Work out Body Mass Index from height and weight. For general information only, not medical advice. Free, no sign-up.', faqs: [FREE, ['Is this medical advice?', 'No. It is for general information only.'], BROWSER] },
  age: { slug: 'age-calculator-date-of-birth', desc: 'Work out age from a date of birth. Free, no sign-up, and it runs in your browser.', faqs: [FREE, BROWSER] },
  percentage: { slug: 'percentage-calculator', desc: 'Work out common percentage calculations quickly. Free, no sign-up, and it runs in your browser.', faqs: [FREE, BROWSER] },
  wordcounter: { slug: 'word-counter-character-counter', desc: 'Count words and characters in pasted text, in your browser. Nothing is uploaded. Free, no sign-up.', faqs: [FREE, ['Is my text uploaded?', 'No. Counting happens in your browser and nothing is uploaded to a server.']] },
  password: { slug: 'password-generator-secure-private', desc: 'Generate a secure password in your browser. Passwords are generated locally and never sent anywhere. Free, no sign-up.', faqs: [FREE, ['Is the password sent anywhere?', 'No. Passwords are generated locally and never sent anywhere.']] },
  cgpa: { slug: 'cgpa-calculator-4-0-scale', desc: 'Work out CGPA on a 4.0 scale from your grades. Free, no sign-up, and it runs in your browser.', faqs: [FREE, BROWSER] },
  pngtojpg: { slug: 'png-to-jpg-converter-online', desc: 'Convert PNG images to JPG in your browser. Your file is never uploaded to a server. Free, no sign-up.', faqs: [FREE, FILE_PRIVATE] },
  pdftojpg: { slug: 'pdf-to-jpg-converter-online', desc: 'Convert PDF pages to JPG images in your browser, without uploading your files. Free, no sign-up.', faqs: [FREE, FILE_PRIVATE] },
  salarycalc: { slug: 'salary-calculator-net-salary-after-tax', desc: 'Work out net salary after tax from gross salary and the tax and deduction rates you enter. A generic estimate only, not an official tax calculation.', faqs: [FREE, ['Is this an official tax calculation?', 'No. It is a generic estimate only. Enter your actual tax and deduction rates and do not use it for filing tax.'], BROWSER] },
  sip: { slug: 'sip-calculator-monthly-investment-step-up', desc: 'Estimate the future value of a monthly SIP, with an optional yearly step-up. Returns are not guaranteed and this is an estimate, not investment advice.', faqs: [FREE, ['Are SIP returns guaranteed?', 'No. Actual returns go up and down. This is an estimate, not investment advice.'], BROWSER] },
  datecalc: { slug: 'date-calculator-days-between-dates-weekday', desc: 'Count calendar days between two dates and find the weekday of a date. Free, no sign-up, and it runs in your browser.', faqs: [FREE, ['Can it tell me the weekday I was born?', 'Yes - the weekday of a birth date is shown.'], BROWSER] },
  areacalc: { slug: 'area-calculator-room-land-area', desc: 'Work out the area of a room, wall or floor from length and width. Plot and Marla conversions are in the separate Property tools.', faqs: [FREE, ['Can I use it for plots in Marla?', 'Plot and Marla conversions are in the separate Property tools.'], BROWSER] },
  homeloan: { slug: 'home-loan-calculator-emi-total-interest', desc: 'Estimate a home loan’s EMI and total interest from price, down payment and rate. An estimate only, not a bank offer.', faqs: [FREE, ['Is this a bank offer?', 'No. It is an estimate only. Banks also check income, credit score and property valuation, and the actual rate may differ.'], BROWSER] },
  unitconv: { slug: 'unit-converter-length-weight-temperature', desc: 'Convert length, weight and temperature units. Free, no sign-up, and it runs in your browser.', faqs: [FREE, BROWSER] },
  love: { slug: 'love-calculator-for-fun-only', desc: 'A love calculator for fun only - not a real prediction. Free, no sign-up, and it runs in your browser.', faqs: [FREE, ['Is the love calculator real?', 'No. It is for fun only.'], BROWSER] },
  attendance: { slug: 'attendance-calculator-students', desc: 'Work out attendance percentage for students from attended and total classes. Free, no sign-up, and it runs in your browser.', faqs: [FREE, BROWSER] },
  carloan: { slug: 'car-loan-calculator-emi-total-interest', desc: 'Estimate a car loan’s EMI and total interest from price, down payment and rate. An estimate only, not a bank offer.', faqs: [FREE, ESTIMATE, BROWSER] },
  htmltovideo: { slug: 'html-to-video-converter-online', desc: 'Turn HTML code into a video in your browser: paste code, preview it live, record up to 60 seconds and download a sharp MP4 or WebM video. Free, no sign-up, nothing is uploaded.', faqs: [FREE, ['What format is the video?', 'MP4 in Chrome, Edge and Safari, which plays almost everywhere including WhatsApp and TikTok. If your browser cannot make MP4, the tool saves WebM instead.'], BROWSER] },
  whatsmyip: { slug: 'what-is-my-ip-address', desc: 'See your public IP address, approximate location, internet provider and time zone. Free, no sign-up, and your IP is not stored.', faqs: [FREE, ['Is my exact location shown?', 'No. The location is approximate and comes from your internet provider, not GPS.'], BROWSER] },
};

// Page title: tool title + " | Kalkio" wherever it fits under 60 characters
// (every current title fits; the guard keeps the keyword hook intact if a title
// is ever lengthened).
export function seoTitle(title) {
  const suffix = ' | Kalkio';
  return title.length + suffix.length <= 60 ? title + suffix : title;
}
export function toolUrl(slug) { return `${BASE_URL}/tools/${slug}/`; }
export function pageUrl(path) { return `${BASE_URL}${path}`; }
