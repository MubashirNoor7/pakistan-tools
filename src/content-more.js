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
const marlaRows = [3, 5, 7, 10, 20].map((m) => [m === 20 ? '20 Marla (1 Kanal)' : m + ' Marla', n2(m * M1) + ' sq ft', n2(m * M2) + ' sq ft', n2(m * M1 / 9) + ' / ' + n2(m * M2 / 9)]);
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
// Age example 1 Jan 2000 to 4 Nov 2026
const ageDays = Math.floor((new Date('2026-11-04') - new Date('2000-01-01')) / 86400000);
const dateDays = Math.abs(Math.round((new Date('2026-11-04') - new Date('2000-01-01')) / 86400000));
// Prize bond table (National Savings 2026 prizes as in the tool)
const BONDS = { 100: [700000, 200000, 1000], 200: [750000, 250000, 1250], 750: [1500000, 500000, 9300], 1500: [3000000, 1000000, 18500], 25000: [30000000, 10000000, 300000], 40000: [80000000, 30000000, 500000] };
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
      'A Marla is the traditional unit for measuring residential plots in Pakistan. There is no single legal size: 225 sq ft is common in housing societies such as DHA and Bahria Town, while 272.25 sq ft is the revenue-record Marla. The calculator lets you choose either, or enter your own custom size.',
      'Always use the Marla standard written in your plot documents. Using the wrong one changes the area by about 21%.',
    ] },
    { h: 'Marla to square feet table', p: ['Common plot sizes under both standards, with square yards (225 standard / 272.25 standard):'], table: {
      head: ['Plot size', '225 sq ft Marla', '272.25 sq ft Marla', 'Square yards'], rows: marlaRows } },
    { h: 'Conversion formulas', p: [
      'Square feet = Marla × sq ft per Marla. Square yards = square feet ÷ 9. Square metres = square feet ÷ 10.7639. Kanal = Marla ÷ 20. Acre = Marla ÷ 160.',
      'Example: 5 Marla at 272.25 sq ft is 1,361.25 sq ft, which is 151.25 square yards and 0.25 Kanal.',
    ] },
  ],
  kanal: [
    { h: 'Kanal to Marla', p: [
      'One Kanal is 20 Marla under both the 225 sq ft and the 272.25 sq ft standards. In area, 1 Kanal is 4,500 sq ft with the 225 standard and 5,445 sq ft with the 272.25 standard. Eight Kanal make one acre, and one acre is 160 Marla.',
    ] },
    { h: 'Kanal conversion table', p: ['Kanal in Marla and square feet:'], table: {
      head: ['Kanal', 'Marla', '225 standard (sq ft)', '272.25 standard (sq ft)'],
      rows: [0.5, 1, 2, 4, 8].map((k) => [String(k), n2(k * 20), n0(k * 20 * M1), n2(k * 20 * M2)]) } },
    { h: 'Which standard applies to you?', p: ['Check your registry or society documents. Using the wrong Marla size changes the total area, so confirm before you buy or sell.'] },
  ],
  plotsize: [
    { h: 'How plot size in Marla is worked out', p: [
      'Multiply the length by the width in feet to get the area in square feet, then divide by the size of one Marla (225 or 272.25 sq ft, or your own). The calculator also shows square yards, square metres, Kanal and acres.',
    ] },
    { h: 'Common plot dimensions', p: ['Area and Marla for typical plots:'], table: {
      head: ['Plot (feet)', 'Area', 'Marla at 225', 'Marla at 272.25'],
      rows: [[25, 45], [30, 50], [35, 65], [30, 60], [50, 90]].map(([w, l]) => [w + ' × ' + l, n0(plotArea(l, w)) + ' sq ft', n2(plotArea(l, w) / M1), n2(plotArea(l, w) / M2)]) } },
    { h: 'Why your result may differ from the paperwork', p: ['Real plots are often slightly under or over their nominal size, and irregular plots are not rectangles. For irregular shapes, measure carefully or use the area from your registry papers.'] },
  ],
  rentvsbuy: [
    { h: 'How the comparison works', p: [
      'Renting: monthly rent, raised each year by the rent increase you enter, added up over the years you choose. Buying: down payment plus the loan repayments plus yearly maintenance over the same years. The loan payment uses the standard EMI formula at the rate you enter.',
      'The tool does not include house price growth, resale value, tax or the return you could earn by investing the down payment. These can change the answer a lot.',
    ] },
    { h: 'Example with the default numbers', p: ['Rent Rs 40,000 a month rising 10% a year, a Rs 10,000,000 house with Rs 2,000,000 down, a 20% loan rate, 10 years and Rs 50,000 yearly maintenance:'], table: {
      head: ['Item', 'Amount'],
      rows: [['Total rent over 10 years', rs(rvb.rentTotal)], ['Loan amount', rs(rvb.loan)], ['Monthly loan payment', rs(rvb.mp)], ['Total buying cost (down + loan + maintenance)', rs(rvb.buyTotal)]] } },
    { h: 'How to read the result', p: ['The cheaper option on paper is not always the better choice. If the house gains value, buying looks better than the table shows. If interest rates are high, as in this example, loan interest is the biggest cost of buying.'] },
  ],
  areacalc: [
    { h: 'Area of a room, wall or floor', p: [
      'Enter length and width in the same unit (feet, metres or yards). The calculator converts to metres using 1 ft = 0.3048 m and 1 yd = 0.9144 m, multiplies for the area in square metres, and shows the result in square feet too.',
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
    { h: 'How much house can you afford?', p: [
      'The calculator uses a rule of thumb: keep the monthly mortgage payment at or below a share of your income (30% by default). It works out the loan that payment can repay over your chosen years at your chosen rate, then adds your down payment to get an affordable house price.',
    ] },
    { h: 'Example', p: ['Income Rs 100,000 a month, 30% budget, 12% rate, 20 years and a Rs 2,000,000 down payment:'], table: {
      head: ['Item', 'Amount'],
      rows: [['Monthly payment budget', rs(mort.budget)], ['Affordable loan', rs(mort.loan)], ['House price you can afford', rs(mort.price)]] } },
    { h: 'What banks also check', p: ['This is an estimate, not an approval. Banks also look at your credit history, other debts, job stability and the valuation of the property.'] },
  ],
  homeloan: [
    { h: 'Home loan EMI and total interest', p: [
      'Loan amount is the property price minus your down payment. The monthly EMI uses the standard formula with your annual rate and tenure. Total interest is everything you pay back above the loan amount.',
    ] },
    { h: 'Example', p: ['A Rs 5,000,000 property with Rs 1,000,000 down, 9% a year, 20 years:'], table: {
      head: ['Item', 'Amount'],
      rows: [['Loan amount', rs(4000000)], ['Monthly EMI', rs(home1)], ['Total paid', rs(home1 * 240)], ['Total interest', rs(home1 * 240 - 4000000)]] } },
    { h: 'Not a bank offer', p: ['Actual rates, fees and eligibility depend on the bank. Banks also check income, credit score and property valuation.'] },
  ],
  carloan: [
    { h: 'Car loan EMI and total interest', p: [
      'Enter the on-road price, your down payment, the yearly interest rate and the tenure. The loan amount is price minus down payment, and the EMI uses the standard formula.',
    ] },
    { h: 'Example', p: ['A Rs 2,500,000 car with Rs 500,000 down, 10% a year, 5 years:'], table: {
      head: ['Item', 'Amount'],
      rows: [['Loan amount', rs(2000000)], ['Monthly EMI', rs(car1)], ['Total paid', rs(car1 * 60)], ['Total interest', rs(car1 * 60 - 2000000)]] } },
    { h: 'Before you borrow', p: ['Use the dealer’s actual on-road figure, which includes registration and taxes where applicable. Ask the bank about insurance and processing fees, which are not in this estimate.'] },
  ],
  sip: [
    { h: 'How the SIP calculator works', p: [
      'A SIP is a fixed amount invested every month. The calculator adds each monthly amount and grows the balance by the monthly return (annual return ÷ 12). An optional yearly step-up raises your monthly amount by a percentage each year.',
      'Returns are not guaranteed. Actual fund returns go up and down, so treat the result as an estimate, not investment advice.',
    ] },
    { h: 'Example', p: ['Rs 5,000 a month at an assumed 12% a year for 10 years:'], table: {
      head: ['Case', 'Total invested', 'Estimated value'],
      rows: [['Fixed SIP', rs(sipA.inv), rs(sipA.val)], ['10% yearly step-up', rs(sipB.inv), rs(sipB.val)]] } },
    { h: 'Reading the result', p: ['The 12% return is an assumption you can change. Small changes in the rate or in the number of years make a large difference to the final value.'] },
  ],
  salarycalc: [
    { h: 'A generic net salary estimate', p: [
      'Net salary = gross salary × (1 − tax rate − other deductions rate). You enter your own tax rate and deduction rate, so the tool works for any country. It does not use any country’s official tax bands.',
      'Example: gross salary 50,000 with 20% tax and 5% other deductions gives 50,000 × (1 − 0.20 − 0.05) = 37,500 a month.',
    ] },
    { h: 'For Pakistan', p: ['For Pakistan salary tax with the official 2026-27 slabs, use the Pakistan Salary Tax Calculator on this site instead. This generic tool should not be used for filing tax.'] },
  ],
  prizebond: [
    { h: 'What this calculator does and does not do', p: [
      'It shows how much you keep after tax if a prize bond wins. It does not check whether your bond number won. Check your number against the official draw list, then use this tool for the after-tax amount.',
      'Withholding tax is 15% for filers and 30% for non-filers.',
    ] },
    { h: 'Prize amounts by denomination (National Savings, 2026)', p: ['Prize amounts as used in the calculator:'], table: {
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
      'Choose a JPG or PNG image from your device. The tool builds a PDF in your browser with a page the same size as the image, and gives you a download button. Nothing is uploaded.',
    ] },
    PRIV,
    { h: 'Limits', p: ['This tool converts the single image you choose into one PDF. Very large photos can be slow on a phone.'] },
  ],
  pdftojpg: [
    { h: 'How to convert PDF pages to JPG', p: [
      'Choose a PDF. Each page is drawn in your browser at 2x scale and saved as a separate JPG at 92% quality, which you can download one by one.',
    ] },
    PRIV,
    { h: 'Limits', p: ['Very large PDFs can be slow on a phone. Password-protected PDFs may not open.'] },
  ],
  pngtojpg: [
    { h: 'How to convert PNG to JPG', p: [
      'Choose a PNG file. The tool draws it onto a canvas in your browser and saves it as a JPG at 92% quality. JPG files do not support transparency, so any transparent area becomes white.',
    ] },
    PRIV,
    { h: 'When to use JPG or PNG', p: ['JPG gives smaller files for photos. PNG keeps sharp edges and transparency, which is better for logos and screenshots.'] },
  ],
  heic: [
    { h: 'How to convert HEIC to JPG', p: [
      'iPhone photos are often saved as HEIC, which many Windows and Android apps cannot open. Choose a HEIC file and the tool converts it to a JPG at 92% quality in your browser.',
    ] },
    PRIV,
    { h: 'Large files', p: ['HEIC conversion can take a few seconds per photo, especially on a phone. Convert one photo at a time.'] },
  ],
  webp: [
    { h: 'How to convert WebP to JPG', p: [
      'WebP images from websites often will not open in older programs. Choose a WebP file and the tool saves it as a JPG that works almost everywhere.',
      'The tool uses your browser’s own image decoder, so your browser must be able to open WebP files, which current browsers can.',
    ] },
    PRIV,
  ],
  qr: [
    { h: 'How to make a QR code', p: [
      'Type or paste a link, text or Wi-Fi details, press Generate, and download the QR code as a PNG image (512 pixels wide). It is drawn in your browser, so your text is never sent anywhere.',
    ] },
    { h: 'Tips for a code that scans', p: ['Test the code with your phone before printing. Print it large enough and with good contrast, dark code on a light background. The code stores the text itself, so it keeps working as long as the link or information you put in stays valid.'] },
  ],
  unitconv: [
    { h: 'Units supported', p: ['Length: metres, kilometres, centimetres, feet, inches, yards, miles. Weight: kilograms, grams, pounds, ounces. Temperature: Celsius, Fahrenheit, Kelvin.'] },
    { h: 'Conversion factors', p: ['Fixed factors used, with no internet needed:'], table: {
      head: ['Unit', 'Equals'],
      rows: [['1 foot', '0.3048 metres'], ['1 inch', '0.0254 metres'], ['1 yard', '0.9144 metres'], ['1 mile', '1,609.34 metres'], ['1 pound', '0.453592 kg'], ['1 ounce', '0.0283495 kg']] } },
    { h: 'Temperature formulas', p: ['Fahrenheit = Celsius × 9 ÷ 5 + 32. Celsius = (Fahrenheit − 32) × 5 ÷ 9. Kelvin = Celsius + 273.15. Example: 25 °C is 77 °F.'] },
  ],
  htmltovideo: [
    { h: 'How HTML to video works', p: [
      'Paste HTML and CSS, preview it live, then record from 3 to 60 seconds, a custom length, or the full animation. Pause or restart the preview with the buttons under it. Choose 10, 30 or 60 frames per second for smooth motion, and record from the beginning or from where the animation is now. The tool captures the preview at up to twice the preview size, so the video stays sharp. You can download the result as MP4 or WebM. Everything runs in your browser.',
    ] },
    { h: 'Format and browser support', p: ['The video downloads as MP4 in Chrome, Edge and Safari, which plays almost everywhere including WhatsApp and TikTok. Smooth 30 and 60 fps recording needs a browser with VideoEncoder, such as a recent Chrome, Edge or Safari. If your browser cannot make MP4, the tool saves WebM instead, recorded in real time at 10 frames per second.'] },
  ],
  age: [
    { h: 'How age is calculated', p: [
      'The calculator counts full years, then months, then days from your date of birth to today, or to any date you choose. It also shows total days lived and days until your next birthday.',
      'Example: born on 1 January 2000, on 4 November 2026 the age is 26 years, 10 months and 3 days, which is ' + n0(ageDays) + ' days.',
    ] },
    { h: 'Privacy', p: ['The date you enter is used only in your browser. It is not stored or sent anywhere.'] },
  ],
  bmi: [
    { h: 'How BMI is calculated', p: [
      'BMI = weight in kg ÷ (height in metres)². Example: 70 kg at 170 cm gives 70 ÷ (1.7 × 1.7) = ' + n2(bmi1) + ', which is in the normal range.',
    ] },
    { h: 'BMI categories (WHO ranges used here)', p: ['The calculator uses these ranges:'], table: {
      head: ['Category', 'BMI'], rows: [['Underweight', 'Below 18.5'], ['Normal weight', '18.5 to 24.9'], ['Overweight', '25 to 29.9'], ['Obese', '30 and above']] } },
    { h: 'Limits of BMI', p: ['BMI does not tell muscle from fat, so athletes can score high. It is not a diagnosis, and children need a different assessment. For health advice, speak to a doctor.'] },
  ],
  percentage: [
    { h: 'Three percentage calculations', p: ['The tool covers the three most common questions:'], table: {
      head: ['Question', 'Formula', 'Example'],
      rows: [['What is X% of Y?', 'Y × X ÷ 100', '20% of 500 = 100'], ['X is what % of Y?', 'X ÷ Y × 100', '80 is 20% of 400'], ['% change from Y to X', '(X − Y) ÷ Y × 100', '400 to 500 is +25%']] } },
    { h: 'Common uses', p: ['Discounts, tax and tip amounts, marks as a percentage, and price increases. A negative result in the change mode means a decrease.'] },
  ],
  wordcounter: [
    { h: 'What the counter measures', p: [
      'Words are counted by splitting on spaces and line breaks. Characters are shown with and without spaces. Sentences are counted by full stops, question marks and exclamation marks. Paragraphs are separated by a blank line. Reading time assumes about 200 words per minute.',
    ] },
    { h: 'Privacy', p: ['Your text is counted in your browser. It is not uploaded or stored.'] },
  ],
  datecalc: [
    { h: 'Days between two dates', p: [
      'Pick two dates to see the number of calendar days between them, the same period in weeks and in approximate months (days ÷ 30.44), and the weekday of the first date.',
      'Example: from 1 January 2000 to 4 November 2026 is ' + n0(dateDays) + ' days. 1 January 2000 was a Saturday.',
    ] },
    { h: 'What day was I born?', p: ['Enter your date of birth as the first date. The weekday shown is the day you were born.'] },
  ],
  password: [
    { h: 'How passwords are generated', p: [
      'Passwords are created in your browser using the secure random number generator built into it. Nothing is stored or sent to a server. You choose the length and which character types to include: A to Z, a to z, 0 to 9 and the symbols ! @ # $ % ^ & * ( ) - _ = +.',
      'With all four types on, there are 76 possible characters, so a 16 character password has about ' + Math.round(pwBits) + ' bits of randomness.',
    ] },
    { h: 'Good password habits', p: ['Longer is stronger. Use a different password for every site and save them in a password manager, not in a note or message.'] },
  ],
  cgpa: [
    { h: 'How CGPA is calculated', p: [
      'CGPA = total grade points ÷ total credit hours, where grade points for each subject are its grade point multiplied by its credit hours. The tool uses the common 4.0 scale (A = 4.0, A- = 3.7, B+ = 3.3, B = 3.0 and so on). You pick the grade point for each subject from 4.0, 3.7, 3.3, 3.0, 2.7, 2.3, 2.0, 1.7, 1.0 or 0. If your university uses a different scale, enter its grade points.',
      'Example: three subjects of 3 credit hours each with grade points 4.0, 3.7 and 3.3 give (4.0 + 3.7 + 3.3) × 3 ÷ 9 = ' + n2(cg) + '.',
    ] },
    { h: 'CGPA to percentage', p: ['The tool also shows a rough percentage as CGPA × 25. That is only a rough rule used by some universities. Confirm the official conversion with your own university.'] },
  ],
  attendance: [
    { h: 'How attendance is calculated', p: [
      'Attendance % = classes attended ÷ classes held × 100. The tool also shows how many classes in a row you must attend to reach your target, and how many you can still miss while staying at or above it.',
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
    { h: 'How the lookup works', p: ['The tool asks a public IP service (ipapi.co, with ipify.org as a backup) for your address, and shows the result only to you. Kalkio does not store it. The location comes from your internet provider’s records, not GPS, so it can be a nearby city, not your exact place.'] },
    { h: 'VPNs and mobile data', p: ['If you use a VPN or proxy, the address shown is the VPN’s. On mobile data, the address is often shared by many users and can change often.'] },
  ],
  love: [
    { h: 'For fun only', p: [
      'The Love Calculator is entertainment. It turns the two names into a number with a fixed formula, so the same two names always give the same result. The score is always between 40% and 100%.',
      'It does not measure real compatibility. Do not use it to make decisions about relationships.',
    ] },
  ],
};
