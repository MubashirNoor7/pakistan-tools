import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, TextField, Box, MenuItem, ToggleButton, ToggleButtonGroup, Alert, Button } from '@mui/material';
import { fmt, Hero, Rows } from './shared.jsx';
import { salaryTax } from './tax.jsx';
import { RATES } from '../rates.js';

function Wrap({ children, note }) {
  return (<><Card elevation={2} sx={{ borderRadius: 3 }}><CardContent sx={{ p: 3 }}>{children}</CardContent></Card>{note && <Alert severity="info" sx={{ mt: 2 }}>{note}</Alert>}</>);
}

// Rent vs Buy - net-cost + net-worth comparison. Buying: down payment + loan
// (EMI) + maintenance, minus ending equity (resale after selling costs, less
// remaining loan). Renting: rent with annual increase, minus the portfolio the
// renter builds by investing the down payment + the monthly amount the buyer
// spends more than the rent. Break-even = first year the buyer's NET cost
// (cash paid minus equity) is lower than the renter's NET cost (rent paid
// minus portfolio). Appreciation and investment return are ASSUMPTIONS -
// change them to test your own case. Worked check (defaults): 10-yr rent
// Rs 7,649,964; EMI Rs 154,606/mo; break-even year 19.
export function RentVsBuyTool() {
  const [rent, setRent] = useState('40000'); const [rentInc, setRentInc] = useState('10'); const [price, setPrice] = useState('10000000'); const [down, setDown] = useState('2000000'); const [loanRate, setLoanRate] = useState('20'); const [years, setYears] = useState('10'); const [maint, setMaint] = useState('50000'); const [appr, setAppr] = useState('5'); const [invRet, setInvRet] = useState('8'); const [sellCost, setSellCost] = useState('2');
  const r = parseFloat(rent) || 0; const ri = (parseFloat(rentInc) || 0) / 100; const p = parseFloat(price) || 0; const d = parseFloat(down) || 0; const lr = (parseFloat(loanRate) || 0) / 100 / 12; const y = parseFloat(years) || 0; const m = parseFloat(maint) || 0; const ap = (parseFloat(appr) || 0) / 100; const ir = (parseFloat(invRet) || 0) / 100; const sc = (parseFloat(sellCost) || 0) / 100;
  const loan = p - d; const n = y * 12; const monthlyPay = loan > 0 && lr > 0 ? loan * lr / (1 - Math.pow(1 + lr, -n)) : (loan > 0 ? loan / n : 0);
  const loanBal = (k) => { if (loan <= 0) return 0; const kk = Math.min(k, n); if (lr === 0) return Math.max(0, loan - monthlyPay * kk); return Math.max(0, loan * Math.pow(1 + lr, kk) - monthlyPay * (Math.pow(1 + lr, kk) - 1) / lr); };
  // Monthly simulation: the renter invests the down payment, then each month
  // the difference between what the buyer pays and the rent that month
  // (negative when rent is higher - the renter draws on the portfolio).
  const simulate = (horizonY) => {
    let rentTot = 0; let rentM = r; let port = d; let cash = d;
    for (let yy = 1; yy <= horizonY; yy++) {
      for (let mm = 0; mm < 12; mm++) {
        const buyerM = ((yy - 1) * 12 + mm < n ? monthlyPay : 0) + m / 12;
        rentTot += rentM; cash += buyerM; port = port * (1 + ir / 12) + (buyerM - rentM);
        if (mm === 11) rentM *= (1 + ri);
      }
    }
    const homeVal = p * Math.pow(1 + ap, horizonY); const resale = homeVal * (1 - sc); const rem = loanBal(horizonY * 12);
    const buyerWealth = resale - rem; const renterWealth = port;
    return { rentTot, cash, homeVal, resale, rem, buyerWealth, renterWealth, buyerNet: cash - buyerWealth, renterNet: rentTot - renterWealth };
  };
  let breakEven = null;
  if (y > 0) { for (let t = 1; t <= 30; t++) { if (simulate(t).buyerNet < simulate(t).renterNet) { breakEven = t; break; } } }
  const end = y > 0 ? simulate(y) : null;
  const verdict = end ? (end.buyerNet < end.renterNet ? 'Buying leaves you richer over this period' : 'Renting leaves you richer over this period') : '';
  return (<Wrap note="Estimate only. Home price rise (5%) and investment return (8%) are ASSUMPTIONS - example figures, change them. Loan rate 20% is an example rate - enter your bank's rate. The loan is spread over the years you enter. Selling costs come off the resale value.">
    <TextField fullWidth label="Monthly rent (Rs)" type="number" value={rent} onChange={(e) => setRent(e.target.value)} sx={{ mb: 2 }} />
    <TextField fullWidth label="Rent increase per year (%)" type="number" value={rentInc} onChange={(e) => setRentInc(e.target.value)} sx={{ mb: 2 }} />
    <TextField fullWidth label="House price (Rs)" type="number" value={price} onChange={(e) => setPrice(e.target.value)} sx={{ mb: 2 }} />
    <TextField fullWidth label="Down payment (Rs)" type="number" value={down} onChange={(e) => setDown(e.target.value)} sx={{ mb: 2 }} />
    <TextField fullWidth label="Loan interest rate (% per year) - example rate, enter your bank's rate" type="number" value={loanRate} onChange={(e) => setLoanRate(e.target.value)} sx={{ mb: 2 }} />
    <TextField fullWidth label="Years to compare" type="number" value={years} onChange={(e) => setYears(e.target.value)} sx={{ mb: 2 }} />
    <TextField fullWidth label="Maintenance per year (Rs)" type="number" value={maint} onChange={(e) => setMaint(e.target.value)} sx={{ mb: 2 }} />
    <TextField fullWidth label="Home price rise per year (%) - assumption, example 5%" type="number" value={appr} onChange={(e) => setAppr(e.target.value)} sx={{ mb: 2 }} />
    <TextField fullWidth label="Return if the renter invests the money (% per year) - assumption, example 8%" type="number" value={invRet} onChange={(e) => setInvRet(e.target.value)} sx={{ mb: 2 }} />
    <TextField fullWidth label="Selling costs when you sell (% of home value)" type="number" value={sellCost} onChange={(e) => setSellCost(e.target.value)} />
    {end && (<><Hero value={verdict} unit={`Buyer net cost Rs ${fmt(end.buyerNet)} vs Renter net cost Rs ${fmt(end.renterNet)}`} eq={breakEven ? 'Break-even year: Year ' + breakEven + ' - from then on, buying costs less overall' : 'No break-even within 30 years - renting costs less overall on these assumptions'} /><Rows rows={[['Total rent over ' + fmt(y) + ' years', 'Rs ' + fmt(end.rentTot)], ['Buyer cash paid (down + loan + maintenance)', 'Rs ' + fmt(end.cash)], ['Monthly loan payment', 'Rs ' + fmt(monthlyPay)], ['Home value after ' + fmt(y) + ' years', 'Rs ' + fmt(end.homeVal)], ['Resale value (after selling costs)', 'Rs ' + fmt(end.resale)], ['Remaining loan', 'Rs ' + fmt(end.rem)], ['Buyer ending wealth (resale - loan)', 'Rs ' + fmt(end.buyerWealth)], ['Renter ending wealth (invested money)', 'Rs ' + fmt(end.renterWealth)], ['Break-even year', breakEven ? 'Year ' + breakEven : 'None within 30 years']]} /></>)}
  </Wrap>);
}

// Tax Slab 2026-27 Finder - salaried slabs, Finance Act 2026 (same verified slabs as Salary Tax).
const SLABS = [
  ['Up to Rs 600,000', '0%', 600000], ['Rs 600,001 - 1,200,000', '1%', 1200000], ['Rs 1,200,001 - 2,200,000', '11% (Rs 6,000 + 11% above 1.2M)', 2200000], ['Rs 2,200,001 - 3,200,000', '20% (Rs 116,000 + 20% above 2.2M)', 3200000], ['Rs 3,200,001 - 4,100,000', '25% (Rs 316,000 + 25% above 3.2M)', 4100000], ['Rs 4,100,001 - 5,600,000', '29% (Rs 541,000 + 29% above 4.1M)', 5600000], ['Rs 5,600,001 - 7,000,000', '32% (Rs 976,000 + 32% above 5.6M)', 7000000], ['Above Rs 7,000,000', '35% (Rs 1,424,000 + 35% above 7M)', Infinity],
];
// 2025-26 salaried slabs (verified): 0% to 600k; 1% to 1.2M (fixed 0);
// 11% to 2.2M (6,000); 23% to 3.2M (116,000); 30% to 4.1M (346,000);
// 35% above (616,000); 9% surcharge above Rs 10M.
const SLABS_2526 = [
  ['Up to Rs 600,000', '0%', 600000], ['Rs 600,001 - 1,200,000', '1%', 1200000], ['Rs 1,200,001 - 2,200,000', '11% (Rs 6,000 + 11% above 1.2M)', 2200000], ['Rs 2,200,001 - 3,200,000', '23% (Rs 116,000 + 23% above 2.2M)', 3200000], ['Rs 3,200,001 - 4,100,000', '30% (Rs 346,000 + 30% above 3.2M)', 4100000], ['Above Rs 4,100,000', '35% (Rs 616,000 + 35% above 4.1M)', Infinity],
];
function tax2526(a) {
  let tax = 0;
  for (let i = 0; i < SLABS_2526.length; i++) {
    const limit = SLABS_2526[i][2]; const prev = i === 0 ? 0 : SLABS_2526[i - 1][2];
    const rate = [0, 0.01, 0.11, 0.23, 0.30, 0.35][i]; const fixed = [0, 0, 6000, 116000, 346000, 616000][i];
    if (a <= limit) { tax = fixed + rate * (a - prev); break; }
  }
  if (a > 10000000) tax *= 1.09;
  return tax;
}
export function TaxSlabTool() {
  const [annual, setAnnual] = useState('2400000'); const a = parseFloat(annual) || 0; const tax = salaryTax(a);
  const slab = SLABS.find(([_, __, max]) => a <= max) || SLABS[SLABS.length - 1];
  // Verified from the slabs: 200k/mo: 162,000 -> 156,000/yr; 300k/mo:
  // 466,000 -> 416,000 (save 50,000); 500k/mo: 1,281,000 -> 1,104,000
  // (save 177,000). Monthly figures are the annual tax / 12.
  const COMPARE_MO = [200000, 300000, 500000];
  return (<Wrap note="Salaried income only, Finance Act 2026 (2026-27). Surcharge abolished for salaried income. This is the slab table people search as 'tax slab 2026-27 pakistan' - enter your annual salary to find your slab and tax.">
    <TextField fullWidth label="Annual salary (Rs)" type="number" value={annual} onChange={(e) => setAnnual(e.target.value)} sx={{ mb: 2 }} />
    {a > 0 && (<><Hero value={slab[1]} unit={'Your slab: ' + slab[0]} eq={'Annual tax Rs ' + fmt(tax) + ' · Monthly Rs ' + fmt(tax / 12)} /><Rows rows={SLABS.map(([label, rate]) => [label, rate])} /></>)}
    <Typography variant="h6" component="h2" fontWeight={700} sx={{ mt: 3, mb: 1 }}>2025-26 vs 2026-27 - same salary, how much less tax?</Typography>
    <Rows rows={COMPARE_MO.map((mo) => { const an = mo * 12; const oldT = tax2526(an); const newT = salaryTax(an); return ['Rs ' + fmt(mo) + ' / month (Rs ' + fmt(an) + ' / year)', '2025-26: Rs ' + fmt(oldT) + '/yr (Rs ' + fmt(oldT / 12) + '/mo) → 2026-27: Rs ' + fmt(newT) + '/yr (Rs ' + fmt(newT / 12) + '/mo) · Save Rs ' + fmt(oldT - newT) + '/yr']; })} />
    <Typography variant="h6" component="h2" fontWeight={700} sx={{ mt: 3, mb: 1 }}>2025-26 slabs (last year)</Typography>
    <Rows rows={SLABS_2526.map(([label, rate]) => [label, rate])} />
    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>2025-26 had a 9% surcharge on tax for annual income above Rs 10,000,000 - included in the comparison above. In 2026-27 the surcharge is abolished for salaried income, and the 23% / 30% / 35% rates fell to 20% / 25% / 29% / 32%.</Typography>
  </Wrap>);
}

// Gold - 1 tola = 11.664 grams. Default 24K rate 10 Nov 2026: Rs 428,700 per tola
// (All-Pakistan Sarafa Association; live-market benchmark the same day showed
// about Rs 427,300, so the rate is EDITABLE).
export function GoldTool() {
  const [tolaRate, setTolaRate] = useState('428700'); const [qty, setQty] = useState('1'); const [unit, setUnit] = useState('tola'); const [purity, setPurity] = useState('24');
  const rate = parseFloat(tolaRate) || 0; const q = parseFloat(qty) || 0; const purityF = { 24: 1, 22: 0.916, 21: 0.875, 18: 0.75 }[purity];
  const tolas = unit === 'tola' ? q : unit === 'gram' ? q / 11.664 : q * 10 / 11.664;
  const value = tolas * rate * purityF;
  return (<Wrap note="Default rate is 10 Nov 2026, 24K Rs 428,700 per tola (Sarafa Association). Gold rates change daily and jewellers add making charges - edit the rate to today's sarafa rate for an exact value. This tool does NOT fetch live gold prices automatically.">
    <TextField fullWidth label="Gold rate - 24K, Rs per tola (editable)" type="number" value={tolaRate} onChange={(e) => setTolaRate(e.target.value)} sx={{ mb: 2 }} />
    <TextField select fullWidth label="Purity" value={purity} onChange={(e) => setPurity(e.target.value)} sx={{ mb: 2 }}>{['24', '22', '21', '18'].map((k) => (<MenuItem key={k} value={k}>{k} Karat</MenuItem>))}</TextField>
    <ToggleButtonGroup value={unit} exclusive fullWidth onChange={(_, nv) => nv && setUnit(nv)} sx={{ mb: 2 }}><ToggleButton value="tola">Tola</ToggleButton><ToggleButton value="gram">Gram</ToggleButton><ToggleButton value="10g">10 gram</ToggleButton></ToggleButtonGroup>
    <TextField fullWidth label={'Quantity (' + unit + ')'} type="number" value={qty} onChange={(e) => setQty(e.target.value)} />
    {q > 0 && (<><Hero value={'Rs ' + fmt(value)} unit={'Value of ' + fmt(q) + ' ' + unit + ' (' + purity + 'K)'} /><Rows rows={[['Per tola (24K)', 'Rs ' + fmt(rate)], ['Per tola (' + purity + 'K)', 'Rs ' + fmt(rate * purityF)], ['Per gram (' + purity + 'K)', 'Rs ' + fmt(rate * purityF / 11.664)], ['Per 10 gram (' + purity + 'K)', 'Rs ' + fmt(rate * purityF * 10 / 11.664)]]} /></>)}
    <Typography variant="h6" component="h2" fontWeight={700} sx={{ mt: 3, mb: 1 }}>Karat rates (rate as of 10 Nov 2026, Sarafa Association)</Typography>
    <Rows rows={[24, 22, 21, 18].flatMap((k) => { const f = k / 24; return [['' + k + 'K - per tola', 'Rs ' + fmt(rate * f)], ['' + k + 'K - per gram', 'Rs ' + fmt(rate * f / 11.664)], ['' + k + 'K - per 10 gram', 'Rs ' + fmt(rate * f * 10 / 11.664)]]; })} />
    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>Karat rates are the 24K rate above × the standard purity factor (22K = 22/24, 21K = 21/24, 18K = 18/24). 1 tola = 11.664 grams.</Typography>
  </Wrap>);
}

// Prize Bond - prize amounts (National Savings, 2026) + withholding tax 15% filer / 30% non-filer.
// This does NOT check whether your bond number won - winning numbers are only on official draw lists.
const BONDS = {
  100: { first: 700000, second: 200000, third: 1000, sCount: 3, tCount: 1199 },
  200: { first: 750000, second: 250000, third: 1250, sCount: 5, tCount: 2394 },
  750: { first: 1500000, second: 500000, third: 9300, sCount: 3, tCount: 1696 },
  1500: { first: 3000000, second: 1000000, third: 18500, sCount: 3, tCount: 1696 },
  7500: { first: 15000000, second: 5000000, third: 93000, sCount: 3, tCount: 1696 },
  15000: { first: 30000000, second: 10000000, third: 185000, sCount: 3, tCount: 1696 },
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

// JPG to PDF - browser-only, nothing uploaded. Uses jsPDF. Several images
// combine into ONE PDF (one image per page), reorder with up/down buttons,
// page size A4 / Letter / Original image size.
const PDF_SIZES = { A4: [595.28, 841.89], Letter: [612, 792] };
export function JpgToPdfTool() {
  const [imgs, setImgs] = useState([]); const [url, setUrl] = useState(''); const [name, setName] = useState(''); const [err, setErr] = useState(''); const [busy, setBusy] = useState(false); const [size, setSize] = useState('A4');
  const addFiles = async (files) => {
    setErr(''); const list = Array.from(files || []);
    for (const f of list) {
      try {
        const dataUrl = await new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsDataURL(f); });
        const dims = await new Promise((res, rej) => { const img = new Image(); img.onload = () => res([img.naturalWidth, img.naturalHeight]); img.onerror = rej; img.src = dataUrl; });
        setImgs((prev) => [...prev, { dataUrl, name: f.name, w: dims[0], h: dims[1] }]);
      } catch (e) { setErr('One image could not be read and was skipped.'); }
    }
  };
  const move = (i, dir) => { setImgs((prev) => { const a = [...prev]; const j = i + dir; if (j < 0 || j >= a.length) return prev; const t = a[i]; a[i] = a[j]; a[j] = t; return a; }); };
  const remove = (i) => { setImgs((prev) => prev.filter((_, k) => k !== i)); setUrl(''); };
  const build = async () => {
    if (!imgs.length) return; setErr(''); setUrl(''); setBusy(true);
    try {
      const { jsPDF } = await import('jspdf'); let pdf = null;
      imgs.forEach((im, idx) => {
        const [pw, ph] = size === 'Original' ? [im.w, im.h] : PDF_SIZES[size];
        if (idx === 0) pdf = new jsPDF({ unit: 'pt', format: [pw, ph] }); else pdf.addPage([pw, ph]);
        const margin = size === 'Original' ? 0 : 36; const scale = Math.min((pw - margin * 2) / im.w, (ph - margin * 2) / im.h);
        const dw = im.w * scale; const dh = im.h * scale;
        pdf.addImage(im.dataUrl, im.dataUrl.startsWith('data:image/png') ? 'PNG' : 'JPEG', (pw - dw) / 2, (ph - dh) / 2, dw, dh);
      });
      const blob = pdf.output('blob'); setUrl(URL.createObjectURL(blob)); setName('kalkio-images.pdf');
    } catch (e) { setErr('PDF conversion failed in this browser. (' + (e && e.message ? e.message : 'unknown error') + ')'); }
    setBusy(false);
  };
  return (<Wrap note="Private by design - your photos never leave your device. Conversion runs in your browser only, nothing is uploaded to a server.">
    <Button variant="contained" component="label" fullWidth sx={{ mb: 2 }}>Add JPG / PNG images<input type="file" hidden multiple accept="image/*" onChange={(e) => addFiles(e.target.files)} /></Button>
    <ToggleButtonGroup value={size} exclusive fullWidth onChange={(_, nv) => nv && setSize(nv)} sx={{ mb: 2 }}><ToggleButton value="A4">A4</ToggleButton><ToggleButton value="Letter">Letter</ToggleButton><ToggleButton value="Original">Original size</ToggleButton></ToggleButtonGroup>
    {imgs.length > 0 && (<Box sx={{ mb: 2 }}>{imgs.map((im, i) => (<Box key={im.name + i} display="flex" alignItems="center" gap={1} sx={{ mb: 1 }}><Typography variant="body2" sx={{ flexGrow: 1 }}>{i + 1}. {im.name}</Typography><Button size="small" variant="outlined" disabled={i === 0} onClick={() => move(i, -1)}>↑</Button><Button size="small" variant="outlined" disabled={i === imgs.length - 1} onClick={() => move(i, 1)}>↓</Button><Button size="small" variant="outlined" color="error" onClick={() => remove(i)}>✕</Button></Box>))}</Box>)}
    {err && <Alert severity="warning" sx={{ mb: 2 }}>{err}</Alert>}
    {imgs.length > 0 && (<Button variant="contained" color="success" fullWidth onClick={build} disabled={busy} sx={{ mb: 2 }}>{busy ? 'Making PDF…' : 'Make PDF (' + imgs.length + ' page' + (imgs.length > 1 ? 's' : '') + ')'}</Button>)}
    {url && (<Box textAlign="center"><Typography variant="body1" sx={{ mb: 1 }}>Ready: {name}</Typography><Button variant="outlined" href={url} download={name}>Download PDF</Button></Box>)}
    {!imgs.length && !err && <Typography variant="body2" color="text.secondary">Add one or more images. They combine into one PDF, one image per page, in the order shown - use ↑ ↓ to reorder.</Typography>}
  </Wrap>);
}

// Fuel Average - km per litre, litres per 100 km, cost per km, monthly
// budget from daily driving, and a Pakistan vehicle benchmark table
// (typical ranges published by PlanDrivo - your car will differ by road,
// load and driving style; no city/motorway split is claimed here).
const FUEL_BENCH = [['660cc kei car', '18–22 km/L'], ['1000cc hatchback', '15–19 km/L'], ['Sedan', '14–17 km/L'], ['Hybrid', '18–23 km/L'], ['SUV', '9–12 km/L']];
export function FuelAverageTool() {
  const [dist, setDist] = useState('100'); const [fuelUsed, setFuelUsed] = useState('8'); const [price, setPrice] = useState(String(RATES.petrol)); const [dailyKm, setDailyKm] = useState('30');
  useEffect(() => { fetch('/rates.json').then((r) => r.ok ? r.json() : null).then((j) => { if (j && j.petrol) setPrice(String(j.petrol)); }).catch(() => {}); }, []);
  const d = parseFloat(dist) || 0; const fu = parseFloat(fuelUsed) || 0; const pr = parseFloat(price) || 0; const dk = parseFloat(dailyKm) || 0;
  const kmpl = fu > 0 ? d / fu : 0; const l100 = d > 0 ? fu / d * 100 : 0; const costKm = d > 0 ? fu * pr / d : 0;
  const monthKm = dk * 30; const monthFuel = kmpl > 0 ? monthKm / kmpl : 0; const monthCost = monthFuel * pr;
  return (<Wrap note="Fill the tank, note the kilometres, fill again - the fuel you added is the fuel used. Default fuel price is the OGRA petrol rate (Rs 346.00, 7 Nov 2026), loaded from rates.json and editable.">
    <TextField fullWidth label="Distance travelled (km)" type="number" value={dist} onChange={(e) => setDist(e.target.value)} sx={{ mb: 2 }} />
    <TextField fullWidth label="Fuel used (litres)" type="number" value={fuelUsed} onChange={(e) => setFuelUsed(e.target.value)} sx={{ mb: 2 }} />
    <TextField fullWidth label="Fuel price (Rs per litre)" type="number" value={price} onChange={(e) => setPrice(e.target.value)} sx={{ mb: 2 }} />
    <TextField fullWidth label="Daily driving (km per day) - for the monthly budget" type="number" value={dailyKm} onChange={(e) => setDailyKm(e.target.value)} />
    {d > 0 && fu > 0 && (<><Hero value={fmt(kmpl) + ' km/L'} unit="Your fuel average" /><Rows rows={[['Litres per 100 km', fmt(l100) + ' L'], ['Cost per km', 'Rs ' + fmt(costKm)], ['Total fuel cost for this trip', 'Rs ' + fmt(fu * pr)], ['Monthly distance (30 days)', fmt(monthKm) + ' km'], ['Monthly fuel needed', fmt(monthFuel) + ' litres'], ['Monthly fuel budget', 'Rs ' + fmt(monthCost)]]} /></>)}
    <Typography variant="h6" component="h2" fontWeight={700} sx={{ mt: 3, mb: 1 }}>Typical fuel average by vehicle (Pakistan)</Typography>
    <Rows rows={FUEL_BENCH} />
    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>Typical ranges published by PlanDrivo. Compare your result above - if yours is far below the range, check tyre pressure, air filter and driving style.</Typography>
  </Wrap>);
}

// Currency Converter - live rates from a free no-key API, with a manual-rate fallback.
const CURS = ['USD', 'EUR', 'GBP', 'AED', 'SAR', 'PKR', 'INR'];
export function CurrencyTool() {
  const [amt, setAmt] = useState('100'); const [from, setFrom] = useState('USD'); const [to, setTo] = useState('PKR'); const [rates, setRates] = useState(null); const [manual, setManual] = useState('277'); const [updated, setUpdated] = useState('');
  useEffect(() => { fetch('https://api.exchangerate-api.com/v4/latest/USD').then((r) => r.ok ? r.json() : null).then((j) => { if (j && j.rates) { setRates(j.rates); setUpdated(new Date().toLocaleString('en-GB', { timeZone: 'Asia/Karachi', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' PKT'); } }).catch(() => {}); }, []);
  const a = parseFloat(amt) || 0; let out = null;
  if (rates && rates[from] && rates[to]) out = a / rates[from] * rates[to];
  else if (from === 'USD' && to === 'PKR') out = a * (parseFloat(manual) || 0);
  else if (from === 'PKR' && to === 'USD') out = a / (parseFloat(manual) || 1);
  const unitRate = rates && rates[from] && rates[to] ? rates[to] / rates[from] : (from === 'USD' && to === 'PKR' ? (parseFloat(manual) || 0) : (from === 'PKR' && to === 'USD' ? 1 / (parseFloat(manual) || 1) : null));
  return (<Wrap note={rates ? 'Live rates from exchangerate-api (USD base, updated by the provider). Rates change during the day - banks and exchangers add their own margin, so this is a guide, not a dealing rate.' : 'Live rates could not be fetched - enter the USD to PKR rate manually below. Other currency pairs need live rates.'}>
    <TextField fullWidth label="Amount" type="number" value={amt} onChange={(e) => setAmt(e.target.value)} sx={{ mb: 2 }} />
    <TextField select fullWidth label="From" value={from} onChange={(e) => setFrom(e.target.value)} sx={{ mb: 2 }}>{CURS.map((c) => (<MenuItem key={c} value={c}>{c}</MenuItem>))}</TextField>
    <TextField select fullWidth label="To" value={to} onChange={(e) => setTo(e.target.value)} sx={{ mb: 2 }}>{CURS.map((c) => (<MenuItem key={c} value={c}>{c}</MenuItem>))}</TextField>
    {!rates && <TextField fullWidth label="Manual USD to PKR rate" type="number" value={manual} onChange={(e) => setManual(e.target.value)} sx={{ mb: 2 }} />}
    {out !== null && (<><Hero value={fmt(out) + ' ' + to} unit={fmt(a) + ' ' + from + ' = '} /></>)}
    {unitRate !== null && (<Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>1 {from} = {fmt(unitRate)} {to} · {rates ? 'live rate, updated ' + updated : 'manual rate (live rate not available)'}</Typography>)}
    {from === 'USD' && to === 'PKR' && unitRate !== null && (<><Typography variant="h6" component="h2" fontWeight={700} sx={{ mt: 3, mb: 1 }}>Common amounts (USD → PKR)</Typography><Rows rows={[1, 5, 10, 50, 100, 1000].map((v) => ['$' + fmt(v), 'Rs ' + fmt(v * unitRate)])} /></>)}
    {out === null && <Typography variant="body2" color="warning.main" sx={{ mt: 2 }}>This pair needs live rates - check your internet connection and try again.</Typography>}
  </Wrap>);
}
