import React, { useState } from 'react';
import { Card, CardContent, Typography, TextField, ToggleButton, ToggleButtonGroup, Box, List, ListItem, ListItemText, Chip, Stack, Button, InputAdornment } from '@mui/material';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { fmt, Hero, Rows } from './shared.jsx';
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
    {mode === 'marla' && <Stack direction="row" spacing={1} sx={{ mt: 2 }}>{[1, 5, 10, 20].map((n) => (<Chip key={n} label={n} variant="outlined" clickable onClick={() => setVal(String(n))} />))}</Stack>}
    <Box textAlign="center" sx={{ py: 3 }}><Typography variant="h2" fontWeight={800}>{valid ? fmt(mode === 'marla' ? sqft : marla) : '-'}</Typography><Typography color="text.secondary">{mode === 'marla' ? 'Square Feet' : 'Marla'}</Typography><Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{valid && (mode === 'marla' ? `${fmt(v)} Marla × ${fmt(s)} sq ft` : `${fmt(v)} sq ft ÷ ${fmt(s)} sq ft`)}</Typography></Box>
    {valid && <List disablePadding>{mode === 'marla' ? (<><ListItem disableGutters divider><ListItemText primary="Square Yards" /><Typography fontWeight={700}>{fmt(sqft / 9)}</Typography></ListItem><ListItem disableGutters divider><ListItemText primary="Square Metres" /><Typography fontWeight={700}>{fmt(sqft / 10.7639)}</Typography></ListItem><ListItem disableGutters divider><ListItemText primary="Kanal" /><Typography fontWeight={700}>{fmt(v / 20)}</Typography></ListItem><ListItem disableGutters><ListItemText primary="Acre" /><Typography fontWeight={700}>{fmt(v / 160)}</Typography></ListItem></>) : (<><ListItem disableGutters divider><ListItemText primary="Kanal" /><Typography fontWeight={700}>{fmt(marla / 20)}</Typography></ListItem><ListItem disableGutters><ListItemText primary="Square Yards" /><Typography fontWeight={700}>{fmt(v / 9)}</Typography></ListItem></>)}</List>}
    <Button fullWidth variant="outlined" startIcon={<SwapHorizIcon />} sx={{ mt: 3 }} onClick={() => { if (mode === 'marla') { setMode('sqft'); setVal(valid ? String(sqft) : val); } else { setMode('marla'); setVal(valid ? String(marla) : val); } }}>{mode === 'marla' ? 'Switch to Sq Ft → Marla' : 'Switch to Marla → Sq Ft'}</Button>
  </CardContent></Card>);
}
export function StdToggle({ std, setStd }) {
  return (<ToggleButtonGroup value={std} exclusive fullWidth onChange={(_, nv) => nv && setStd(nv)} sx={{ mb: 2 }}>
    <ToggleButton value="225">225 sq ft</ToggleButton><ToggleButton value="250">250 sq ft</ToggleButton><ToggleButton value="272.25">272.25 sq ft</ToggleButton><ToggleButton value="custom">Custom</ToggleButton></ToggleButtonGroup>);
}
export function KanalTool() {
  const [std, setStd] = useState('272.25'); const [custom, setCustom] = useState('225'); const [v, setV] = useState('1');
  const s = std === 'custom' ? parseFloat(custom) || 0 : parseFloat(std); const k = parseFloat(v) || 0; const m = k * 20; const sqft = m * s;
  return (<Card elevation={2} sx={{ borderRadius: 3 }}><CardContent sx={{ p: 3 }}>
    <StdToggle std={std} setStd={setStd} />
    {std === 'custom' && <TextField fullWidth label="Custom sq ft per Marla" type="number" value={custom} onChange={(e) => setCustom(e.target.value)} sx={{ mb: 2 }} />}
    <TextField fullWidth label="Kanal" type="number" value={v} onChange={(e) => setV(e.target.value)} sx={{ '& input': { fontSize: 24, fontWeight: 700 } }} />
    {k > 0 && s > 0 && (<><Hero value={fmt(m)} unit="Marla" eq={`${fmt(k)} Kanal × 20`} /><Rows rows={[['Square Feet', fmt(sqft)], ['Square Yards', fmt(sqft / 9)], ['Square Metres', fmt(sqft / 10.7639)], ['Acre', fmt(k / 8)]]} /></>)}
  </CardContent></Card>);
}
export function PlotSizeTool() {
  const [std, setStd] = useState('272.25'); const [custom, setCustom] = useState('225'); const [L, setL] = useState('45'); const [W, setW] = useState('25');
  const s = std === 'custom' ? parseFloat(custom) || 0 : parseFloat(std); const sqft = (parseFloat(L) || 0) * (parseFloat(W) || 0); const m = s > 0 ? sqft / s : 0;
  return (<Card elevation={2} sx={{ borderRadius: 3 }}><CardContent sx={{ p: 3 }}>
    <StdToggle std={std} setStd={setStd} />
    {std === 'custom' && <TextField fullWidth label="Custom sq ft per Marla" type="number" value={custom} onChange={(e) => setCustom(e.target.value)} sx={{ mb: 2 }} />}
    <TextField fullWidth label="Length (feet)" type="number" value={L} onChange={(e) => setL(e.target.value)} sx={{ mb: 2 }} />
    <TextField fullWidth label="Width (feet)" type="number" value={W} onChange={(e) => setW(e.target.value)} />
    {sqft > 0 && (<><Hero value={fmt(m)} unit="Marla" eq={`${fmt(parseFloat(L) || 0)} × ${fmt(parseFloat(W) || 0)} ft`} /><Rows rows={[['Square Feet', fmt(sqft)], ['Square Yards', fmt(sqft / 9)], ['Square Metres', fmt(sqft / 10.7639)], ['Kanal', fmt(m / 20)], ['Acre', fmt(m / 160)]]} /></>)}
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
