import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, TextField, Box, MenuItem, ToggleButton, ToggleButtonGroup, Alert, Button, Slider, LinearProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, FormControlLabel } from '@mui/material';
import { fmt, Hero, Rows } from './shared.jsx';

function Wrap({ children, note }) {
  return (<><Card elevation={2} sx={{ borderRadius: 3 }}><CardContent sx={{ p: 3 }}>{children}</CardContent></Card>{note && <Alert severity="info" sx={{ mt: 2 }}>{note}</Alert>}</>);
}
function emi(principal, annualPct, months) {
  const r = annualPct / 100 / 12;
  if (principal <= 0 || months <= 0) return 0;
  if (r === 0) return principal / months;
  return principal * r / (1 - Math.pow(1 + r, -months));
}

// Monthly amortisation rows: payment, interest, principal, remaining balance.
// First month interest = balance x monthly rate; last payment clears the balance.
function amortRows(principal, annualPct, months) {
  const r = annualPct / 100 / 12;
  const pay = emi(principal, annualPct, months);
  const rows = []; let bal = principal;
  for (let i = 1; i <= months; i++) {
    const interest = bal * r;
    let princ = pay - interest;
    if (i === months) princ = bal;
    bal = Math.max(0, bal - princ);
    rows.push({ n: i, pay: i === months ? interest + princ : pay, interest, princ, bal });
  }
  return rows;
}
function yearlyRows(monthly) {
  const years = [];
  monthly.forEach((row) => {
    const y = Math.ceil(row.n / 12);
    if (!years[y - 1]) years[y - 1] = { n: y, pay: 0, interest: 0, princ: 0, bal: 0 };
    years[y - 1].pay += row.pay; years[y - 1].interest += row.interest; years[y - 1].princ += row.princ; years[y - 1].bal = row.bal;
  });
  return years;
}
// Amortisation table with a monthly / yearly view toggle.
function AmortTable({ principal, rate, months }) {
  const [view, setView] = useState('yearly');
  if (!principal || !months) return null;
  const monthly = amortRows(principal, rate, months);
  const rows = view === 'yearly' ? yearlyRows(monthly) : monthly;
  const label = view === 'yearly' ? 'Year' : 'Month';
  return (<Box sx={{ mt: 2 }}>
    <ToggleButtonGroup value={view} exclusive size="small" onChange={(_, nv) => nv && setView(nv)} sx={{ mb: 1 }}><ToggleButton value="monthly">Monthly</ToggleButton><ToggleButton value="yearly">Yearly</ToggleButton></ToggleButtonGroup>
    <TableContainer sx={{ maxHeight: 320, border: '1px solid #e0e0e0', borderRadius: 2 }}>
      <Table size="small" stickyHeader>
        <TableHead><TableRow><TableCell>{label}</TableCell><TableCell align="right">Payment</TableCell><TableCell align="right">Interest</TableCell><TableCell align="right">Principal</TableCell><TableCell align="right">Balance</TableCell></TableRow></TableHead>
        <TableBody>{rows.map((r) => (<TableRow key={r.n}><TableCell>{r.n}</TableCell><TableCell align="right">{fmt(r.pay)}</TableCell><TableCell align="right">{fmt(r.interest)}</TableCell><TableCell align="right">{fmt(r.princ)}</TableCell><TableCell align="right">{fmt(r.bal)}</TableCell></TableRow>))}</TableBody>
      </Table>
    </TableContainer>
  </Box>);
}

// Loan / EMI calculator - global, pure arithmetic.
export function LoanEmiTool() {
  const [amt, setAmt] = useState('1000000'); const [rate, setRate] = useState('12'); const [years, setYears] = useState('5');
  const p = parseFloat(amt) || 0; const r = parseFloat(rate) || 0; const n = (parseFloat(years) || 0) * 12; const m = emi(p, r, n); const total = m * n;
  const reckoner = [100000, 250000, 500000, 1000000, 2500000, 5000000];
  return (<Wrap note="Monthly EMI = P × r × (1+r)^n ÷ ((1+r)^n − 1). Rates vary by bank and country - enter your bank's actual rate. No personal data is stored or sent anywhere.">
    <TextField fullWidth label="Loan amount" type="number" value={amt} onChange={(e) => setAmt(e.target.value)} sx={{ mb: 2 }} />
    <TextField fullWidth label="Interest rate (% per year)" type="number" value={rate} onChange={(e) => setRate(e.target.value)} sx={{ mb: 2 }} />
    <TextField fullWidth label="Loan duration (years)" type="number" value={years} onChange={(e) => setYears(e.target.value)} />
    {p > 0 && n > 0 && (<><Hero value={fmt(m) + ' / month'} unit="Monthly EMI" /><Rows rows={[['Total paid', fmt(total)], ['Total interest', fmt(total - p)], ['Principal', fmt(p)]]} />
      <Typography variant="subtitle1" fontWeight={700} sx={{ mt: 3, mb: 1 }}>EMI ready reckoner — same rate and duration</Typography>
      <TableContainer sx={{ border: '1px solid #e0e0e0', borderRadius: 2, mb: 2 }}><Table size="small"><TableHead><TableRow><TableCell>Loan amount</TableCell><TableCell align="right">EMI / month</TableCell></TableRow></TableHead>
        <TableBody>{reckoner.map((a) => (<TableRow key={a}><TableCell>{fmt(a)}</TableCell><TableCell align="right">{fmt(emi(a, r, n))}</TableCell></TableRow>))}</TableBody></Table></TableContainer>
      <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>Amortisation schedule</Typography>
      <AmortTable principal={p} rate={r} months={n} /></>)}
  </Wrap>);
}

// Mortgage - monthly-payment mode + affordability mode.
export function MortgageTool() {
  const [mode, setMode] = useState('payment');
  // Monthly payment mode
  const [price, setPrice] = useState('10000000'); const [down, setDown] = useState('2000000'); const [rate, setRate] = useState('12'); const [years, setYears] = useState('20');
  const [tax, setTax] = useState('50000'); const [ins, setIns] = useState('30000'); const [pmi, setPmi] = useState('0');
  const hp = parseFloat(price) || 0; const d = parseFloat(down) || 0; const loan = Math.max(0, hp - d); const n = (parseFloat(years) || 0) * 12; const pi = emi(loan, parseFloat(rate) || 0, n);
  const taxM = (parseFloat(tax) || 0) / 12; const insM = (parseFloat(ins) || 0) / 12; const pmiM = parseFloat(pmi) || 0; const totalM = pi + taxM + insM + pmiM;
  // Affordability mode
  const [income, setIncome] = useState('100000'); const [downA, setDownA] = useState('2000000'); const [rateA, setRateA] = useState('12'); const [yearsA, setYearsA] = useState('20'); const [share, setShare] = useState('30');
  const inc = parseFloat(income) || 0; const dA = parseFloat(downA) || 0; const rA = (parseFloat(rateA) || 0) / 100 / 12; const nA = (parseFloat(yearsA) || 0) * 12; const budget = inc * (parseFloat(share) || 0) / 100;
  const loanA = budget > 0 && nA > 0 ? (rA === 0 ? budget * nA : budget * (1 - Math.pow(1 + rA, -nA)) / rA) : 0;
  return (<Wrap note="Monthly payment = principal + interest, plus property tax, home insurance and PMI (if any) each month. Affordability mode uses the rule of thumb: keep the monthly payment at or below the % of income you choose. Both are estimates, not a bank approval - banks also check credit, debts and property value.">
    <ToggleButtonGroup value={mode} exclusive fullWidth onChange={(_, nv) => nv && setMode(nv)} sx={{ mb: 2 }}><ToggleButton value="payment">Monthly payment</ToggleButton><ToggleButton value="afford">How much can I afford?</ToggleButton></ToggleButtonGroup>
    {mode === 'payment' ? (<>
      <TextField fullWidth label="Home price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} sx={{ mb: 2 }} />
      <TextField fullWidth label="Down payment" type="number" value={down} onChange={(e) => setDown(e.target.value)} sx={{ mb: 2 }} />
      <TextField fullWidth label="Mortgage rate (% per year)" type="number" value={rate} onChange={(e) => setRate(e.target.value)} sx={{ mb: 2 }} />
      <TextField fullWidth label="Mortgage duration (years)" type="number" value={years} onChange={(e) => setYears(e.target.value)} sx={{ mb: 2 }} />
      <TextField fullWidth label="Property tax (per year)" type="number" value={tax} onChange={(e) => setTax(e.target.value)} sx={{ mb: 2 }} />
      <TextField fullWidth label="Home insurance (per year)" type="number" value={ins} onChange={(e) => setIns(e.target.value)} sx={{ mb: 2 }} />
      <TextField fullWidth label="PMI (per month, 0 if none)" type="number" value={pmi} onChange={(e) => setPmi(e.target.value)} />
      {hp > 0 && n > 0 && (<><Hero value={fmt(totalM) + ' / month'} unit="Total monthly payment" /><Rows rows={[['Loan amount', fmt(loan)], ['Principal + interest', fmt(pi)], ['Property tax / month', fmt(taxM)], ['Insurance / month', fmt(insM)], ['PMI / month', fmt(pmiM)]]} />
        <Typography variant="subtitle1" fontWeight={700} sx={{ mt: 3, mb: 1 }}>Amortisation schedule (principal + interest only)</Typography>
        <AmortTable principal={loan} rate={parseFloat(rate) || 0} months={n} /></>)}
    </>) : (<>
      <TextField fullWidth label="Monthly income" type="number" value={income} onChange={(e) => setIncome(e.target.value)} sx={{ mb: 2 }} />
      <TextField fullWidth label="Down payment saved" type="number" value={downA} onChange={(e) => setDownA(e.target.value)} sx={{ mb: 2 }} />
      <TextField fullWidth label="Mortgage rate (% per year)" type="number" value={rateA} onChange={(e) => setRateA(e.target.value)} sx={{ mb: 2 }} />
      <TextField fullWidth label="Mortgage duration (years)" type="number" value={yearsA} onChange={(e) => setYearsA(e.target.value)} sx={{ mb: 2 }} />
      <TextField fullWidth label="Max payment as % of income" type="number" value={share} onChange={(e) => setShare(e.target.value)} />
      {inc > 0 && (<><Hero value={fmt(loanA + dA)} unit="House price you can afford" /><Rows rows={[['Affordable loan', fmt(loanA)], ['Down payment', fmt(dA)], ['Monthly payment budget', fmt(budget)]]} /></>)}
    </>)}
  </Wrap>);
}

// QR Code Generator - fully client-side via qrcode library. Nothing is uploaded.
const escWifi = (s) => s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/:/g, '\\:');
export function QrTool() {
  const [type, setType] = useState('url');
  const [text, setText] = useState('https://example.com');
  const [ssid, setSsid] = useState(''); const [wifiPass, setWifiPass] = useState(''); const [enc, setEnc] = useState('WPA'); const [hidden, setHidden] = useState(false);
  const [vName, setVName] = useState(''); const [vPhone, setVPhone] = useState(''); const [vEmail, setVEmail] = useState(''); const [vOrg, setVOrg] = useState('');
  const [smsPhone, setSmsPhone] = useState(''); const [smsMsg, setSmsMsg] = useState('');
  const [emAddr, setEmAddr] = useState(''); const [emSubject, setEmSubject] = useState(''); const [emBody, setEmBody] = useState('');
  const [url, setUrl] = useState(''); const [svgUrl, setSvgUrl] = useState(''); const [err, setErr] = useState('');
  const payload = type === 'wifi' ? `WIFI:T:${enc === 'nopass' ? 'nopass' : enc};S:${escWifi(ssid)};${enc === 'nopass' ? '' : 'P:' + escWifi(wifiPass) + ';'}H:${hidden ? 'true' : 'false'};;`
    : type === 'vcard' ? ['BEGIN:VCARD', 'VERSION:3.0', `FN:${vName}`, vPhone ? `TEL:${vPhone}` : '', vEmail ? `EMAIL:${vEmail}` : '', vOrg ? `ORG:${vOrg}` : '', 'END:VCARD'].filter(Boolean).join('\n')
    : type === 'sms' ? `SMSTO:${smsPhone}:${smsMsg}`
    : type === 'email' ? `mailto:${emAddr}` + ((emSubject || emBody) ? '?' + [emSubject ? 'subject=' + encodeURIComponent(emSubject) : '', emBody ? 'body=' + encodeURIComponent(emBody) : ''].filter(Boolean).join('&') : '')
    : (text || ' ');
  const gen = async () => {
    try {
      const QRCode = (await import('qrcode')).default;
      setUrl(await QRCode.toDataURL(payload, { width: 512, margin: 2 }));
      const svg = await QRCode.toString(payload, { type: 'svg' });
      setSvgUrl(URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' })));
      setErr('');
    } catch (e) { setErr('QR generation failed in this browser.'); }
  };
  useEffect(() => { gen(); }, [payload]); // live update as you type
  return (<Wrap note="Your text never leaves your device - the QR code is drawn in your browser only. Use it for links, Wi-Fi details, a contact card, SMS or email.">
    <ToggleButtonGroup value={type} exclusive fullWidth onChange={(_, nv) => nv && setType(nv)} sx={{ mb: 2, flexWrap: 'wrap' }}><ToggleButton value="url">Link / text</ToggleButton><ToggleButton value="wifi">Wi-Fi</ToggleButton><ToggleButton value="vcard">Contact</ToggleButton><ToggleButton value="sms">SMS</ToggleButton><ToggleButton value="email">Email</ToggleButton></ToggleButtonGroup>
    {type === 'url' && (<TextField fullWidth label="Text or link for the QR code" value={text} onChange={(e) => setText(e.target.value)} sx={{ mb: 2 }} />)}
    {type === 'wifi' && (<>
      <TextField fullWidth label="Wi-Fi network name (SSID)" value={ssid} onChange={(e) => setSsid(e.target.value)} sx={{ mb: 2 }} />
      <TextField select fullWidth label="Security" value={enc} onChange={(e) => setEnc(e.target.value)} sx={{ mb: 2 }}>{['WPA', 'WEP', 'nopass'].map((o) => (<MenuItem key={o} value={o}>{o === 'nopass' ? 'Open (no password)' : o}</MenuItem>))}</TextField>
      {enc !== 'nopass' && (<TextField fullWidth label="Wi-Fi password" value={wifiPass} onChange={(e) => setWifiPass(e.target.value)} sx={{ mb: 2 }} />)}
      <FormControlLabel control={<Checkbox checked={hidden} onChange={(e) => setHidden(e.target.checked)} />} label="Hidden network" sx={{ mb: 1 }} />
    </>)}
    {type === 'vcard' && (<>
      <TextField fullWidth label="Full name" value={vName} onChange={(e) => setVName(e.target.value)} sx={{ mb: 2 }} />
      <TextField fullWidth label="Phone" value={vPhone} onChange={(e) => setVPhone(e.target.value)} sx={{ mb: 2 }} />
      <TextField fullWidth label="Email" value={vEmail} onChange={(e) => setVEmail(e.target.value)} sx={{ mb: 2 }} />
      <TextField fullWidth label="Company (optional)" value={vOrg} onChange={(e) => setVOrg(e.target.value)} sx={{ mb: 2 }} />
    </>)}
    {type === 'sms' && (<>
      <TextField fullWidth label="Phone number" value={smsPhone} onChange={(e) => setSmsPhone(e.target.value)} sx={{ mb: 2 }} />
      <TextField fullWidth multiline rows={2} label="Message" value={smsMsg} onChange={(e) => setSmsMsg(e.target.value)} sx={{ mb: 2 }} />
    </>)}
    {type === 'email' && (<>
      <TextField fullWidth label="Email address" value={emAddr} onChange={(e) => setEmAddr(e.target.value)} sx={{ mb: 2 }} />
      <TextField fullWidth label="Subject (optional)" value={emSubject} onChange={(e) => setEmSubject(e.target.value)} sx={{ mb: 2 }} />
      <TextField fullWidth multiline rows={2} label="Message (optional)" value={emBody} onChange={(e) => setEmBody(e.target.value)} sx={{ mb: 2 }} />
    </>)}
    <Button variant="contained" fullWidth onClick={gen} sx={{ mb: 2 }}>Generate QR Code</Button>
    {err && <Alert severity="warning" sx={{ mb: 2 }}>{err}</Alert>}
    {url && (<Box textAlign="center"><img src={url} alt="Generated QR code" style={{ width: 256, height: 256 }} /><Box sx={{ mt: 1, display: 'flex', gap: 1, justifyContent: 'center' }}><Button variant="outlined" href={url} download="qr-code.png">Download PNG</Button><Button variant="outlined" href={svgUrl} download="qr-code.svg">Download SVG</Button></Box></Box>)}
  </Wrap>);
}

// BMI calculator - WHO categories, metric + imperial.
export function BmiTool() {
  const [unit, setUnit] = useState('metric');
  const [h, setH] = useState('170'); const [w, setW] = useState('70');
  const [ft, setFt] = useState('5'); const [inch, setInch] = useState('7'); const [lb, setLb] = useState('154');
  const hm = unit === 'metric' ? (parseFloat(h) || 0) / 100 : ((parseFloat(ft) || 0) * 12 + (parseFloat(inch) || 0)) * 0.0254;
  const kg = unit === 'metric' ? (parseFloat(w) || 0) : (parseFloat(lb) || 0) * 0.45359237;
  const bmi = hm > 0 ? kg / (hm * hm) : 0;
  const cat = bmi === 0 ? '' : bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal weight' : bmi < 30 ? 'Overweight' : 'Obese';
  const lowKg = 18.5 * hm * hm; const highKg = 24.9 * hm * hm;
  const healthy = hm > 0 ? `${fmt(lowKg)} - ${fmt(highKg)} kg (${fmt(lowKg * 2.20462)} - ${fmt(highKg * 2.20462)} lb)` : '';
  return (<Wrap note="BMI = weight (kg) ÷ height (m)². Categories follow WHO ranges. BMI does not distinguish muscle from fat - athletes and children need a different assessment.">
    <ToggleButtonGroup value={unit} exclusive fullWidth onChange={(_, nv) => nv && setUnit(nv)} sx={{ mb: 2 }}><ToggleButton value="metric">Metric (cm / kg)</ToggleButton><ToggleButton value="imperial">Imperial (ft / lb)</ToggleButton></ToggleButtonGroup>
    {unit === 'metric' ? (<>
      <TextField fullWidth label="Height (cm)" type="number" value={h} onChange={(e) => setH(e.target.value)} sx={{ mb: 2 }} />
      <TextField fullWidth label="Weight (kg)" type="number" value={w} onChange={(e) => setW(e.target.value)} />
    </>) : (<>
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}><TextField fullWidth label="Height (feet)" type="number" value={ft} onChange={(e) => setFt(e.target.value)} /><TextField fullWidth label="Height (inches)" type="number" value={inch} onChange={(e) => setInch(e.target.value)} /></Box>
      <TextField fullWidth label="Weight (pounds)" type="number" value={lb} onChange={(e) => setLb(e.target.value)} />
    </>)}
    {bmi > 0 && (<><Hero value={fmt(bmi)} unit={cat} /><Rows rows={[['Healthy weight for your height', healthy], ['Underweight', 'Below 18.5'], ['Normal', '18.5 - 24.9'], ['Overweight', '25 - 29.9'], ['Obese', '30 and above']]} /></>)}
  </Wrap>);
}

// Age calculator - from date of birth to today.
export function AgeTool() {
  const [dob, setDob] = useState('2000-01-01'); const [target, setTarget] = useState('');
  const [tick, setTick] = useState(Date.now());
  useEffect(() => { if (target) return undefined; const id = setInterval(() => setTick(Date.now()), 1000); return () => clearInterval(id); }, [target]);
  const calc = () => {
    const birth = new Date(dob); const now = target ? new Date(target) : new Date(tick); if (isNaN(birth) || birth > now) return null;
    let y = now.getFullYear() - birth.getFullYear(); let m = now.getMonth() - birth.getMonth(); let d = now.getDate() - birth.getDate();
    if (d < 0) { m--; const prev = new Date(now.getFullYear(), now.getMonth(), 0); d += prev.getDate(); }
    if (m < 0) { y--; m += 12; }
    const ms = now - birth;
    const days = Math.floor(ms / 86400000);
    const next = new Date(now.getFullYear(), birth.getMonth(), birth.getDate()); if (next < now) next.setFullYear(now.getFullYear() + 1);
    const last = new Date(birth); last.setFullYear(now.getFullYear()); if (last > now) last.setFullYear(now.getFullYear() - 1);
    const fmtDate = (dt) => dt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    return { y, m, d, days, weeks: Math.floor(days / 7), hours: Math.floor(ms / 3600000), minutes: Math.floor(ms / 60000), seconds: Math.floor(ms / 1000), nextDays: Math.ceil((next - now) / 86400000), nextDate: fmtDate(next), lastAge: last.getFullYear() - birth.getFullYear(), lastDate: fmtDate(last) };
  };
  const a = calc();
  return (<Wrap note="Age is calculated from your date of birth to today (or to the date you choose). No date is stored or sent anywhere.">
    <TextField fullWidth label="Date of birth" type="date" value={dob} onChange={(e) => setDob(e.target.value)} InputLabelProps={{ shrink: true }} sx={{ mb: 2 }} />
    <TextField fullWidth label="Calculate age on this date (optional, leave blank for today)" type="date" value={target} onChange={(e) => setTarget(e.target.value)} InputLabelProps={{ shrink: true }} />
    {a && (<><Hero value={`${a.y} years, ${a.m} months, ${a.d} days`} unit="Your age" /><Rows rows={[['Total weeks', fmt(a.weeks)], ['Total hours', fmt(a.hours)], ['Total minutes', fmt(a.minutes)], ['Total seconds' + (target ? '' : ' (live)'), fmt(a.seconds)], ['Total days lived', fmt(a.days)], ['Age on last birthday', `${a.lastAge} years (${a.lastDate})`], ['Age on next birthday', `${a.lastAge + 1} years (${a.nextDate})`], ['Days until next birthday', fmt(a.nextDays)]]} /></>)}
    {!a && <Typography variant="body2" color="warning.main" sx={{ mt: 2 }}>Please enter a valid date of birth that is not in the future.</Typography>}
  </Wrap>);
}

// Percentage calculator - five modes.
const PCT_MODES = [['of', '% of a number'], ['is', 'X is % of Y'], ['change', '% change'], ['diff', '% difference'], ['reverse', 'Price before discount']];
export function PercentageTool() {
  const [mode, setMode] = useState('of'); const [a, setA] = useState('20'); const [b, setB] = useState('500');
  const x = parseFloat(a) || 0; const y = parseFloat(b) || 0;
  const result = mode === 'of' ? y * x / 100 : mode === 'is' ? (y !== 0 ? x / y * 100 : 0) : mode === 'change' ? (y !== 0 ? (x - y) / y * 100 : 0) : mode === 'diff' ? ((x + y) !== 0 ? Math.abs(x - y) / ((x + y) / 2) * 100 : 0) : (y < 100 ? x / (1 - y / 100) : 0);
  const label = mode === 'of' ? `${fmt(x)}% of ${fmt(y)}` : mode === 'is' ? `${fmt(x)} is what % of ${fmt(y)}` : mode === 'change' ? `Change from ${fmt(y)} to ${fmt(x)}` : mode === 'diff' ? `% difference between ${fmt(x)} and ${fmt(y)}` : `Original price before ${fmt(y)}% off`;
  const working = mode === 'of' ? `${fmt(x)} ÷ 100 × ${fmt(y)} = ${fmt(result)}`
    : mode === 'is' ? `${fmt(x)} ÷ ${fmt(y)} × 100 = ${fmt(result)}%`
    : mode === 'change' ? `(${fmt(x)} − ${fmt(y)}) ÷ ${fmt(y)} × 100 = ${fmt(result)}%`
    : mode === 'diff' ? `|${fmt(x)} − ${fmt(y)}| ÷ ((${fmt(x)} + ${fmt(y)}) ÷ 2) × 100 = ${fmt(result)}%`
    : `${fmt(x)} ÷ (1 − ${fmt(y)} ÷ 100) = ${fmt(result)}`;
  const labelA = mode === 'of' ? 'Percentage (%)' : mode === 'reverse' ? 'Price after discount / tax' : 'First number';
  const labelB = mode === 'of' ? 'Number' : mode === 'reverse' ? 'Discount or tax (%)' : 'Second number';
  return (<Wrap note="Five common percentage questions in one tool: a % of a number, one number as a % of another, % increase/decrease, % difference (symmetric), and the price before a discount or tax was applied.">
    <ToggleButtonGroup value={mode} exclusive fullWidth onChange={(_, nv) => nv && setMode(nv)} sx={{ mb: 2, flexWrap: 'wrap' }}>{PCT_MODES.map(([v, l]) => (<ToggleButton key={v} value={v}>{l}</ToggleButton>))}</ToggleButtonGroup>
    <TextField fullWidth label={labelA} type="number" value={a} onChange={(e) => setA(e.target.value)} sx={{ mb: 2 }} />
    <TextField fullWidth label={labelB} type="number" value={b} onChange={(e) => setB(e.target.value)} />
    <Hero value={mode === 'is' || mode === 'change' || mode === 'diff' ? fmt(result) + '%' : fmt(result)} unit={label} />
    <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>Working: {working}</Typography>
  </Wrap>);
}

// Word counter - counts in the browser, text never leaves the device.
const PLATFORM_LIMITS = [['X post', 280], ['Instagram bio', 150], ['LinkedIn post', 3000], ['TikTok caption', 4000], ['SMS', 160], ['Google Ads headline', 30], ['Meta description', 160]];
export function WordCounterTool() {
  const [text, setText] = useState('');
  const words = text.trim() ? text.trim().split(/\s+/).length : 0; const chars = text.length; const charsNoSpace = text.replace(/\s/g, '').length; const sentences = text.split(/[.!?]+/).filter((s) => s.trim()).length; const paras = text.split(/\n\s*\n/).filter((s) => s.trim()).length;
  return (<Wrap note="Your text is counted in your browser only - nothing is uploaded or stored. Reading time assumes about 200 words per minute. Platform limits are checked against characters (with spaces).">
    <TextField fullWidth multiline rows={6} label="Paste or type your text" value={text} onChange={(e) => setText(e.target.value)} />
    <Rows rows={[['Words', fmt(words)], ['Characters (with spaces)', fmt(chars)], ['Characters (no spaces)', fmt(charsNoSpace)], ['Sentences', fmt(sentences)], ['Paragraphs', fmt(paras)], ['Reading time', words === 0 ? '0 min' : (words / 200 < 1 ? 'Under 1 min' : fmt(words / 200) + ' min')]]} />
    <Typography variant="subtitle1" fontWeight={700} sx={{ mt: 3, mb: 1 }}>Platform limits</Typography>
    {PLATFORM_LIMITS.map(([name, limit]) => {
      const left = limit - chars; const over = left < 0;
      return (<Box key={name} sx={{ mb: 1.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography variant="body2">{name} — {fmt(limit)} characters</Typography><Typography variant="body2" fontWeight={700} color={over ? 'error.main' : 'text.primary'}>{over ? fmt(-left) + ' over' : fmt(left) + ' left'}</Typography></Box>
        <LinearProgress variant="determinate" value={Math.min(100, (chars / limit) * 100)} color={over ? 'error' : 'primary'} sx={{ height: 8, borderRadius: 4 }} />
      </Box>);
    })}
  </Wrap>);
}

// Password generator - generated locally, never stored or sent.
const CRACK_RATE = 1e10; // 10 billion guesses per second (offline attack estimate)
function crackTimeLabel(bits) {
  const seconds = Math.pow(2, Math.max(0, bits - 1)) / CRACK_RATE;
  if (seconds < 1) return 'less than a second';
  if (seconds < 60) return `about ${fmt(seconds)} seconds`;
  const minutes = seconds / 60; if (minutes < 60) return `about ${fmt(minutes)} minutes`;
  const hours = minutes / 60; if (hours < 24) return `about ${fmt(hours)} hours`;
  const days = hours / 24; if (days < 365) return `about ${fmt(days)} days`;
  const years = days / 365.25;
  if (years >= 1e9) return 'billions of years';
  if (years >= 1e6) return 'millions of years';
  return `about ${fmt(years)} years`;
}
export function PasswordTool() {
  const [len, setLen] = useState('16'); const [upper, setUpper] = useState(true); const [lower, setLower] = useState(true); const [nums, setNums] = useState(true); const [syms, setSyms] = useState(true); const [pwd, setPwd] = useState(''); const [copied, setCopied] = useState(false);
  const poolSize = (upper ? 26 : 0) + (lower ? 26 : 0) + (nums ? 10 : 0) + (syms ? 14 : 0);
  const bits = poolSize > 0 ? (parseInt(len, 10) || 16) * Math.log2(poolSize) : 0;
  const strength = bits < 40 ? 'Weak' : bits < 60 ? 'Fair' : bits < 80 ? 'Good' : bits < 100 ? 'Strong' : 'Very strong';
  const strengthColor = bits < 40 ? 'error' : bits < 60 ? 'warning' : bits < 80 ? 'info' : 'success';
  const gen = () => {
    let pool = ''; if (upper) pool += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; if (lower) pool += 'abcdefghijklmnopqrstuvwxyz'; if (nums) pool += '0123456789'; if (syms) pool += '!@#$%^&*()-_=+';
    if (!pool) { setPwd(''); return; }
    const L = Math.min(Math.max(parseInt(len, 10) || 16, 1), 128); const lim = Math.floor(4294967296 / pool.length) * pool.length; const out = []; while (out.length < L) { const arr = new Uint32Array(L * 2); crypto.getRandomValues(arr); for (const n of arr) { if (out.length < L && n < lim) out.push(pool[n % pool.length]); } } setPwd(out.join('')); setCopied(false);
  };
  useEffect(() => { gen(); }, [len, upper, lower, nums, syms]); // password ready on page load, refreshes when options change
  return (<Wrap note="Generated with your browser's secure random generator. It is never stored, never sent to a server, and never shown to anyone else. Use a password manager to save it - do not reuse it across sites.">
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
      <Slider sx={{ flex: 1 }} min={4} max={64} value={Math.min(Math.max(parseInt(len, 10) || 16, 4), 64)} onChange={(_, v) => setLen(String(v))} aria-label="Password length" />
      <TextField label="Length" type="number" value={len} onChange={(e) => setLen(e.target.value)} sx={{ width: 110 }} />
    </Box>
    <ToggleButtonGroup value={''} sx={{ mb: 2, flexWrap: 'wrap' }}>
      <ToggleButton value="upper" selected={upper} onClick={() => setUpper(!upper)}>A-Z</ToggleButton>
      <ToggleButton value="lower" selected={lower} onClick={() => setLower(!lower)}>a-z</ToggleButton>
      <ToggleButton value="nums" selected={nums} onClick={() => setNums(!nums)}>0-9</ToggleButton>
      <ToggleButton value="syms" selected={syms} onClick={() => setSyms(!syms)}>Symbols</ToggleButton>
    </ToggleButtonGroup>
    <Button variant="contained" fullWidth onClick={gen} sx={{ mb: 2 }}>Generate Password</Button>
    {pwd && (<><TextField fullWidth value={pwd} InputProps={{ readOnly: true }} sx={{ mb: 1 }} /><Button variant="outlined" fullWidth onClick={() => { navigator.clipboard.writeText(pwd); setCopied(true); }} sx={{ mb: 2 }}>{copied ? 'Copied!' : 'Copy Password'}</Button>
      <Rows rows={[['Entropy', `${fmt(bits)} bits`], ['Strength', strength], ['Time to crack (at 10 billion guesses/sec)', crackTimeLabel(bits)]]} />
      <LinearProgress variant="determinate" value={Math.min(100, bits)} color={strengthColor} sx={{ height: 10, borderRadius: 5, mt: 1.5 }} />
    </>)}
  </Wrap>);
}

// CGPA calculator - scale picker + subjects mode + multi-semester mode.
const CGPA_GRADES = {
  us: [['4.0', 'A (4.0)'], ['3.7', 'A− (3.7)'], ['3.3', 'B+ (3.3)'], ['3.0', 'B (3.0)'], ['2.7', 'B− (2.7)'], ['2.3', 'C+ (2.3)'], ['2.0', 'C (2.0)'], ['1.7', 'C− (1.7)'], ['1.0', 'D (1.0)'], ['0', 'F (0)']],
  hec: [['4.0', 'A (4.0)'], ['3.67', 'A− (3.67)'], ['3.33', 'B+ (3.33)'], ['3.0', 'B (3.0)'], ['2.67', 'B− (2.67)'], ['2.33', 'C+ (2.33)'], ['2.0', 'C (2.0)'], ['1.67', 'C− (1.67)'], ['1.0', 'D (1.0)'], ['0', 'F (0)']],
  ten: [['10', 'O (10)'], ['9', 'A+ (9)'], ['8', 'A (8)'], ['7', 'B+ (7)'], ['6', 'B (6)'], ['5', 'C (5)'], ['4', 'P (4)'], ['0', 'F (0)']],
  five: [['5', 'A (5)'], ['4.5', 'A− (4.5)'], ['4', 'B (4)'], ['3.5', 'B− (3.5)'], ['3', 'C (3)'], ['2.5', 'C− (2.5)'], ['2', 'D (2)'], ['1', 'E (1)'], ['0', 'F (0)']],
};
const CGPA_SCALES = {
  '4.0': { max: '4.0', pct: (c) => c * 25, pctLabel: 'Rough percentage (CGPA × 25)' },
  '10': { max: '10', pct: (c) => c * 9.5, pctLabel: 'Rough percentage (CGPA × 9.5)' },
  '5.0': { max: '5.0', pct: (c) => c * 20, pctLabel: 'Rough percentage (CGPA × 20)' },
};
function cgpaDefaults(scale, system) {
  if (scale === '10') return { rows: [{ grade: '9', credits: '3' }, { grade: '8', credits: '3' }, { grade: '7', credits: '3' }], sems: [{ sgpa: '8.5', credits: '20' }, { sgpa: '8.0', credits: '20' }] };
  if (scale === '5.0') return { rows: [{ grade: '5', credits: '3' }, { grade: '4', credits: '3' }, { grade: '3.5', credits: '3' }], sems: [{ sgpa: '4.2', credits: '15' }, { sgpa: '4.0', credits: '15' }] };
  const top = system === 'hec' ? '3.67' : '3.7'; const mid = system === 'hec' ? '3.33' : '3.3';
  return { rows: [{ grade: '4.0', credits: '3' }, { grade: top, credits: '3' }, { grade: mid, credits: '3' }], sems: [{ sgpa: '3.5', credits: '15' }, { sgpa: '3.3', credits: '15' }] };
}
export function CgpaTool() {
  const [scale, setScale] = useState('4.0'); const [system, setSystem] = useState('us'); const [mode, setMode] = useState('subjects');
  const [rows, setRows] = useState(cgpaDefaults('4.0', 'us').rows);
  const [sems, setSems] = useState(cgpaDefaults('4.0', 'us').sems);
  const gradeKey = scale === '4.0' ? system : scale === '10' ? 'ten' : 'five';
  const gradeOpts = CGPA_GRADES[gradeKey];
  const changeScale = (s) => { setScale(s); const d = cgpaDefaults(s, system); setRows(d.rows); setSems(d.sems); };
  const changeSystem = (sys) => { setSystem(sys); const d = cgpaDefaults(scale, sys); setRows(d.rows); setSems(d.sems); };
  const scaleInfo = CGPA_SCALES[scale];
  let totalCredits = 0; let points = 0;
  if (mode === 'subjects') { totalCredits = rows.reduce((s, r) => s + (parseFloat(r.credits) || 0), 0); points = rows.reduce((s, r) => s + (parseFloat(r.grade) || 0) * (parseFloat(r.credits) || 0), 0); }
  else { totalCredits = sems.reduce((s, r) => s + (parseFloat(r.credits) || 0), 0); points = sems.reduce((s, r) => s + (parseFloat(r.sgpa) || 0) * (parseFloat(r.credits) || 0), 0); }
  const cgpa = totalCredits > 0 ? points / totalCredits : 0;
  return (<Wrap note="CGPA = total grade points ÷ total credit hours. Percentage conversions are only rough - confirm with your university. The Pakistan HEC grade points (A− = 3.67, B+ = 3.33) differ slightly from the US ± system (A− = 3.7, B+ = 3.3).">
    <ToggleButtonGroup value={scale} exclusive fullWidth onChange={(_, nv) => nv && changeScale(nv)} sx={{ mb: 2 }}><ToggleButton value="4.0">4.0 scale</ToggleButton><ToggleButton value="10">10-point scale</ToggleButton><ToggleButton value="5.0">5.0 scale</ToggleButton></ToggleButtonGroup>
    {scale === '4.0' && (<ToggleButtonGroup value={system} exclusive fullWidth onChange={(_, nv) => nv && changeSystem(nv)} sx={{ mb: 2 }}><ToggleButton value="us">US (±) grade points</ToggleButton><ToggleButton value="hec">Pakistan HEC grade points</ToggleButton></ToggleButtonGroup>)}
    <ToggleButtonGroup value={mode} exclusive fullWidth onChange={(_, nv) => nv && setMode(nv)} sx={{ mb: 2 }}><ToggleButton value="subjects">Subjects</ToggleButton><ToggleButton value="semesters">Semesters</ToggleButton></ToggleButtonGroup>
    {mode === 'subjects' ? (<>
      {rows.map((r, i) => (<Box key={i} sx={{ display: 'flex', gap: 1, mb: 1 }}>
        <TextField select fullWidth label="Grade point" value={r.grade} onChange={(e) => { const c = [...rows]; c[i].grade = e.target.value; setRows(c); }}>{gradeOpts.map(([v, l]) => (<MenuItem key={v} value={v}>{l}</MenuItem>))}</TextField>
        <TextField fullWidth label="Credit hours" type="number" value={r.credits} onChange={(e) => { const c = [...rows]; c[i].credits = e.target.value; setRows(c); }} />
      </Box>))}
      <Button variant="outlined" fullWidth onClick={() => setRows([...rows, { grade: gradeOpts[0][0], credits: '3' }])} sx={{ mb: 2 }}>Add Subject</Button>
    </>) : (<>
      {sems.map((r, i) => (<Box key={i} sx={{ display: 'flex', gap: 1, mb: 1 }}>
        <TextField fullWidth label={`Semester ${i + 1} GPA (0–${scaleInfo.max})`} type="number" value={r.sgpa} onChange={(e) => { const c = [...sems]; c[i].sgpa = e.target.value; setSems(c); }} />
        <TextField fullWidth label="Credit hours" type="number" value={r.credits} onChange={(e) => { const c = [...sems]; c[i].credits = e.target.value; setSems(c); }} />
      </Box>))}
      <Button variant="outlined" fullWidth onClick={() => setSems([...sems, { sgpa: '', credits: '' }])} sx={{ mb: 2 }}>Add Semester</Button>
    </>)}
    {totalCredits > 0 && (<><Hero value={fmt(cgpa)} unit={`Your CGPA (${scaleInfo.max} scale)`} /><Rows rows={[['Total credit hours', fmt(totalCredits)], ['Total grade points', fmt(points)], [scaleInfo.pctLabel, fmt(scaleInfo.pct(cgpa)) + '%']]} /></>)}
  </Wrap>);
}

// PNG to JPG - browser-only, white background for transparency.
export function PngToJpgTool() {
  const [quality, setQuality] = useState(92);
  const [files, setFiles] = useState([]); const [err, setErr] = useState(''); const [busy, setBusy] = useState(false);
  const convertOne = (f, q) => new Promise((resolve, reject) => {
    const img = new Image(); const src = URL.createObjectURL(f);
    img.onload = () => {
      const c = document.createElement('canvas'); c.width = img.naturalWidth; c.height = img.naturalHeight; const ctx = c.getContext('2d'); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height); ctx.drawImage(img, 0, 0);
      c.toBlob((b) => { URL.revokeObjectURL(src); if (b) resolve({ name: f.name.replace(/\.[^.]+$/, '') + '.jpg', url: URL.createObjectURL(b), size: b.size }); else reject(new Error('convert failed')); }, 'image/jpeg', q / 100);
    };
    img.onerror = () => { URL.revokeObjectURL(src); reject(new Error('decode failed')); };
    img.src = src;
  });
  const onFiles = async (list) => {
    const chosen = Array.from(list || []); if (!chosen.length) return;
    setErr(''); setFiles([]); setBusy(true);
    const out = []; const failed = [];
    for (const f of chosen) { try { out.push(await convertOne(f, quality)); } catch (e) { failed.push(f.name); } }
    setFiles(out);
    if (failed.length) setErr(`Could not convert: ${failed.join(', ')}`);
    setBusy(false);
  };
  const downloadAll = () => { files.forEach((f, i) => { setTimeout(() => { const a = document.createElement('a'); a.href = f.url; a.download = f.name; a.click(); }, i * 300); }); };
  return (<Wrap note="Private by design - your files never leave your device. JPG has no transparency, so transparent areas become white.">
    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Quality: {quality}%</Typography>
    <Slider value={quality} min={0} max={100} onChange={(_, v) => setQuality(v)} aria-label="JPG quality" sx={{ mb: 2 }} />
    <Button variant="contained" component="label" fullWidth sx={{ mb: 2 }}>{busy ? 'Converting…' : 'Choose PNG files (one or more)'}<input type="file" hidden multiple accept="image/png" onChange={(e) => onFiles(e.target.files)} /></Button>
    {err && <Alert severity="warning" sx={{ mb: 2 }}>{err}</Alert>}
    {files.length > 0 && (<Box>
      {files.length > 1 && (<Button variant="contained" fullWidth onClick={downloadAll} sx={{ mb: 2 }}>Download all ({files.length} JPGs)</Button>)}
      {files.map((f, i) => (<Box key={i} sx={{ mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1 }}><Typography variant="body2" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name} ({fmt(Math.round(f.size / 1024))} KB)</Typography><Button variant="outlined" size="small" href={f.url} download={f.name} sx={{ flexShrink: 0 }}>Download</Button></Box>))}
    </Box>)}
  </Wrap>);
}

// PDF to JPG - renders PDF pages in the browser via pdfjs-dist, downloads as JPGs or one ZIP.
const PDF_QUALITY = { low: { label: 'Low — 72 DPI, 80% quality', scale: 1, q: 0.8 }, standard: { label: 'Standard — 144 DPI, 92% quality', scale: 2, q: 0.92 }, high: { label: 'High — 216 DPI, 95% quality', scale: 3, q: 0.95 } };
export function PdfToJpgTool() {
  const [preset, setPreset] = useState('standard');
  const [pages, setPages] = useState([]); const [err, setErr] = useState(''); const [busy, setBusy] = useState(false); const [zipBusy, setZipBusy] = useState(false);
  const onFile = async (f) => {
    if (!f) return; setErr(''); setPages([]); setBusy(true);
    try {
      const pdfjs = await import('pdfjs-dist');
      pdfjs.GlobalWorkerOptions.workerSrc = (await import('pdfjs-dist/build/pdf.worker.min.mjs?url')).default;
      const buf = await f.arrayBuffer(); const doc = await pdfjs.getDocument({ data: buf }).promise; const out = [];
      const { scale, q } = PDF_QUALITY[preset];
      for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i); const viewport = page.getViewport({ scale }); const canvas = document.createElement('canvas'); canvas.width = viewport.width; canvas.height = viewport.height;
        await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
        const blob = await new Promise((res) => canvas.toBlob(res, 'image/jpeg', q));
        out.push({ name: `page-${i}.jpg`, url: URL.createObjectURL(blob), blob });
      }
      setPages(out);
    } catch (e) { setErr('This PDF could not be rendered in this browser. Try a simpler PDF, or use a desktop PDF tool.'); }
    setBusy(false);
  };
  const downloadZip = async () => {
    if (!pages.length) return; setZipBusy(true);
    try {
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();
      pages.forEach((p) => zip.file(p.name, p.blob));
      const blob = await zip.generateAsync({ type: 'blob' });
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'pdf-pages.zip'; a.click();
    } catch (e) { setErr('ZIP download failed in this browser - download pages one by one instead.'); }
    setZipBusy(false);
  };
  return (<Wrap note="Private by design - your PDF never leaves your device. Each page downloads as a JPG, or all pages together as one ZIP. Very large PDFs may be slow on a phone.">
    <TextField select fullWidth label="Quality / resolution" value={preset} onChange={(e) => setPreset(e.target.value)} sx={{ mb: 2 }}>{Object.entries(PDF_QUALITY).map(([k, v]) => (<MenuItem key={k} value={k}>{v.label}</MenuItem>))}</TextField>
    <Button variant="contained" component="label" fullWidth sx={{ mb: 2 }}>{busy ? 'Rendering…' : 'Choose PDF file'}<input type="file" hidden accept="application/pdf" onChange={(e) => onFile(e.target.files[0])} /></Button>
    {err && <Alert severity="warning" sx={{ mb: 2 }}>{err}</Alert>}
    {pages.length > 0 && (<Box>
      <Button variant="contained" fullWidth onClick={downloadZip} disabled={zipBusy} sx={{ mb: 2 }}>{zipBusy ? 'Making ZIP…' : `Download all ${pages.length} pages as ZIP`}</Button>
      {pages.map((p, i) => (<Box key={i} sx={{ mb: 1, textAlign: 'center' }}><Button variant="outlined" href={p.url} download={p.name}>Download Page {i + 1} JPG</Button></Box>))}
    </Box>)}
  </Wrap>);
}
