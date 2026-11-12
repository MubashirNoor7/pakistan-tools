import React, { useState, useEffect } from 'react';
import { RATES, fuelAgeDays } from '../rates.js';
import { Card, CardContent, Typography, TextField, Box, MenuItem, ToggleButton, ToggleButtonGroup, Alert, Button, Link, Slider } from '@mui/material';
import { fmt, Hero, Rows } from './shared.jsx';

function Wrap({ children, note }) {
  return (<><Card elevation={2} sx={{ borderRadius: 3 }}><CardContent sx={{ p: 3 }}>{children}</CardContent></Card>{note && <Alert severity="info" sx={{ mt: 2 }}>{note}</Alert>}</>);
}
// Electricity 2026 - NEPRA SRO 279(I)/2026, effective 12 Feb 2026. Key correction:
// Protected = slab-by-slab (telescopic) up to 200 units. Unprotected = rate of the slab reached
// applied to EVERY unit (not telescopic). Lifeline = up to 100 units, no fixed charge.
// GST 18% is added; FPA (fuel adjustment, varies monthly) is an editable input, default 0.
const UNPROT = [[100, 22.44, 275], [200, 28.91, 300], [300, 33.10, 350], [400, 36.46, 400], [500, 38.95, 500], [600, 40.22, 675], [700, 41.85, 675], [Infinity, 47.20, 675]];
export function ElectricityTool() {
  const [disco, setDisco] = useState('LESCO'); const [cat, setCat] = useState('unprotected'); const [units, setUnits] = useState('300'); const [load, setLoad] = useState('1'); const [fpa, setFpa] = useState('0');
  const u = parseFloat(units) || 0; const kw = parseFloat(load) || 0; const fpaR = parseFloat(fpa) || 0;
  let energy = 0; let fixed = 0; let note = ''; let parts = [];
  if (cat === 'lifeline') {
    if (u <= 100) { energy = u <= 50 ? u * 3.95 : 50 * 3.95 + (u - 50) * 7.74; parts = [['Energy charges (lifeline)', 'Rs ' + fmt(energy)]]; }
    else { const b = UNPROT.find(([max]) => u <= max); energy = u * b[1]; fixed = kw * b[2]; parts = [['Unprotected rate applied to all units (lifeline ended at 100)', `Rs ${fmt(b[1])} × ${fmt(u)}`]]; note = 'Lifeline is only up to 100 units - above 100 the bill is calculated at unprotected rates, NOT at lifeline rates.'; }
  } else if (cat === 'protected') {
    if (u > 200) { note = 'Above 200 units you lose protected status - calculated here at unprotected rates.'; const b = UNPROT.find(([max]) => u <= max); energy = u * b[1]; fixed = kw * b[2]; parts = [['Unprotected rate applied to all units', `Rs ${fmt(b[1])} × ${fmt(u)}`]]; }
    else { energy = u <= 100 ? u * 10.54 : 100 * 10.54 + (u - 100) * 13.01; fixed = kw * (u <= 100 ? 200 : 300); parts = [['Energy charges (slab by slab)', 'Rs ' + fmt(energy)]]; }
  } else {
    const b = UNPROT.find(([max]) => u <= max); energy = u * b[1]; fixed = kw * b[2]; parts = [['Rate for your slab, on all units', `Rs ${fmt(b[1])} × ${fmt(u)}`]];
  }
  const fpaAmt = u * fpaR; const sub = energy + fixed + fpaAmt; const gst = sub * 0.18; const total = sub + gst;
  return (<Wrap note="Estimate only - base tariff SRO 279(I)/2026. Fixed charge is per kW of sanctioned load. GST 18% included below; FPA changes monthly and is editable. This estimate is before the FC surcharge (about Rs 3.23 per unit), electricity duty (about 1.5%) and the Rs 35 TV fee, and FCA/QTA change monthly. Your actual bill also depends on arrears, meter rent and other adjustments.">
    <TextField select fullWidth label="DISCO" value={disco} onChange={(e) => setDisco(e.target.value)} sx={{ mb: 2 }}>{['LESCO', 'K-Electric', 'IESCO', 'GEPCO', 'FESCO', 'MEPCO', 'PESCO', 'HESCO', 'SEPCO', 'QESCO'].map((d) => (<MenuItem key={d} value={d}>{d}</MenuItem>))}</TextField>
    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>NEPRA's base tariff is uniform across DISCOs - changing DISCO does NOT change the rate, it only labels your bill. That is why the calculation stays the same.</Typography>
    <ToggleButtonGroup value={cat} exclusive fullWidth onChange={(_, nv) => nv && setCat(nv)} sx={{ mb: 2 }}><ToggleButton value="lifeline">Lifeline</ToggleButton><ToggleButton value="protected">Protected</ToggleButton><ToggleButton value="unprotected">Unprotected</ToggleButton></ToggleButtonGroup>
    <TextField fullWidth label="Units used (kWh)" type="number" value={units} onChange={(e) => setUnits(e.target.value)} sx={{ mb: 2 }} />
    <TextField fullWidth label="Sanctioned load (kW) - for fixed charge" type="number" value={load} onChange={(e) => setLoad(e.target.value)} sx={{ mb: 2 }} />
    <TextField fullWidth label="Fuel Price Adjustment (Rs per unit, 0 if unknown)" type="number" value={fpa} onChange={(e) => setFpa(e.target.value)} />
    {u > 0 && (<><Hero value={'Rs ' + fmt(total)} unit="Estimated total bill (incl. 18% GST)" eq={`${fmt(u)} units · ${disco} · ${cat}`} /><Rows rows={[...parts, ['Fixed charge', 'Rs ' + fmt(fixed)], ['FPA', 'Rs ' + fmt(fpaAmt)], ['GST (18%)', 'Rs ' + fmt(gst)]]} /></>)}
    {note && <Typography variant="body2" color="warning.main" sx={{ mt: 2 }}>{note}</Typography>}
    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>Checks: Protected 150 units = 100×10.54 + 50×13.01 = Rs 1,704.50 energy. Unprotected 150 units = 150×28.91 = Rs 4,336.50 energy.</Typography>
  </Wrap>);
}
// Sui Gas 2026-27 - OGRA Gas Sale Price Notification 29 Jun 2025, effective 1 Jul 2025,
// unchanged for FY 2026-27. Same slabs for SNGPL and SSGC. Price is per MMBTU;
// the meter reads hm3, so hm3 x GCV factor (default 3.5 MMBTU per hm3) gives MMBTU.
// One-preceding-slab benefit: use up to the previous slab boundary bills at the
// previous rate, only the excess at the landed rate. Above 4 hm3 (non-protected)
// the whole month bills at Rs 4,200 per MMBTU. GST 18% on the subtotal.
const GAS_PROT = [[0.25, 200], [0.5, 250], [0.6, 300], [0.9, 350]];
const GAS_NONPROT = [[0.25, 500], [0.6, 850], [1, 1250], [1.5, 1450], [2, 1900], [3, 3300], [4, 3800]];
export function GasTool() {
  const [utility, setUtility] = useState('SNGPL'); const [cat, setCat] = useState('nonprotected'); const [hm3, setHm3] = useState('1'); const [gcv, setGcv] = useState('3.5');
  const use = parseFloat(hm3) || 0; const factor = parseFloat(gcv) || 0; const mmbtu = use * factor;
  let energy = 0; let fixed = 0; let parts = []; let note = '';
  const slabEnergy = (slabs, landed) => {
    if (landed === 0) return { e: mmbtu * slabs[0][1], rows: [[`All ${fmt(mmbtu)} MMBTU at Rs ${fmt(slabs[0][1])}`, 'Rs ' + fmt(mmbtu * slabs[0][1])]] };
    const prevB = slabs[landed - 1][0]; const prevR = slabs[landed - 1][1]; const first = prevB * factor * prevR; const rest = (use - prevB) * factor * slabs[landed][1];
    return { e: first + rest, rows: [[`First ${fmt(prevB)} hm3 (${fmt(prevB * factor)} MMBTU) at Rs ${fmt(prevR)}`, 'Rs ' + fmt(first)], [`Remaining ${fmt(use - prevB)} hm3 (${fmt((use - prevB) * factor)} MMBTU) at Rs ${fmt(slabs[landed][1])}`, 'Rs ' + fmt(rest)]] };
  };
  if (cat === 'protected') {
    if (use > 0.9) { note = 'Above 0.9 hm3 a month you are non-protected - calculated here at non-protected rates.'; const landed = GAS_NONPROT.findIndex(([max]) => use <= max); if (landed === -1) { energy = mmbtu * 4200; parts = [[`All ${fmt(mmbtu)} MMBTU at Rs 4,200 (flat above 4 hm3)`, 'Rs ' + fmt(energy)]]; } else { const r = slabEnergy(GAS_NONPROT, landed); energy = r.e; parts = r.rows; } fixed = use <= 1.5 ? 1500 : 3000; }
    else { const landed = GAS_PROT.findIndex(([max]) => use <= max); const r = slabEnergy(GAS_PROT, landed); energy = r.e; parts = r.rows; fixed = 600; }
  } else {
    if (use > 4) { energy = mmbtu * 4200; parts = [[`All ${fmt(mmbtu)} MMBTU at Rs 4,200 (flat above 4 hm3)`, 'Rs ' + fmt(energy)]]; }
    else { const landed = GAS_NONPROT.findIndex(([max]) => use <= max); const r = slabEnergy(GAS_NONPROT, landed); energy = r.e; parts = r.rows; }
    fixed = use <= 1.5 ? 1500 : 3000;
  }
  const meter = 40; const sub = energy + fixed + meter; const gst = sub * 0.18; const total = sub + gst;
  return (<Wrap note="Estimate only - OGRA Gas Sale Price Notification 29 Jun 2025, effective 1 Jul 2025, unchanged for FY 2026-27; SSGC Domestic Rates page. Same slabs for SNGPL and SSGC. New connections are on the RLNG tariff, not these slabs. Protected status is set by your Nov-Feb average use, not by one month.">
    <TextField select fullWidth label="Gas utility" value={utility} onChange={(e) => setUtility(e.target.value)} sx={{ mb: 2 }}>{['SNGPL', 'SSGC'].map((u) => (<MenuItem key={u} value={u}>{u}</MenuItem>))}</TextField>
    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>SNGPL and SSGC charge the same domestic slabs - changing the utility does not change the rate, it only labels your bill.</Typography>
    <ToggleButtonGroup value={cat} exclusive fullWidth onChange={(_, nv) => nv && setCat(nv)} sx={{ mb: 2 }}><ToggleButton value="protected">Protected</ToggleButton><ToggleButton value="nonprotected">Non-protected</ToggleButton></ToggleButtonGroup>
    <TextField fullWidth label="Gas used this month (hm3)" type="number" value={hm3} onChange={(e) => setHm3(e.target.value)} sx={{ mb: 2 }} />
    <TextField fullWidth label="GCV factor (MMBTU per hm3, from your bill)" type="number" value={gcv} onChange={(e) => setGcv(e.target.value)} />
    {use > 0 && factor > 0 && (<><Hero value={'Rs ' + fmt(total)} unit="Estimated monthly gas bill (incl. 18% GST)" eq={`${fmt(use)} hm3 = ${fmt(mmbtu)} MMBTU · ${utility} · ${cat === 'protected' ? 'Protected' : 'Non-protected'}`} /><Rows rows={[...parts, ['Energy charge', 'Rs ' + fmt(energy)], ['Fixed charge', 'Rs ' + fmt(fixed)], ['Meter rent', 'Rs ' + fmt(meter)], ['GST (18%)', 'Rs ' + fmt(gst)]]} /></>)}
    {note && <Typography variant="body2" color="warning.main" sx={{ mt: 2 }}>{note}</Typography>}
    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>Check: non-protected 1.0 hm3 at 3.5 MMBTU per hm3 = energy Rs 3,535 + fixed Rs 1,500 + meter Rs 40 = Rs 5,075 + 18% GST Rs 913.50 = Rs 5,988.50.</Typography>
  </Wrap>);
}
export function FuelTool() {
  const [dist, setDist] = useState('100'); const [mile, setMile] = useState('12'); const [fuel, setFuel] = useState('petrol'); const [rate, setRate] = useState(String(RATES.petrol)); const [rateDate, setRateDate] = useState(RATES.fuelUpdated); const [fetched, setFetched] = useState(null); const [rateSrc, setRateSrc] = useState(RATES.fuelSource); const [roundTrip, setRoundTrip] = useState(false);
  useEffect(() => { fetch('/rates.json').then((r) => r.ok ? r.json() : null).then((j) => { if (j && j.petrol) { setFetched(j); setRate(String(j.petrol)); setRateDate(j.fuelUpdated || rateDate); setRateSrc(j.fuelSource || rateSrc); } }).catch(() => {}); }, []);
  const d = parseFloat(dist) || 0; const m = parseFloat(mile) || 0; const r = parseFloat(rate) || 0; const effD = roundTrip ? d * 2 : d; const litres = m > 0 ? effD / m : 0; const cost = litres * r;
  return (<Wrap note="Fuel rates change often. Defaults are the 7 Nov 2026 OGRA notified rates (petrol Rs 346.00, diesel Rs 378.00), loaded from rates.json so they can be updated without rebuilding the app. Edit the rate to today's OGRA rate for an exact trip cost.">
    <ToggleButtonGroup value={fuel} exclusive fullWidth onChange={(_, nv) => { if (nv) { setFuel(nv); setRate(nv === 'petrol' ? String(fetched ? fetched.petrol : RATES.petrol) : String(fetched ? fetched.diesel : RATES.diesel)); } }} sx={{ mb: 2 }}><ToggleButton value="petrol">Petrol</ToggleButton><ToggleButton value="diesel">Diesel</ToggleButton></ToggleButtonGroup>
    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Default rate date: {rateDate} - {rateSrc}. {fuelAgeDays(rateDate) > 15 ? 'Warning: this rate is more than 15 days old and may be out of date - enter today\'s OGRA rate.' : 'Rates are checked daily; if OGRA changes them, the default is updated from rates.json.'}</Typography>
    <ToggleButtonGroup value={roundTrip ? 'round' : 'one'} exclusive fullWidth onChange={(_, nv) => nv && setRoundTrip(nv === 'round')} sx={{ mb: 2 }}><ToggleButton value="one">One way</ToggleButton><ToggleButton value="round">Round trip (there and back)</ToggleButton></ToggleButtonGroup>
    <TextField fullWidth label="Distance (km, one way)" type="number" value={dist} onChange={(e) => setDist(e.target.value)} sx={{ mb: 2 }} />
    <TextField fullWidth label="Mileage (km per litre)" type="number" value={mile} onChange={(e) => setMile(e.target.value)} sx={{ mb: 2 }} />
    <TextField fullWidth label="Fuel rate (Rs per litre)" type="number" value={rate} onChange={(e) => setRate(e.target.value)} />
    {d > 0 && m > 0 && (<><Hero value={'Rs ' + fmt(cost)} unit="Trip fuel cost" /><Rows rows={[['Fuel needed', fmt(litres) + ' litres'], ['Rate', 'Rs ' + fmt(r) + ' / litre'], ['Distance', fmt(effD) + ' km' + (roundTrip ? ' (round trip: 2 × ' + fmt(d) + ' km)' : ' (one way)')]]} /></>)}
  </Wrap>);
}

// Petrol Price Pakistan Today - today's OGRA petrol + diesel rates, with the
// week's table. Rates come from RATES (built in) and /rates.json (live), the
// same source the Fuel tools use, so the page stays current without a rebuild.
// The week's table is the verified OGRA week 2-7 Nov 2026.
const FUEL_WEEK = [
  ['Mon 2 Nov 2026', 'Rs 377.91', 'Rs 402.96'],
  ['Tue 3 Nov 2026', 'Rs 374.51', 'Rs 395.20'],
  ['Wed 4 Nov 2026', 'Rs 369.06', 'Rs 391.52'],
  ['Thu 5 Nov 2026', 'Rs 362.00', 'Rs 387.81'],
  ['Fri 6 Nov 2026', 'Rs 352.59', 'Rs 382.25'],
  ['Sat 7 Nov 2026', 'Rs 346.00', 'Rs 378.00'],
];
export function PetrolPriceTool() {
  const [rates, setRates] = useState(RATES);
  useEffect(() => { fetch('/rates.json').then((r) => r.ok ? r.json() : null).then((j) => { if (j && j.petrol) setRates(j); }).catch(() => {}); }, []);
  return (<Wrap note="OGRA notified rates. OGRA changes fuel rates on weekdays; Friday's rates run on Saturday and Sunday too. Rates are checked daily - if OGRA changes them, this page updates from rates.json.">
    <Hero value={'Rs ' + fmt(rates.petrol)} unit="Petrol per litre" eq={'Diesel Rs ' + fmt(rates.diesel) + ' / litre · ' + (rates.fuelUpdated || RATES.fuelUpdated)} />
    <Rows rows={[['Petrol (per litre)', 'Rs ' + fmt(rates.petrol)], ['Diesel (per litre)', 'Rs ' + fmt(rates.diesel)], ['Hi-octane (per litre)', 'Rs 415.00'], ['Light diesel (per litre)', 'Rs 251.37'], ['Kerosene (per litre)', 'Rs 308.52'], ['Rate date', rates.fuelUpdated || RATES.fuelUpdated], ['Source', rates.fuelSource || RATES.fuelSource]]} />
    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>Hi-octane, light diesel and kerosene: 7 Nov 2026 rates (OGRA daily bulletin via MashriqTV; PSO official rates via checkprice.pk). Petrol/diesel update from rates.json.</Typography>
    <Typography variant="h6" component="h2" fontWeight={700} sx={{ mt: 3, mb: 1 }}>This week's rates</Typography>
    <Rows rows={FUEL_WEEK.map(([d, p, ds]) => [d, 'Petrol ' + p + ' · Diesel ' + ds])} />
    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>Petrol fell Rs 31.91 a litre this week (Rs 377.91 on Monday to Rs 346.00 on Saturday) and diesel fell Rs 24.96 (Rs 402.96 to Rs 378.00) - the fifth straight cut.</Typography>
    <Box sx={{ mt: 2 }}><Button variant="outlined" component="a" href="/tools/fuel-trip-cost-calculator-pakistan-ogra/">Work out a trip's fuel cost</Button></Box>
  </Wrap>);
}
// Shared single/batch image converter (browser-only). HEIC goes through
// heic2any (JPEG, quality 0.92) with a native-decode fallback (Safari);
// everything else is decoded by the browser and re-encoded on a canvas
// with the given mime + quality. Batch mode converts up to 50 files at
// once, each with its own download button.
function FileTool({ from, to, mime, ext, quality = 0.92, batch = false, controls = null }) {
  const [items, setItems] = useState([]); const [err, setErr] = useState(''); const [busy, setBusy] = useState(false);
  const convertOne = async (f) => {
    if (from === 'HEIC') {
      try {
        const heic2any = (await import('heic2any')).default;
        const out = await heic2any({ blob: f, toType: 'image/jpeg', quality: 0.92 });
        const blob = Array.isArray(out) ? out[0] : out; return { url: URL.createObjectURL(blob) };
      } catch (e) { /* fall through to native decode below (Safari) */ }
    }
    return new Promise((resolve) => {
      const img = new Image(); const src = URL.createObjectURL(f); img.onload = () => {
        const c = document.createElement('canvas'); c.width = img.naturalWidth; c.height = img.naturalHeight; const ctx = c.getContext('2d');
        if (mime === 'image/jpeg') { ctx.fillStyle = 'white'; ctx.fillRect(0, 0, c.width, c.height); }
        ctx.drawImage(img, 0, 0); c.toBlob((b) => { if (b) resolve({ url: URL.createObjectURL(b) }); else resolve({ error: 'Conversion failed in this browser.' }); }, mime, quality);
      }; img.onerror = () => resolve({ error: from === 'HEIC' ? 'This HEIC file could not be decoded in this browser. Try exporting it as JPG from Photos, or try again in Chrome / Safari.' : 'This file could not be decoded in this browser.' }); img.src = src;
    });
  };
  const onFiles = async (files) => {
    const list = Array.from(files || []).slice(0, batch ? 50 : 1); if (!list.length) return;
    setErr(''); setBusy(true); setItems([]);
    const done = [];
    for (const f of list) {
      const r = await convertOne(f);
      done.push({ name: f.name.replace(/\.[^.]+$/, '') + '.' + ext, url: r.url || '', error: r.error || '' });
      setItems([...done]);
    }
    setBusy(false);
  };
  return (<Wrap note="Private by design - your files never leave your device. Conversion runs in your browser only, nothing is uploaded to a server.">
    {controls && <Box sx={{ mb: 2 }}>{controls}</Box>}
    <Button variant="contained" component="label" fullWidth sx={{ mb: 2 }}>{busy ? 'Converting…' : `Choose ${from} file${batch ? 's (up to 50)' : ''}`}<input type="file" hidden multiple={batch} accept="image/*" onChange={(e) => onFiles(e.target.files)} /></Button>
    {err && <Alert severity="warning" sx={{ mb: 2 }}>{err}</Alert>}
    {items.length > 0 && (<Box>{items.map((it, i) => (<Box key={it.name + i} display="flex" alignItems="center" gap={1} sx={{ mb: 1 }}><Typography variant="body2" sx={{ flexGrow: 1 }}>{it.name}</Typography>{it.url ? <Button size="small" variant="outlined" href={it.url} download={it.name}>Download {to.toUpperCase()}</Button> : <Typography variant="body2" color="warning.main">{it.error}</Typography>}</Box>))}</Box>)}
    {!items.length && !err && <Typography variant="body2" color="text.secondary">Select {batch ? 'one or more' : 'a'} {from} file{batch ? 's' : ''}. {batch ? 'Each file converts and downloads separately.' : 'The converted file downloads to your device.'}</Typography>}
  </Wrap>);
}
export function HeicTool() { return <FileTool from="HEIC" to="jpg" mime="image/jpeg" ext="jpg" quality={0.92} batch />; }
export function WebpTool() {
  const [q, setQ] = useState(92);
  return (<FileTool from="WebP" to="jpg" mime="image/jpeg" ext="jpg" quality={q / 100} batch controls={(<><Typography variant="body2" gutterBottom>Quality: {q}% - lower means a smaller file</Typography><Slider value={q} onChange={(_, v) => setQ(v)} min={10} max={100} step={1} aria-label="JPG quality" /></>)} />);
}
// JPG / PNG to WebP - NEW component (not wired into App.jsx / seo-data.js /
// sitemap; that is Phase B). Same FileTool pattern: canvas toBlob('image/webp').
export function JpgToWebpTool() {
  const [q, setQ] = useState(80);
  return (<FileTool from="JPG / PNG" to="webp" mime="image/webp" ext="webp" quality={q / 100} batch controls={(<><Typography variant="body2" gutterBottom>Quality: {q}% - lower means a smaller file</Typography><Slider value={q} onChange={(_, v) => setQ(v)} min={10} max={100} step={1} aria-label="WebP quality" /></>)} />);
}
