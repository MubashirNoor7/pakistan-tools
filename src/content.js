// Written guide content for the highest-demand Pakistan tools (shown under the calculator and
// included in the pre-rendered HTML). RULES: only figures that already exist in the tool code
// or are computed from it. No invented rates. No em/en dashes. Worked examples are computed
// from the same slabs/bands the tool uses (checked 5 Nov 2026).
// Shape: { h: heading, p: [paragraphs], table?: { head: [...], rows: [[...]] } }
// Date the guide content was last updated (shown under each tool title).
export const CONTENT_UPDATED = '5 Nov 2026';
export const CONTENT_BY_ID = {
  salarytax: [
    { h: 'How salary tax is worked out for 2026-27', p: [
      'Pakistan taxes salaried people on their annual salary, in slabs. Only the part of your salary that falls inside a slab is taxed at that slab’s rate. This calculator multiplies your monthly salary by 12, applies the FBR slabs from the Finance Act 2026, and divides the annual tax by 12 to give your monthly deduction.',
      'The extra surcharge that used to apply to salaried people has been abolished, so it is not added here.',
    ] },
    { h: 'Salaried tax slabs 2026-27', p: ['Annual taxable salary, the tax already due at the start of the slab, and the rate on the amount above it:'], table: {
      head: ['Annual salary', 'Tax rate', 'Fixed tax at slab start'],
      rows: [
        ['Up to Rs 600,000', '0%', 'Rs 0'],
        ['Rs 600,001 to 1,200,000', '1%', 'Rs 0'],
        ['Rs 1,200,001 to 2,200,000', '11%', 'Rs 6,000'],
        ['Rs 2,200,001 to 3,200,000', '20%', 'Rs 116,000'],
        ['Rs 3,200,001 to 4,100,000', '25%', 'Rs 316,000'],
        ['Rs 4,100,001 to 5,600,000', '29%', 'Rs 541,000'],
        ['Rs 5,600,001 to 7,000,000', '32%', 'Rs 976,000'],
        ['Above Rs 7,000,000', '35%', 'Rs 1,424,000'],
      ] } },
    { h: 'Examples: monthly tax at common salaries', p: ['These results come from the same slabs as the calculator. They are rounded and ignore allowances, exemptions and credits.'], table: {
      head: ['Monthly salary', 'Annual tax', 'Monthly tax', 'Monthly take-home'],
      rows: [
        ['Rs 50,000', 'Rs 0', 'Rs 0', 'Rs 50,000'],
        ['Rs 75,000', 'Rs 3,000', 'Rs 250', 'Rs 74,750'],
        ['Rs 100,000', 'Rs 6,000', 'Rs 500', 'Rs 99,500'],
        ['Rs 150,000', 'Rs 72,000', 'Rs 6,000', 'Rs 144,000'],
        ['Rs 200,000', 'Rs 156,000', 'Rs 13,000', 'Rs 187,000'],
        ['Rs 300,000', 'Rs 416,000', 'Rs 34,667', 'Rs 265,333'],
        ['Rs 500,000', 'Rs 1,104,000', 'Rs 92,000', 'Rs 408,000'],
      ] } },
    { h: '2026-27 vs 2025-26: what changed', p: [
      'Compared with last year (Finance Act 2025), the 2026-27 slabs cut the middle rates and abolished the surcharge. The first three slabs are unchanged.',
    ], table: {
      head: ['Annual salary', '2025-26 rate', '2026-27 rate'],
      rows: [
        ['Up to Rs 600,000', '0%', '0%'],
        ['Rs 600,001 to 1,200,000', '1%', '1%'],
        ['Rs 1,200,001 to 2,200,000', '11%', '11%'],
        ['Rs 2,200,001 to 3,200,000', '23%', '20%'],
        ['Rs 3,200,001 to 4,100,000', '30%', '25%'],
        ['Rs 4,100,001 to 5,600,000', '35%', '29%'],
        ['Rs 5,600,001 to 7,000,000', '35%', '32%'],
        ['Above Rs 7,000,000', '35%', '35%'],
      ] } },
    { h: 'How much less tax in 2026-27', p: ['Annual tax at the same salary, last year vs this year. The 9% surcharge above Rs 10 million a year has also been abolished, so very high salaries save more.'], table: {
      head: ['Monthly salary', 'Tax in 2025-26', 'Tax in 2026-27', 'You save'],
      rows: [
        ['Rs 200,000', 'Rs 162,000', 'Rs 156,000', 'Rs 6,000'],
        ['Rs 300,000', 'Rs 466,000', 'Rs 416,000', 'Rs 50,000'],
        ['Rs 500,000', 'Rs 1,281,000', 'Rs 1,104,000', 'Rs 177,000'],
      ] } },
    { h: 'A worked example', p: [
      'Take a monthly salary of Rs 200,000. Annual salary is Rs 2,400,000, which falls in the 20% slab (Rs 2,200,001 to 3,200,000). Tax is the fixed Rs 116,000 plus 20% of the part above Rs 2,200,000, which is 20% of Rs 200,000 = Rs 40,000. Total annual tax is Rs 156,000, or Rs 13,000 per month. That is an effective rate of 6.5%.',
    ] },
    { h: 'What this estimate does not include', p: [
      'Your payslip can differ from this estimate. Taxable and exempt allowances, bonuses, arrears, and any tax credits or adjustments your employer applies are not modelled here. Use the result to plan, and confirm the final figure with your payslip or FBR before filing.',
    ] },
  ],

  pta: [
    { h: 'How PTA tax is calculated in 2026-27', p: [
      'PTA tax on a phone brought into Pakistan is not a single percentage. It is made of four parts: Regulatory Duty and a Handset Levy, which are fixed rupee amounts by price band, Income Tax (withholding), which is also a fixed amount by band, and Sales Tax, which is a percentage of the customs value. The fixed amounts come from SRO 1064(I)/2026 under the Finance Act 2026.',
      'The customs value is the phone’s assessed value in US dollars multiplied by the exchange rate. It is the value FBR assesses for your exact model, not the price you paid in a shop.',
    ] },
    { h: 'PTA tax bands (filer)', p: ['Sales tax is 18% up to $500 and 25% above $500. The other three amounts are fixed rupees for each band:'], table: {
      head: ['Customs value (USD)', 'Regulatory Duty', 'Sales tax', 'Income tax (filer)', 'Handset levy'],
      rows: [
        ['Up to $30', 'Rs 240', '18%', 'Rs 100', 'Rs 100'],
        ['$31 to $100', 'Rs 2,400', '18%', 'Rs 100', 'Rs 200'],
        ['$101 to $200', 'Rs 6,000', '18%', 'Rs 100', 'Rs 200'],
        ['$201 to $350', 'Rs 8,800', '18%', 'Rs 970', 'Rs 1,800'],
        ['$351 to $500', 'Rs 12,000', '18%', 'Rs 5,000', 'Rs 4,000'],
        ['$501 to $700', 'Rs 17,600', '25%', 'Rs 11,500', 'Rs 8,000'],
        ['Above $700', 'Rs 17,600', '25%', 'Rs 11,500', 'Rs 16,000'],
      ] } },
    { h: 'Filer or non-filer', p: [
      'If you are not on the Active Taxpayer List, the income tax (withholding) amount is double the filer amount. The other parts stay the same. For a $500 phone that means Rs 10,000 instead of Rs 5,000 for income tax, so the total is Rs 5,000 higher.',
    ] },
    { h: 'Passport or CNIC: which is cheaper?', p: [
      'Registering on a passport is cheaper, because the income tax line is skipped. A phone you carried into Pakistan yourself can be registered on your passport within 60 days of arriving, and no income tax is charged on that route. The other parts (Regulatory Duty, sales tax and handset levy) are the same on both routes.',
      'Registering on a CNIC is for phones bought locally, gifted phones, or phones registered after the 60-day window. It adds the income tax line, and a late-registration fine can also apply.',
      'For a $500 phone at Rs 280 per USD, a filer pays Rs 46,200 on CNIC but Rs 41,200 on passport, a saving of Rs 5,000. For a $100 phone the saving is Rs 100. On phones above $500 the saving is Rs 11,500 for a filer.',
    ] },
    { h: 'How to pay: PSID in 5 steps', p: [
      'Check your IMEI on the DIRBS portal (dirbs.pta.gov.pk) or by dialling *8484# from a local SIM. Enter your IMEI and your CNIC or passport number, and the system gives you a Payment Slip ID (PSID) with the exact amount. Pay the PSID at a bank or through your banking app. Keep the receipt, and the phone is activated once the payment is confirmed. The amount on your PSID is the final amount, even if an estimate differs.',
    ] },
    { h: 'Examples at an exchange rate of Rs 280 per USD', p: ['The exchange rate is editable in the calculator. These totals use Rs 280 only as an example, include the handset levy, and are for a filer:'], table: {
      head: ['Customs value', 'Customs value in Rs', 'Total tax (filer)', 'Total tax (non-filer)'],
      rows: [
        ['$100', 'Rs 28,000', 'Rs 7,740', 'Rs 7,840'],
        ['$200', 'Rs 56,000', 'Rs 16,380', 'Rs 16,480'],
        ['$350', 'Rs 98,000', 'Rs 29,210', 'Rs 30,180'],
        ['$500', 'Rs 140,000', 'Rs 46,200', 'Rs 51,200'],
        ['$700', 'Rs 196,000', 'Rs 86,100', 'Rs 97,600'],
      ] } },
    { h: 'A worked example', p: [
      'A phone with a customs value of $500 at Rs 280 per USD has a customs value of Rs 140,000. Regulatory Duty is Rs 12,000, sales tax is 18% of Rs 140,000 = Rs 25,200, income tax for a filer is Rs 5,000, and the handset levy is Rs 4,000. Total: Rs 46,200.',
    ] },
    { h: 'Why your final amount may differ', p: [
      'The phone models listed in the calculator use approximate used-phone customs values. DIRBS assesses each exact model, and the amount shown on your PSID at dirbs.pta.gov.pk is the one you actually pay. Always confirm the final amount there before paying.',
    ] },
  ],

  freelancer: [
    { h: 'Freelancer tax in Pakistan under Section 154A', p: [
      'Pakistani freelancers who earn in foreign currency and bring the money in through a bank are taxed on their export receipts under Section 154A. The tax is a percentage of the receipts, not of profit. For IT and IT-enabled services exporters registered with PSEB, the reduced rate of 0.25% has been extended through Tax Year 2029 by the Finance Act 2026.',
      'For the rate to be final, the income must come through a bank and you must file an income tax return.',
    ] },
    { h: 'Tax rates by status', p: ['Four combinations are used in this calculator:'], table: {
      head: ['Status', 'Rate on export receipts'],
      rows: [
        ['Filer and PSEB registered', '0.25%'],
        ['Filer, not PSEB registered', '1%'],
        ['Non-filer and PSEB registered', '0.50%'],
        ['Non-filer, not PSEB registered', '2%'],
      ] } },
    { h: 'The 80% banking-channel rule', p: ['The low rate is not automatic. At least 80% of your foreign earnings must arrive in Pakistan through approved banking channels — a Pakistani bank account, or Payoneer or Wise routed into a local bank account. Money that stays in a foreign wallet or comes through informal channels does not count.', 'For every foreign payment, ask your bank for a Proceeds Realization Certificate (PRC). It is your proof that the money came from abroad. If less than 80% comes through banking channels, the low rate can be lost and the income can be taxed at the normal rates instead.', 'Example: if you earn $2,000 in a month, at least $1,600 of it must come through a bank. The 0.25% rate for PSEB-registered exporters runs through Tax Year 2029.'] },
    { h: 'Examples', p: ['Tax on annual export receipts under each status:'], table: {
      head: ['Annual receipts', 'Filer + PSEB', 'Filer, no PSEB', 'Non-filer + PSEB', 'Non-filer, no PSEB'],
      rows: [
        ['Rs 1,000,000', 'Rs 2,500', 'Rs 10,000', 'Rs 5,000', 'Rs 20,000'],
        ['Rs 5,000,000', 'Rs 12,500', 'Rs 50,000', 'Rs 25,000', 'Rs 100,000'],
      ] } },
    { h: 'What to check before relying on the result', p: [
      'This is an estimate of the tax on export receipts only. Whether your work qualifies as an IT or IT-enabled service export, and how your return should be filed, depends on your situation. Confirm with FBR or a tax adviser.',
    ] },
  ],

  bps: [
    { h: 'How this BPS take-home estimate works', p: [
      'Enter your basic pay and the allowances that appear on your payslip. The calculator adds them to get your gross monthly pay, works out income tax on that amount using the FBR 2026-27 salaried slabs, and subtracts the monthly tax to show an estimated take-home.',
      'Allowances in BPS jobs differ by grade, city and department, so this tool does not use one fixed allowance table. Using your own payslip figures is more accurate than any generic table.',
    ] },
    { h: 'BPS 2026 pay scale: minimum, increment and maximum', p: [
      'From 1 July 2026 the Finance Division (Office Memorandum F.1(2)IMP/2026, dated 21 July 2026) merged the ARA-2022 and ARA-2025 allowances into basic pay. The full official chart for all 22 grades is below. Your basic pay starts at the minimum and rises by the annual increment each year, up to the maximum. On top of basic pay, a 7% Ad-hoc Relief Allowance 2026 is paid on running basic pay.'], table: {
      head: ['BPS grade', 'Minimum basic pay', 'Annual increment', 'Maximum basic pay'],
      rows: [
        ['BPS 1', 'Rs 16,280', 'Rs 520', 'Rs 31,880'],
        ['BPS 2', 'Rs 16,600', 'Rs 590', 'Rs 34,300'],
        ['BPS 3', 'Rs 17,130', 'Rs 700', 'Rs 38,130'],
        ['BPS 4', 'Rs 17,650', 'Rs 800', 'Rs 41,650'],
        ['BPS 5', 'Rs 18,300', 'Rs 910', 'Rs 45,600'],
        ['BPS 6', 'Rs 18,930', 'Rs 1,010', 'Rs 49,230'],
        ['BPS 7', 'Rs 19,590', 'Rs 1,100', 'Rs 52,590'],
        ['BPS 8', 'Rs 20,290', 'Rs 1,210', 'Rs 56,590'],
        ['BPS 9', 'Rs 20,990', 'Rs 1,310', 'Rs 60,290'],
        ['BPS 10', 'Rs 21,680', 'Rs 1,430', 'Rs 64,580'],
        ['BPS 11', 'Rs 22,410', 'Rs 1,580', 'Rs 69,810'],
        ['BPS 12', 'Rs 23,750', 'Rs 1,720', 'Rs 75,350'],
        ['BPS 13', 'Rs 25,420', 'Rs 1,880', 'Rs 81,820'],
        ['BPS 14', 'Rs 27,060', 'Rs 2,090', 'Rs 89,760'],
        ['BPS 15', 'Rs 28,730', 'Rs 2,380', 'Rs 100,130'],
        ['BPS 16', 'Rs 33,720', 'Rs 2,720', 'Rs 115,320'],
        ['BPS 17', 'Rs 54,140', 'Rs 4,110', 'Rs 136,340'],
        ['BPS 18', 'Rs 68,330', 'Rs 5,120', 'Rs 170,730'],
        ['BPS 19', 'Rs 105,510', 'Rs 5,450', 'Rs 214,510'],
        ['BPS 20', 'Rs 123,090', 'Rs 8,040', 'Rs 235,650'],
        ['BPS 21', 'Rs 136,680', 'Rs 8,920', 'Rs 261,560'],
        ['BPS 22', 'Rs 146,770', 'Rs 10,470', 'Rs 293,350'],
      ] } },
    { h: 'What this table does not show', p: [
      'These figures are basic pay only. House rent, conveyance and other allowances are paid on top and differ by grade, city and department, so enter them from your own payslip in the calculator above.',
    ] },
    { h: 'Limits of the estimate', p: [
      'The result does not include other deductions such as GP fund, benevolent fund or group insurance, which vary by department. It is an income tax and take-home estimate, not a payslip.',
    ] },
  ],

  zakat: [
    { h: 'How Zakat is calculated', p: [
      'Zakat is 2.5% of your zakatable wealth, provided that wealth is at or above the nisab threshold and you have held it for a full lunar year. This calculator adds your cash and bank balance, the value of your gold and silver, and your stocks or investments, then subtracts debts you have to pay.',
      'If the total is below nisab, no Zakat is due and the calculator shows Rs 0.',
    ] },
    { h: 'Nisab: gold and silver', p: [
      'The nisab used here is 87.48 grams of gold or 612.36 grams of silver. The calculator takes the lower of the two values as the threshold, because silver nisab is usually the lower figure. Scholars and institutions differ on whether to use gold or silver for cash holdings, so ask your scholar if you are close to the threshold.',
      'Both nisab values depend on the rate you enter. Gold and silver rates change daily, so use today’s local rate for an accurate result.',
    ] },
    { h: 'Official government nisab for bank deduction', p: [
      'Separately from the gold and silver nisab above, the government notifies one cash nisab each Zakat year for compulsory deduction from bank accounts. For Zakat Year 1446-47H (2026), the Ministry of Poverty Alleviation and Social Safety fixed it at Rs 503,529. On the first day of Ramadan, banks deduct Zakat from savings and profit-and-loss-sharing accounts holding Rs 503,529 or more. Accounts below that balance are not deducted.',
      'This bank-deduction nisab is not the same as your personal Zakat calculation. Your personal obligation uses the gold or silver nisab at current rates, which is what this calculator works out.',
    ] },
    { h: 'What to include', p: [
      'Cash at home and in bank accounts, gold and silver you own, and stocks or other investments held for the year. Debts you must repay are subtracted. Enter your gold and silver weight in grams and the rate per gram.',
    ] },
    { h: 'A worked example', p: [
      'Suppose someone holds Rs 500,000 in cash, 20 grams of gold at Rs 25,000 per gram, and owes nothing. Gold is worth Rs 500,000, so total wealth is Rs 1,000,000. At the same rates, the gold nisab (87.48 grams) is Rs 2,187,000 and, at Rs 3,000 per gram of silver, the silver nisab (612.36 grams) is Rs 1,837,080. The lower threshold is Rs 1,837,080, so this person is below nisab and owes no Zakat. These rates are examples only, not current prices.',
    ] },
    { h: 'A note on religious rulings', p: [
      'This tool does the arithmetic. It does not give a religious ruling. For questions about which assets count, how to value them, or when your Zakat year starts, confirm with a qualified scholar.',
    ] },
  ],
  gold: [
    { h: 'How the gold calculator works', p: [
      'Gold in Pakistan is priced per tola. One tola is 11.664 grams. Enter the 24 karat rate per tola from your local sarafa, choose the purity of your gold and the quantity, and the calculator gives the value, plus the price per tola, per gram and per 10 grams.',
      'This tool does not fetch live prices. Gold rates change daily, so type in today’s sarafa rate to get an accurate result.',
    ] },
    { h: 'Purity factors used', p: ['The value of lower-karat gold is the 24 karat value multiplied by a purity factor:'], table: {
      head: ['Karat', 'Purity factor'],
      rows: [['24K', '1.000'], ['22K', '0.916'], ['21K', '0.875'], ['18K', '0.750']] } },
    { h: 'Example', p: ['These figures use an example rate of Rs 400,000 per tola for 24K gold. It is not today’s price.'], table: {
      head: ['Item', 'Value'],
      rows: [
        ['1 tola of 24K', 'Rs 400,000'],
        ['1 tola of 22K', 'Rs 366,400'],
        ['1 tola of 21K', 'Rs 350,000'],
        ['1 tola of 18K', 'Rs 300,000'],
        ['1 gram of 24K', 'Rs 34,294'],
        ['1 gram of 22K', 'Rs 31,413'],
        ['10 grams of 24K', 'Rs 342,936'],
      ] } },
    { h: 'What the result does not include', p: [
      'Jewellers add making charges and sometimes a wastage deduction when you sell, so the price you pay or receive for jewellery will differ from the pure gold value. Use this tool for the gold value only.',
    ] },
  ],

  fuel: [
    { h: 'How trip fuel cost is calculated', p: [
      'The calculator divides the distance by your vehicle’s mileage to get the litres needed, then multiplies by the fuel rate per litre. Cost = (distance in km ÷ km per litre) × rate per litre.',
      'Choose petrol or diesel and the rate fills in from the latest rate saved on this site. Fuel rates in Pakistan are notified by OGRA and change often, so edit the rate if today’s price is different.',
    ] },
    { h: 'Example', p: [
      'A 100 km trip in a car that does 12 km per litre needs 100 ÷ 12 = 8.33 litres. At an example rate of Rs 300 per litre (not today’s rate) the fuel cost is about Rs 2,500.',
    ] },
    { h: 'What affects your real cost', p: [
      'Real mileage depends on traffic, speed, air conditioning, load and road type. Highway mileage is usually different from city mileage, so use a figure from your own recent driving. The Fuel Average Calculator on this site can work it out from your last tank.',
    ] },
  ],

  fuelavg: [
    { h: 'How to measure your fuel average', p: [
      'Fill the tank fully and note the odometer reading. Drive as usual. At the next fill-up, fill the tank fully again and note the odometer. The litres you added are the fuel used for the kilometres driven in between.',
      'Fuel average in km per litre = distance travelled ÷ fuel used. The calculator also shows litres per 100 km and the fuel cost per kilometre.',
    ] },
    { h: 'Example', p: [
      'Driving 400 km and adding 32 litres gives 400 ÷ 32 = 12.5 km per litre, which is 8 litres per 100 km. At an example price of Rs 300 per litre (not today’s rate), the cost is Rs 24 per km.',
    ] },
    { h: 'Tips for a reliable number', p: [
      'Use the same pump and fill to the same point each time, and measure over a few hundred kilometres rather than one short trip. A single short trip can give a misleading result.',
    ] },
  ],
};
// Guides for the other tools live in content-more.js and are loaded on demand
// (one small chunk, only when a tool page that needs one opens), so the home
// page never downloads them. The pre-render plugin still imports both files
// at build time, so the static crawler pages keep their full guide text.
let moreCache = null;
export async function loadGuide(id) {
  if (CONTENT_BY_ID[id]) return CONTENT_BY_ID[id];
  if (!moreCache) moreCache = (await import('./content-more.js')).CONTENT_MORE;
  return moreCache[id] || null;
}
