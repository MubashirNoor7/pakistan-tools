// Guide content for the remaining tools (merged into CONTENT_BY_ID by content.js).
// RULES: only facts present in the tool code, or numbers computed from the same formulas below.
// Worked examples are computed here at load time so they cannot drift from the maths.
// No invented rates. No em/en dashes. Example rates are labelled as examples, not current prices.
const n0 = (x) => Math.round(x).toLocaleString('en-US');
const n2 = (x) => (Math.round(x * 100) / 100).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
const rs = (x) => 'Rs ' + n0(x);
const emi = (P, pct, months) => { const r = pct / 100 / 12; return r === 0 ? P / months : P * r / (1 - Math.pow(1 + r, -months)); };
const PRIV = { h: 'Privacy', p: ['The file is processed inside your browser. It is not uploaded to a server, and no account is needed.'] };

// Marla
const M1 = 225, M2 = 272.25;
const marlaRows = [3, 5, 7, 10, 20].map((m) => [m === 20 ? '20 Marla (1 Kanal)' : m + ' Marla', n2(m * M1) + ' sq ft', n2(m * 250) + ' sq ft', n2(m * M2) + ' sq ft', n2(m * M1 / 9) + ' / ' + n2(m * M2 / 9)]);
// Plot size
const plotArea = (l, w) => l * w;
// Rent vs buy with the tool's default inputs
const rvb = (() => { let rent = 40000, tot = 0; for (let i = 0; i < 10; i++) { tot += rent * 12; rent *= 1.10; } const loan = 10000000 - 2000000; const mp = emi(loan, 20, 120); return { rentTotal: tot, buyTotal: 2000000 + mp * 120 + 50000 * 10, mp, loan }; })();
// Mortgage affordability with defaults
const mort = (() => { const budget = 100000 * 0.30; const r = 0.12 / 12; const nn = 240; const loan = budget * (1 - Math.pow(1 + r, -nn)) / r; return { budget, loan, price: loan + 2000000 }; })();
// SIP
const sip = (P, rate, years, step) => { const r = rate / 100 / 12; let inv = 0, val = 0, cur = P; for (let y = 0; y < years; y++) { for (let m = 0; m < 12; m++) { inv += cur; val = (val + cur) * (1 + r); } cur *= 1 + step / 100; } return { inv, val }; };
const sipA = sip(5000, 12, 10, 0), sipB = sip(5000, 12, 10, 10);
const loan1 = emi(1000000, 12, 60), home1 = emi(4000000, 9, 240), car1 = emi(2000000, 10, 60);
// Electricity worked checks (NEPRA SRO 279(I)/2026)
const elecProt150 = 100 * 10.54 + 50 * 13.01; // 1,704.50
const elecUnprot150 = 150 * 28.91; // 4,336.50
// Sui gas worked check: non-protected 1.0 hm3 at 3.5 MMBTU per hm3
const gasExEnergy = 0.6 * 3.5 * 850 + 0.4 * 3.5 * 1250; // 3,535
const gasExSub = gasExEnergy + 1500 + 40; // 5,075
const gasExGst = gasExSub * 0.18; // 913.50
const gasExTotal = gasExSub + gasExGst; // 5,988.50
// Token tax worked check: 1300cc Punjab filer, Rs 4,000,000 invoice
const tokToken = 4000000 * 0.003; // 12,000
const tokTotal = tokToken + 2500 + 200; // 14,700
// Age example 1 Jan 2000 to 4 Nov 2026
const ageDays = Math.floor((new Date('2026-11-04') - new Date('2000-01-01')) / 86400000);
const dateDays = Math.abs(Math.round((new Date('2026-11-04') - new Date('2000-01-01')) / 86400000));
// Prize bond table (National Savings 2026 prizes as in the tool)
const BONDS = { 100: [700000, 200000, 1000], 200: [750000, 250000, 1250], 750: [1500000, 500000, 9300], 1500: [3000000, 1000000, 18500], 7500: [15000000, 5000000, 93000], 15000: [30000000, 10000000, 185000], 25000: [30000000, 10000000, 300000], 40000: [80000000, 30000000, 500000] };
const bondRows = Object.entries(BONDS).map(([d, p]) => ['Rs ' + n0(+d), rs(p[0]), rs(p[1]), rs(p[2])]);
const bondNet = Object.entries(BONDS).map(([d, p]) => ['Rs ' + n0(+d) + ' bond, 1st prize', rs(p[0] * 0.85), rs(p[0] * 0.70)]);
// BMI
const bmi1 = 70 / (1.7 * 1.7);
// CGPA
const cg = (4.0 + 3.7 + 3.3) * 3 / 9;
// Password pool: 26 + 26 + 10 + 14 = 76
const pwBits = Math.log2(76) * 16;

export const CONTENT_MORE = {
  marla: [
    { h: 'What is a Marla?', p: [
      'A Marla is the traditional unit for measuring residential plots in Pakistan. There is no single legal size: 225 sq ft is common in housing societies such as DHA and Bahria Town, 250 sq ft is the CDA Islamabad standard, while 272.25 sq ft is the revenue-record Marla. The calculator lets you choose any of the three, or enter your own custom size.',
      'Always use the Marla standard written in your plot documents. Using the wrong one changes the area by about 21%.',
    ] },
    { h: 'Marla to square feet table', p: ['Common plot sizes under the three standards, with square yards (225 / 272.25):'], table: {
      head: ['Plot size', '225 sq ft Marla', '250 sq ft Marla', '272.25 sq ft Marla', 'Square yards'], rows: marlaRows } },
    { h: 'The Fard ladder: Marla, Kanal, Killa, Murabba', p: ['On the revenue record (Fard), the units stack up: 1 Marla = 9 Sarsahi, 1 Kanal = 20 Marla, 1 Killa (1 acre) = 8 Kanal = 160 Marla, and 1 Murabba = 25 Killa = 200 Kanal = 4,000 Marla. One Sarsahi is 30.25 sq ft at the 272.25 standard. The tool shows the split for any area you enter.'] },
    { h: 'Conversion formulas', p: [
      'Square feet = Marla × sq ft per Marla. Square yards = square feet ÷ 9. Square metres = square feet ÷ 10.7639. Kanal = Marla ÷ 20. Acre = Marla ÷ 160.',
      'Example: 5 Marla at 272.25 sq ft is 1,361.25 sq ft, which is 151.25 square yards and 0.25 Kanal.',
    ] },
  ],
  kanal: [
    { h: 'Kanal to Marla', p: [
      'One Kanal is 20 Marla under both the 225 sq ft and the 272.25 sq ft standards. In area, 1 Kanal is 4,500 sq ft with the 225 standard and 5,445 sq ft with the 272.25 standard. Eight Kanal make one acre, and one acre is 160 Marla. The tool works both ways - enter Kanal to get Marla, or enter Marla to get Kanal.',
    ] },
    { h: 'Kanal conversion table', p: ['Kanal in Marla and square feet:'], table: {
      head: ['Kanal', 'Marla', '225 standard (sq ft)', '272.25 standard (sq ft)'],
      rows: [0.5, 1, 2, 4, 8].map((k) => [String(k), n2(k * 20), n0(k * 20 * M1), n2(k * 20 * M2)]) } },
    { h: 'Which standard applies to you?', p: ['Check your registry or society documents. Using the wrong Marla size changes the total area, so confirm before you buy or sell.'] },
  ],
  plotsize: [
    { h: 'How plot size in Marla is worked out', p: [
      'Multiply the length by the width to get the area in square feet, then divide by the size of one Marla (225 or 272.25 sq ft, or your own). Enter the size in feet, yards or metres - the tool converts for you. The calculator also shows square yards, square metres, Kanal and acres, plus the perimeter and the Kanal-Marla-Sarsahi split.',
    ] },
    { h: 'Common plot dimensions', p: ['Area and Marla for typical plots:'], table: {
      head: ['Plot (feet)', 'Area', 'Marla at 225', 'Marla at 272.25'],
      rows: [[25, 45], [30, 50], [35, 65], [30, 60], [50, 90]].map(([w, l]) => [w + ' × ' + l, n0(plotArea(l, w)) + ' sq ft', n2(plotArea(l, w) / M1), n2(plotArea(l, w) / M2)]) } },
    { h: 'Why your result may differ from the paperwork', p: ['Real plots are often slightly under or over their nominal size, and irregular plots are not rectangles. For irregular shapes, measure carefully or use the area from your registry papers.'] },
  ],
  rentvsbuy: [
    { h: 'How the comparison works', p: [
      'Renting: monthly rent, raised each year by the rent increase you enter, added up over the years you choose. Buying: down payment plus the loan repayments plus yearly maintenance over the same years. The loan payment uses the standard EMI formula at the rate you enter.',
      'The comparison also counts house price growth, the resale value after selling costs, and the return you could earn by investing the down payment instead. House price growth (5% a year by default) and the investment return (8% a year by default) are assumptions you can change. Tax is not included - check with your bank before deciding.',
    ] },
    { h: 'Example with the default numbers', p: ['Rent Rs 40,000 a month rising 10% a year, a Rs 10,000,000 house with Rs 2,000,000 down, a 20% loan rate, 10 years and Rs 50,000 yearly maintenance:'], table: {
      head: ['Item', 'Amount'],
      rows: [['Total rent over 10 years', rs(rvb.rentTotal)], ['Loan amount', rs(rvb.loan)], ['Monthly loan payment', rs(rvb.mp)], ['Total buying cost (down + loan + maintenance)', rs(rvb.buyTotal)]] } },
    { h: 'How to read the result', p: ['The cheaper option on paper is not always the better choice. The break-even year is the first year in which buying becomes cheaper overall - in the default example that is year 19. If interest rates are high, as in this example, loan interest is the biggest cost of buying.'] },
  ],
  areacalc: [
    { h: 'Area of a room, wall or floor', p: [
      'Pick a shape - rectangle, square, circle, triangle, trapezoid, ellipse, parallelogram or sector - enter its measurements, and the tool works out the area and the perimeter, with the formula shown. For a rectangle, enter length and width in the same unit (feet, metres or yards); the calculator converts to metres using 1 ft = 0.3048 m and 1 yd = 0.9144 m, and shows the result in square feet too.',
      'Example: a room 20 ft by 15 ft is 300 sq ft, which is about 27.87 square metres.',
    ] },
    { h: 'Useful conversions', p: ['1 square foot = 0.092903 square metres. 1 square yard = 9 square feet. For plots in Marla and Kanal, use the Marla and Kanal tools on this site.'] },
  ],
  taxslab: [
    { h: 'Find your salary tax slab for 2026-27', p: [
      'Enter your annual salary to see which slab it falls in and the tax due. Pakistan taxes the part of your salary inside each slab at that slab’s rate, so moving into a higher slab does not tax your whole salary at the higher rate.',
    ] },
    { h: 'Annual salary and tax examples', p: ['Using the Finance Act 2026 salaried slabs:'], table: {
      head: ['Annual salary', 'Slab rate', 'Annual tax', 'Monthly tax'],
      rows: [[600000, '0%', 0], [1200000, '1%', 6000], [2400000, '20%', 156000], [3600000, '25%', 416000], [6000000, '32%', 1104000]].map(([a, r, t]) => [rs(a), r, rs(t), rs(t / 12)]) } },
    { h: '2025-26 vs 2026-27: what changed', p: ['The 2026-27 slabs cut the middle rates and abolished the 9% surcharge on income above Rs 10 million a year. The table shows the rate on each income band.'], table: {
      head: ['Income band (Rs / year)', '2025-26 rate', '2026-27 rate'],
      rows: [['Up to 600,000', '0%', '0%'], ['600,001 – 1,200,000', '1%', '1%'], ['1,200,001 – 2,200,000', '11%', '11%'], ['2,200,001 – 3,200,000', '23%', '20%'], ['3,200,001 – 4,100,000', '30%', '25%'], ['4,100,001 – 5,600,000', '35%', '29%'], ['5,600,001 – 7,000,000', '35%', '32%'], ['Above 7,000,000', '35%', '35%']] } },
    { h: 'How much less tax in 2026-27', p: ['Same salary, lower tax for most people:'], table: {
      head: ['Monthly salary', 'Tax 2025-26', 'Tax 2026-27', 'You save'],
      rows: [['Rs 200,000', 'Rs 162,000', 'Rs 156,000', 'Rs 6,000'], ['Rs 300,000', 'Rs 466,000', 'Rs 416,000', 'Rs 50,000'], ['Rs 500,000', 'Rs 1,281,000', 'Rs 1,104,000', 'Rs 177,000']] } },
    { h: 'A worked example: Rs 200,000 a month', p: [
      'Annual salary: Rs 200,000 × 12 = Rs 2,400,000.',
      '2026-27: the first Rs 600,000 is tax-free, the next Rs 600,000 is taxed at 1% (Rs 6,000), the next Rs 1,000,000 at 11% (Rs 110,000), and the last Rs 200,000 at 20% (Rs 40,000). Total: Rs 156,000 a year, or Rs 13,000 a month.',
      '2025-26: the same steps, but the last Rs 200,000 was taxed at 23% (Rs 46,000), giving Rs 162,000 a year. The 2026-27 cut saves Rs 6,000 a year.',
    ] },
    { h: 'See also', p: ['For the full slab table and a month-by-month breakdown, use the Pakistan Salary Tax Calculator on this site. Results are estimates; confirm with FBR before filing.'] },
  ],
  loanemi: [
    { h: 'How EMI is calculated', p: [
      'EMI = P × r × (1 + r)^n ÷ ((1 + r)^n − 1), where P is the loan amount, r is the monthly interest rate (annual rate ÷ 12 ÷ 100) and n is the number of monthly payments. Total interest is total paid minus the amount borrowed.',
    ] },
    { h: 'Example', p: ['A loan of Rs 1,000,000 at 12% a year for 5 years:'], table: {
      head: ['Item', 'Amount'],
      rows: [['Monthly EMI', rs(loan1)], ['Total paid', rs(loan1 * 60)], ['Total interest', rs(loan1 * 60 - 1000000)]] } },
    { h: 'Tips', p: ['A longer tenure lowers the monthly payment but increases total interest. Enter the exact rate your bank quotes, and ask about processing fees and insurance, which this calculator does not include.'] },
  ],
  mortgage: [
    { h: 'Monthly payment mode', p: ['The default mode works the other way round: enter the house price, down payment, rate and years, and the tool shows the monthly payment - principal and interest, plus property tax, insurance and PMI if you enter them - with the full payment schedule. Use it when you already know the house and want the exact monthly cost.'] },
    { h: 'Affordability mode', p: [
      'The calculator uses a rule of thumb: keep the monthly mortgage payment at or below a share of your income (30% by default). It works out the loan that payment can repay over your chosen years at your chosen rate, then adds your down payment to get an affordable house price.',
    ] },
    { h: 'Example', p: ['Income Rs 100,000 a month, 30% budget, 12% rate, 20 years and a Rs 2,000,000 down payment:'], table: {
      head: ['Item', 'Amount'],
      rows: [['Monthly payment budget', rs(mort.budget)], ['Affordable loan', rs(mort.loan)], ['House price you can afford', rs(mort.price)]] } },
    { h: 'What banks also check', p: ['This is an estimate, not an approval. Banks also look at your credit history, other debts, job stability and the valuation of the property.'] },
  ],
  homeloan: [
    { h: 'Home loan EMI and total interest', p: [
      'Loan amount is the property price minus your down payment. The monthly EMI uses the standard formula with your annual rate and tenure. Total interest is everything you pay back above the loan amount. The tool also shows the yearly payment schedule, and an eligibility mode that works out the maximum loan from your monthly income - banks usually allow up to 50% of income for all EMIs combined, so check your bank’s own limit.',
    ] },
    { h: 'Example', p: ['A Rs 5,000,000 property with Rs 1,000,000 down, 9% a year, 20 years:'], table: {
      head: ['Item', 'Amount'],
      rows: [['Loan amount', rs(4000000)], ['Monthly EMI', rs(home1)], ['Total paid', rs(home1 * 240)], ['Total interest', rs(home1 * 240 - 4000000)]] } },
    { h: 'Not a bank offer', p: ['Actual rates, fees and eligibility depend on the bank. Banks also check income, credit score and property valuation.'] },
  ],
  carloan: [
    { h: 'Car loan EMI and total interest', p: [
      'Enter the on-road price, your down payment, the yearly interest rate and the tenure. The loan amount is price minus down payment, and the EMI uses the standard formula. The tool also adds sales tax and fees, subtracts any trade-in, compares terms from 36 to 84 months in a table, and shows the payoff date - the month your last payment is due.',
    ] },
    { h: 'Example', p: ['A Rs 2,500,000 car with Rs 500,000 down, 10% a year, 5 years:'], table: {
      head: ['Item', 'Amount'],
      rows: [['Loan amount', rs(2000000)], ['Monthly EMI', rs(car1)], ['Total paid', rs(car1 * 60)], ['Total interest', rs(car1 * 60 - 2000000)]] } },
    { h: 'Before you borrow', p: ['Use the dealer’s actual on-road figure, which includes registration and taxes where applicable. Ask the bank about insurance and processing fees, which are not in this estimate.'] },
  ],
  sip: [
    { h: 'How the SIP calculator works', p: [
      'A SIP is a fixed amount invested every month. The calculator adds each monthly amount and grows the balance by the monthly return (annual return ÷ 12). An optional yearly step-up raises your monthly amount by a percentage each year. The tool also shows a year-by-year table, a one-time lumpsum mode, and a reverse goal mode that works out the monthly SIP you need for a target amount.',
      'Returns are not guaranteed. Actual fund returns go up and down, so treat the result as an estimate, not investment advice.',
    ] },
    { h: 'Example', p: ['Rs 5,000 a month at an assumed 12% a year for 10 years:'], table: {
      head: ['Case', 'Total invested', 'Estimated value'],
      rows: [['Fixed SIP', rs(sipA.inv), rs(sipA.val)], ['10% yearly step-up', rs(sipB.inv), rs(sipB.val)]] } },
    { h: 'Reading the result', p: ['The 12% return is an assumption you can change. Small changes in the rate or in the number of years make a large difference to the final value.'] },
  ],
  salarycalc: [
    { h: 'A generic net salary estimate', p: [
      'Net salary = gross salary × (1 − tax rate − other deductions rate). The Pakistan mode uses the real FBR 2026-27 salary tax slabs, the same ones as the Salary Tax Calculator. The generic mode takes the percentage you enter, so it works for any country and does not use any country’s official tax bands.',
      'Example: gross salary 50,000 with 20% tax and 5% other deductions gives 50,000 × (1 − 0.20 − 0.05) = 37,500 a month.',
    ] },
    { h: 'For Pakistan', p: ['For Pakistan, pick the Pakistan mode in the tool above - it uses the official 2026-27 FBR slabs. The generic mode should not be used for filing tax.'] },
  ],
  prizebond: [
    { h: 'What this calculator does and does not do', p: [
      'It shows how much you keep after tax if a prize bond wins. It does not check whether your bond number won. Check your number against the official draw list, then use this tool for the after-tax amount.',
      'Withholding tax is 15% for filers and 30% for non-filers.',
    ] },
    { h: 'Prize amounts by denomination (National Savings, 2026)', p: ['Prize amounts as used in the calculator. The Rs 25,000 and Rs 40,000 figures are for the registered Premium bonds (the old bearer bonds were withdrawn).'], table: {
      head: ['Bond', '1st prize', '2nd prize', '3rd prize'], rows: bondRows } },
    { h: 'First prize after tax', p: ['What you keep from a first prize:'], table: {
      head: ['Bond', 'Filer (15% tax)', 'Non-filer (30% tax)'], rows: bondNet } },
  ],
  currency: [
    { h: 'How the converter works', p: [
      'The converter loads live exchange rates with the US dollar as the base. To convert, it divides your amount by the rate of the currency you are converting from and multiplies by the rate of the currency you are converting to. It supports USD, EUR, GBP, AED, SAR, PKR and INR.',
      'If live rates cannot be loaded, you can type a USD to PKR rate by hand. Other currency pairs need live rates.',
    ] },
    { h: 'Example', p: ['At an example rate of Rs 280 per US dollar (not today’s rate), 100 USD is Rs 28,000. Change the rate to match what your bank or exchange shows.'] },
    { h: 'A guide, not a dealing rate', p: ['Exchange rates move during the day, and banks and money exchangers add their own margin, so the amount you actually receive can differ from this result.'] },
  ],
  jpgtopdf: [
    { h: 'How to convert an image to PDF', p: [
      'Choose JPG or PNG images from your device. The tool combines them into one PDF in your browser - add several images, drag them into order with the arrows, and pick A4, Letter or the original image size - and gives you a download button. Nothing is uploaded.',
    ] },
    PRIV,
    { h: 'Limits', p: ['The PDF keeps each image as it is, with no compression. Very large photos can be slow on a phone.'] },
  ],
  pdftojpg: [
    { h: 'How to convert PDF pages to JPG', p: [
      'Choose a PDF. Each page is drawn in your browser and saved as a JPG, and you can download them all at once in one ZIP file. Pick the quality: Low (72 DPI, 80% quality), Standard (144 DPI, 92%) or High (216 DPI, 95%).',
    ] },
    PRIV,
    { h: 'Limits', p: ['Very large PDFs can be slow on a phone. Password-protected PDFs may not open.'] },
  ],
  pngtojpg: [
    { h: 'How to convert PNG to JPG', p: [
      'Choose PNG files. The tool draws each one onto a canvas in your browser and saves it as a JPG. Pick the quality with the slider (0 to 100, default 92) - higher means a bigger, sharper file. You can convert several PNGs at once. JPG files do not support transparency, so any transparent area becomes white.',
    ] },
    PRIV,
    { h: 'When to use JPG or PNG', p: ['JPG gives smaller files for photos. PNG keeps sharp edges and transparency, which is better for logos and screenshots.'] },
  ],
  heic: [
    { h: 'How to convert HEIC to JPG', p: [
      'iPhone photos are often saved as HEIC, which many Windows and Android apps cannot open. Choose HEIC files and the tool converts them to JPGs at 92% quality in your browser - up to 50 photos at once.',
    ] },
    PRIV,
    { h: 'Large files', p: ['HEIC conversion can take a few seconds per photo, especially on a phone.'] },
  ],
  webp: [
    { h: 'How to convert WebP to JPG', p: [
      'WebP images from websites often will not open in older programs. Choose a WebP file and the tool saves it as a JPG that works almost everywhere. Pick the JPG quality with the slider (default 92%) and convert several images at once.',
      'The tool uses your browser’s own image decoder, so your browser must be able to open WebP files, which current browsers can.',
    ] },
    PRIV,
  ],
  qr: [
    { h: 'How to make a QR code', p: [
      'Type or paste a link, text or Wi-Fi details, press Generate, and download the QR code as a PNG image (512 pixels wide) or as an SVG. Pick the type first - a link or text, a Wi-Fi network, a contact card (vCard 3.0), an SMS or an email. It is drawn in your browser, so your text is never sent anywhere.',
    ] },
    { h: 'Tips for a code that scans', p: ['Test the code with your phone before printing. Print it large enough and with good contrast, dark code on a light background. The code stores the text itself, so it keeps working as long as the link or information you put in stays valid.'] },
  ],
  unitconv: [
    { h: 'Units supported', p: ['Nine categories: length, weight, area, volume, speed, time, data, energy and temperature. Length covers metres, kilometres, centimetres, feet, inches, yards, miles and nautical miles; weight covers kilograms, grams, pounds, ounces, tonnes and stone. Pick a category, enter a value, and the tool shows the same amount in every unit of that category at once.'] },
    { h: 'Conversion factors', p: ['Fixed factors used, with no internet needed:'], table: {
      head: ['Unit', 'Equals'],
      rows: [['1 foot', '0.3048 metres'], ['1 inch', '0.0254 metres'], ['1 yard', '0.9144 metres'], ['1 mile', '1,609.34 metres'], ['1 pound', '0.453592 kg'], ['1 ounce', '0.0283495 kg']] } },
    { h: 'Temperature formulas', p: ['Fahrenheit = Celsius × 9 ÷ 5 + 32. Celsius = (Fahrenheit − 32) × 5 ÷ 9. Kelvin = Celsius + 273.15. Example: 25 °C is 77 °F.'] },
  ],
  htmltovideo: [
    { h: 'How HTML to video works', p: [
      'Paste HTML and CSS, preview it live, then press Record video. The tool works out what kind of animation it is: a CSS animation records smooth at 30 or 60 frames per second; a story that plays with JavaScript, for example one with a Play button, records live, and the tool presses Play for you. If your story makes sound with WebAudio, the sound is recorded in the video too. Pick the smoothness (10, 30 or 60 frames per second) on the main screen, and a length yourself, or the full animation, under More options. A vertical story, for example a 9:16 phone story, is shown in a vertical preview and comes out as a vertical video. 3D scenes, for example Three.js, are captured too. The tool captures the preview at up to twice the preview size, so the video stays sharp. You can also record in 1080p instead of the default 720p - pick it in the options before you record. You can download the result as MP4 or WebM. Everything runs in your browser.',
    ] },
    { h: 'Format and browser support', p: ['The video downloads as MP4 in Chrome, Edge and Safari, which plays almost everywhere including WhatsApp and TikTok. Smooth 30 and 60 fps recording is for CSS animations and needs a browser with VideoEncoder, such as a recent Chrome, Edge or Safari. A story that plays with JavaScript records live at the frame rate you pick, with sound when the story makes sound with WebAudio; the picture updates as fast as the page allows. A CSS animation records picture only, with no sound. If your browser cannot make MP4, the tool saves WebM instead.'] },
  ],
  petrolprice: [
    { h: 'How petrol prices work in Pakistan', p: [
      'Fuel rates are now reviewed daily, so a Friday rate does not automatically carry through the weekend - always check the date on the rate you are using. This page shows today’s rates and the full week, so you can see whether prices went up or down.',
      'The rates on this page are the OGRA notified rates, checked daily. If OGRA changes them, the page updates from the saved rates file.',
    ] },
    { h: 'Work out a trip cost', p: ['Use the Fuel Trip Cost tool on this site to work out how much a trip costs at today’s rate. Enter the distance and your vehicle’s mileage.'] },
  ],
  gta6price: [
    { h: 'How much is GTA 6?', p: [
      'GTA 6 costs $79.99 for the Standard Edition and $99.99 for the Ultimate Edition in the USA, before tax. In Canada it is C$109.99 and C$139.99, before tax. In the UK it is £69.99 and £89.99, and in the EU it is €79.99 and €99.99, before tax. These are store prices, not currency conversions - each store sets its own price, and tax is added at checkout.',
      'Pick your country in the tool above to see the price in your currency.',
    ] },
    { h: 'Standard vs Ultimate - what is different?', p: [
      'The $20 difference buys only the Ultimate Edition Upgrade content. The story, map and missions are the same in both editions, and there is no early access in either one.',
      'Standard owners can buy the Ultimate Edition Upgrade separately later for $20 in the USA, so there is no need to pay for Ultimate now if you are unsure.',
    ], table: { head: ['What you get', 'Standard ($79.99)', 'Ultimate ($99.99)'], rows: [
      ['Full game, story, map and missions', 'Yes', 'Yes'],
      ['Vintage Vice City Pack (buy before 20 Nov)', 'Yes', 'Yes'],
      ['1 month of GTA+ (digital pre-order)', 'Yes', 'Yes'],
      ['6 exclusive vehicles', 'No', 'Yes'],
      ['4 exclusive weapons', 'No', 'Yes'],
      ['5 exclusive shops and businesses', 'No', 'Yes'],
      ['Exclusive mission, car restoration, second garage', 'No', 'Yes'],
      ['Cosmetic sets for Jason and Lucia', 'No', 'Yes'],
      ['Early access', 'No', 'No'],
    ] } },
    { h: 'Pre-order bonuses', p: ['Buy before 20 November 2026 and you get the Vintage Vice City Pack on either edition - a 1955 Vapid Stanier sedan with a garage, 80s-style outfits and hairstyles, and an exclusive weapon pattern. A digital pre-order also includes 1 month of GTA+. On PlayStation it must be claimed by 31 March 2027; on Xbox, within 180 days of the pre-order. After the free month, GTA+ renews at its regular price unless you cancel it. There is no early access and no pre-order discount.'] },
    { h: 'Is GTA 6 on Game Pass or PS Plus?', p: ['No. GTA 6 is not on Xbox Game Pass or PlayStation Plus at launch, and no subscription release has been announced. You do not need Game Pass or PS Plus to play the story, because it is single-player at launch. Take-Two has said day-one subscription releases for big new games do not make economic sense, so do not wait for a subscription version.'] },
    { h: 'When GTA 6 comes out', p: ['GTA 6 launches 19 November 2026 on PS5 and Xbox Series X|S. There is no disc in the box - the box holds a download code. A PC version has not been announced.'] },
  ],
  gta6download: [
    { h: 'How long the GTA 6 download takes', p: [
      'The GTA 6 download is up to 212 GB, confirmed by Rockstar on 3 November 2026. Download time depends on your internet speed: at 50 Mbps it takes about 9 hours 25 minutes, at 100 Mbps about 4 hours 43 minutes, and at 20 Mbps about 23 hours 33 minutes.',
      'The tool works it out as: time = size in GB × 8,000 ÷ speed in Mbps, in seconds. That is the full-speed time. Real downloads run slower, so the tool uses 80% efficiency by default - 100 Mbps then takes about 5 hours 53 minutes - and you can change the efficiency to match your connection. Pre-load starts 10 November 2026, so you can download the game before it unlocks on 19 November.',
    ] },
    { h: 'What affects the download time', p: ['Your real speed is often lower than the package speed, and the store servers are busy at launch. Start the pre-load early if you can.'] },
  ],
  gta6countdown: [
    { h: 'When GTA 6 launches', p: [
      'GTA 6 launches 19 November 2026 on PS5 and Xbox Series X|S. The countdown on this page counts down to midnight Eastern Time (New York / Toronto) on 19 November. The tool lists the unlock time for all 13 countries - New Zealand first at 11:00 UTC on 18 November, Pakistan at midnight local time (19:00 UTC, 18 November - expected, because Pakistan has no PlayStation Store and the time follows your account’s store region), and the USA and Canada last at 05:00 UTC on 19 November.',
      'The game unlocks at local midnight on 19 November in each store region - midnight Eastern in the USA and Canada. Pre-load starts 10 November: at midnight local time on PS5, and at 12:00 AM GMT (7:00 PM Eastern, 9 November) on Xbox.',
    ] },
    { h: 'What is in the box', p: ['There is no disc in the GTA 6 box. The box holds a download code you redeem on your PlayStation 5 or Xbox Series X|S account. Boxed copies reach shops from 12 November. A PC version has not been announced.'] },
  ],
  gta6pccheck: [
    { h: 'Can my PC run GTA 6?', p: [
      'Rockstar has not announced a PC version of GTA 6 and has not published official system specs. The specs in this checker are predicted specs from experts and the community - they are estimates, not official requirements. This page will be updated when Rockstar publishes official specs.',
      'The predicted minimum (1080p, 30 fps, Low) is an RTX 2060 or RX 5700 graphics card, an i5-12400 or Ryzen 5 5600 processor, 16 GB RAM and a 150 GB SSD. The predicted recommended (1440p, 60 fps, High) is an RTX 4070 or RX 7800 XT, an i7-12700K or Ryzen 7 5800X, 32 GB RAM and an NVMe SSD. An SSD is required - a hard drive will not run the game well.',
    ] },
    { h: 'How the checker decides', p: ['Pick your graphics card, processor, RAM and storage. The result is set by your weakest part - if one part is below minimum, the whole result is below minimum.'] },
    { h: 'When is the PC version coming?', p: ['There is no announced date. The reported PC window is Q1 2027 - 43 to 132 days after the 19 November 2026 console launch - from a GamesBeat report of 13 October 2026, not a Rockstar announcement.'] },
  ],
  gta6totalcost: [
    { h: 'What the total cost includes', p: [
      'The total is your console plus the game plus any extras you tick. In the USA and Canada the game is the local store price, so there are no bank charges - but tax is added at checkout.',
      'Examples, before tax: in the USA, a PS5 Slim (Disc) at $649.99 plus the Standard Edition at $79.99 is $729.98, and an Xbox Series S at $499.99 plus the same game is $579.98. In Canada, a PS5 Slim (Disc) at C$819.99 plus the Standard Edition at C$109.99 is C$929.98. A used or refurbished console costs less - in the USA, a Series S goes from about $400 - and no PS Plus or Game Pass is needed for single-player, only for online play.',
    ] },
    { h: 'Console prices', p: ['USA list prices (before tax): PS5 Slim (Disc) $649.99, PS5 Pro $899.99, Xbox Series S $499.99, Xbox Series X $799.99. Canada list prices (before tax): PS5 Slim (Disc) C$819.99, PS5 Pro C$1,099.99, Xbox Series S C$649.99, Xbox Series X C$999.99. Prices change, so the tool lets you type the price your store charges.'] },
    { h: 'Extras you can add', p: ['Tick the extras to add an extra controller, a headset or an extra 1TB SSD. In the USA the controller ($74.99) and the PlayStation Pulse headset ($99.99) are list prices; the 1TB SSD price is an estimate. In Canada the controller (C$109.99) is a list price; the headset and SSD prices are estimates. Type the price you would actually pay.'] },
    { h: 'When GTA 6 comes out', p: ['GTA 6 launches 19 November 2026 on PS5 and Xbox Series X|S. Pre-load starts 10 November. There is no disc in the box - the box holds a download code.'] },
  ],
  gta6preorder: [
    { h: 'Pre-order dates', p: [
      'Pre-load opens 10 November 2026: at midnight local time on PS5, and at 12:00 AM GMT (7:00 PM Eastern, 9 November) on Xbox. The game launches 19 November 2026 on PS5 and Xbox Series X|S, and unlocks at local midnight in each store region.',
      'Boxed copies reach shops from 12 November, but there is no disc in the box - it holds a download code. A PC version has not been announced. The $399.99 Vice City Collection is a merch box, not a game edition - it does not include GTA 6.',
    ] },
    { h: 'Standard vs Ultimate - what the $20 buys', p: [
      'The Ultimate Edition is the full game plus the Ultimate Edition Upgrade. The story, map and missions are the same in both editions, and there is no early access in either one.',
      'Ultimate adds 6 exclusive vehicles, 4 exclusive weapons, 5 exclusive shops and businesses, the Paradise Garage, an exclusive raid and a car commission, and cosmetic sets for Jason and Lucia. The bonuses unlock across the story, chapter by chapter, not all at once.',
    ], table: { head: ['What you get', 'Standard ($79.99)', 'Ultimate ($99.99)'], rows: [
      ['Full game, story, map and missions', 'Yes', 'Yes'],
      ['6 exclusive vehicles', 'No', 'Yes'],
      ['4 exclusive weapons', 'No', 'Yes'],
      ['5 exclusive shops and businesses', 'No', 'Yes'],
      ['Paradise Garage (second garage)', 'No', 'Yes'],
      ['Exclusive raid and car commission', 'No', 'Yes'],
      ['Cosmetic sets', 'No', 'Yes'],
      ['Early access', 'No', 'No'],
    ] } },
    { h: 'Pre-order bonuses', p: ['Buy before 20 November 2026 and you get the Vintage Vice City Pack on either edition - a 1955 Vapid Stanier sedan with a garage, 80s-style outfits and hairstyles, and an exclusive weapon pattern. A digital pre-order also includes 1 month of GTA+. On PlayStation it must be claimed by 31 March 2027; on Xbox, within 180 days of the pre-order. After the free month, GTA+ renews at its regular price unless you cancel it. There is no early access and no pre-order discount.'] },
    { h: 'Should you buy Ultimate now?', p: ['Standard owners can buy the Ultimate Edition Upgrade separately later for $20 in the USA, so there is no need to pay for Ultimate now if you are unsure. Ultimate is digital only - only Standard has a boxed copy, and the box holds a download code, not a disc.'] },
  ],
  gta6storage: [
    { h: 'How big is GTA 6?', p: [
      'GTA 6 needs up to 212 GB of free space, confirmed by Rockstar on 3 November 2026. The earlier 210 GB figure was a store leak and is out of date. The size may differ slightly by console, and a day-one patch could add more, so leave some room on top of 212 GB. The tool works out a safe free-space figure for your console: about 288 GB on PS5 and about 286 GB on Xbox.',
    ] },
    { h: 'Usable storage by console', p: ['Consoles never give you their full advertised storage, because the system software takes a chunk. These are the reported usable figures:'], table: {
      head: ['Console', 'Advertised', 'Usable (about)', 'GTA 6 share'],
      rows: [
        ['PS5 (original)', '825 GB', '667 GB', 'about 32%'],
        ['PS5 Slim', '1 TB', '848 GB', 'about 25%'],
        ['PS5 Pro', '2 TB', '1,860 GB', 'about 11%'],
        ['Xbox Series X', '1 TB', '802 GB', 'about 26%'],
        ['Xbox Series S', '512 GB', '364 GB', 'about 58%'],
      ] } },
    { h: 'If GTA 6 does not fit', p: ['Delete a game you have finished. On PS5 you can add an M.2 SSD (Gen 4, 250 GB to 8 TB, 5,500 MB/s or faster recommended). On Xbox Series X|S you can add a storage expansion card.'] },
  ],
  gta6nztick: [
    { h: 'How the New Zealand trick works', p: [
      'GTA 6 unlocks at midnight local time in each store region, so New Zealand plays first at 11:00 UTC on Wednesday 18 November 2026, and the last regions (Mexico and Central America) play last at 06:00 UTC on Thursday 19 November. Switching your console or account region to New Zealand makes the game unlock at New Zealand time.',
      'How many hours earlier you play depends on your country: the USA and Canada gain 18 hours, the UK 13 hours, Germany and France 12 hours, the UAE 9 hours, Pakistan 8 hours, India 7.5 hours, Japan 4 hours and Australia 2 hours. Pick your country in the tool above for the exact number.',
    ] },
    { h: 'Xbox vs PS5 - the steps are different', p: [
      'On Xbox Series X|S, change the console location to New Zealand (Profile & System, then Settings, System, Language & Location), restart the console, and the game unlocks at New Zealand midnight. It costs nothing and is quick to undo. You must already own the game and have finished the pre-load.',
      'On PS5 there is no region switch. You need a new PlayStation Network account set to New Zealand, then buy GTA 6 again from the New Zealand PlayStation Store in New Zealand dollars and pre-load it from 10 November. You pay in New Zealand dollars, so you need a New Zealand gift card or a card that works in that store. Your save lives on the new account, and you pay for the game twice.',
    ] },
    { h: 'Warnings - read before you try it', p: [
      'Unlock times come from PlayStation and Xbox Store listings, not a Rockstar announcement, so they can change. Rockstar has not commented on region switching, and the trick has worked for some Rockstar titles and not others. It is untested for GTA 6 specifically.',
      'On PS5, buying again can break pre-order bonuses tied to your original store region, including the Vintage Vice City Pack. Pakistan has no PlayStation Store, so the unlock follows your account’s store region: a UAE account unlocks 9 hours early, a US account 18 hours early.',
      'Do not pay anyone who offers "early access" to GTA 6 - there is no early access, and anyone selling it is running a scam.',
    ], table: {
      head: ['Country', 'Normal unlock (UTC)', 'Hours earlier'],
      rows: [
        ['Pakistan', '19:00, Wed 18 Nov', '8'],
        ['USA', '05:00, Thu 19 Nov', '18'],
        ['United Kingdom', '00:00, Thu 19 Nov', '13'],
        ['Canada', '05:00, Thu 19 Nov', '18'],
        ['India', '18:30, Wed 18 Nov', '7.5'],
        ['UAE', '20:00, Wed 18 Nov', '9'],
        ['Saudi Arabia', '21:00, Wed 18 Nov', '10'],
        ['Australia', '13:00, Wed 18 Nov', '2'],
        ['Germany', '23:00, Wed 18 Nov', '12'],
        ['France', '23:00, Wed 18 Nov', '12'],
        ['Brazil', '03:00, Thu 19 Nov', '16'],
        ['Japan', '15:00, Wed 18 Nov', '4'],
        ['Mexico', '06:00, Thu 19 Nov', '19'],
      ] } },
  ],
  gta6pcdate: [
    { h: 'The reported Q1 2027 window', p: [
      'On 13 October 2026, GamesBeat reported that Rockstar plans to release GTA 6 on PC in Q1 2027 - January to March 2027 - citing four industry sources familiar with the studio’s plans, all anonymous. Rockstar declined to comment, and has said nothing about a PC version since.',
      'If the window holds, PC players get the game 43 to 132 days after the 19 November 2026 console launch. No month, price, storefront or system requirements were named in the report.',
    ] },
    { h: 'What Rockstar and Take-Two have actually said', p: [
      'Rockstar has announced GTA 6 only for PlayStation 5 and Xbox Series X|S, launching 19 November 2026. No PC version, date, storefront or price has been announced.',
      'Take-Two CEO Strauss Zelnick said on 21 May 2026 that Rockstar has announced GTA 6 “for console only so far”. That is the only official word on PC.',
    ] },
    { h: 'No PC download exists yet', p: ['Rockstar has announced no PC version, so there is no PC download, beta or early access anywhere. Any site or video offering one is a scam - do not download it.'] },
    { h: 'What history says', p: [
      'Rockstar has never released a major game on PC at the same time as consoles. The gaps are a matter of record: GTA IV took about 7 months, Red Dead Redemption 2 about 12 months, and GTA V about 19 months. The same gaps from 19 November 2026 land in June 2027, November 2027 and June 2028.',
      'Analyst Michael Pachter (Wedbush, via BBC) expects about 6 to 7 months, which would mean around May to June 2027. GameSpot guessed Q1 2028 from history alone - that is an informed guess, not a plan.',
    ], table: {
      head: ['Game', 'Console launch', 'PC launch', 'Gap', 'Same gap = GTA 6 PC'],
      rows: [
        ['GTA IV', '29 Apr 2008', '2 Dec 2008', 'about 7 months', 'Jun 2027'],
        ['Red Dead Redemption 2', '26 Oct 2018', '5 Nov 2019', 'about 12 months', 'Nov 2027'],
        ['GTA V', '17 Sep 2013', '14 Apr 2015', 'about 19 months', 'Jun 2028'],
      ] } },
    { h: 'What to do while you wait', p: ['Check the Can My PC Run GTA 6 tool on this site for the predicted system requirements. This page will be updated the day Rockstar announces a real PC date.'] },
  ],
  age: [
    { h: 'How age is calculated', p: [
      'The calculator counts full years, then months, then days from your date of birth to today, or to any date you choose. It also shows total days lived, the total in weeks, hours, minutes and seconds - the seconds tick live - your age at your last birthday and at your next one, and the days until your next birthday.',
      'Example: born on 1 January 2000, on 4 November 2026 the age is 26 years, 10 months and 3 days, which is ' + n0(ageDays) + ' days.',
    ] },
    { h: 'Privacy', p: ['The date you enter is used only in your browser. It is not stored or sent anywhere.'] },
  ],
  bmi: [
    { h: 'How BMI is calculated', p: [
      'BMI = weight in kg ÷ (height in metres)². Example: 70 kg at 170 cm gives 70 ÷ (1.7 × 1.7) = ' + n2(bmi1) + ', which is in the normal range. Switch to imperial to enter height in feet and inches and weight in pounds - the tool also shows your healthy weight range for your height.',
    ] },
    { h: 'BMI categories (WHO ranges used here)', p: ['The calculator uses these ranges:'], table: {
      head: ['Category', 'BMI'], rows: [['Underweight', 'Below 18.5'], ['Normal weight', '18.5 to 24.9'], ['Overweight', '25 to 29.9'], ['Obese', '30 and above']] } },
    { h: 'Limits of BMI', p: ['BMI does not tell muscle from fat, so athletes can score high. It is not a diagnosis, and children need a different assessment. For health advice, speak to a doctor.'] },
  ],
  percentage: [
    { h: 'Five percentage calculations', p: ['The tool covers the five most common questions:'], table: {
      head: ['Question', 'Formula', 'Example'],
      rows: [['What is X% of Y?', 'Y × X ÷ 100', '20% of 500 = 100'], ['X is what % of Y?', 'X ÷ Y × 100', '80 is 20% of 400'], ['% change from Y to X', '(X − Y) ÷ Y × 100', '400 to 500 is +25%'], ['% difference between X and Y', '|X − Y| ÷ ((X + Y) ÷ 2) × 100', '50 and 60 differ by 18.18%'], ['Price before a discount (reverse %)', 'Price after ÷ (1 − % ÷ 100)', 'Rs 80 after 20% off was Rs 100']] } },
    { h: 'Common uses', p: ['Discounts, tax and tip amounts, marks as a percentage, and price increases. A negative result in the change mode means a decrease.'] },
  ],
  wordcounter: [
    { h: 'What the counter measures', p: [
      'Words are counted by splitting on spaces and line breaks. Characters are shown with and without spaces. Sentences are counted by full stops, question marks and exclamation marks. Paragraphs are separated by a blank line. Reading time assumes about 200 words per minute. The tool also checks your text against common platform limits - X (280 characters), Instagram bio (150), LinkedIn post (3,000), TikTok caption (4,000), SMS (160), Google Ads headline (30) and meta description (160) - with a bar showing how much room is left.',
    ] },
    { h: 'Privacy', p: ['Your text is counted in your browser. It is not uploaded or stored.'] },
  ],
  datecalc: [
    { h: 'Days between two dates', p: [
      'Pick two dates to see the number of calendar days between them, the same period in weeks and in approximate months (days ÷ 30.44), the weekday of the first date, and how many of the days are weekdays and how many are weekends. Turn on "Include end date" to count both the first and the last day. You can also add or subtract days from a date - for example, 90 days after today.',
      'Example: from 1 January 2000 to 4 November 2026 is ' + n0(dateDays) + ' days. 1 January 2000 was a Saturday.',
    ] },
    { h: 'What day was I born?', p: ['Enter your date of birth as the first date. The weekday shown is the day you were born.'] },
  ],
  password: [
    { h: 'How passwords are generated', p: [
      'Passwords are created in your browser using the secure random number generator built into it. Nothing is stored or sent to a server. You choose the length and which character types to include: A to Z, a to z, 0 to 9 and the symbols ! @ # $ % ^ & * ( ) - _ = +.',
      'With all four types on, there are 76 possible characters, so a 16 character password has about ' + Math.round(pwBits) + ' bits of randomness.',
    ] },
    { h: 'How strong is my password?', p: ['The tool shows the strength of your password in bits of randomness, with a crack-time estimate at 10 billion guesses per second. A fresh strong password is generated for you when the page opens - pick a new one any time with the Generate button.'] },
    { h: 'Good password habits', p: ['Longer is stronger. Use a different password for every site and save them in a password manager, not in a note or message.'] },
  ],
  cgpa: [
    { h: 'How CGPA is calculated', p: [
      'CGPA = total grade points ÷ total credit hours, where grade points for each subject are its grade point multiplied by its credit hours. Pick your scale first: 4.0, 10-point or 5.0, or the Pakistan HEC option (A- = 3.67, B+ = 3.33). On the 4.0 scale, A = 4.0, A- = 3.7, B+ = 3.3, B = 3.0 and so on. You can add several semesters and the tool combines them. If your university uses a different scale, enter its grade points.',
      'Example: three subjects of 3 credit hours each with grade points 4.0, 3.7 and 3.3 give (4.0 + 3.7 + 3.3) × 3 ÷ 9 = ' + n2(cg) + '.',
    ] },
    { h: 'CGPA to percentage', p: ['The tool also shows a rough percentage as CGPA × 25. That is only a rough rule used by some universities. Confirm the official conversion with your own university.'] },
  ],
  attendance: [
    { h: 'How attendance is calculated', p: [
      'Attendance % = classes attended ÷ classes held × 100. The tool also shows how many classes in a row you must attend to reach your target, and how many you can still miss while staying at or above it. Pick a target quickly with the preset buttons (65%, 75%, 80% or 85%), and switch to monthly mode to plan one month at a time.',
    ] },
    { h: 'Examples', p: ['With a 75% target:'], table: {
      head: ['Held', 'Attended', 'Attendance', 'Result'],
      rows: [['40', '32', '80%', 'Can still miss 2 classes'], ['40', '28', '70%', 'Must attend the next 8 classes']] } },
    { h: 'Check your own rule', p: ['Many colleges use 75%, but the minimum differs by institution and course. Confirm yours.'] },
  ],
  whatsmyip: [
    { h: 'What your IP address is', p: [
      'An IP address is the public address your internet connection uses on the internet. This tool shows it with an approximate location, your internet provider and your time zone.',
    ] },
    { h: 'How the lookup works', p: ['The tool asks a public IP service (ipapi.co first, ipwho.is as a full-data backup, ipify.org last for the address only) for your address, and shows the result only to you. Kalkio does not store it. The tool also shows your ASN (the network your provider uses), your approximate coordinates and your hostname. The location comes from your internet provider’s records, not GPS, so it can be a nearby city, not your exact place.'] },
    { h: 'VPNs and mobile data', p: ['If you use a VPN or proxy, the address shown is the VPN’s. On mobile data, the address is often shared by many users and can change often.'] },
  ],
  love: [
    { h: 'For fun only', p: [
      'The Love Calculator is entertainment. It turns the two names into a number with a fixed formula, so the same two names always give the same result. The score can be anything from 0% to 100%.',
      'It does not measure real compatibility. Do not use it to make decisions about relationships.',
    ] },
  ],
  jpgtowebp: [
    { h: 'How to convert JPG to WebP', p: [
      'WebP files are much smaller than JPG files at the same quality, so websites load faster. Choose a JPG or PNG file and the tool saves it as a WebP image in your browser.',
      'Pick the quality with the slider (default 80%) - lower means a smaller file, higher means a sharper image. You can convert several images at once.',
    ] },
    PRIV,
  ],
  plotprice: [
    { h: 'How plot price per Marla works', p: [
      'Enter the total price of the plot and its area, and the tool works out the price per Marla, per Kanal, per square foot and per square yard, so you can compare plots of different sizes.',
      'Pick the Marla standard from your documents: 272.25 sq ft (revenue record), 225 sq ft (housing societies) or 250 sq ft (CDA Islamabad), or enter your own size.',
    ] },
    { h: 'Example', p: ['A plot of 5 Marla at the 272.25 standard is 1,361.25 sq ft. If it costs Rs 10,000,000, that is Rs 2,000,000 per Marla and about Rs 7,346 per sq ft.'] },
  ],
  electricity: [
    { h: 'How the electricity bill is worked out', p: [
      'The base tariff is NEPRA SRO 279(I)/2026, effective 12 Feb 2026, and it is the same for every DISCO, including K-Electric. There are three kinds of domestic consumer. Lifeline covers up to 100 units with no fixed charge. Protected covers up to 200 units a month, for homes that stayed at or below 200 units a month for the previous six months, and is charged slab by slab. Unprotected charges every unit at the rate of the slab the use lands in. GST of 18% is added on the subtotal, and the fixed charge is per kW of sanctioned load.',
      'Above 200 units you lose protected status, and the whole bill is worked out at unprotected rates. Above 100 units the lifeline rates no longer apply either.',
    ] },
    { h: 'Unprotected rates (rate applies to every unit)', p: ['Fixed charge is per kW of sanctioned load:'], table: {
      head: ['Units used', 'Rate per unit', 'Fixed charge per kW'],
      rows: [[100, 22.44, 275], [200, 28.91, 300], [300, 33.10, 350], [400, 36.46, 400], [500, 38.95, 500], [600, 40.22, 675], [700, 41.85, 675]].map(([u, r, f]) => ['Up to ' + n0(u) + ' units', 'Rs ' + n2(r), 'Rs ' + n0(f)]).concat([['Above 700 units', 'Rs 47.20', 'Rs 675']]) } },
    { h: 'Protected and lifeline rates', p: ['Protected is charged slab by slab: 1 to 100 units at Rs 10.54 per unit with a fixed charge of Rs 200 per kW, and 101 to 200 units at Rs 13.01 per unit with a fixed charge of Rs 300 per kW. Lifeline is 1 to 50 units at Rs 3.95 per unit and 51 to 100 units at Rs 7.74 per unit, with no fixed charge.'] },
    { h: 'Worked examples: 150 units', p: ['The same 150 units cost very different amounts by category (energy only, before fixed charge and GST):'], table: {
      head: ['Category', 'Working', 'Energy charge'],
      rows: [['Protected', '100 x Rs 10.54 + 50 x Rs 13.01', 'Rs ' + n2(elecProt150)], ['Unprotected', '150 x Rs 28.91', 'Rs ' + n2(elecUnprot150)]] } },
    { h: 'What the estimate leaves out', p: [
      'This estimate is before the FC surcharge (about Rs 3.23 per unit), electricity duty (about 1.5%) and the Rs 35 TV fee, so a real bill is higher. FCA (fuel charge adjustment) and QTA (quarterly adjustment) also change monthly - use the Fuel Price Adjustment box in the tool for the value on your bill. The tool does not cover time-of-use billing for sanctioned loads of 5 kW and above.',
    ] },
  ],
  gasbill: [
    { h: 'How the sui gas bill is worked out', p: [
      'The rates are the OGRA Gas Sale Price Notification of 29 Jun 2025, effective 1 Jul 2025, unchanged for FY 2026-27, and they are the same for SNGPL and SSGC. Gas is priced per MMBTU, but your meter reads in hm3 (100 cubic metres = 1 hm3). The tool converts hm3 to MMBTU with the GCV factor from your bill, 3.5 MMBTU per hm3 by default, and you can edit it.',
      'Domestic consumers get the benefit of one preceding slab: use up to the previous slab boundary is charged at the previous slab rate, and only the excess is charged at the rate of the slab you landed in. Above 4 hm3 (non-protected) that benefit ends and the whole month is charged at Rs 4,200 per MMBTU. GST of 18% is added on the subtotal, which includes the energy charge, the fixed charge and the Rs 40 meter rent.',
    ] },
    { h: 'Protected slabs (Nov-Feb average up to 0.9 hm3)', p: ['Fixed charge Rs 600 a month, meter rent Rs 40 a month:'], table: {
      head: ['Monthly use', 'Rs per MMBTU'],
      rows: [['Up to 0.25 hm3', 'Rs 200'], ['Up to 0.5 hm3', 'Rs 250'], ['Up to 0.6 hm3', 'Rs 300'], ['Up to 0.9 hm3', 'Rs 350']] } },
    { h: 'Non-protected slabs', p: ['Fixed charge Rs 1,500 a month up to 1.5 hm3 and Rs 3,000 a month above 1.5 hm3, meter rent Rs 40 a month:'], table: {
      head: ['Monthly use', 'Rs per MMBTU'],
      rows: [['Up to 0.25 hm3', 'Rs 500'], ['Up to 0.6 hm3', 'Rs 850'], ['Up to 1 hm3', 'Rs 1,250'], ['Up to 1.5 hm3', 'Rs 1,450'], ['Up to 2 hm3', 'Rs 1,900'], ['Up to 3 hm3', 'Rs 3,300'], ['Up to 4 hm3', 'Rs 3,800'], ['Above 4 hm3', 'Rs 4,200 on everything']] } },
    { h: 'Worked example: non-protected, 1.0 hm3', p: ['At 3.5 MMBTU per hm3, 1.0 hm3 is 3.5 MMBTU. The first 0.6 hm3 (2.1 MMBTU) is charged at Rs 850 and the remaining 0.4 hm3 (1.4 MMBTU) at Rs 1,250:'], table: {
      head: ['Item', 'Amount'],
      rows: [['Energy charge', 'Rs ' + n2(gasExEnergy)], ['Fixed charge', 'Rs 1,500'], ['Meter rent', 'Rs 40'], ['Subtotal', 'Rs ' + n2(gasExSub)], ['GST (18%)', 'Rs ' + n2(gasExGst)], ['Total bill', 'Rs ' + n2(gasExTotal)]] } },
    { h: 'Protected status and new connections', p: [
      'Protected status is set by your average use over the four winter months, November to February, not by one month. If that average is above 0.9 hm3 a month you are non-protected.',
      'New domestic connections are given only on the RLNG tariff, not on these slabs, so this tool covers existing system-gas connections only.',
    ] },
  ],
  tokentax: [
    { h: 'How car token tax works in 2026-27', p: [
      'What you pay at the counter is two charges together: the provincial token tax, set by your province, and the federal advance income tax under Section 234 of the Income Tax Ordinance, which the Excise office collects with it. Section 234 is adjustable against your income tax return. The tool shows both lines and the total.',
      'In Punjab and Islamabad, cars up to 1000cc pay Rs 20,000 once for life. Above 1000cc the token is a share of the invoice price every year: Punjab 0.3% for 1001 to 2000cc and 0.4% above 2000cc, Islamabad 0.25% and 0.35%. Sindh and KPK charge a fixed yearly amount by engine size instead.',
    ] },
    { h: 'Punjab and Islamabad token tax', p: ['The rebate is 10% if the full year is paid by 31 August (next window: 31 August 2027). It applies to annual tax only, not to the lifetime token:'], table: {
      head: ['Engine size', 'Punjab (per year)', 'Islamabad (per year)'],
      rows: [['Up to 1000cc', 'Rs 20,000 once', 'Rs 20,000 once'], ['1001 to 2000cc', '0.3% of invoice price', '0.25% of invoice price'], ['Above 2000cc', '0.4% of invoice price', '0.35% of invoice price']] } },
    { h: 'Sindh and KPK token tax (fixed, per year)', p: ['No invoice price is needed in these provinces - the amount depends only on engine size:'], table: {
      head: ['Engine size', 'Sindh', 'KPK'],
      rows: [['Up to 1000cc', 'Rs 1,500', 'Rs 2,000'], ['1001 to 1300cc', 'Rs 2,000', 'Rs 3,000'], ['1301 to 1500cc', 'Rs 4,000', 'Rs 4,000'], ['1501 to 1600cc', 'Rs 4,000', 'Rs 5,000'], ['1601 to 2000cc', 'Rs 4,500', 'Rs 5,000'], ['2001 to 2500cc', 'Rs 5,000', 'Rs 5,000'], ['Above 2500cc', 'Rs 7,000', 'Rs 8,000']] } },
    { h: 'Section 234 advance income tax (filer)', p: ['The same table applies in every province. Non-filers pay double under the FBR rate card. Where the token is paid once for life, the lump-sum amount is collected instead of the yearly amount. No Section 234 is collected on a car used in Pakistan for more than 10 years:'], table: {
      head: ['Engine size', 'Filer, per year', 'Filer, lump sum'],
      rows: [[1000, 800, 10000], [1199, 1500, 18000], [1299, 1750, 20000], [1499, 2500, 30000], [1599, 3750, 45000], [1999, 4500, 60000]].map(([c, a, l]) => ['Up to ' + n0(c) + 'cc', 'Rs ' + n0(a), 'Rs ' + n0(l)]).concat([['2000cc and above', 'Rs 10,000', 'Rs 120,000']]) } },
    { h: 'Worked example: 1300cc Punjab filer', p: ['On an invoice price of Rs 4,000,000:'], table: {
      head: ['Item', 'Amount'],
      rows: [['Token tax (0.3% of Rs 4,000,000)', 'Rs ' + n0(tokToken)], ['Section 234 (1300 to 1499cc, filer)', 'Rs 2,500'], ['Punjab professional tax', 'Rs 200'], ['Total due for the year', 'Rs ' + n0(tokTotal)], ['Token tax with 10% early rebate', 'Rs ' + n0(tokToken * 0.9)]] } },
    { h: 'Motorcycles and Balochistan', p: [
      'A motorcycle pays Rs 1,500 once for life in Punjab. Section 234 is not charged on motorcycles.',
      'Balochistan uses its own schedule, which could not be confirmed against a second source, so it is not in this tool - check your Balochistan excise office. One more caution: some Excise offices collect three times the filer Section 234 amount from non-filers in practice, although the FBR rate card says double, so check the amount on your payment slip.',
    ] },
  ],
  dailywage: [
    { h: 'How daily wage is worked out', p: [
      'Daily wage is the monthly wage divided by 26 working days, the standard 6-day-week convention, and hourly wage is daily wage divided by 8 hours. Pick your province and the tool pre-fills the notified minimum wage for 2026-27, which you can edit to your actual wage. Enter the days worked in the month and the tool shows the daily wage, the hourly wage and the pay for the days worked.',
    ] },
    { h: 'Notified minimum wages 2026-27', p: ['Monthly minimum wage, with the daily and hourly wage it gives (monthly divided by 26, then by 8):'], table: {
      head: ['Province', 'Monthly minimum', 'Daily wage', 'Hourly wage'],
      rows: [['Punjab', 40000], ['Sindh', 43000], ['KP', 40000], ['ICT', 40700]].map(([p, m]) => [p, 'Rs ' + n0(m), 'Rs ' + n2(m / 26), 'Rs ' + n2(m / 26 / 8)]) } },
    { h: 'Worked examples', p: ['Punjab at Rs 40,000 a month: Rs 40,000 divided by 26 = Rs ' + n2(40000 / 26) + ' a day, and divided by 8 again = Rs ' + n2(40000 / 26 / 8) + ' an hour. Worked 20 days, the pay is 20 x Rs ' + n2(40000 / 26) + ' = Rs ' + n2(40000 / 26 * 20) + '. Sindh at Rs 43,000 a month: Rs 43,000 divided by 26 = Rs ' + n2(43000 / 26) + ' a day.'] },
    { h: 'Rates change every July', p: [
      'Minimum wages are re-notified, usually every July, so these figures go out of date. Re-check the current notification before relying on the result. Balochistan is not shown here because no verified notification for 2026-27 was found.',
    ] },
  ],
};
