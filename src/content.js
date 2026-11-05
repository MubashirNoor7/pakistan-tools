// Written guide content for the highest-demand Pakistan tools (shown under the calculator and
// included in the pre-rendered HTML). RULES: only figures that already exist in the tool code
// or are computed from it. No invented rates. No em/en dashes. Worked examples are computed
// from the same slabs/bands the tool uses (checked 5 Nov 2026).
// Shape: { h: heading, p: [paragraphs], table?: { head: [...], rows: [[...]] } }
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
    { h: 'BPS 2026 minimum basic pay', p: [
      'From 1 July 2026 the Finance Division (Office Memorandum F.1(2)IMP/2026, dated 21 July 2026) merged the ARA-2022 and ARA-2025 allowances into basic pay. The minimum basic pay for these grades is:'], table: {
      head: ['BPS grade', 'Minimum basic pay (2026)'],
      rows: [
        ['BPS 1', 'Rs 16,280'],
        ['BPS 6', 'Rs 18,930'],
        ['BPS 7', 'Rs 19,590'],
        ['BPS 16', 'Rs 33,720'],
        ['BPS 17', 'Rs 54,140'],
        ['BPS 22', 'Rs 146,770'],
      ] } },
    { h: 'Other grades', p: [
      'Only grades confirmed from the official chart are listed above. For any other grade, use the basic pay printed on your own payslip rather than a guess.',
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
};
