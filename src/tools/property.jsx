import React, { useState } from 'react';
import { Card, CardContent, Typography, TextField, ToggleButton, ToggleButtonGroup, Box, List, ListItem, ListItemText, Divider } from '@mui/material';
export const fmt = (n) => n.toLocaleString('en-US', { maximumFractionDigits: 2 });
export function Hero({ value, unit, eq }) {
  return (<Box textAlign="center" sx={{ py: 2 }}><Typography variant="h3" fontWeight={800}>{value}</Typography><Typography color="text.secondary">{unit}</Typography>{eq && <Typography variant="body2" color="text.disabled" sx={{ mt: 1 }}>{eq}</Typography>}</Box>);
}
export function Rows({ rows }) {
  return (<List disablePadding>{rows.map(([k, v], i) => (<React.Fragment key={k}>{i > 0 && <Divider />}<ListItem disableGutters><ListItemText primary={k} /><Typography fontWeight={700}>{v}</Typography></ListItem></React.Fragment>))}</List>);
}
export function StdToggle({ std, setStd }) {
  return (<ToggleButtonGroup value={std} exclusive fullWidth onChange={(_, nv) => nv && setStd(nv)} sx={{ mb: 2 }}>
    <ToggleButton value="225">225 sq ft</ToggleButton><ToggleButton value="272.25">272.25 sq ft</ToggleButton><ToggleButton value="custom">Custom</ToggleButton></ToggleButtonGroup>);
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
