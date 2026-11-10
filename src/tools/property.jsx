import React, { useState } from 'react';
import { Card, CardContent, Typography, TextField, ToggleButton, ToggleButtonGroup, Box, List, ListItem, ListItemText, Button, InputAdornment } from '@mui/material';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { fmt, Hero, Rows, CopyResultButton } from './shared.jsx';
// Fard-format split: 1 Kanal = 20 Marla, 1 Marla = 9 Sarsahi.
// (Revenue ladder: 1 Sarsahi = 30.25 sq ft at the 272.25 standard;
// 1 Killa/Acre = 8 Kanal; 1 Murabba = 25 Killa = 200 Kanal.)
function splitKMS(marla) {
  const m = Math.max(0, marla || 0);
  let kanal = Math.floor(m / 20);
  const rem = m - kanal * 20;
  let mp = Math.floor(rem);
  let sar = Math.round((rem - mp) * 9);
  if (sar === 9) { sar = 0; mp += 1; }
  if (mp === 20) { mp = 0; kanal += 1; }
  return `${fmt(kanal)} Kanal ${fmt(mp)} Marla ${fmt(sar)} Sarsahi`;
}
export function MarlaTool() {
  const [std, setStd] = useState('272.25'); const [custom, setCustom] = useState('225'); const [mode, setMode] = useState('marla'); const [val, setVal] = useState('5');
  const s = std === 'custom' ? parseFloat(custom) || 0 : parseFloat(std); const v = parseFloat(val) || 0; const valid = v > 0 && s > 0;
  const sqft = mode === 'marla' ? v * s : v; const marla = mode === 'marla' ? v : v / s;
  return (<Card elevation={2} sx={{ borderRadius: 3 }}><CardContent sx={{ p: 3 }}>
    <ToggleButtonGroup value={std} exclusive fullWidth onChange={(_, nv) => nv && setStd(nv)} sx={{ mb: 2 }}>
      <ToggleButton value="225">225 sq ft</ToggleButton><ToggleButton value="250">250 sq ft</ToggleButton><ToggleButton value="272.25">272.25 sq ft</ToggleButton><ToggleButton value="custom">Custom</ToggleButton>
    </ToggleButtonGroup>
    {std === 'custom' && <TextField fullWidth label="Custom sq ft per Marla" type="number" value={custom} onChange={(e) => setCustom(e.target.value)} sx={{ mb: 2 }} />}
    <TextField fullWidth label={mode === 'marla' ? 'Marla' : 'Square Feet'} type="number" value={val} onChange={(e) => setVal(e.target.value)} inputProps={{ inputMode: 'decimal' }} InputProps={{ endAdornment: <InputAdornment position="end">{mode === 'marla' ? 'Marla' : 'Sq Ft'}</InputAdornment> }} sx={{ '& input': { fontSize: 26, fontWeight: 700 } }} />
    {mode === 'marla' && <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>{[1, 5, 10, 20].map((n) => (<Button key={n} variant="outlined" onClick={() => setVal(String(n))} sx={{ flex: 1, height: 48, fontSize: 16, fontWeight: 700 }}>{n}</Button>))}</Box>}
    <Box textAlign="center" sx={{ py: 3, px: 2, mb: 2, borderRadius: 3, bgcolor: '#E6F4F2' }}><Typography variant="h2" fontWeight={800} color="primary.main">{valid ? fmt(mode === 'marla' ? sqft : marla) : '-'}</Typography><Typography color="text.secondary">{mode === 'marla' ? 'Square Feet' : 'Marla'}</Typography><Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{valid && (mode === 'marla' ? `${fmt(v)} Marla × ${fmt(s)} sq ft` : `${fmt(v)} sq ft ÷ ${fmt(s)} sq ft`)}</Typography>{valid && <CopyResultButton text={mode === 'marla' ? `${fmt(sqft)} Square Feet (${fmt(v)} Marla × ${fmt(s)} sq ft)` : `${fmt(marla)} Marla (${fmt(v)} sq ft ÷ ${fmt(s)} sq ft)`} />}</Box>
    {valid && <List disablePadding>{mode === 'marla' ? (<><ListItem disableGutters divider><ListItemText primary="Square Yards" /><Typography fontWeight={700}>{fmt(sqft / 9)}</Typography></ListItem><ListItem disableGutters divider><ListItemText primary="Square Metres" /><Typography fontWeight={700}>{fmt(sqft / 10.7639)}</Typography></ListItem><ListItem disableGutters divider><ListItemText primary="Kanal" /><Typography fontWeight={700}>{fmt(v / 20)}</Typography></ListItem><ListItem disableGutters divider><ListItemText primary="Acre" /><Typography fontWeight={700}>{fmt(v / 160)}</Typography></ListItem><ListItem disableGutters divider><ListItemText primary="Sarsahi" /><Typography fontWeight={700}>{fmt(v * 9)}</Typography></ListItem><ListItem disableGutters divider><ListItemText primary="Killa" /><Typography fontWeight={700}>{fmt(v / 160)}</Typography></ListItem><ListItem disableGutters divider><ListItemText primary="Murabba" /><Typography fontWeight={700}>{fmt(v / 4000)}</Typography></ListItem><ListItem disableGutters><ListItemText primary="Kanal–Marla–Sarsahi" /><Typography fontWeight={700}>{splitKMS(v)}</Typography></ListItem></>) : (<><ListItem disableGutters divider><ListItemText primary="Kanal" /><Typography fontWeight={700}>{fmt(marla / 20)}</Typography></ListItem><ListItem disableGutters divider><ListItemText primary="Square Yards" /><Typography fontWeight={700}>{fmt(v / 9)}</Typography></ListItem><ListItem disableGutters divider><ListItemText primary="Sarsahi" /><Typography fontWeight={700}>{fmt(marla * 9)}</Typography></ListItem><ListItem disableGutters divider><ListItemText primary="Killa" /><Typography fontWeight={700}>{fmt(marla / 160)}</Typography></ListItem><ListItem disableGutters divider><ListItemText primary="Murabba" /><Typography fontWeight={700}>{fmt(marla / 4000)}</Typography></ListItem><ListItem disableGutters><ListItemText primary="Kanal–Marla–Sarsahi" /><Typography fontWeight={700}>{splitKMS(marla)}</Typography></ListItem></>)}</List>}
    <Button fullWidth variant="outlined" startIcon={<SwapHorizIcon />} sx={{ mt: 3 }} onClick={() => { if (mode === 'marla') { setMode('sqft'); setVal(valid ? String(sqft) : val); } else { setMode('marla'); setVal(valid ? String(marla) : val); } }}>{mode === 'marla' ? 'Switch to Sq Ft → Marla' : 'Switch to Marla → Sq Ft'}</Button>
  </CardContent></Card>);
}
export function StdToggle({ std, setStd }) {
  return (<ToggleButtonGroup value={std} exclusive fullWidth onChange={(_, nv) => nv && setStd(nv)} sx={{ mb: 2 }}>
    <ToggleButton value="225">225 sq ft</ToggleButton><ToggleButton value="250">250 sq ft</ToggleButton><ToggleButton value="272.25">272.25 sq ft</ToggleButton><ToggleButton value="custom">Custom</ToggleButton></ToggleButtonGroup>);
}
export function KanalTool() {
  const [std, setStd] = useState('272.25'); const [custom, setCustom] = useState('225'); const [mode, setMode] = useState('kanal'); const [v, setV] = useState('1');
  const s = std === 'custom' ? parseFloat(custom) || 0 : parseFloat(std); const n = parseFloat(v) || 0; const valid = n > 0 && s > 0;
  const kanal = mode === 'kanal' ? n : n / 20; const marla = mode === 'kanal' ? n * 20 : n; const sqft = marla * s;
  return (<Card elevation={2} sx={{ borderRadius: 3 }}><CardContent sx={{ p: 3 }}>
    <StdToggle std={std} setStd={setStd} />
    {std === 'custom' && <TextField fullWidth label="Custom sq ft per Marla" type="number" value={custom} onChange={(e) => setCustom(e.target.value)} sx={{ mb: 2 }} />}
    <TextField fullWidth label={mode === 'kanal' ? 'Kanal' : 'Marla'} type="number" value={v} onChange={(e) => setV(e.target.value)} inputProps={{ inputMode: 'decimal' }} InputProps={{ endAdornment: <InputAdornment position="end">{mode === 'kanal' ? 'Kanal' : 'Marla'}</InputAdornment> }} sx={{ '& input': { fontSize: 24, fontWeight: 700 } }} />
    <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>{[1, 5, 10, 20].map((x) => (<Button key={x} variant="outlined" onClick={() => setV(String(x))} sx={{ flex: 1, height: 48, fontSize: 16, fontWeight: 700 }}>{x}</Button>))}</Box>
    {valid && (<><Hero value={fmt(mode === 'kanal' ? marla : kanal)} unit={mode === 'kanal' ? 'Marla' : 'Kanal'} eq={mode === 'kanal' ? `${fmt(n)} Kanal × 20` : `${fmt(n)} Marla ÷ 20`} /><Rows rows={[['Square Feet', fmt(sqft)], ['Square Yards', fmt(sqft / 9)], ['Square Metres', fmt(sqft / 10.7639)], ['Acre (Killa)', fmt(kanal / 8)], ['Sarsahi', fmt(marla * 9)], ['Murabba', fmt(kanal / 200)], ['Kanal–Marla–Sarsahi', splitKMS(marla)]]} /></>)}
    <Button fullWidth variant="outlined" startIcon={<SwapHorizIcon />} sx={{ mt: 3 }} onClick={() => { if (mode === 'kanal') { setMode('marla'); setV(valid ? String(marla) : v); } else { setMode('kanal'); setV(valid ? String(kanal) : v); } }}>{mode === 'kanal' ? 'Switch to Marla → Kanal' : 'Switch to Kanal → Marla'}</Button>
  </CardContent></Card>);
}
export function PlotSizeTool() {
  const [std, setStd] = useState('272.25'); const [custom, setCustom] = useState('225'); const [unit, setUnit] = useState('ft'); const [L, setL] = useState('45'); const [W, setW] = useState('25');
  const s = std === 'custom' ? parseFloat(custom) || 0 : parseFloat(std);
  const toFt = unit === 'yd' ? 3 : unit === 'm' ? 3.28084 : 1;
  const lFt = (parseFloat(L) || 0) * toFt; const wFt = (parseFloat(W) || 0) * toFt;
  const sqft = lFt * wFt; const m = s > 0 ? sqft / s : 0;
  const perim = 2 * ((parseFloat(L) || 0) + (parseFloat(W) || 0));
  const unitLabel = unit === 'yd' ? 'yards' : unit === 'm' ? 'metres' : 'feet';
  return (<Card elevation={2} sx={{ borderRadius: 3 }}><CardContent sx={{ p: 3 }}>
    <StdToggle std={std} setStd={setStd} />
    {std === 'custom' && <TextField fullWidth label="Custom sq ft per Marla" type="number" value={custom} onChange={(e) => setCustom(e.target.value)} sx={{ mb: 2 }} />}
    <ToggleButtonGroup value={unit} exclusive fullWidth onChange={(_, nv) => nv && setUnit(nv)} sx={{ mb: 2 }}>
      <ToggleButton value="ft">Feet</ToggleButton><ToggleButton value="yd">Yards</ToggleButton><ToggleButton value="m">Metres</ToggleButton>
    </ToggleButtonGroup>
    <TextField fullWidth label={`Length (${unitLabel})`} type="number" value={L} onChange={(e) => setL(e.target.value)} sx={{ mb: 2 }} />
    <TextField fullWidth label={`Width (${unitLabel})`} type="number" value={W} onChange={(e) => setW(e.target.value)} />
    {sqft > 0 && (<><Hero value={fmt(m)} unit="Marla" eq={`${fmt(parseFloat(L) || 0)} × ${fmt(parseFloat(W) || 0)} ${unitLabel}`} /><Rows rows={[['Square Feet', fmt(sqft)], ['Square Yards', fmt(sqft / 9)], ['Square Metres', fmt(sqft / 10.7639)], ['Kanal', fmt(m / 20)], ['Acre', fmt(m / 160)], ['Sarsahi', fmt(m * 9)], ['Kanal–Marla–Sarsahi', splitKMS(m)], ['Perimeter', `${fmt(perim)} ${unitLabel}`]]} /></>)}
  </CardContent></Card>);
}
export function PlotPriceTool() {
  const [std, setStd] = useState('272.25'); const [custom, setCustom] = useState('225'); const [price, setPrice] = useState('5000000'); const [area, setArea] = useState('5');
  const s = std === 'custom' ? parseFloat(custom) || 0 : parseFloat(std); const a = parseFloat(area) || 0; const p = parseFloat(price) || 0; const sqft = a * s;
  return (<Card elevation={2} sx={{ borderRadius: 3 }}><CardContent sx={{ p: 3 }}>
    <StdToggle std={std} setStd={setStd} />
    {std === 'custom' && <TextField fullWidth label="Custom sq ft per Marla" type="number" value={custom} onChange={(e) => setCustom(e.target.value)} sx={{ mb: 2 }} />}
    <TextField fullWidth label="Total price (Rs)" type="number" value={price} onChange={(e) => setPrice(e.target.value)} sx={{ mb: 2 }} />
    <TextField fullWidth label="Area (Marla)" type="number" value={area} onChange={(e) => setArea(e.target.value)} />
    {a > 0 && p > 0 && (<><Hero value={'Rs ' + fmt(p / a)} unit="Price per Marla" /><Rows rows={[['Price per Kanal', 'Rs ' + fmt(p / (a / 20))], ['Price per Sq Ft', 'Rs ' + fmt(p / sqft)], ['Price per Sq Yard', 'Rs ' + fmt(p / (sqft / 9))], ['Total area (Sq Ft)', fmt(sqft)]]} /></>)}
  </CardContent></Card>);
}
