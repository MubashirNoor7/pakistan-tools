import React, { useState, useEffect } from 'react';
import { RATES, fuelAgeDays } from '../rates.js';
import { Card, CardContent, Typography, TextField, Box, MenuItem, ToggleButton, ToggleButtonGroup, Alert, Button, Link } from '@mui/material';
import { fmt, Hero, Rows } from './property.jsx';

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
  return (<Wrap note="Estimate only - base tariff SRO 279(I)/2026. Fixed charge is per kW of sanctioned load. GST 18% included below; FPA changes monthly and is editable. Your actual bill also depends on arrears, meter rent and other adjustments.">
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
export function FuelTool() {
  const [dist, setDist] = useState('100'); const [mile, setMile] = useState('12'); const [fuel, setFuel] = useState('petrol'); const [rate, setRate] = useState(String(RATES.petrol)); const [rateDate, setRateDate] = useState(RATES.fuelUpdated); const [fetched, setFetched] = useState(null); const [rateSrc, setRateSrc] = useState(RATES.fuelSource);
  useEffect(() => { fetch('/rates.json').then((r) => r.ok ? r.json() : null).then((j) => { if (j && j.petrol) { setFetched(j); setRate(String(j.petrol)); setRateDate(j.fuelUpdated || rateDate); setRateSrc(j.fuelSource || rateSrc); } }).catch(() => {}); }, []);
  const d = parseFloat(dist) || 0; const m = parseFloat(mile) || 0; const r = parseFloat(rate) || 0; const litres = m > 0 ? d / m : 0; const cost = litres * r;
  return (<Wrap note="Fuel rates change often. Defaults are the 5 Nov 2026 OGRA notified rates (petrol Rs 362.00, diesel Rs 387.81), loaded from rates.json so they can be updated without rebuilding the app. Edit the rate to today's OGRA rate for an exact trip cost.">
    <ToggleButtonGroup value={fuel} exclusive fullWidth onChange={(_, nv) => { if (nv) { setFuel(nv); setRate(nv === 'petrol' ? String(fetched ? fetched.petrol : RATES.petrol) : String(fetched ? fetched.diesel : RATES.diesel)); } }} sx={{ mb: 2 }}><ToggleButton value="petrol">Petrol</ToggleButton><ToggleButton value="diesel">Diesel</ToggleButton></ToggleButtonGroup>
    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Default rate date: {rateDate} - {rateSrc}. {fuelAgeDays(rateDate) > 15 ? 'Warning: this rate is more than 15 days old and may be out of date - enter today\'s OGRA rate.' : 'Rates are checked daily; if OGRA changes them, the default is updated from rates.json.'}</Typography>
    <TextField fullWidth label="Distance (km)" type="number" value={dist} onChange={(e) => setDist(e.target.value)} sx={{ mb: 2 }} />
    <TextField fullWidth label="Mileage (km per litre)" type="number" value={mile} onChange={(e) => setMile(e.target.value)} sx={{ mb: 2 }} />
    <TextField fullWidth label="Fuel rate (Rs per litre)" type="number" value={rate} onChange={(e) => setRate(e.target.value)} />
    {d > 0 && m > 0 && (<><Hero value={'Rs ' + fmt(cost)} unit="Trip fuel cost" /><Rows rows={[['Fuel needed', fmt(litres) + ' litres'], ['Rate', 'Rs ' + fmt(r) + ' / litre'], ['Distance', fmt(d) + ' km']]} /></>)}
  </Wrap>);
}
function FileTool({ from, to, mime, ext }) {
  const [url, setUrl] = useState(''); const [name, setName] = useState(''); const [err, setErr] = useState(''); const [busy, setBusy] = useState(false);
  const onFile = async (f) => {
    if (!f) return; setErr(''); setUrl(''); setName(f.name.replace(/\.[^.]+$/, '') + '.' + ext); setBusy(true);
    if (from === 'HEIC') {
      try {
        const heic2any = (await import('heic2any')).default;
        const out = await heic2any({ blob: f, toType: 'image/jpeg', quality: 0.92 });
        const blob = Array.isArray(out) ? out[0] : out; setUrl(URL.createObjectURL(blob)); setBusy(false); return;
      } catch (e) { /* fall through to native decode below (Safari) */ }
    }
    const img = new Image(); const src = URL.createObjectURL(f); img.onload = () => {
      const c = document.createElement('canvas'); c.width = img.naturalWidth; c.height = img.naturalHeight; const ctx = c.getContext('2d');
      if (mime === 'image/jpeg') { ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height); }
      ctx.drawImage(img, 0, 0); c.toBlob((b) => { if (b) setUrl(URL.createObjectURL(b)); else setErr('Conversion failed in this browser.'); setBusy(false); }, mime, 0.92);
    }; img.onerror = () => { setErr(from === 'HEIC' ? 'This HEIC file could not be decoded in this browser. Try exporting it as JPG from Photos, or try again in Chrome / Safari.' : 'This file could not be decoded in this browser.'); setBusy(false); }; img.src = src;
  };
  return (<Wrap note="Private by design - your file never leaves your device. Conversion runs in your browser only, nothing is uploaded to a server.">
    <Button variant="contained" component="label" fullWidth sx={{ mb: 2 }}>{busy ? 'Converting…' : `Choose ${from} file`}<input type="file" hidden accept="image/*" onChange={(e) => onFile(e.target.files[0])} /></Button>
    {err && <Alert severity="warning" sx={{ mb: 2 }}>{err}</Alert>}
    {url && (<Box textAlign="center"><Typography variant="body1" sx={{ mb: 1 }}>Ready: {name}</Typography><Button variant="outlined" href={url} download={name}>Download {to.toUpperCase()}</Button></Box>)}
    {!url && !err && <Typography variant="body2" color="text.secondary">Select a {from} file. The converted file downloads to your device.</Typography>}
  </Wrap>);
}
export function HeicTool() { return <FileTool from="HEIC" to="jpg" mime="image/jpeg" ext="jpg" />; }
export function WebpTool() { return <FileTool from="WebP" to="jpg" mime="image/jpeg" ext="jpg" />; }
