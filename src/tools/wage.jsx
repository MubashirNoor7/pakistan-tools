import React, { useState } from 'react';
import { Card, CardContent, Typography, TextField, MenuItem } from '@mui/material';
import { fmt, Hero, Rows } from './shared.jsx';

// Daily Wage - notified minimum wages: Sindh Rs 43,000 and ICT
// Rs 40,700 from 1 Jul 2026; Punjab Rs 40,000 and KP Rs 40,000 are the
// last notified figures (2025-26, no 2026-27 notification yet).
// Balochistan is NOT included: no verified notification was found.
// Daily wage = monthly wage / 26 working days (6-day week convention);
// hourly wage = daily wage / 8. Rates change every July - re-check then.
const MIN_WAGE = { Punjab: 40000, Sindh: 43000, KP: 40000, ICT: 40700 };
const PROV_LABEL = { Punjab: 'Punjab', Sindh: 'Sindh', KP: 'Khyber Pakhtunkhwa (KP)', ICT: 'Islamabad (ICT)' };
function Wrap({ children, note }) {
  return (<><Card elevation={2} sx={{ borderRadius: 3 }}><CardContent sx={{ p: 3 }}>{children}</CardContent></Card>{note && <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>{note}</Typography>}</>);
}
export function DailyWageTool() {
  const [prov, setProv] = useState('Punjab'); const [monthly, setMonthly] = useState('40000'); const [days, setDays] = useState('26');
  const wage = parseFloat(monthly) || 0; const worked = parseFloat(days) || 0;
  const daily = wage / 26; const hourly = daily / 8; const pay = daily * worked;
  const onProv = (nv) => { setProv(nv); setMonthly(String(MIN_WAGE[nv])); };
  return (<Wrap note="Notified minimum wages: Sindh Rs 43,000 and ICT Rs 40,700 from 1 Jul 2026; Punjab Rs 40,000 and KP Rs 40,000 are the last notified figures (2025-26, no 2026-27 notification yet). Rates change every July, so re-check the rate before relying on it. Daily wage is monthly wage divided by 26 working days, the standard 6-day-week convention; hourly wage is daily wage divided by 8 hours.">
    <TextField select fullWidth label="Province" value={prov} onChange={(e) => onProv(e.target.value)} sx={{ mb: 2 }}>{Object.keys(MIN_WAGE).map((p) => (<MenuItem key={p} value={p}>{PROV_LABEL[p]}</MenuItem>))}</TextField>
    <TextField fullWidth label="Monthly wage (Rs) - pre-filled with the province minimum, editable" type="number" value={monthly} onChange={(e) => setMonthly(e.target.value)} sx={{ mb: 2 }} />
    <TextField fullWidth label="Days worked in the month" type="number" value={days} onChange={(e) => setDays(e.target.value)} />
    {wage > 0 && (<><Hero value={'Rs ' + fmt(daily)} unit="Daily wage" eq={'Rs ' + fmt(hourly) + ' per hour · ' + PROV_LABEL[prov]} /><Rows rows={[['Monthly wage', 'Rs ' + fmt(wage)], ['Days worked', fmt(worked) + ' of 26 working days'], ['Daily wage (monthly / 26)', 'Rs ' + fmt(daily)], ['Hourly wage (daily / 8)', 'Rs ' + fmt(hourly)], ['Pay for days worked', 'Rs ' + fmt(pay)]]} /></>)}
    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>Notified minimums per month: Punjab Rs 40,000 (2025-26), Sindh Rs 43,000 (2026-27), KP Rs 40,000 (2025-26), ICT Rs 40,700 (2026-27). Balochistan is not shown - no verified notification was found.</Typography>
    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>Checks: Punjab Rs 40,000 / 26 = Rs 1,538.46 a day, Rs 192.31 an hour. Sindh Rs 43,000 / 26 = Rs 1,653.85 a day.</Typography>
  </Wrap>);
}
