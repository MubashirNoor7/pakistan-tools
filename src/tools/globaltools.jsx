import React, { useState } from 'react';
import { Card, CardContent, Typography, TextField, Box, MenuItem, ToggleButton, ToggleButtonGroup, Alert, Button } from '@mui/material';
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

// Loan / EMI calculator - global, pure arithmetic.
export function LoanEmiTool() {
  const [amt, setAmt] = useState('1000000'); const [rate, setRate] = useState('12'); const [years, setYears] = useState('5');
  const p = parseFloat(amt) || 0; const m = emi(p, parseFloat(rate) || 0, (parseFloat(years) || 0) * 12); const total = m * (parseFloat(years) || 0) * 12;
  return (<Wrap note="Monthly EMI = P × r × (1+r)^n ÷ ((1+r)^n − 1). Rates vary by bank and country - enter your bank's actual rate. No personal data is stored or sent anywhere.">
    <TextField fullWidth label="Loan amount" type="number" value={amt} onChange={(e) => setAmt(e.target.value)} sx={{ mb: 2 }} />
    <TextField fullWidth label="Interest rate (% per year)" type="number" value={rate} onChange={(e) => setRate(e.target.value)} sx={{ mb: 2 }} />
    <TextField fullWidth label="Loan duration (years)" type="number" value={years} onChange={(e) => setYears(e.target.value)} />
    {p > 0 && (<><Hero value={fmt(m) + ' / month'} unit="Monthly EMI" /><Rows rows={[['Total paid', fmt(total)], ['Total interest', fmt(total - p)], ['Principal', fmt(p)]]} /></>)}
  </Wrap>);
}

// Mortgage affordability - how much house can your income afford?
export function MortgageTool() {
  const [income, setIncome] = useState('100000'); const [down, setDown] = useState('2000000'); const [rate, setRate] = useState('12'); const [years, setYears] = useState('20'); const [share, setShare] = useState('30');
  const inc = parseFloat(income) || 0; const d = parseFloat(down) || 0; const r = (parseFloat(rate) || 0) / 100 / 12; const n = (parseFloat(years) || 0) * 12; const budget = inc * (parseFloat(share) || 0) / 100;
  const loan = budget > 0 && n > 0 ? (r === 0 ? budget * n : budget * (1 - Math.pow(1 + r, -n)) / r) : 0;
  return (<Wrap note="Rule of thumb used here: keep the monthly mortgage payment at or below the % of income you choose (default 30%). This is an affordability estimate, not a bank approval - banks also check credit, debts and property value.">
    <TextField fullWidth label="Monthly income" type="number" value={income} onChange={(e) => setIncome(e.target.value)} sx={{ mb: 2 }} />
    <TextField fullWidth label="Down payment saved" type="number" value={down} onChange={(e) => setDown(e.target.value)} sx={{ mb: 2 }} />
    <TextField fullWidth label="Mortgage rate (% per year)" type="number" value={rate} onChange={(e) => setRate(e.target.value)} sx={{ mb: 2 }} />
    <TextField fullWidth label="Mortgage duration (years)" type="number" value={years} onChange={(e) => setYears(e.target.value)} sx={{ mb: 2 }} />
    <TextField fullWidth label="Max payment as % of income" type="number" value={share} onChange={(e) => setShare(e.target.value)} />
    {inc > 0 && (<><Hero value={fmt(loan + d)} unit="House price you can afford" /><Rows rows={[['Affordable loan', fmt(loan)], ['Down payment', fmt(d)], ['Monthly payment budget', fmt(budget)]]} /></>)}
  </Wrap>);
}

// QR Code Generator - fully client-side via qrcode library. Nothing is uploaded.
export function QrTool() {
  const [text, setText] = useState('https://example.com'); const [url, setUrl] = useState(''); const [err, setErr] = useState('');
  const gen = async () => {
    try { const QRCode = (await import('qrcode')).default; setUrl(await QRCode.toDataURL(text || ' ', { width: 512, margin: 2 })); setErr(''); }
    catch (e) { setErr('QR generation failed in this browser.'); }
  };
  return (<Wrap note="Your text never leaves your device - the QR code is drawn in your browser only. Use it for links, Wi-Fi details, or plain text.">
    <TextField fullWidth label="Text or link for the QR code" value={text} onChange={(e) => setText(e.target.value)} sx={{ mb: 2 }} />
    <Button variant="contained" fullWidth onClick={gen} sx={{ mb: 2 }}>Generate QR Code</Button>
    {err && <Alert severity="warning" sx={{ mb: 2 }}>{err}</Alert>}
    {url && (<Box textAlign="center"><img src={url} alt="Generated QR code" style={{ width: 256, height: 256 }} /><Box sx={{ mt: 1 }}><Button variant="outlined" href={url} download="qr-code.png">Download PNG</Button></Box></Box>)}
  </Wrap>);
}

// BMI calculator - WHO categories.
export function BmiTool() {
  const [h, setH] = useState('170'); const [w, setW] = useState('70'); const hm = (parseFloat(h) || 0) / 100; const kg = parseFloat(w) || 0; const bmi = hm > 0 ? kg / (hm * hm) : 0;
  const cat = bmi === 0 ? '' : bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal weight' : bmi < 30 ? 'Overweight' : 'Obese';
  return (<Wrap note="BMI = weight (kg) ÷ height (m)². Categories follow WHO ranges. BMI does not distinguish muscle from fat - athletes and children need a different assessment.">
    <TextField fullWidth label="Height (cm)" type="number" value={h} onChange={(e) => setH(e.target.value)} sx={{ mb: 2 }} />
    <TextField fullWidth label="Weight (kg)" type="number" value={w} onChange={(e) => setW(e.target.value)} />
    {bmi > 0 && (<><Hero value={fmt(bmi)} unit={cat} /><Rows rows={[['Underweight', 'Below 18.5'], ['Normal', '18.5 - 24.9'], ['Overweight', '25 - 29.9'], ['Obese', '30 and above']]} /></>)}
  </Wrap>);
}

// Age calculator - from date of birth to today.
export function AgeTool() {
  const [dob, setDob] = useState('2000-01-01'); const [target, setTarget] = useState('');
  const calc = () => {
    const birth = new Date(dob); const now = target ? new Date(target) : new Date(); if (isNaN(birth) || birth > now) return null;
    let y = now.getFullYear() - birth.getFullYear(); let m = now.getMonth() - birth.getMonth(); let d = now.getDate() - birth.getDate();
    if (d < 0) { m--; const prev = new Date(now.getFullYear(), now.getMonth(), 0); d += prev.getDate(); }
    if (m < 0) { y--; m += 12; }
    const days = Math.floor((now - birth) / 86400000);
    const next = new Date(now.getFullYear(), birth.getMonth(), birth.getDate()); if (next < now) next.setFullYear(now.getFullYear() + 1);
    return { y, m, d, days, nextDays: Math.ceil((next - now) / 86400000) };
  };
  const a = calc();
  return (<Wrap note="Age is calculated from your date of birth to today (or to the date you choose). No date is stored or sent anywhere.">
    <TextField fullWidth label="Date of birth" type="date" value={dob} onChange={(e) => setDob(e.target.value)} InputLabelProps={{ shrink: true }} sx={{ mb: 2 }} />
    <TextField fullWidth label="Calculate age on this date (optional, leave blank for today)" type="date" value={target} onChange={(e) => setTarget(e.target.value)} InputLabelProps={{ shrink: true }} />
    {a && (<><Hero value={`${a.y} years, ${a.m} months, ${a.d} days`} unit="Your age" /><Rows rows={[['Total days lived', fmt(a.days)], ['Days until next birthday', fmt(a.nextDays)]]} /></>)}
    {!a && <Typography variant="body2" color="warning.main" sx={{ mt: 2 }}>Please enter a valid date of birth that is not in the future.</Typography>}
  </Wrap>);
}

// Percentage calculator - three modes.
export function PercentageTool() {
  const [mode, setMode] = useState('of'); const [a, setA] = useState('20'); const [b, setB] = useState('500');
  const x = parseFloat(a) || 0; const y = parseFloat(b) || 0;
  const result = mode === 'of' ? y * x / 100 : mode === 'is' ? (y !== 0 ? x / y * 100 : 0) : (y !== 0 ? (x - y) / y * 100 : 0);
  const label = mode === 'of' ? `${fmt(x)}% of ${fmt(y)}` : mode === 'is' ? `${fmt(x)} is what % of ${fmt(y)}` : `Change from ${fmt(y)} to ${fmt(x)}`;
  return (<Wrap note="Three common percentage questions in one tool: a % of a number, one number as a % of another, and % increase/decrease.">
    <ToggleButtonGroup value={mode} exclusive fullWidth onChange={(_, nv) => nv && setMode(nv)} sx={{ mb: 2 }}><ToggleButton value="of">% of a number</ToggleButton><ToggleButton value="is">X is % of Y</ToggleButton><ToggleButton value="change">% change</ToggleButton></ToggleButtonGroup>
    <TextField fullWidth label={mode === 'of' ? 'Percentage (%)' : 'First number'} type="number" value={a} onChange={(e) => setA(e.target.value)} sx={{ mb: 2 }} />
    <TextField fullWidth label={mode === 'of' ? 'Number' : 'Second number'} type="number" value={b} onChange={(e) => setB(e.target.value)} />
    <Hero value={mode === 'is' || mode === 'change' ? fmt(result) + '%' : fmt(result)} unit={label} />
  </Wrap>);
}

// Word counter - counts in the browser, text never leaves the device.
export function WordCounterTool() {
  const [text, setText] = useState('');
  const words = text.trim() ? text.trim().split(/\s+/).length : 0; const chars = text.length; const charsNoSpace = text.replace(/\s/g, '').length; const sentences = text.split(/[.!?]+/).filter((s) => s.trim()).length; const paras = text.split(/\n\s*\n/).filter((s) => s.trim()).length;
  return (<Wrap note="Your text is counted in your browser only - nothing is uploaded or stored. Reading time assumes about 200 words per minute.">
    <TextField fullWidth multiline rows={6} label="Paste or type your text" value={text} onChange={(e) => setText(e.target.value)} />
    <Rows rows={[['Words', fmt(words)], ['Characters (with spaces)', fmt(chars)], ['Characters (no spaces)', fmt(charsNoSpace)], ['Sentences', fmt(sentences)], ['Paragraphs', fmt(paras)], ['Reading time', words === 0 ? '0 min' : (words / 200 < 1 ? 'Under 1 min' : fmt(words / 200) + ' min')]]} />
  </Wrap>);
}

// Password generator - generated locally, never stored or sent.
export function PasswordTool() {
  const [len, setLen] = useState('16'); const [upper, setUpper] = useState(true); const [lower, setLower] = useState(true); const [nums, setNums] = useState(true); const [syms, setSyms] = useState(true); const [pwd, setPwd] = useState(''); const [copied, setCopied] = useState(false);
  const gen = () => {
    let pool = ''; if (upper) pool += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; if (lower) pool += 'abcdefghijklmnopqrstuvwxyz'; if (nums) pool += '0123456789'; if (syms) pool += '!@#$%^&*()-_=+';
    if (!pool) { setPwd(''); return; }
    const L = Math.min(Math.max(parseInt(len, 10) || 16, 1), 128); const lim = Math.floor(4294967296 / pool.length) * pool.length; const out = []; while (out.length < L) { const arr = new Uint32Array(L * 2); crypto.getRandomValues(arr); for (const n of arr) { if (out.length < L && n < lim) out.push(pool[n % pool.length]); } } setPwd(out.join('')); setCopied(false);
  };
  return (<Wrap note="Generated with your browser's secure random generator. It is never stored, never sent to a server, and never shown to anyone else. Use a password manager to save it - do not reuse it across sites.">
    <TextField fullWidth label="Length" type="number" value={len} onChange={(e) => setLen(e.target.value)} sx={{ mb: 2 }} />
    <ToggleButtonGroup value={''} sx={{ mb: 2, flexWrap: 'wrap' }}>
      <ToggleButton value="upper" selected={upper} onClick={() => setUpper(!upper)}>A-Z</ToggleButton>
      <ToggleButton value="lower" selected={lower} onClick={() => setLower(!lower)}>a-z</ToggleButton>
      <ToggleButton value="nums" selected={nums} onClick={() => setNums(!nums)}>0-9</ToggleButton>
      <ToggleButton value="syms" selected={syms} onClick={() => setSyms(!syms)}>Symbols</ToggleButton>
    </ToggleButtonGroup>
    <Button variant="contained" fullWidth onClick={gen} sx={{ mb: 2 }}>Generate Password</Button>
    {pwd && (<><TextField fullWidth value={pwd} InputProps={{ readOnly: true }} sx={{ mb: 1 }} /><Button variant="outlined" fullWidth onClick={() => { navigator.clipboard.writeText(pwd); setCopied(true); }}>{copied ? 'Copied!' : 'Copy Password'}</Button></>)}
  </Wrap>);
}

// CGPA calculator - grades + credit hours, plus CGPA to percentage.
export function CgpaTool() {
  const [rows, setRows] = useState([{ grade: '4.0', credits: '3' }, { grade: '3.7', credits: '3' }, { grade: '3.3', credits: '3' }]);
  const totalCredits = rows.reduce((s, r) => s + (parseFloat(r.credits) || 0), 0); const points = rows.reduce((s, r) => s + (parseFloat(r.grade) || 0) * (parseFloat(r.credits) || 0), 0); const cgpa = totalCredits > 0 ? points / totalCredits : 0;
  return (<Wrap note="CGPA = total grade points ÷ total credit hours. Grade points use the 4.0 scale (A = 4.0, A− = 3.7, B+ = 3.3, B = 3.0, etc.) - if your university uses a different scale, enter its grade points. Percentage = CGPA × 25 is only a rough conversion used by some universities; confirm with your university.">
    {rows.map((r, i) => (<Box key={i} sx={{ display: 'flex', gap: 1, mb: 1 }}>
      <TextField select fullWidth label="Grade point" value={r.grade} onChange={(e) => { const c = [...rows]; c[i].grade = e.target.value; setRows(c); }}>{['4.0', '3.7', '3.3', '3.0', '2.7', '2.3', '2.0', '1.7', '1.0', '0'].map((g) => (<MenuItem key={g} value={g}>{g}</MenuItem>))}</TextField>
      <TextField fullWidth label="Credit hours" type="number" value={r.credits} onChange={(e) => { const c = [...rows]; c[i].credits = e.target.value; setRows(c); }} />
    </Box>))}
    <Button variant="outlined" fullWidth onClick={() => setRows([...rows, { grade: '4.0', credits: '3' }])} sx={{ mb: 2 }}>Add Subject</Button>
    {totalCredits > 0 && (<><Hero value={fmt(cgpa)} unit="Your CGPA (4.0 scale)" /><Rows rows={[['Total credit hours', fmt(totalCredits)], ['Total grade points', fmt(points)], ['Rough percentage (CGPA × 25)', fmt(cgpa * 25) + '%']]} /></>)}
  </Wrap>);
}

// PNG to JPG - browser-only, white background for transparency.
export function PngToJpgTool() {
  const [url, setUrl] = useState(''); const [name, setName] = useState(''); const [err, setErr] = useState(''); const [busy, setBusy] = useState(false);
  const onFile = (f) => {
    if (!f) return; setErr(''); setUrl(''); setName(f.name.replace(/\.[^.]+$/, '') + '.jpg'); setBusy(true);
    const img = new Image(); const src = URL.createObjectURL(f); img.onload = () => {
      const c = document.createElement('canvas'); c.width = img.naturalWidth; c.height = img.naturalHeight; const ctx = c.getContext('2d'); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height); ctx.drawImage(img, 0, 0);
      c.toBlob((b) => { if (b) setUrl(URL.createObjectURL(b)); else setErr('Conversion failed in this browser.'); setBusy(false); }, 'image/jpeg', 0.92);
    }; img.onerror = () => { setErr('This file could not be decoded in this browser.'); setBusy(false); }; img.src = src;
  };
  return (<Wrap note="Private by design - your file never leaves your device. JPG has no transparency, so transparent areas become white.">
    <Button variant="contained" component="label" fullWidth sx={{ mb: 2 }}>{busy ? 'Converting…' : 'Choose PNG file'}<input type="file" hidden accept="image/png" onChange={(e) => onFile(e.target.files[0])} /></Button>
    {err && <Alert severity="warning" sx={{ mb: 2 }}>{err}</Alert>}
    {url && (<Box textAlign="center"><Typography variant="body1" sx={{ mb: 1 }}>Ready: {name}</Typography><Button variant="outlined" href={url} download={name}>Download JPG</Button></Box>)}
  </Wrap>);
}

// PDF to JPG - renders PDF pages in the browser via pdfjs-dist, downloads as JPGs.
export function PdfToJpgTool() {
  const [urls, setUrls] = useState([]); const [err, setErr] = useState(''); const [busy, setBusy] = useState(false);
  const onFile = async (f) => {
    if (!f) return; setErr(''); setUrls([]); setBusy(true);
    try {
      const pdfjs = await import('pdfjs-dist');
      pdfjs.GlobalWorkerOptions.workerSrc = (await import('pdfjs-dist/build/pdf.worker.min.mjs?url')).default;
      const buf = await f.arrayBuffer(); const doc = await pdfjs.getDocument({ data: buf }).promise; const out = [];
      for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i); const viewport = page.getViewport({ scale: 2 }); const canvas = document.createElement('canvas'); canvas.width = viewport.width; canvas.height = viewport.height;
        await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
        out.push(await new Promise((res) => canvas.toBlob((b) => res(URL.createObjectURL(b)), 'image/jpeg', 0.92)));
      }
      setUrls(out);
    } catch (e) { setErr('This PDF could not be rendered in this browser. Try a simpler PDF, or use a desktop PDF tool.'); }
    setBusy(false);
  };
  return (<Wrap note="Private by design - your PDF never leaves your device. Each page downloads as a separate JPG. Very large PDFs may be slow on a phone.">
    <Button variant="contained" component="label" fullWidth sx={{ mb: 2 }}>{busy ? 'Rendering…' : 'Choose PDF file'}<input type="file" hidden accept="application/pdf" onChange={(e) => onFile(e.target.files[0])} /></Button>
    {err && <Alert severity="warning" sx={{ mb: 2 }}>{err}</Alert>}
    {urls.length > 0 && (<Box>{urls.map((u, i) => (<Box key={i} sx={{ mb: 1, textAlign: 'center' }}><Button variant="outlined" href={u} download={`page-${i + 1}.jpg`}>Download Page {i + 1} JPG</Button></Box>))}</Box>)}
  </Wrap>);
}
