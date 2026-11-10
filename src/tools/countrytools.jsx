import React, { useState } from 'react';
import { Card, CardContent, Typography, TextField, Box, MenuItem, Alert, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, ToggleButton, ToggleButtonGroup, FormControlLabel, Checkbox } from '@mui/material';
import { fmt, Hero, Rows } from './shared.jsx';
import { salaryTax, slabFor } from './tax.jsx';

function Wrap({ children, note }) {
  return (<><Card elevation={2} sx={{ borderRadius: 3 }}><CardContent sx={{ p: 3 }}>{children}</CardContent></Card>{note && <Alert severity="info" sx={{ mt: 2 }}>{note}</Alert>}</>);
}
function emiAmt(p, annualPct, months) {
  const r = annualPct / 100 / 12;
  if (p <= 0 || months <= 0) return 0;
  if (r === 0) return p / months;
  return p * r / (1 - Math.pow(1 + r, -months));
}
// Yearly amortisation: each row = one year of payments (EMI, interest, principal, balance left).
function amortYears(p, annualPct, months) {
  const r = annualPct / 100 / 12; const emi = emiAmt(p, annualPct, months);
  let bal = p; const years = [];
  for (let y = 0; y < Math.ceil(months / 12); y++) {
    let intr = 0, princ = 0; const mCount = Math.min(12, months - y * 12);
    for (let i = 0; i < mCount; i++) { const it = bal * r; const pr = Math.min(bal, emi - it); intr += it; princ += pr; bal -= pr; }
    years.push({ year: y + 1, paid: emi * mCount, interest: intr, principal: princ, balance: Math.max(0, bal) });
  }
  return { emi, years };
}
function SchedTable({ years }) {
  return (<TableContainer sx={{ mt: 2 }}><Table size="small"><TableHead><TableRow><TableCell>Year</TableCell><TableCell align="right">Paid</TableCell><TableCell align="right">Interest</TableCell><TableCell align="right">Principal</TableCell><TableCell align="right">Balance left</TableCell></TableRow></TableHead><TableBody>{years.map((r) => (<TableRow key={r.year}><TableCell>{r.year}</TableCell><TableCell align="right">{fmt(r.paid)}</TableCell><TableCell align="right">{fmt(r.interest)}</TableCell><TableCell align="right">{fmt(r.principal)}</TableCell><TableCell align="right">{fmt(r.balance)}</TableCell></TableRow>))}</TableBody></Table></TableContainer>);
}
const todayISO = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
const parseLocal = (s) => { const [y, m, d] = (s || '').split('-').map(Number); return new Date(y || 1970, (m || 1) - 1, d || 1); };

// Salary Calculator - Pakistan preset uses the real FBR 2026-27 slabs (salaryTax from tax.jsx);
// generic mode keeps the old enter-your-own-rates maths. India/UK/US modes NOT added:
// no verified deduction tables for them were available, so they are left out rather than invented.
export function SalaryCalcTool() {
  const [mode, setMode] = useState('pakistan');
  const [gross, setGross] = useState('50000'); const [tax, setTax] = useState('20'); const [other, setOther] = useState('5');
  const g = parseFloat(gross) || 0;
  const annual = g * 12; const pkTax = salaryTax(annual); const pkMonthlyTax = pkTax / 12; const pkNet = g - pkMonthlyTax;
  const genNet = g * (1 - (parseFloat(tax) || 0) / 100 - (parseFloat(other) || 0) / 100);
  return (<Wrap note={mode === 'pakistan' ? 'Pakistan preset: FBR salaried slabs 2026-27 (Finance Act 2026) via the same calculation as the Pakistan Salary Tax tool. Allowances and payslip figures can change the final amount. Do not use for filing tax.' : 'Generic estimate only - NOT an official tax calculation. Every country has its own tax bands, allowances and social charges, so enter YOUR actual tax and deduction rates. Do not use this for filing tax.'}>
    <ToggleButtonGroup value={mode} exclusive fullWidth onChange={(_, nv) => nv && setMode(nv)} sx={{ mb: 2 }}><ToggleButton value="pakistan">Pakistan (FBR slabs)</ToggleButton><ToggleButton value="generic">Generic (%)</ToggleButton></ToggleButtonGroup>
    <TextField fullWidth label="Gross monthly salary" type="number" value={gross} onChange={(e) => setGross(e.target.value)} sx={{ mb: 2 }} />
    {mode === 'generic' && (<><TextField fullWidth label="Income tax rate (%) - enter your own" type="number" value={tax} onChange={(e) => setTax(e.target.value)} sx={{ mb: 2 }} />
      <TextField fullWidth label="Other deductions (%) - pension, insurance, etc." type="number" value={other} onChange={(e) => setOther(e.target.value)} /></>)}
    {g > 0 && mode === 'pakistan' && (<><Hero value={fmt(pkNet) + ' / month'} unit="Estimated net salary (Pakistan)" /><Rows rows={[['Gross monthly', fmt(g)], ['Monthly tax', fmt(pkMonthlyTax)], ['Annual tax', fmt(pkTax)], ['Net annual', fmt(pkNet * 12)], ['Effective rate', fmt(annual > 0 ? (pkTax / annual) * 100 : 0) + '%'], ['Tax slab', slabFor(annual)]]} /></>)}
    {g > 0 && mode === 'generic' && (<><Hero value={fmt(genNet) + ' / month'} unit="Estimated net salary" /><Rows rows={[['Gross monthly', fmt(g)], ['Net annual', fmt(genNet * 12)], ['Tax amount', fmt(g * (parseFloat(tax) || 0) / 100)], ['Other deductions', fmt(g * (parseFloat(other) || 0) / 100)]]} /></>)}
  </Wrap>);
}

// SIP Calculator - monthly SIP (with step-up), lumpsum, and reverse goal modes.
// Verified: 5,000/mo at 12% for 10 years = Rs 1,161,695.
export function SipTool() {
  const [mode, setMode] = useState('sip');
  const [monthly, setMonthly] = useState('5000'); const [rate, setRate] = useState('12'); const [years, setYears] = useState('10'); const [step, setStep] = useState('0');
  const [lump, setLump] = useState('100000'); const [target, setTarget] = useState('1000000');
  const P = parseFloat(monthly) || 0; const r = (parseFloat(rate) || 0) / 100 / 12; const y = parseFloat(years) || 0; const s = (parseFloat(step) || 0) / 100;
  let invested = 0; let value = 0; let cur = P; const yRows = [];
  for (let yr = 0; yr < y; yr++) {
    for (let mo = 0; mo < 12; mo++) { invested += cur; value = (value + cur) * (1 + r); }
    cur = cur * (1 + s); yRows.push({ year: yr + 1, invested, value, returns: value - invested });
  }
  const lumpAmt = parseFloat(lump) || 0; const lumpValue = r > 0 ? lumpAmt * Math.pow(1 + r, 12 * y) : lumpAmt;
  const tgt = parseFloat(target) || 0; const n = 12 * y;
  const goalSip = tgt > 0 && y > 0 ? (r > 0 ? tgt * r / (((Math.pow(1 + r, n) - 1)) * (1 + r)) : tgt / n) : 0;
  return (<Wrap note="SIP future value uses monthly compounding at the return rate you enter. Returns are NOT guaranteed - actual mutual-fund returns go up and down. This is an estimate, not investment advice.">
    <ToggleButtonGroup value={mode} exclusive fullWidth onChange={(_, nv) => nv && setMode(nv)} sx={{ mb: 2 }}><ToggleButton value="sip">Monthly SIP</ToggleButton><ToggleButton value="lumpsum">Lumpsum</ToggleButton><ToggleButton value="goal">Goal (reverse)</ToggleButton></ToggleButtonGroup>
    {mode === 'sip' && (<><TextField fullWidth label="Monthly SIP amount" type="number" value={monthly} onChange={(e) => setMonthly(e.target.value)} sx={{ mb: 2 }} />
      <TextField fullWidth label="Expected return (% per year)" type="number" value={rate} onChange={(e) => setRate(e.target.value)} sx={{ mb: 2 }} />
      <TextField fullWidth label="Duration (years)" type="number" value={years} onChange={(e) => setYears(e.target.value)} sx={{ mb: 2 }} />
      <TextField fullWidth label="Yearly step-up (%) - 0 for a fixed SIP" type="number" value={step} onChange={(e) => setStep(e.target.value)} /></>)}
    {mode === 'lumpsum' && (<><TextField fullWidth label="One-time investment amount" type="number" value={lump} onChange={(e) => setLump(e.target.value)} sx={{ mb: 2 }} />
      <TextField fullWidth label="Expected return (% per year)" type="number" value={rate} onChange={(e) => setRate(e.target.value)} sx={{ mb: 2 }} />
      <TextField fullWidth label="Duration (years)" type="number" value={years} onChange={(e) => setYears(e.target.value)} /></>)}
    {mode === 'goal' && (<><TextField fullWidth label="Target amount" type="number" value={target} onChange={(e) => setTarget(e.target.value)} sx={{ mb: 2 }} />
      <TextField fullWidth label="Expected return (% per year)" type="number" value={rate} onChange={(e) => setRate(e.target.value)} sx={{ mb: 2 }} />
      <TextField fullWidth label="Duration (years)" type="number" value={years} onChange={(e) => setYears(e.target.value)} /></>)}
    {mode === 'sip' && P > 0 && y > 0 && (<><Hero value={fmt(value)} unit="Estimated maturity value" /><Rows rows={[['Total invested', fmt(invested)], ['Estimated returns', fmt(value - invested)], ['Final monthly SIP (after step-up)', fmt(cur / (1 + s))]]} />
      <Typography variant="subtitle2" sx={{ mt: 2 }}>Year-by-year growth</Typography>
      <TableContainer><Table size="small"><TableHead><TableRow><TableCell>Year</TableCell><TableCell align="right">Invested</TableCell><TableCell align="right">Value</TableCell><TableCell align="right">Returns</TableCell></TableRow></TableHead><TableBody>{yRows.map((row) => (<TableRow key={row.year}><TableCell>{row.year}</TableCell><TableCell align="right">{fmt(row.invested)}</TableCell><TableCell align="right">{fmt(row.value)}</TableCell><TableCell align="right">{fmt(row.returns)}</TableCell></TableRow>))}</TableBody></Table></TableContainer></>)}
    {mode === 'lumpsum' && lumpAmt > 0 && y > 0 && (<><Hero value={fmt(lumpValue)} unit="Estimated maturity value (lumpsum)" /><Rows rows={[['Invested', fmt(lumpAmt)], ['Estimated returns', fmt(lumpValue - lumpAmt)]]} /></>)}
    {mode === 'goal' && tgt > 0 && y > 0 && (<><Hero value={fmt(goalSip) + ' / month'} unit="Monthly SIP needed for your target" /><Rows rows={[['Target amount', fmt(tgt)], ['Duration', fmt(y) + ' years'], ['Total you will invest', fmt(goalSip * n)]]} /></>)}
  </Wrap>);
}

// Date / Days Calculator - days between two dates, add/subtract days, weekday of a date.
export function DateCalcTool() {
  const [mode, setMode] = useState('between');
  const [d1, setD1] = useState('2000-01-01'); const [d2, setD2] = useState(todayISO());
  const [includeEnd, setIncludeEnd] = useState(false);
  const [start, setStart] = useState(todayISO()); const [ndays, setNdays] = useState('90'); const [dir, setDir] = useState('add');
  const a = parseLocal(d1); const b = parseLocal(d2); const ok = !isNaN(a) && !isNaN(b);
  const rawDays = ok ? Math.abs(Math.round((b - a) / 86400000)) : 0;
  const days = rawDays + (includeEnd && ok ? 1 : 0);
  // Weekdays vs weekend days, counted from the earlier date over rawDays (excluding end date unless included).
  let weekdays = 0, weekends = 0;
  if (ok) { const lo = a < b ? a : b; const count = includeEnd ? rawDays + 1 : rawDays; for (let i = 0; i < count; i++) { const dw = new Date(lo.getFullYear(), lo.getMonth(), lo.getDate() + i).getDay(); if (dw === 0 || dw === 6) weekends++; else weekdays++; } }
  const weeks = Math.floor(days / 7); const weekRem = days % 7;
  // Whole calendar months + remaining days from the earlier date to the later date.
  let months = 0, monthRem = 0;
  if (ok) {
    const lo = a < b ? a : b; const hi = a < b ? b : a;
    months = (hi.getFullYear() - lo.getFullYear()) * 12 + (hi.getMonth() - lo.getMonth());
    if (hi.getDate() < lo.getDate()) months--;
    const anchor = new Date(lo.getFullYear(), lo.getMonth() + months, lo.getDate());
    monthRem = Math.round((hi - anchor) / 86400000);
  }
  const wd = ok ? ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][a.getDay()] : '';
  const sDate = parseLocal(start); const n = parseInt(ndays, 10) || 0;
  const resDate = new Date(sDate.getFullYear(), sDate.getMonth(), sDate.getDate() + (dir === 'add' ? n : -n));
  const resWd = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][resDate.getDay()];
  return (<Wrap note="Counts calendar days between two dates. 'Include end date' adds 1 day - the reason two date calculators often disagree by one. 'What day was I born' = the weekday of your birth date, shown below.">
    <ToggleButtonGroup value={mode} exclusive fullWidth onChange={(_, nv) => nv && setMode(nv)} sx={{ mb: 2 }}><ToggleButton value="between">Days between dates</ToggleButton><ToggleButton value="addsub">Add / subtract days</ToggleButton></ToggleButtonGroup>
    {mode === 'between' && (<><TextField fullWidth label="First date" type="date" value={d1} onChange={(e) => setD1(e.target.value)} InputLabelProps={{ shrink: true }} sx={{ mb: 2 }} />
      <TextField fullWidth label="Second date" type="date" value={d2} onChange={(e) => setD2(e.target.value)} InputLabelProps={{ shrink: true }} />
      <FormControlLabel control={<Checkbox checked={includeEnd} onChange={(e) => setIncludeEnd(e.target.checked)} />} label="Include end date (+1 day)" />
      {ok && (<><Hero value={fmt(days) + ' days'} unit="Between the two dates" /><Rows rows={[['Weeks', weeks + ' weeks and ' + weekRem + (weekRem === 1 ? ' day' : ' days')], ['Calendar months', months + ' months and ' + monthRem + (monthRem === 1 ? ' day' : ' days')], ['Weekdays', fmt(weekdays)], ['Weekend days', fmt(weekends)], ['Weekday of first date', wd]]} /></>)}</>)}
    {mode === 'addsub' && (<><TextField fullWidth label="Start date" type="date" value={start} onChange={(e) => setStart(e.target.value)} InputLabelProps={{ shrink: true }} sx={{ mb: 2 }} />
      <ToggleButtonGroup value={dir} exclusive fullWidth onChange={(_, nv) => nv && setDir(nv)} sx={{ mb: 2 }}><ToggleButton value="add">Add days</ToggleButton><ToggleButton value="sub">Subtract days</ToggleButton></ToggleButtonGroup>
      <TextField fullWidth label="Number of days" type="number" value={ndays} onChange={(e) => setNdays(e.target.value)} />
      {!isNaN(sDate) && (<><Hero value={resDate.toDateString()} unit={resWd} /><Rows rows={[['Start date', sDate.toDateString()], ['Days ' + (dir === 'add' ? 'added' : 'subtracted'), fmt(n)]]} /></>)}</>)}
  </Wrap>);
}

// Area Calculator - 8 shapes with formulas and perimeter, in ft / m / yd.
const SHAPES = {
  rectangle: { label: 'Rectangle', formula: 'Area = length × width', fields: [['l', 'Length'], ['w', 'Width']] },
  square: { label: 'Square', formula: 'Area = side × side', fields: [['s', 'Side']] },
  circle: { label: 'Circle', formula: 'Area = π × radius²', fields: [['r', 'Radius']] },
  triangle: { label: 'Triangle', formula: 'Area = ½ × base × height', fields: [['b', 'Base'], ['h', 'Height']] },
  trapezoid: { label: 'Trapezoid', formula: 'Area = (a + b) ÷ 2 × height', fields: [['a', 'Side a (parallel)'], ['b', 'Side b (parallel)'], ['h', 'Height']] },
  ellipse: { label: 'Ellipse', formula: 'Area = π × a × b', fields: [['a', 'Semi-axis a'], ['b', 'Semi-axis b']] },
  parallelogram: { label: 'Parallelogram', formula: 'Area = base × height', fields: [['b', 'Base'], ['h', 'Height'], ['s', 'Side (for perimeter)']] },
  sector: { label: 'Sector', formula: 'Area = ½ × radius² × angle (radians)', fields: [['r', 'Radius'], ['ang', 'Angle (degrees)']] },
};
export function AreaCalcTool() {
  const [shape, setShape] = useState('rectangle'); const [unit, setUnit] = useState('ft');
  const [vals, setVals] = useState({ l: '20', w: '15', s: '10', r: '5', b: '10', h: '8', a: '10', ang: '90' });
  const setV = (k, v) => setVals((p) => ({ ...p, [k]: v }));
  const toM = unit === 'ft' ? 0.3048 : unit === 'yd' ? 0.9144 : 1;
  const m = (k) => (parseFloat(vals[k]) || 0) * toM;
  let sqm = 0, perimM = null, perimLabel = 'Perimeter';
  if (shape === 'rectangle') { sqm = m('l') * m('w'); perimM = 2 * (m('l') + m('w')); }
  else if (shape === 'square') { sqm = m('s') * m('s'); perimM = 4 * m('s'); }
  else if (shape === 'circle') { sqm = Math.PI * m('r') * m('r'); perimM = 2 * Math.PI * m('r'); perimLabel = 'Circumference'; }
  else if (shape === 'triangle') { sqm = 0.5 * m('b') * m('h'); }
  else if (shape === 'trapezoid') { sqm = (m('a') + m('b')) / 2 * m('h'); }
  else if (shape === 'ellipse') { const a = m('a'), b = m('b'); sqm = Math.PI * a * b; perimM = Math.PI * (3 * (a + b) - Math.sqrt((3 * a + b) * (a + 3 * b))); perimLabel = 'Perimeter (approx.)'; }
  else if (shape === 'parallelogram') { sqm = m('b') * m('h'); if (parseFloat(vals.s) > 0) perimM = 2 * (m('b') + m('s')); }
  else if (shape === 'sector') { const ang = (parseFloat(vals.ang) || 0) * Math.PI / 180; sqm = 0.5 * m('r') * m('r') * ang; perimM = 2 * m('r') + m('r') * ang; }
  const sqft = sqm / 0.09290304; const perim = perimM == null ? null : perimM / toM;
  const cfg = SHAPES[shape];
  const rows = [['Square metres', fmt(sqm)], ['Square yards', fmt(sqft / 9)], ['Acres', fmt(sqft / 43560)]];
  if (perim != null) rows.push([perimLabel + ' (' + unit + ')', fmt(perim)]);
  return (<Wrap note="For rooms, walls and floors. Plot/Marla/Kanal conversions are in the separate Property tools.">
    <TextField select fullWidth label="Shape" value={shape} onChange={(e) => setShape(e.target.value)} sx={{ mb: 2 }}>{Object.entries(SHAPES).map(([k, v]) => (<MenuItem key={k} value={k}>{v.label}</MenuItem>))}</TextField>
    {cfg.fields.map(([k, lab]) => (<TextField key={k} fullWidth label={lab + ' (' + unit + ')'} type="number" value={vals[k]} onChange={(e) => setV(k, e.target.value)} sx={{ mb: 2 }} />))}
    <TextField select fullWidth label="Unit" value={unit} onChange={(e) => setUnit(e.target.value)} sx={{ mb: 2 }}>{[['ft', 'Feet'], ['m', 'Metres'], ['yd', 'Yards']].map(([v, l2]) => (<MenuItem key={v} value={v}>{l2}</MenuItem>))}</TextField>
    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{cfg.formula}</Typography>
    {sqm > 0 && (<><Hero value={fmt(sqft) + ' sq ft'} unit={'Area — ' + cfg.label} /><Rows rows={rows} /></>)}
  </Wrap>);
}

// Home Loan Calculator - EMI mode with amortisation schedule, plus an eligibility mode
// (max loan from income, FOIR-style). Rate defaults are EXAMPLE rates only - enter your bank's rate.
export function HomeLoanTool() {
  const [mode, setMode] = useState('emi');
  const [price, setPrice] = useState('5000000'); const [down, setDown] = useState('1000000'); const [rate, setRate] = useState('9'); const [years, setYears] = useState('20');
  const [income, setIncome] = useState('200000'); const [existing, setExisting] = useState('0');
  const loan = Math.max(0, (parseFloat(price) || 0) - (parseFloat(down) || 0)); const months = (parseFloat(years) || 0) * 12;
  const { emi, years: sched } = amortYears(loan, parseFloat(rate) || 0, months); const total = emi * months;
  const r = (parseFloat(rate) || 0) / 100 / 12;
  const maxEmi = Math.max(0, (parseFloat(income) || 0) * 0.5 - (parseFloat(existing) || 0));
  const maxLoan = maxEmi > 0 && months > 0 ? (r === 0 ? maxEmi * months : maxEmi * (1 - Math.pow(1 + r, -months)) / r) : 0;
  return (<Wrap note="Estimate only - NOT a bank offer. Banks also check income, credit score and property valuation, and the actual rate may differ. The 9% default is an EXAMPLE rate - enter your bank's rate.">
    <ToggleButtonGroup value={mode} exclusive fullWidth onChange={(_, nv) => nv && setMode(nv)} sx={{ mb: 2 }}><ToggleButton value="emi">EMI calculator</ToggleButton><ToggleButton value="elig">How much can I borrow?</ToggleButton></ToggleButtonGroup>
    {mode === 'emi' && (<><TextField fullWidth label="Property price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} sx={{ mb: 2 }} />
      <TextField fullWidth label="Down payment" type="number" value={down} onChange={(e) => setDown(e.target.value)} sx={{ mb: 2 }} />
      <TextField fullWidth label="Interest rate (% per year) - example rate, enter your bank's rate" type="number" value={rate} onChange={(e) => setRate(e.target.value)} sx={{ mb: 2 }} />
      <TextField fullWidth label="Loan tenure (years)" type="number" value={years} onChange={(e) => setYears(e.target.value)} />
      {loan > 0 && (<><Hero value={fmt(emi) + ' / month'} unit="Home loan EMI" /><Rows rows={[['Loan amount', fmt(loan)], ['Total paid', fmt(total)], ['Total interest', fmt(total - loan)]]} />
        <Typography variant="subtitle2" sx={{ mt: 2 }}>Amortisation schedule (yearly)</Typography><SchedTable years={sched} /></>)}</>)}
    {mode === 'elig' && (<><TextField fullWidth label="Monthly income" type="number" value={income} onChange={(e) => setIncome(e.target.value)} sx={{ mb: 2 }} />
      <TextField fullWidth label="Existing EMIs (per month)" type="number" value={existing} onChange={(e) => setExisting(e.target.value)} sx={{ mb: 2 }} />
      <TextField fullWidth label="Interest rate (% per year) - example rate, enter your bank's rate" type="number" value={rate} onChange={(e) => setRate(e.target.value)} sx={{ mb: 2 }} />
      <TextField fullWidth label="Loan tenure (years)" type="number" value={years} onChange={(e) => setYears(e.target.value)} />
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 1 }}>Assumes banks allow up to 50% of monthly income for all EMIs combined (FOIR 50%) - check your bank's own limit.</Typography>
      {maxLoan > 0 && (<><Hero value={fmt(maxLoan)} unit="Maximum loan you could borrow" /><Rows rows={[['Monthly income', fmt(parseFloat(income) || 0)], ['Max EMI you can afford', fmt(maxEmi)], ['Existing EMIs', fmt(parseFloat(existing) || 0)]]} /></>)}
      {maxLoan <= 0 && <Alert severity="warning" sx={{ mt: 2 }}>Existing EMIs already use 50% or more of your income, so no extra loan fits this rule.</Alert>}</>)}
  </Wrap>);
}

// Unit Converter - 9 categories, exact factors (mile 1609.344 m, pound 0.45359237 kg),
// all units of the category shown at once.
const UNITS = {
  length: { label: 'Length', base: 'm', units: [['mm', 'Millimetres', 0.001], ['cm', 'Centimetres', 0.01], ['m', 'Metres', 1], ['km', 'Kilometres', 1000], ['in', 'Inches', 0.0254], ['ft', 'Feet', 0.3048], ['yd', 'Yards', 0.9144], ['mi', 'Miles', 1609.344], ['nmi', 'Nautical miles', 1852]] },
  weight: { label: 'Weight', base: 'kg', units: [['mg', 'Milligrams', 0.000001], ['g', 'Grams', 0.001], ['kg', 'Kilograms', 1], ['t', 'Tonnes', 1000], ['oz', 'Ounces', 0.028349523125], ['lb', 'Pounds', 0.45359237], ['st', 'Stone', 6.35029318]] },
  area: { label: 'Area', base: 'm²', units: [['cm²', 'Square centimetres', 0.0001], ['m²', 'Square metres', 1], ['ha', 'Hectares', 10000], ['km²', 'Square kilometres', 1000000], ['in²', 'Square inches', 0.00064516], ['ft²', 'Square feet', 0.09290304], ['yd²', 'Square yards', 0.83612736], ['ac', 'Acres', 4046.8564224], ['mi²', 'Square miles', 2589988.110336]] },
  volume: { label: 'Volume', base: 'm³', units: [['ml', 'Millilitres', 0.000001], ['l', 'Litres', 0.001], ['m³', 'Cubic metres', 1], ['fl oz (US)', 'Fluid ounces (US)', 0.0000295735295625], ['cup (US)', 'Cups (US)', 0.0002365882365], ['pt (US)', 'Pints (US)', 0.000473176473], ['gal (US)', 'Gallons (US)', 0.003785411784], ['gal (UK)', 'Gallons (UK)', 0.00454609]] },
  speed: { label: 'Speed', base: 'm/s', units: [['m/s', 'Metres per second', 1], ['km/h', 'Kilometres per hour', 1 / 3.6], ['mph', 'Miles per hour', 0.44704], ['kn', 'Knots', 0.5144444444444445], ['ft/s', 'Feet per second', 0.3048]] },
  time: { label: 'Time', base: 's', units: [['ms', 'Milliseconds', 0.001], ['s', 'Seconds', 1], ['min', 'Minutes', 60], ['h', 'Hours', 3600], ['day', 'Days', 86400], ['week', 'Weeks', 604800]] },
  data: { label: 'Data', base: 'B', units: [['bit', 'Bits', 0.125], ['B', 'Bytes', 1], ['KB', 'Kilobytes (1000)', 1000], ['MB', 'Megabytes (1000²)', 1000000], ['GB', 'Gigabytes (1000³)', 1000000000], ['TB', 'Terabytes (1000⁴)', 1000000000000], ['KiB', 'Kibibytes (1024)', 1024], ['MiB', 'Mebibytes (1024²)', 1048576], ['GiB', 'Gibibytes (1024³)', 1073741824]] },
  energy: { label: 'Energy', base: 'J', units: [['J', 'Joules', 1], ['kJ', 'Kilojoules', 1000], ['cal', 'Calories', 4.184], ['kcal', 'Kilocalories', 4184], ['Wh', 'Watt-hours', 3600], ['kWh', 'Kilowatt-hours', 3600000], ['BTU', 'British thermal units', 1055.05585262]] },
};
export function UnitConverterTool() {
  const [cat, setCat] = useState('length'); const [val, setVal] = useState('1'); const [from, setFrom] = useState('m'); const [temp, setTemp] = useState('25'); const [tempFrom, setTempFrom] = useState('C');
  const list = (UNITS[cat] && UNITS[cat].units) || []; const fv = list.find((u) => u[0] === from)?.[2] || 1;
  const baseVal = (parseFloat(val) || 0) * fv;
  const toC = (v, u) => u === 'C' ? v : u === 'F' ? (v - 32) * 5 / 9 : v - 273.15; const fromC = (v, u) => u === 'C' ? v : u === 'F' ? v * 9 / 5 + 32 : v + 273.15;
  const tempC = toC(parseFloat(temp) || 0, tempFrom);
  return (<Wrap note="Fixed conversion factors - no internet or API needed. Temperature uses the standard C/F/K formulas.">
    <TextField select fullWidth label="Category" value={cat} onChange={(e) => { setCat(e.target.value); const first = (UNITS[e.target.value] && UNITS[e.target.value].units[0][0]) || 'm'; setFrom(first); }} sx={{ mb: 2 }}>{Object.entries(UNITS).map(([k, v]) => (<MenuItem key={k} value={k}>{v.label}</MenuItem>))}<MenuItem value="temperature">Temperature</MenuItem></TextField>
    {cat !== 'temperature' ? (<><TextField fullWidth label="Value" type="number" value={val} onChange={(e) => setVal(e.target.value)} sx={{ mb: 2 }} />
      <TextField select fullWidth label="From unit" value={from} onChange={(e) => setFrom(e.target.value)} sx={{ mb: 2 }}>{list.map(([v, l]) => (<MenuItem key={v} value={v}>{l}</MenuItem>))}</TextField>
      <Typography variant="subtitle2" sx={{ mt: 1 }}>In every unit ({UNITS[cat].base})</Typography>
      <Rows rows={list.map(([v, l, f]) => [l, fmt(baseVal / f) + ' ' + v])} /></>)
      : (<><TextField fullWidth label="Temperature" type="number" value={temp} onChange={(e) => setTemp(e.target.value)} sx={{ mb: 2 }} />
        <TextField select fullWidth label="From" value={tempFrom} onChange={(e) => setTempFrom(e.target.value)} sx={{ mb: 2 }}>{[['C', 'Celsius'], ['F', 'Fahrenheit'], ['K', 'Kelvin']].map(([v, l]) => (<MenuItem key={v} value={v}>{l}</MenuItem>))}</TextField>
        <Rows rows={[['Celsius', fmt(fromC(tempC, 'C')) + ' °C'], ['Fahrenheit', fmt(fromC(tempC, 'F')) + ' °F'], ['Kelvin', fmt(fromC(tempC, 'K')) + ' K']]} /></>)}
  </Wrap>);
}

// Font / Stylish Text Converter - Unicode mappings, browser-only.
function mapStyle(text, fn) { return text.split('').map(fn).join(''); }
const STYLES = [
  ['Bold', (c) => /[A-Z]/.test(c) ? String.fromCodePoint(c.charCodeAt(0) - 65 + 0x1D400) : /[a-z]/.test(c) ? String.fromCodePoint(c.charCodeAt(0) - 97 + 0x1D41A) : /[0-9]/.test(c) ? String.fromCodePoint(c.charCodeAt(0) - 48 + 0x1D7CE) : c],
  ['Italic', (c) => /[A-Z]/.test(c) ? String.fromCodePoint(c.charCodeAt(0) - 65 + 0x1D434) : /[a-z]/.test(c) ? String.fromCodePoint(c.charCodeAt(0) - 97 + 0x1D44E) : c],
  ['Bold Italic', (c) => /[A-Z]/.test(c) ? String.fromCodePoint(c.charCodeAt(0) - 65 + 0x1D468) : /[a-z]/.test(c) ? String.fromCodePoint(c.charCodeAt(0) - 97 + 0x1D482) : c],
  ['Script', (c) => /[A-Z]/.test(c) ? String.fromCodePoint(c.charCodeAt(0) - 65 + 0x1D49C) : /[a-z]/.test(c) ? String.fromCodePoint(c.charCodeAt(0) - 97 + 0x1D4B6) : c],
  ['Monospace', (c) => /[A-Z]/.test(c) ? String.fromCodePoint(c.charCodeAt(0) - 65 + 0x1D670) : /[a-z]/.test(c) ? String.fromCodePoint(c.charCodeAt(0) - 97 + 0x1D68A) : /[0-9]/.test(c) ? String.fromCodePoint(c.charCodeAt(0) - 48 + 0x1D7F6) : c],
  ['Small Caps', (c) => ({ a: 'ᴀ', b: 'ʙ', c: 'ᴄ', d: 'ᴅ', e: 'ᴇ', f: 'ꜰ', g: 'ɢ', h: 'ʜ', i: 'ɪ', j: 'ᴊ', k: 'ᴋ', l: 'ʟ', m: 'ᴍ', n: 'ɴ', o: 'ᴏ', p: 'ᴘ', q: 'ǫ', r: 'ʀ', s: 'ꜱ', t: 'ᴛ', u: 'ᴜ', v: 'ᴠ', w: 'ᴡ', x: 'x', y: 'ʏ', z: 'ᴢ' }[c.toLowerCase()] || c)],
];
export function FontTool() {
  const [text, setText] = useState('Hello World'); const [copied, setCopied] = useState('');
  return (<Wrap note="Unicode styles - they work in most apps and social bios because they are real characters, not fonts. Some apps may show boxes for Script style on old phones. Nothing is uploaded.">
    <TextField fullWidth label="Your text" value={text} onChange={(e) => setText(e.target.value)} sx={{ mb: 2 }} />
    {STYLES.map(([name, fn]) => (<Box key={name} sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}><Typography sx={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>{mapStyle(text, fn)}</Typography><Button size="small" variant="outlined" onClick={() => { navigator.clipboard.writeText(mapStyle(text, fn)); setCopied(name); }}>{copied === name ? 'Copied!' : 'Copy'}</Button></Box>))}
  </Wrap>);
}

// Love Calculator - entertainment only, deterministic hash so same names always give same result.
// Score now covers the full 0-100 range (previously clamped to 40-100, so it could never give a low score).
export function LoveTool() {
  const [n1, setN1] = useState('Ali'); const [n2, setN2] = useState('Sara');
  const s = (n1 + '♥' + n2).toLowerCase(); let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 100000; const pct = h % 101;
  const msg = pct >= 90 ? 'Soulmates!' : pct >= 70 ? 'Great match!' : pct >= 50 ? 'Good match!' : pct >= 30 ? 'Just friends, maybe?' : 'Better as friends!';
  return (<Wrap note="FOR FUN ONLY - this is not real compatibility. It is a fixed calculation from the two names, so the same names always give the same number. Do not take relationship decisions from it.">
    <TextField fullWidth label="First name" value={n1} onChange={(e) => setN1(e.target.value)} sx={{ mb: 2 }} />
    <TextField fullWidth label="Second name" value={n2} onChange={(e) => setN2(e.target.value)} />
    {n1 && n2 && (<><Hero value={pct + '%'} unit={msg} /><Rows rows={[['Names', `${n1} + ${n2}`], ['90-100', 'Soulmates'], ['70-89', 'Great match'], ['50-69', 'Good match'], ['30-49', 'Just friends'], ['0-29', 'Better as friends']]} /></>)}
  </Wrap>);
}

// Attendance Calculator - attended/total, % and classes needed/missable for a target.
export function AttendanceTool() {
  const [mode, setMode] = useState('overall');
  const [held, setHeld] = useState('40'); const [att, setAtt] = useState('32'); const [target, setTarget] = useState('75');
  const [mDays, setMDays] = useState('22'); const [mAtt, setMAtt] = useState('18');
  const h = mode === 'overall' ? (parseFloat(held) || 0) : (parseFloat(mDays) || 0);
  const a = mode === 'overall' ? (parseFloat(att) || 0) : (parseFloat(mAtt) || 0);
  const t = parseFloat(target) || 0; const pct = h > 0 ? a / h * 100 : 0;
  const need = t > 0 && t < 100 ? Math.max(0, Math.ceil((t / 100 * h - a) / (1 - t / 100))) : 0;
  const canMiss = t > 0 ? Math.max(0, Math.floor((a - t / 100 * h) / (t / 100))) : 0;
  const unit = mode === 'overall' ? 'Classes' : 'Days';
  return (<Wrap note="Attendance % = attended ÷ held × 100. 'Needed' assumes you attend every next class/day until you reach your target. Rules differ by college - check your own minimum (commonly 75%).">
    <ToggleButtonGroup value={mode} exclusive fullWidth onChange={(_, nv) => nv && setMode(nv)} sx={{ mb: 2 }}><ToggleButton value="overall">Whole term</ToggleButton><ToggleButton value="monthly">This month</ToggleButton></ToggleButtonGroup>
    {mode === 'overall' ? (<><TextField fullWidth label="Total classes held" type="number" value={held} onChange={(e) => setHeld(e.target.value)} sx={{ mb: 2 }} />
      <TextField fullWidth label="Classes attended" type="number" value={att} onChange={(e) => setAtt(e.target.value)} sx={{ mb: 2 }} /></>)
      : (<><TextField fullWidth label="Working days this month" type="number" value={mDays} onChange={(e) => setMDays(e.target.value)} sx={{ mb: 2 }} />
        <TextField fullWidth label="Days attended this month" type="number" value={mAtt} onChange={(e) => setMAtt(e.target.value)} sx={{ mb: 2 }} /></>)}
    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Target attendance</Typography>
    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>{[65, 75, 80, 85].map((p) => (<Button key={p} variant={t === p ? 'contained' : 'outlined'} size="small" onClick={() => setTarget(String(p))}>{p}%</Button>))}</Box>
    <TextField fullWidth label="Target attendance (%)" type="number" value={target} onChange={(e) => setTarget(e.target.value)} />
    {h > 0 && (<><Hero value={fmt(pct) + '%'} unit={mode === 'overall' ? 'Your attendance' : 'Your attendance this month'} /><Rows rows={[[unit + ' you must attend next (in a row)', fmt(need)], [unit + ' you can still miss', fmt(canMiss)]]} /></>)}
  </Wrap>);
}

// Car Loan Calculator - on-road price, down payment, trade-in, sales tax, fees, rate, tenure.
// Rate defaults are EXAMPLE rates only - enter your bank's rate.
export function CarLoanTool() {
  const [price, setPrice] = useState('2500000'); const [down, setDown] = useState('500000'); const [trade, setTrade] = useState('0'); const [taxPct, setTaxPct] = useState('0'); const [fees, setFees] = useState('0'); const [rate, setRate] = useState('10'); const [years, setYears] = useState('5');
  const p = parseFloat(price) || 0; const taxAmt = p * (parseFloat(taxPct) || 0) / 100;
  const loan = Math.max(0, p - (parseFloat(down) || 0) - (parseFloat(trade) || 0) + taxAmt + (parseFloat(fees) || 0));
  const months = (parseFloat(years) || 0) * 12; const m = emiAmt(loan, parseFloat(rate) || 0, months); const total = m * months;
  const payoff = new Date(); payoff.setMonth(payoff.getMonth() + months);
  const terms = [36, 48, 60, 72, 84];
  return (<Wrap note="Estimate only - NOT a bank offer. On-road price includes taxes and registration where applicable; enter the dealer's actual figure. The 10% default is an EXAMPLE rate - enter your bank's rate.">
    <TextField fullWidth label="Car on-road price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} sx={{ mb: 2 }} />
    <TextField fullWidth label="Down payment" type="number" value={down} onChange={(e) => setDown(e.target.value)} sx={{ mb: 2 }} />
    <TextField fullWidth label="Trade-in value (0 if none)" type="number" value={trade} onChange={(e) => setTrade(e.target.value)} sx={{ mb: 2 }} />
    <TextField fullWidth label="Sales tax (%) - 0 if already in the price" type="number" value={taxPct} onChange={(e) => setTaxPct(e.target.value)} sx={{ mb: 2 }} />
    <TextField fullWidth label="Other fees (registration, etc.)" type="number" value={fees} onChange={(e) => setFees(e.target.value)} sx={{ mb: 2 }} />
    <TextField fullWidth label="Interest rate (% per year) - example rate, enter your bank's rate" type="number" value={rate} onChange={(e) => setRate(e.target.value)} sx={{ mb: 2 }} />
    <TextField fullWidth label="Loan tenure (years)" type="number" value={years} onChange={(e) => setYears(e.target.value)} />
    {loan > 0 && (<><Hero value={fmt(m) + ' / month'} unit="Car loan EMI" /><Rows rows={[['Loan amount', fmt(loan)], ['Total paid', fmt(total)], ['Total interest', fmt(total - loan)], ['Payoff date', payoff.toDateString()]]} />
      <Typography variant="subtitle2" sx={{ mt: 2 }}>Same car, different terms</Typography>
      <TableContainer><Table size="small"><TableHead><TableRow><TableCell>Term</TableCell><TableCell align="right">EMI / month</TableCell><TableCell align="right">Total interest</TableCell></TableRow></TableHead><TableBody>{terms.map((tm) => { const e = emiAmt(loan, parseFloat(rate) || 0, tm); return (<TableRow key={tm}><TableCell>{tm} months</TableCell><TableCell align="right">{fmt(e)}</TableCell><TableCell align="right">{fmt(e * tm - loan)}</TableCell></TableRow>); })}</TableBody></Table></TableContainer></>)}
  </Wrap>);
}
