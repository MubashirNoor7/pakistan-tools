import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, TextField, Box, MenuItem, ToggleButton, ToggleButtonGroup, Alert, Button } from '@mui/material';
import { fmt, Hero, Rows } from './shared.jsx';
import { salaryTax } from './tax.jsx';

function Wrap({ children, note }) {
  return (<><Card elevation={2} sx={{ borderRadius: 3 }}><CardContent sx={{ p: 3 }}>{children}</CardContent></Card>{note && <Alert severity="info" sx={{ mt: 2 }}>{note}</Alert>}</>);
}

// Rent vs Buy - compare total cost of renting vs buying over N years.
// Buying: down payment + loan (monthly payment formula) + maintenance. Renting: rent with annual increase.
export function RentVsBuyTool() {
  const [rent, setRent] = useState('40000'); const [rentInc, setRentInc] = useState('10'); const [price, setPrice] = useState('10000000'); const [down, setDown] = useState('2000000'); const [loanRate, setLoanRate] = useState('20'); const [years, setYears] = useState('10'); const [maint, setMaint] = useState('50000');
  const r = parseFloat(rent) || 0; const ri = (parseFloat(rentInc) || 0) / 100; const p = parseFloat(price) || 0; const d = parseFloat(down) || 0; const lr = (parseFloat(loanRate) || 0) / 100 / 12; const y = parseFloat(years) || 0; const m = parseFloat(maint) || 0;
  let rentTotal = 0; let monthlyRent = r;
  for (let i = 0; i < y; i++) { rentTotal += monthlyRent * 12; monthlyRent *= (1 + ri); }
  const loan = p - d; const n = y * 12; const monthlyPay = loan > 0 && lr > 0 ? loan * lr / (1 - Math.pow(1 + lr, -n)) : (loan > 0 ? loan / n : 0);
  const buyTotal = d + monthlyPay * n + m * y;
  const cheaper = rentTotal < buyTotal ? 'Renting is cheaper over this period' : 'Buying is cheaper over this period';
  return (<Wrap note="Estimate only - house price growth, resale value and tax are NOT included here. Buying looks better if the house value rises; renting looks better if rent stays low. Change the years, loan rate and rent increase to test your own case.">
    <TextField fullWidth label="Monthly rent (Rs)" type="number" value={rent} onChange={(e) => setRent(e.target.value)} sx={{ mb: 2 }} />
    <TextField fullWidth label="Rent increase per year (%)" type="number" value={rentInc} onChange={(e) => setRentInc(e.target.value)} sx={{ mb: 2 }} />
    <TextField fullWidth label="House price (Rs)" type="number" value={price} onChange={(e) => setPrice(e.target.value)} sx={{ mb: 2 }} />
    <TextField fullWidth label="Down payment (Rs)" type="number" value={down} onChange={(e) => setDown(e.target.value)} sx={{ mb: 2 }} />
    <TextField fullWidth label="Loan interest rate (% per year)" type="number" value={loanRate} onChange={(e) => setLoanRate(e.target.value)} sx={{ mb: 2 }} />
    <TextField fullWidth label="Years to compare" type="number" value={years} onChange={(e) => setYears(e.target.value)} sx={{ mb: 2 }} />
    <TextField fullWidth label="Maintenance per year (Rs)" type="number" value={maint} onChange={(e) => setMaint(e.target.value)} />
    {y > 0 && (<><Hero value={cheaper} unit={`Rent total Rs ${fmt(rentTotal)} vs Buy total Rs ${fmt(buyTotal)}`} /><Rows rows={[['Total rent over ' + fmt(y) + ' years', 'Rs ' + fmt(rentTotal)], ['Total buying cost (down + loan + maintenance)', 'Rs ' + fmt(buyTotal)], ['Monthly loan payment', 'Rs ' + fmt(monthlyPay)], ['Loan amount', 'Rs ' + fmt(loan)]]} /></>)}
  </Wrap>);
}

// Tax Slab 2026-27 Finder - salaried slabs, Finance Act 2026 (same verified slabs as Salary Tax).
const SLABS = [
  ['Up to Rs 600,000', '0%', 600000], ['Rs 600,001 - 1,200,000', '1%', 1200000], ['Rs 1,200,001 - 2,200,000', '11% (Rs 6,000 + 11% above 1.2M)', 2200000], ['Rs 2,200,001 - 3,200,000', '20% (Rs 116,000 + 20% above 2.2M)', 3200000], ['Rs 3,200,001 - 4,100,000', '25% (Rs 316,000 + 25% above 3.2M)', 4100000], ['Rs 4,100,001 - 5,600,000', '29% (Rs 541,000 + 29% above 4.1M)', 5600000], ['Rs 5,600,001 - 7,000,000', '32% (Rs 976,000 + 32% above 5.6M)', 7000000], ['Above Rs 7,000,000', '35% (Rs 1,424,000 + 35% above 7M)', Infinity],
];
export function TaxSlabTool() {
  const [annual, setAnnual] = useState('2400000'); const a = parseFloat(annual) || 0; const tax = salaryTax(a);
  const slab = SLABS.find(([_, __, max]) => a <= max) || SLABS[SLABS.length - 1];
  return (<Wrap note="Salaried income only, Finance Act 2026 (2026-27). Surcharge abolished for salaried income. This is the slab table people search as 'tax slab 2026-27 pakistan' - enter your annual salary to find your slab and tax.">
    <TextField fullWidth label="Annual salary (Rs)" type="number" value={annual} onChange={(e) => setAnnual(e.target.value)} sx={{ mb: 2 }} />
    {a > 0 && (<><Hero value={slab[1]} unit={'Your slab: ' + slab[0]} eq={'Annual tax Rs ' + fmt(tax) + ' · Monthly Rs ' + fmt(tax / 12)} /><Rows rows={SLABS.map(([label, rate]) => [label, rate])} /></>)}
  </Wrap>);
}

// Gold - 1 tola = 11.664 grams. Default 24K rate 6 Nov 2026: Rs 435,636 per tola
// (All-Pakistan Sarafa Association; live-market sites the same day showed
// Rs 427,598, so the rate is EDITABLE).
export function GoldTool() {
  const [tolaRate, setTolaRate] = useState('435636'); const [qty, setQty] = useState('1'); const [unit, setUnit] = useState('tola'); const [purity, setPurity] = useState('24');
  const rate = parseFloat(tolaRate) || 0; const q = parseFloat(qty) || 0; const purityF = { 24: 1, 22: 0.916, 21: 0.875, 18: 0.75 }[purity];
  const tolas = unit === 'tola' ? q : unit === 'gram' ? q / 11.664 : q * 10 / 11.664;
  const value = tolas * rate * purityF;
  return (<Wrap note="Default rate is 6 Nov 2026, 24K Rs 435,636 per tola (Sarafa Association). Gold rates change daily and jewellers add making charges - edit the rate to today's sarafa rate for an exact value. This tool does NOT fetch live gold prices automatically.">
    <TextField fullWidth label="Gold rate - 24K, Rs per tola (editable)" type="number" value={tolaRate} onChange={(e) => setTolaRate(e.target.value)} sx={{ mb: 2 }} />
    <TextField select fullWidth label="Purity" value={purity} onChange={(e) => setPurity(e.target.value)} sx={{ mb: 2 }}>{['24', '22', '21', '18'].map((k) => (<MenuItem key={k} value={k}>{k} Karat</MenuItem>))}</TextField>
    <ToggleButtonGroup value={unit} exclusive fullWidth onChange={(_, nv) => nv && setUnit(nv)} sx={{ mb: 2 }}><ToggleButton value="tola">Tola</ToggleButton><ToggleButton value="gram">Gram</ToggleButton><ToggleButton value="10g">10 gram</ToggleButton></ToggleButtonGroup>
    <TextField fullWidth label={'Quantity (' + unit + ')'} type="number" value={qty} onChange={(e) => setQty(e.target.value)} />
    {q > 0 && (<><Hero value={'Rs ' + fmt(value)} unit={'Value of ' + fmt(q) + ' ' + unit + ' (' + purity + 'K)'} /><Rows rows={[['Per tola (24K)', 'Rs ' + fmt(rate)], ['Per tola (' + purity + 'K)', 'Rs ' + fmt(rate * purityF)], ['Per gram (' + purity + 'K)', 'Rs ' + fmt(rate * purityF / 11.664)], ['Per 10 gram (' + purity + 'K)', 'Rs ' + fmt(rate * purityF * 10 / 11.664)]]} /></>)}
  </Wrap>);
}

// Prize Bond - prize amounts (National Savings, 2026) + withholding tax 15% filer / 30% non-filer.
// This does NOT check whether your bond number won - winning numbers are only on official draw lists.
const BONDS = {
  100: { first: 700000, second: 200000, third: 1000, sCount: 3, tCount: 1199 },
  200: { first: 750000, second: 250000, third: 1250, sCount: 5, tCount: 2394 },
  750: { first: 1500000, second: 500000, third: 9300, sCount: 3, tCount: 1696 },
  1500: { first: 3000000, second: 1000000, third: 18500, sCount: 3, tCount: 1696 },
  25000: { first: 30000000, second: 10000000, third: 300000, sCount: 5, tCount: 700 },
  40000: { first: 80000000, second: 30000000, third: 500000, sCount: 3, tCount: 660 },
};
export function PrizeBondTool() {
  const [denom, setDenom] = useState('750'); const [tier, setTier] = useState('first'); const [filer, setFiler] = useState('filer');
  const b = BONDS[denom]; const gross = b[tier]; const taxRate = filer === 'filer' ? 0.15 : 0.30; const tax = gross * taxRate; const net = gross - tax;
  return (<Wrap note="IMPORTANT: this tool does NOT check if your bond won. It only calculates how much you keep IF you win. Winning numbers are published in official draw lists (National Savings / State Bank) - check your number there, then use this tool for the after-tax amount. Tax: 15% filer, 30% non-filer (National Savings).">
    <TextField select fullWidth label="Prize Bond denomination (Rs)" value={denom} onChange={(e) => setDenom(e.target.value)} sx={{ mb: 2 }}>{Object.keys(BONDS).map((d) => (<MenuItem key={d} value={d}>Rs {fmt(parseInt(d, 10))}{d === '25000' || d === '40000' ? ' (Premium)' : ''}</MenuItem>))}</TextField>
    <ToggleButtonGroup value={tier} exclusive fullWidth onChange={(_, nv) => nv && setTier(nv)} sx={{ mb: 2 }}><ToggleButton value="first">1st Prize</ToggleButton><ToggleButton value="second">2nd Prize</ToggleButton><ToggleButton value="third">3rd Prize</ToggleButton></ToggleButtonGroup>
    <ToggleButtonGroup value={filer} exclusive fullWidth onChange={(_, nv) => nv && setFiler(nv)} sx={{ mb: 2 }}><ToggleButton value="filer">Filer (15% tax)</ToggleButton><ToggleButton value="nonfiler">Non-filer (30% tax)</ToggleButton></ToggleButtonGroup>
    <Hero value={'Rs ' + fmt(net)} unit="You keep after tax" />
    <Rows rows={[['Gross prize', 'Rs ' + fmt(gross)], ['Withholding tax (' + fmt(taxRate * 100) + '%)', 'Rs ' + fmt(tax)], ['1st prize (this bond)', 'Rs ' + fmt(b.first)], ['2nd prize (×' + b.sCount + ')', 'Rs ' + fmt(b.second)], ['3rd prize (×' + b.tCount + ')', 'Rs ' + fmt(b.third)]]} />
  </Wrap>);
}

// JPG to PDF - browser-only, nothing uploaded. Uses jsPDF.
export function JpgToPdfTool() {
  const [url, setUrl] = useState(''); const [name, setName] = useState(''); const [err, setErr] = useState(''); const [busy, setBusy] = useState(false);
  const onFile = async (f) => {
    if (!f) return; setErr(''); setUrl(''); setBusy(true);
    try {
      const { jsPDF } = await import('jspdf');
      const dataUrl = await new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsDataURL(f); });
      const img = new Image(); img.onload = () => {
        const w = img.naturalWidth; const h = img.naturalHeight; const pdf = new jsPDF({ unit: 'pt', format: [w, h] });
        pdf.addImage(dataUrl, 'JPEG', 0, 0, w, h); const blob = pdf.output('blob'); setUrl(URL.createObjectURL(blob)); setName(f.name.replace(/\.[^.]+$/, '') + '.pdf'); setBusy(false);
      }; img.onerror = () => { setErr('This image could not be read in this browser.'); setBusy(false); }; img.src = dataUrl;
    } catch (e) { setErr('PDF conversion failed in this browser.'); setBusy(false); }
  };
  return (<Wrap note="Private by design - your photo never leaves your device. Conversion runs in your browser only, nothing is uploaded to a server.">
    <Button variant="contained" component="label" fullWidth sx={{ mb: 2 }}>{busy ? 'Converting…' : 'Choose JPG / PNG image'}<input type="file" hidden accept="image/*" onChange={(e) => onFile(e.target.files[0])} /></Button>
    {err && <Alert severity="warning" sx={{ mb: 2 }}>{err}</Alert>}
    {url && (<Box textAlign="center"><Typography variant="body1" sx={{ mb: 1 }}>Ready: {name}</Typography><Button variant="outlined" href={url} download={name}>Download PDF</Button></Box>)}
    {!url && !err && <Typography variant="body2" color="text.secondary">Select an image. The PDF downloads to your device, one image per page.</Typography>}
  </Wrap>);
}

// Fuel Average - km per litre, litres per 100 km, cost per km.
export function FuelAverageTool() {
  const [dist, setDist] = useState('100'); const [fuelUsed, setFuelUsed] = useState('8'); const [price, setPrice] = useState('352.59');
  const d = parseFloat(dist) || 0; const fu = parseFloat(fuelUsed) || 0; const pr = parseFloat(price) || 0;
  const kmpl = fu > 0 ? d / fu : 0; const l100 = d > 0 ? fu / d * 100 : 0; const costKm = d > 0 ? fu * pr / d : 0;
  return (<Wrap note="Fill the tank, note the kilometres, fill again - the fuel you added is the fuel used. Default fuel price is 6 Nov 2026 OGRA petrol Rs 352.59, editable.">
    <TextField fullWidth label="Distance travelled (km)" type="number" value={dist} onChange={(e) => setDist(e.target.value)} sx={{ mb: 2 }} />
    <TextField fullWidth label="Fuel used (litres)" type="number" value={fuelUsed} onChange={(e) => setFuelUsed(e.target.value)} sx={{ mb: 2 }} />
    <TextField fullWidth label="Fuel price (Rs per litre)" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
    {d > 0 && fu > 0 && (<><Hero value={fmt(kmpl) + ' km/L'} unit="Your fuel average" /><Rows rows={[['Litres per 100 km', fmt(l100) + ' L'], ['Cost per km', 'Rs ' + fmt(costKm)], ['Total fuel cost for this trip', 'Rs ' + fmt(fu * pr)]]} /></>)}
  </Wrap>);
}

// Currency Converter - live rates from a free no-key API, with a manual-rate fallback.
const CURS = ['USD', 'EUR', 'GBP', 'AED', 'SAR', 'PKR', 'INR'];
export function CurrencyTool() {
  const [amt, setAmt] = useState('100'); const [from, setFrom] = useState('USD'); const [to, setTo] = useState('PKR'); const [rates, setRates] = useState(null); const [manual, setManual] = useState('277');
  useEffect(() => { fetch('https://api.exchangerate-api.com/v4/latest/USD').then((r) => r.ok ? r.json() : null).then((j) => { if (j && j.rates) setRates(j.rates); }).catch(() => {}); }, []);
  const a = parseFloat(amt) || 0; let out = null;
  if (rates && rates[from] && rates[to]) out = a / rates[from] * rates[to];
  else if (from === 'USD' && to === 'PKR') out = a * (parseFloat(manual) || 0);
  else if (from === 'PKR' && to === 'USD') out = a / (parseFloat(manual) || 1);
  return (<Wrap note={rates ? 'Live rates from exchangerate-api (USD base, updated by the provider). Rates change during the day - banks and exchangers add their own margin, so this is a guide, not a dealing rate.' : 'Live rates could not be fetched - enter the USD to PKR rate manually below. Other currency pairs need live rates.'}>
    <TextField fullWidth label="Amount" type="number" value={amt} onChange={(e) => setAmt(e.target.value)} sx={{ mb: 2 }} />
    <TextField select fullWidth label="From" value={from} onChange={(e) => setFrom(e.target.value)} sx={{ mb: 2 }}>{CURS.map((c) => (<MenuItem key={c} value={c}>{c}</MenuItem>))}</TextField>
    <TextField select fullWidth label="To" value={to} onChange={(e) => setTo(e.target.value)} sx={{ mb: 2 }}>{CURS.map((c) => (<MenuItem key={c} value={c}>{c}</MenuItem>))}</TextField>
    {!rates && <TextField fullWidth label="Manual USD to PKR rate" type="number" value={manual} onChange={(e) => setManual(e.target.value)} sx={{ mb: 2 }} />}
    {out !== null && (<><Hero value={fmt(out) + ' ' + to} unit={fmt(a) + ' ' + from + ' = '} /></>)}
    {out === null && <Typography variant="body2" color="warning.main" sx={{ mt: 2 }}>This pair needs live rates - check your internet connection and try again.</Typography>}
  </Wrap>);
}
