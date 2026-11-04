import React, { useState } from 'react';
import { Card, CardContent, Typography, TextField, Box, List, ListItem, ListItemText, Divider, MenuItem, ToggleButton, ToggleButtonGroup, Alert, FormControlLabel, Checkbox, Button } from '@mui/material';
import { fmt, Hero, Rows } from './property.jsx';

// FBR salaried slabs 2026-27 (Finance Act 2026), verified from multiple published tables:
// 0 to 600k, 1% to 1.2M, 11% to 2.2M (6,000+), 20% to 3.2M (116,000+), 25% to 4.1M (316,000+),
// 29% to 5.6M (541,000+), 32% to 7M (976,000+), 35% above (1,424,000+). Surcharge abolished for salaried.
export function salaryTax(annual) {
  const slabs = [[600000, 0, 0], [1200000, 0.01, 0], [2200000, 0.11, 6000], [3200000, 0.20, 116000], [4100000, 0.25, 316000], [5600000, 0.29, 541000], [7000000, 0.32, 976000], [Infinity, 0.35, 1424000]];
  for (let i = 0; i < slabs.length; i++) {
    const [limit, rate, fixed] = slabs[i]; const prev = i === 0 ? 0 : slabs[i - 1][0];
    if (annual <= limit) return fixed + rate * (annual - prev);
  }
  return 0;
}
function Wrap({ children, note }) {
  return (<><Card elevation={2} sx={{ borderRadius: 3 }}><CardContent sx={{ p: 3 }}>{children}</CardContent></Card>{note && <Alert severity="info" sx={{ mt: 2 }}>{note}</Alert>}</>);
}
export function SalaryTaxTool() {
  const [m, setM] = useState('200000'); const monthly = parseFloat(m) || 0; const annual = monthly * 12; const tax = salaryTax(annual);
  return (<Wrap note="Estimate only — FBR salaried slabs 2026-27 (Finance Act 2026). Allowances, deductions and payslip figures can change the final amount. Confirm from FBR / your payslip before filing.">
    <TextField fullWidth label="Monthly salary (Rs)" type="number" value={m} onChange={(e) => setM(e.target.value)} sx={{ '& input': { fontSize: 24, fontWeight: 700 } }} />
    {monthly > 0 && (<><Hero value={'Rs ' + fmt(tax / 12)} unit="Monthly tax deduction" eq={`Annual tax Rs ${fmt(tax)}`} /><Rows rows={[['Annual salary', 'Rs ' + fmt(annual)], ['Annual tax', 'Rs ' + fmt(tax)], ['Monthly take-home', 'Rs ' + fmt(monthly - tax / 12)], ['Annual take-home', 'Rs ' + fmt(annual - tax)], ['Effective rate', fmt(annual > 0 ? (tax / annual) * 100 : 0) + '%']]} /></>)}
    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>Slabs: 0% to Rs 600,000 · 1% to 1.2M · 11% to 2.2M · 20% to 3.2M · 25% to 4.1M · 29% to 5.6M · 32% to 7M · 35% above 7M.</Typography>
  </Wrap>);
}
// BPS-2026 minimum basic pay (Finance Division OM No.F.1(2)IMP/2026, 21 July 2026,
// effective 1 July 2026, merging ARA-2022 + ARA-2025). Only grades verified from the
// official chart are listed here — other grades must come from the payslip, not a guess.
const BPS_2026_MIN = { 1: 16280, 6: 18930, 7: 19590, 16: 33720, 17: 54140, 22: 146770 };
export function BpsTool() {
  const [grade, setGrade] = useState('16'); const [basic, setBasic] = useState('80000'); const [hra, setHra] = useState('20000'); const [conv, setConv] = useState('5000'); const [med, setMed] = useState('3000'); const [adhoc, setAdhoc] = useState('10000');
  const minBasic = BPS_2026_MIN[parseInt(grade, 10)];
  const b = parseFloat(basic) || 0; const gross = b + (parseFloat(hra) || 0) + (parseFloat(conv) || 0) + (parseFloat(med) || 0) + (parseFloat(adhoc) || 0); const tax = salaryTax(gross * 12) / 12;
  return (<Wrap note="BPS allowances vary by grade, city and department — no single fixed table is used here on purpose. Enter the allowances from your payslip. Gross minus FBR salary tax (2026-27 slabs) gives the take-home estimate.">
    <TextField select fullWidth label="BPS Grade" value={grade} onChange={(e) => setGrade(e.target.value)} sx={{ mb: 2 }}>{Array.from({ length: 22 }, (_, i) => i + 1).map((g) => (<MenuItem key={g} value={String(g)}>BPS {g}</MenuItem>))}</TextField>
    {minBasic ? (<><Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>BPS {grade} (2026) minimum basic: Rs {fmt(minBasic)} — Finance Division, 1 July 2026. This is only a starting point; your actual basic comes from your payslip.</Typography><Button variant="outlined" size="small" sx={{ mb: 2 }} onClick={() => setBasic(String(minBasic))}>Use BPS {grade} minimum basic (Rs {fmt(minBasic)})</Button></>) : (<Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Is grade ka 2026 minimum is tool mein nahi hai — apna actual basic payslip se likhen. Grade alone does not fix allowances; they vary by city and department.</Typography>)}
    <TextField fullWidth label="Basic pay (Rs/month)" type="number" value={basic} onChange={(e) => setBasic(e.target.value)} sx={{ mb: 2 }} />
    <TextField fullWidth label="House Rent Allowance (Rs)" type="number" value={hra} onChange={(e) => setHra(e.target.value)} sx={{ mb: 2 }} />
    <TextField fullWidth label="Conveyance Allowance (Rs)" type="number" value={conv} onChange={(e) => setConv(e.target.value)} sx={{ mb: 2 }} />
    <TextField fullWidth label="Medical Allowance (Rs)" type="number" value={med} onChange={(e) => setMed(e.target.value)} sx={{ mb: 2 }} />
    <TextField fullWidth label="Ad hoc / other allowances (Rs)" type="number" value={adhoc} onChange={(e) => setAdhoc(e.target.value)} />
    {gross > 0 && (<><Hero value={'Rs ' + fmt(gross - tax)} unit="Monthly take-home (estimate)" /><Rows rows={[['Gross monthly', 'Rs ' + fmt(gross)], ['Monthly tax (estimate)', 'Rs ' + fmt(tax)], ['Basic pay', 'Rs ' + fmt(b)]]} /></>)}
  </Wrap>);
}
// PTA 2026-27 — FIXED bands, not percentages (except sales tax). SRO 1064(I)/2026, Finance Act 2026.
// Band: [max USD, RD, sales%, WHT filer, levy]
// Non-filer WHT = double filer WHT. Customs value = USD x exchange rate. DIRBS final amount is authoritative.
const PTA_BANDS = [
  [30, 240, 18, 100, 100],
  [100, 2400, 18, 100, 200],
  [200, 6000, 18, 100, 200],
  [350, 8800, 18, 970, 1800],
  [500, 12000, 18, 5000, 4000],
  [700, 17600, 25, 11500, 8000],
  [Infinity, 17600, 25, 11500, 16000],
];
// Used-phone approximate customs values (USD) from FBR Valuation Ruling 1035/2035
// as reported by PhoneWorld / legalpoint / taxationmaeasy. These are APPROXIMATE
// used values — DIRBS assesses each exact model and the final PSID is authoritative.
// Selecting a model only fills the USD field; the user can still edit it.
const PTA_MODELS = [
  { label: 'Custom / other phone — enter USD yourself', usd: '' },
  { label: 'iPhone 15 Pro Max (used, ~$460)', usd: 460 },
  { label: 'iPhone 15 Pro (used, ~$390)', usd: 390 },
  { label: 'iPhone 15 Plus (used, ~$320)', usd: 320 },
  { label: 'iPhone 15 (used, ~$310)', usd: 310 },
  { label: 'Galaxy S23 Ultra (used, ~$160)', usd: 160 },
  { label: 'Galaxy S23 Plus (used, ~$120)', usd: 120 },
  { label: 'Galaxy S23 (used, ~$110)', usd: 110 },
  { label: 'Galaxy S22 Ultra (used, ~$135)', usd: 135 },
  { label: 'Galaxy S21 (used, ~$50)', usd: 50 },
];
export function PtaTool() {
  const [model, setModel] = useState(''); const [usd, setUsd] = useState('500'); const [rate, setRate] = useState('280'); const [filer, setFiler] = useState('filer');
  const u = parseFloat(usd) || 0; const customs = u * (parseFloat(rate) || 0);
  const band = PTA_BANDS.find(([max]) => u <= max) || PTA_BANDS[PTA_BANDS.length - 1];
  const [_, rd, salesPct, whtF, levy] = band; const wht = filer === 'filer' ? whtF : whtF * 2; const sales = customs * salesPct / 100; const total = rd + sales + wht + levy;
  return (<Wrap note="Estimate only — PTA tax is charged on FBR's assessed customs value for your exact model, not the shop price. Sales tax is 18% up to $500 and 25% above. All other charges are fixed rupee amounts by band (SRO 1064(I)/2026). Confirm the final PSID amount on DIRBS (dirbs.pta.gov.pk) before paying.">
    <TextField select fullWidth label="Phone model" value={model} onChange={(e) => { setModel(e.target.value); const m = PTA_MODELS.find((x) => x.label === e.target.value); if (m && m.usd !== '') setUsd(String(m.usd)); }} sx={{ mb: 2 }}>{PTA_MODELS.map((m) => (<MenuItem key={m.label} value={m.label}>{m.label}</MenuItem>))}</TextField>
    <TextField fullWidth label="Phone customs value (USD) — editable" type="number" value={usd} onChange={(e) => setUsd(e.target.value)} sx={{ mb: 2 }} />
    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Model values are used-phone approximate customs values. New phones and other models: enter the DIRBS assessed value here. DIRBS final PSID is authoritative, not this estimate.</Typography>
    <TextField fullWidth label="Exchange rate (Rs per USD)" type="number" value={rate} onChange={(e) => setRate(e.target.value)} sx={{ mb: 2 }} />
    <ToggleButtonGroup value={filer} exclusive fullWidth onChange={(_, nv) => nv && setFiler(nv)} sx={{ mb: 2 }}><ToggleButton value="filer">Filer (ATL)</ToggleButton><ToggleButton value="nonfiler">Non-filer (WHT double)</ToggleButton></ToggleButtonGroup>
    {u > 0 && (<><Hero value={'Rs ' + fmt(total)} unit="Total PTA tax (estimate)" /><Rows rows={[['Customs value', 'Rs ' + fmt(customs)], ['Regulatory Duty (fixed)', 'Rs ' + fmt(rd)], ['Sales Tax (' + salesPct + '%)', 'Rs ' + fmt(sales)], ['Income Tax / WHT', 'Rs ' + fmt(wht)], ['Handset Levy (fixed)', 'Rs ' + fmt(levy)]]} /></>)}
    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>Bands: up to $30 · $31–100 · $101–200 · $201–350 · $351–500 · $501–700 · above $700. Example check: $500 at Rs 280 = Rs 12,000 + Rs 25,200 + Rs 5,000 + Rs 4,000 = Rs 46,200 (filer, with levy).</Typography>
  </Wrap>);
}
export function FreelancerTool() {
  const [rec, setRec] = useState('1000000'); const [pseb, setPseb] = useState('yes'); const [filer, setFiler] = useState('filer');
  const receipts = parseFloat(rec) || 0;
  const rate = filer === 'filer' ? (pseb === 'yes' ? 0.25 : 1) : (pseb === 'yes' ? 0.5 : 2);
  const tax = receipts * rate / 100;
  return (<Wrap note="Section 154A, Finance Act 2026 — 0.25% rate for PSEB-registered IT/ITeS exporters extended through Tax Year 2029. Income must come through a bank and a return must be filed for the rate to be final. Confirm from FBR / your tax adviser.">
    <ToggleButtonGroup value={pseb} exclusive fullWidth onChange={(_, nv) => nv && setPseb(nv)} sx={{ mb: 2 }}><ToggleButton value="yes">PSEB registered</ToggleButton><ToggleButton value="no">Not registered</ToggleButton></ToggleButtonGroup>
    <ToggleButtonGroup value={filer} exclusive fullWidth onChange={(_, nv) => nv && setFiler(nv)} sx={{ mb: 2 }}><ToggleButton value="filer">Filer</ToggleButton><ToggleButton value="nonfiler">Non-filer</ToggleButton></ToggleButtonGroup>
    <TextField fullWidth label="Annual freelance export receipts (Rs)" type="number" value={rec} onChange={(e) => setRec(e.target.value)} />
    {receipts > 0 && (<><Hero value={'Rs ' + fmt(tax)} unit="Tax (final, estimate)" /><Rows rows={[['Receipts', 'Rs ' + fmt(receipts)], ['Rate used', fmt(rate) + '%'], ['Take-home', 'Rs ' + fmt(receipts - tax)]]} /></>)}
    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>Rates: Filer+PSEB 0.25% · Filer, no PSEB 1% · Non-filer+PSEB 0.50% · Non-filer, no PSEB 2%.</Typography>
  </Wrap>);
}
// Token tax 2026-27 — Punjab & Islamabad (Finance Act 2026). Sindh and others use fixed schedules: check excise.
export function TokenTool() {
  const [prov, setProv] = useState('Punjab'); const [cc, setCc] = useState('1300'); const [invoice, setInvoice] = useState('4000000'); const [early, setEarly] = useState(false);
  const engine = parseFloat(cc) || 0; const inv = parseFloat(invoice) || 0;
  let tax = 0; let kind = '';
  if (prov === 'Punjab' || prov === 'Islamabad') {
    const pct = prov === 'Punjab' ? (engine > 2000 ? 0.004 : 0.003) : (engine > 2000 ? 0.0035 : 0.0025);
    if (engine <= 1000) { tax = 20000; kind = 'Lifetime (one-time)'; } else { tax = inv * pct; kind = 'Annual'; if (early) tax *= 0.9; }
  }
  return (<Wrap note="Punjab & Islamabad 2026-27 only in this version. Up to 1000cc: Rs 20,000 lifetime once. Punjab above 1000cc: 0.3% (1001–2000cc) / 0.4% (above 2000cc) of invoice price per year; Islamabad: 0.25% / 0.35%. 10% rebate if the full year is paid by 31 August. Sindh / KPK / Balochistan use fixed engine schedules — check your provincial excise schedule. Motorcycles: Rs 1,500 lifetime in Punjab.">
    <TextField select fullWidth label="Province" value={prov} onChange={(e) => setProv(e.target.value)} sx={{ mb: 2 }}>{['Punjab', 'Islamabad'].map((p) => (<MenuItem key={p} value={p}>{p}</MenuItem>))}</TextField>
    <TextField fullWidth label="Engine size (cc)" type="number" value={cc} onChange={(e) => setCc(e.target.value)} sx={{ mb: 2 }} />
    <TextField fullWidth label="Invoice price (Rs) — needed above 1000cc" type="number" value={invoice} onChange={(e) => setInvoice(e.target.value)} sx={{ mb: 2 }} />
    <FormControlLabel control={<Checkbox checked={early} onChange={(e) => setEarly(e.target.checked)} />} label="Paid in full by 31 August (10% rebate, annual tax only)" />
    {engine > 0 && (<><Hero value={'Rs ' + fmt(tax)} unit={kind + ' token tax'} /><Rows rows={[['Province', prov], ['Engine', fmt(engine) + ' cc'], ['Invoice price', 'Rs ' + fmt(inv)]]} /></>)}
    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>Check: 1300cc Punjab, Rs 4,000,000 invoice = 0.3% = Rs 12,000 per year; with early rebate Rs 10,800.</Typography>
  </Wrap>);
}
export function ZakatTool() {
  const [cash, setCash] = useState('500000'); const [goldG, setGoldG] = useState('20'); const [goldR, setGoldR] = useState('25000'); const [silG, setSilG] = useState('0'); const [silR, setSilR] = useState('3000'); const [stocks, setStocks] = useState('0'); const [debts, setDebts] = useState('0');
  const total = (parseFloat(cash) || 0) + (parseFloat(goldG) || 0) * (parseFloat(goldR) || 0) + (parseFloat(silG) || 0) * (parseFloat(silR) || 0) + (parseFloat(stocks) || 0) - (parseFloat(debts) || 0);
  const goldNisabVal = 87.48 * (parseFloat(goldR) || 0); const silNisabVal = 612.36 * (parseFloat(silR) || 0);
  const nisabCands = [goldNisabVal, silNisabVal].filter((x) => x > 0); const nisab = nisabCands.length ? Math.min(...nisabCands) : 0;
  const belowNisab = nisab > 0 && total < nisab;
  const zakat = total > 0 && !belowNisab ? total * 0.025 : 0;
  return (<Wrap note="Zakat is 2.5% of zakatable wealth held for a lunar year, above nisab. Gold nisab is 87.48 grams, silver nisab is 612.36 grams. For religious rulings, confirm with a scholar.">
    <TextField fullWidth label="Cash + bank (Rs)" type="number" value={cash} onChange={(e) => setCash(e.target.value)} sx={{ mb: 2 }} />
    <TextField fullWidth label="Gold (grams)" type="number" value={goldG} onChange={(e) => setGoldG(e.target.value)} sx={{ mb: 2 }} />
    <TextField fullWidth label="Gold rate (Rs per gram)" type="number" value={goldR} onChange={(e) => setGoldR(e.target.value)} sx={{ mb: 2 }} />
    <TextField fullWidth label="Silver (grams)" type="number" value={silG} onChange={(e) => setSilG(e.target.value)} sx={{ mb: 2 }} />
    <TextField fullWidth label="Silver rate (Rs per gram)" type="number" value={silR} onChange={(e) => setSilR(e.target.value)} sx={{ mb: 2 }} />
    <TextField fullWidth label="Stocks / investments (Rs)" type="number" value={stocks} onChange={(e) => setStocks(e.target.value)} sx={{ mb: 2 }} />
    <TextField fullWidth label="Debts to pay (Rs)" type="number" value={debts} onChange={(e) => setDebts(e.target.value)} />
    {total > 0 && (<><Hero value={'Rs ' + fmt(zakat)} unit={belowNisab ? 'Zakat due — below nisab (Rs 0)' : 'Zakat due (2.5%)'} /><Rows rows={[['Total zakatable wealth', 'Rs ' + fmt(total)], ['Nisab threshold (lower of gold/silver)', nisab > 0 ? 'Rs ' + fmt(nisab) : '— (enter gold/silver rate)'], ['Gold nisab value (87.48g)', 'Rs ' + fmt(goldNisabVal)], ['Silver nisab value (612.36g)', 'Rs ' + fmt(silNisabVal)], ['Gold value', 'Rs ' + fmt((parseFloat(goldG) || 0) * (parseFloat(goldR) || 0))], ['Silver value', 'Rs ' + fmt((parseFloat(silG) || 0) * (parseFloat(silR) || 0))]]} /></>)}
    {belowNisab && <Alert severity="warning" sx={{ mt: 2 }}>Total wealth is below nisab (Rs {fmt(nisab)}), so no Zakat is due on this amount. Zakat is only due when wealth is at or above nisab and held for a lunar year.</Alert>}
  </Wrap>);
}
