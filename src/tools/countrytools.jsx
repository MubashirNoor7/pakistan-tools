import React, { useState } from 'react';
import { Card, CardContent, Typography, TextField, Box, MenuItem, Alert, Button } from '@mui/material';
import { fmt, Hero, Rows } from './property.jsx';

function Wrap({ children, note }) {
  return (<><Card elevation={2} sx={{ borderRadius: 3 }}><CardContent sx={{ p: 3 }}>{children}</CardContent></Card>{note && <Alert severity="info" sx={{ mt: 2 }}>{note}</Alert>}</>);
}
function emiAmt(p, annualPct, months) {
  const r = annualPct / 100 / 12;
  if (p <= 0 || months <= 0) return 0;
  if (r === 0) return p / months;
  return p * r / (1 - Math.pow(1 + r, -months));
}

// Generic Salary Calculator — user enters their own tax rate; no country's tax bands are invented.
export function SalaryCalcTool() {
  const [gross, setGross] = useState('50000'); const [tax, setTax] = useState('20'); const [other, setOther] = useState('5');
  const g = parseFloat(gross) || 0; const net = g * (1 - (parseFloat(tax) || 0) / 100 - (parseFloat(other) || 0) / 100);
  return (<Wrap note="Generic estimate only — NOT an official tax calculation. Every country (UK, Netherlands, India, etc.) has its own tax bands, allowances and social charges, so enter YOUR actual tax and deduction rates. Do not use this for filing tax.">
    <TextField fullWidth label="Gross monthly salary" type="number" value={gross} onChange={(e) => setGross(e.target.value)} sx={{ mb: 2 }} />
    <TextField fullWidth label="Income tax rate (%) — enter your own" type="number" value={tax} onChange={(e) => setTax(e.target.value)} sx={{ mb: 2 }} />
    <TextField fullWidth label="Other deductions (%) — pension, insurance, etc." type="number" value={other} onChange={(e) => setOther(e.target.value)} />
    {g > 0 && (<><Hero value={fmt(net) + ' / month'} unit="Estimated net salary" /><Rows rows={[['Gross monthly', fmt(g)], ['Net annual', fmt(net * 12)], ['Tax amount', fmt(g * (parseFloat(tax) || 0) / 100)], ['Other deductions', fmt(g * (parseFloat(other) || 0) / 100)]]} /></>)}
  </Wrap>);
}

// SIP Calculator — monthly SIP, optional yearly step-up, plus lumpsum mode via a second input.
export function SipTool() {
  const [monthly, setMonthly] = useState('5000'); const [rate, setRate] = useState('12'); const [years, setYears] = useState('10'); const [step, setStep] = useState('0');
  const P = parseFloat(monthly) || 0; const r = (parseFloat(rate) || 0) / 100 / 12; const y = parseFloat(years) || 0; const s = (parseFloat(step) || 0) / 100;
  let invested = 0; let value = 0; let cur = P;
  for (let yr = 0; yr < y; yr++) {
    for (let mo = 0; mo < 12; mo++) { invested += cur; value = (value + cur) * (1 + r); }
    cur = cur * (1 + s);
  }
  return (<Wrap note="SIP future value uses monthly compounding at the return rate you enter. Returns are NOT guaranteed — actual mutual-fund returns go up and down. This is an estimate, not investment advice.">
    <TextField fullWidth label="Monthly SIP amount" type="number" value={monthly} onChange={(e) => setMonthly(e.target.value)} sx={{ mb: 2 }} />
    <TextField fullWidth label="Expected return (% per year)" type="number" value={rate} onChange={(e) => setRate(e.target.value)} sx={{ mb: 2 }} />
    <TextField fullWidth label="Duration (years)" type="number" value={years} onChange={(e) => setYears(e.target.value)} sx={{ mb: 2 }} />
    <TextField fullWidth label="Yearly step-up (%) — 0 for a fixed SIP" type="number" value={step} onChange={(e) => setStep(e.target.value)} />
    {P > 0 && y > 0 && (<><Hero value={fmt(value)} unit="Estimated maturity value" /><Rows rows={[['Total invested', fmt(invested)], ['Estimated returns', fmt(value - invested)], ['Final monthly SIP (after step-up)', fmt(cur / (1 + s))]]} /></>)}
  </Wrap>);
}

// Date / Days Calculator — days between two dates + weekday of a date.
export function DateCalcTool() {
  const [d1, setD1] = useState('2000-01-01'); const [d2, setD2] = useState('2026-11-04');
  const a = new Date(d1); const b = new Date(d2); const ok = !isNaN(a) && !isNaN(b);
  const days = ok ? Math.abs(Math.round((b - a) / 86400000)) : 0;
  const wd = ok ? ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][a.getDay()] : '';
  return (<Wrap note="Counts calendar days between two dates. 'What day was I born' = the weekday of your birth date, shown below.">
    <TextField fullWidth label="First date" type="date" value={d1} onChange={(e) => setD1(e.target.value)} InputLabelProps={{ shrink: true }} sx={{ mb: 2 }} />
    <TextField fullWidth label="Second date" type="date" value={d2} onChange={(e) => setD2(e.target.value)} InputLabelProps={{ shrink: true }} />
    {ok && (<><Hero value={fmt(days) + ' days'} unit="Between the two dates" /><Rows rows={[['Weeks', fmt(days / 7)], ['Approx. months', fmt(days / 30.44)], ['Weekday of first date', wd]]} /></>)}
  </Wrap>);
}

// Area Calculator — room/land area in multiple units, distinct from Marla/Kanal plot tools.
export function AreaCalcTool() {
  const [len, setLen] = useState('20'); const [wid, setWid] = useState('15'); const [unit, setUnit] = useState('ft');
  const l = parseFloat(len) || 0; const w = parseFloat(wid) || 0; const toM = unit === 'ft' ? 0.3048 : unit === 'yd' ? 0.9144 : 1;
  const sqm = l * toM * w * toM; const sqft = sqm / 0.092903;
  return (<Wrap note="For rooms, walls and floors — enter length and width in the same unit. Plot/Marla/Kanal conversions are in the separate Property tools.">
    <TextField fullWidth label="Length" type="number" value={len} onChange={(e) => setLen(e.target.value)} sx={{ mb: 2 }} />
    <TextField fullWidth label="Width" type="number" value={wid} onChange={(e) => setWid(e.target.value)} sx={{ mb: 2 }} />
    <TextField select fullWidth label="Unit" value={unit} onChange={(e) => setUnit(e.target.value)}>{[['ft', 'Feet'], ['m', 'Metres'], ['yd', 'Yards']].map(([v, l2]) => (<MenuItem key={v} value={v}>{l2}</MenuItem>))}</TextField>
    {l > 0 && w > 0 && (<><Hero value={fmt(sqft) + ' sq ft'} unit="Area" /><Rows rows={[['Square metres', fmt(sqm)], ['Square yards', fmt(sqft / 9)], ['Acres', fmt(sqft / 43560)]]} /></>)}
  </Wrap>);
}

// Home Loan Calculator — property price, down payment, rate, tenure.
export function HomeLoanTool() {
  const [price, setPrice] = useState('5000000'); const [down, setDown] = useState('1000000'); const [rate, setRate] = useState('9'); const [years, setYears] = useState('20');
  const loan = Math.max(0, (parseFloat(price) || 0) - (parseFloat(down) || 0)); const m = emiAmt(loan, parseFloat(rate) || 0, (parseFloat(years) || 0) * 12); const total = m * (parseFloat(years) || 0) * 12;
  return (<Wrap note="Estimate only — NOT a bank offer. Banks also check income, credit score and property valuation, and the actual rate may differ.">
    <TextField fullWidth label="Property price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} sx={{ mb: 2 }} />
    <TextField fullWidth label="Down payment" type="number" value={down} onChange={(e) => setDown(e.target.value)} sx={{ mb: 2 }} />
    <TextField fullWidth label="Interest rate (% per year)" type="number" value={rate} onChange={(e) => setRate(e.target.value)} sx={{ mb: 2 }} />
    <TextField fullWidth label="Loan tenure (years)" type="number" value={years} onChange={(e) => setYears(e.target.value)} />
    {loan > 0 && (<><Hero value={fmt(m) + ' / month'} unit="Home loan EMI" /><Rows rows={[['Loan amount', fmt(loan)], ['Total paid', fmt(total)], ['Total interest', fmt(total - loan)]]} /></>)}
  </Wrap>);
}

// Unit Converter — length, weight, temperature with fixed factors.
const UNITS = {
  length: { label: 'Length', units: [['m', 'Metres', 1], ['km', 'Kilometres', 1000], ['cm', 'Centimetres', 0.01], ['ft', 'Feet', 0.3048], ['in', 'Inches', 0.0254], ['yd', 'Yards', 0.9144], ['mi', 'Miles', 1609.34]] },
  weight: { label: 'Weight', units: [['kg', 'Kilograms', 1], ['g', 'Grams', 0.001], ['lb', 'Pounds', 0.453592], ['oz', 'Ounces', 0.0283495]] },
};
export function UnitConverterTool() {
  const [cat, setCat] = useState('length'); const [val, setVal] = useState('1'); const [from, setFrom] = useState('m'); const [to, setTo] = useState('ft'); const [temp, setTemp] = useState('25'); const [tempFrom, setTempFrom] = useState('C'); const [tempTo, setTempTo] = useState('F');
  const list = (UNITS[cat] && UNITS[cat].units) || []; const fv = list.find((u) => u[0] === from)?.[2] || 1; const tv = list.find((u) => u[0] === to)?.[2] || 1; const out = (parseFloat(val) || 0) * fv / tv;
  const toC = (v, u) => u === 'C' ? v : u === 'F' ? (v - 32) * 5 / 9 : v - 273.15; const fromC = (v, u) => u === 'C' ? v : u === 'F' ? v * 9 / 5 + 32 : v + 273.15;
  const tempOut = fromC(toC(parseFloat(temp) || 0, tempFrom), tempTo);
  return (<Wrap note="Fixed conversion factors — no internet or API needed. Temperature uses the standard C/F/K formulas.">
    <TextField select fullWidth label="Category" value={cat} onChange={(e) => { setCat(e.target.value); setFrom('m'); setTo('ft'); }} sx={{ mb: 2 }}>{Object.entries(UNITS).map(([k, v]) => (<MenuItem key={k} value={k}>{v.label}</MenuItem>))}<MenuItem value="temperature">Temperature</MenuItem></TextField>
    {cat !== 'temperature' ? (<><TextField fullWidth label="Value" type="number" value={val} onChange={(e) => setVal(e.target.value)} sx={{ mb: 2 }} />
      <TextField select fullWidth label="From" value={from} onChange={(e) => setFrom(e.target.value)} sx={{ mb: 2 }}>{list.map(([v, l]) => (<MenuItem key={v} value={v}>{l}</MenuItem>))}</TextField>
      <TextField select fullWidth label="To" value={to} onChange={(e) => setTo(e.target.value)}>{list.map(([v, l]) => (<MenuItem key={v} value={v}>{l}</MenuItem>))}</TextField>
      <Hero value={fmt(out)} unit={`${val} ${from} = in ${to}`} /></>)
      : (<><TextField fullWidth label="Temperature" type="number" value={temp} onChange={(e) => setTemp(e.target.value)} sx={{ mb: 2 }} />
        <TextField select fullWidth label="From" value={tempFrom} onChange={(e) => setTempFrom(e.target.value)} sx={{ mb: 2 }}>{[['C', 'Celsius'], ['F', 'Fahrenheit'], ['K', 'Kelvin']].map(([v, l]) => (<MenuItem key={v} value={v}>{l}</MenuItem>))}</TextField>
        <TextField select fullWidth label="To" value={tempTo} onChange={(e) => setTempTo(e.target.value)}>{[['C', 'Celsius'], ['F', 'Fahrenheit'], ['K', 'Kelvin']].map(([v, l]) => (<MenuItem key={v} value={v}>{l}</MenuItem>))}</TextField>
        <Hero value={fmt(tempOut) + ' °' + tempTo} unit="Converted temperature" /></>)}
  </Wrap>);
}

// Font / Stylish Text Converter — Unicode mappings, browser-only.
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
  return (<Wrap note="Unicode styles — they work in most apps and social bios because they are real characters, not fonts. Some apps may show boxes for Script style on old phones. Nothing is uploaded.">
    <TextField fullWidth label="Your text" value={text} onChange={(e) => setText(e.target.value)} sx={{ mb: 2 }} />
    {STYLES.map(([name, fn]) => (<Box key={name} sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}><Typography sx={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>{mapStyle(text, fn)}</Typography><Button size="small" variant="outlined" onClick={() => { navigator.clipboard.writeText(mapStyle(text, fn)); setCopied(name); }}>{copied === name ? 'Copied!' : 'Copy'}</Button></Box>))}
  </Wrap>);
}

// Love Calculator — entertainment only, deterministic hash so same names always give same result.
export function LoveTool() {
  const [n1, setN1] = useState('Ali'); const [n2, setN2] = useState('Sara');
  const s = (n1 + '♥' + n2).toLowerCase(); let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 100000; const pct = 40 + (h % 61);
  const msg = pct >= 90 ? 'Perfect match — on paper!' : pct >= 70 ? 'Great match!' : pct >= 55 ? 'Good match!' : 'Just friends, maybe?';
  return (<Wrap note="FOR FUN ONLY — this is not real compatibility. It is a fixed calculation from the two names, so the same names always give the same number. Do not take relationship decisions from it.">
    <TextField fullWidth label="First name" value={n1} onChange={(e) => setN1(e.target.value)} sx={{ mb: 2 }} />
    <TextField fullWidth label="Second name" value={n2} onChange={(e) => setN2(e.target.value)} />
    {n1 && n2 && (<><Hero value={pct + '%'} unit={msg} /><Rows rows={[['Names', `${n1} + ${n2}`]]} /></>)}
  </Wrap>);
}

// Attendance Calculator — attended/total, % and classes needed/missable for a target.
export function AttendanceTool() {
  const [held, setHeld] = useState('40'); const [att, setAtt] = useState('32'); const [target, setTarget] = useState('75');
  const h = parseFloat(held) || 0; const a = parseFloat(att) || 0; const t = parseFloat(target) || 0; const pct = h > 0 ? a / h * 100 : 0;
  const need = t > 0 && t < 100 ? Math.max(0, Math.ceil((t / 100 * h - a) / (1 - t / 100))) : 0;
  const canMiss = t > 0 ? Math.max(0, Math.floor((a - t / 100 * h) / (t / 100))) : 0;
  return (<Wrap note="Attendance % = attended ÷ held × 100. 'Classes needed' assumes you attend every next class until you reach your target. Rules differ by college — check your own minimum (commonly 75%).">
    <TextField fullWidth label="Total classes held" type="number" value={held} onChange={(e) => setHeld(e.target.value)} sx={{ mb: 2 }} />
    <TextField fullWidth label="Classes attended" type="number" value={att} onChange={(e) => setAtt(e.target.value)} sx={{ mb: 2 }} />
    <TextField fullWidth label="Target attendance (%)" type="number" value={target} onChange={(e) => setTarget(e.target.value)} />
    {h > 0 && (<><Hero value={fmt(pct) + '%'} unit="Your attendance" /><Rows rows={[['Classes you must attend next (in a row)', fmt(need)], ['Classes you can still miss', fmt(canMiss)]]} /></>)}
  </Wrap>);
}

// Car Loan Calculator — on-road price, down payment, rate, tenure.
export function CarLoanTool() {
  const [price, setPrice] = useState('2500000'); const [down, setDown] = useState('500000'); const [rate, setRate] = useState('10'); const [years, setYears] = useState('5');
  const loan = Math.max(0, (parseFloat(price) || 0) - (parseFloat(down) || 0)); const m = emiAmt(loan, parseFloat(rate) || 0, (parseFloat(years) || 0) * 12); const total = m * (parseFloat(years) || 0) * 12;
  return (<Wrap note="Estimate only — NOT a bank offer. On-road price includes taxes and registration where applicable; enter the dealer's actual figure.">
    <TextField fullWidth label="Car on-road price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} sx={{ mb: 2 }} />
    <TextField fullWidth label="Down payment" type="number" value={down} onChange={(e) => setDown(e.target.value)} sx={{ mb: 2 }} />
    <TextField fullWidth label="Interest rate (% per year)" type="number" value={rate} onChange={(e) => setRate(e.target.value)} sx={{ mb: 2 }} />
    <TextField fullWidth label="Loan tenure (years)" type="number" value={years} onChange={(e) => setYears(e.target.value)} />
    {loan > 0 && (<><Hero value={fmt(m) + ' / month'} unit="Car loan EMI" /><Rows rows={[['Loan amount', fmt(loan)], ['Total paid', fmt(total)], ['Total interest', fmt(total - loan)]]} /></>)}
  </Wrap>);
}
