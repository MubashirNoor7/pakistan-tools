import React, { useState } from 'react';
import { Card, CardContent, Typography, TextField, MenuItem, Checkbox, FormControlLabel } from '@mui/material';
import { fmt, Hero, Rows } from './shared.jsx';

// EOBI pension: monthly pension = average monthly wage (last 12 months)
// x years of insurable employment / 50 (2% per year). A part-year of 6
// months or more counts as a full year. Minimum pension Rs 11,500 a month
// from 1 Jan 2025. Eligibility: age 60 (men) / 55 (women) and 15 years of
// contributions, where 14 years 6 months counts as 15 years (Federal
// Constitutional Court, Jan 2026, upholding LHC 2024/2025 and dismissing
// EOBI's appeals; the Schedule's 6-month rounding applies to eligibility,
// and EOBI's 2022 circular excluding it is invalid). Under 14.5 years there
// is a lump-sum old-age grant, not a monthly pension. Contributions are
// employer 5% + employee 1% of the notified minimum wage, not of salary.
const MIN_PENSION = 11500;
const FED_WAGE = 40700;
function Wrap({ children, note }) {
  return (<><Card elevation={2} sx={{ borderRadius: 3 }}><CardContent sx={{ p: 3 }}>{children}</CardContent></Card>{note && <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>{note}</Typography>}</>);
}
export function EobiTool() {
  const [wage, setWage] = useState('40700'); const [years, setYears] = useState('25'); const [months, setMonths] = useState('0');
  const w = parseFloat(wage) || 0; const y = parseFloat(years) || 0; const m = parseFloat(months) || 0;
  const qualYears = y + (m >= 6 ? 1 : 0);
  const serviceYears = y + m / 12;
  const formula = w * qualYears / 50;
  const pension = serviceYears >= 14.5 ? Math.max(formula, MIN_PENSION) : 0;
  const eligible = serviceYears >= 14.5;
  return (<Wrap note="EOBI pension under the Employees' Old-Age Benefits Act 1976. The minimum pension is Rs 11,500 a month from 1 Jan 2025. Eligibility is 15 years of contributions, and 14 years 6 months counts as 15 years (Federal Constitutional Court, Jan 2026). Contributions are employer 5% plus employee 1% of the notified minimum wage, not of your actual salary, so for most workers the answer clusters near the minimum. EOBI told a Senate committee in Feb 2026 its current maximum is ~Rs 32,000 - a reported current maximum, not a legal ceiling. The formula is never capped here: at 40 years on Rs 40,700 it gives Rs 32,560.">
    <TextField fullWidth label="Average monthly wage, last 12 months (Rs) - default is the federal minimum wage, editable" type="number" value={wage} onChange={(e) => setWage(e.target.value)} sx={{ mb: 2 }} />
    <TextField fullWidth label="Years of insurable employment" type="number" value={years} onChange={(e) => setYears(e.target.value)} sx={{ mb: 2 }} />
    <TextField fullWidth label="Extra months of service (6 or more counts as a full year)" type="number" value={months} onChange={(e) => setMonths(e.target.value)} />
    {w > 0 && (eligible ? (<><Hero value={'Rs ' + fmt(pension)} unit="per month" eq={'Rs ' + fmt(w) + ' x ' + fmt(qualYears) + ' years / 50'} /><Rows rows={[['Average monthly wage', 'Rs ' + fmt(w)], ['Qualifying years', fmt(qualYears)], ['Formula pension (wage x years / 50)', 'Rs ' + fmt(formula)], ['Minimum pension', 'Rs ' + fmt(MIN_PENSION) + ' a month'], ['Monthly pension', 'Rs ' + fmt(pension)], ['Employer contribution (5% of wage)', 'Rs ' + fmt(w * 0.05) + ' a month'], ['Employee contribution (1% of wage)', 'Rs ' + fmt(w * 0.01) + ' a month']]} /></>) : (<Typography variant="body1" sx={{ mt: 2 }}>With {fmt(serviceYears)} years of contributions you do not yet qualify for a monthly pension. EOBI needs 15 years of contributions (14 years 6 months counts as 15 years), and age 60 for men or 55 for women. With 2 to under 14.5 years of contributions you get a lump-sum old-age grant instead, not a monthly pension.</Typography>))}
    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>Default wage Rs 40,700 is the federal minimum wage from 1 Jul 2026. Provincial rates differ: Sindh Rs 43,000, Punjab Rs 40,000 and KP Rs 40,000 (last notified 2025-26, no 2026-27 notification yet). EOBI bills nationally on the federal Rs 40,700 base.</Typography>
    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>Checks: Rs 40,700 x 25 years / 50 = Rs 20,350 a month. Rs 37,000 x 20 years / 50 = Rs 14,800 a month. Each year at Rs 40,700 is worth Rs 814 a month.</Typography>
  </Wrap>);
}

// Gratuity: last month's wages x qualifying years - 30 days' wages for every
// completed year of service, and a remaining part-year of MORE than 6 months
// counts as a full year. That is (salary / 30) x 30 = one month's salary per
// year - never (salary / 26) x 30. Balochistan pays 2 months' wages per year.
// Minimum service is province-dependent: Punjab requires 12 months (Punjab
// Labour Code requirement). In Islamabad, Sindh, KP and Balochistan the
// Standing Orders text states no separate one-year minimum - a part-year
// over 6 months counts as a year, so 7-11 months counts as a year there
// (employers and courts may read this differently). No gratuity if dismissed
// for misconduct, and no gratuity for a period covered by a qualifying
// provident fund (employer paid at least as much as the employee) - except
// in Balochistan, where the provident fund is paid IN ADDITION to gratuity.
const GRAT_PROV = { Islamabad: 1, Punjab: 1, Sindh: 1, KP: 1, Balochistan: 2 };
const GRAT_LABEL = { Islamabad: 'Islamabad', Punjab: 'Punjab', Sindh: 'Sindh', KP: 'Khyber Pakhtunkhwa (KP)', Balochistan: 'Balochistan' };
export function GratuityTool() {
  const [wage, setWage] = useState('100000'); const [years, setYears] = useState('8'); const [months, setMonths] = useState('7'); const [prov, setProv] = useState('Punjab'); const [misconduct, setMisconduct] = useState(false); const [pf, setPf] = useState(false);
  const w = parseFloat(wage) || 0; const y = parseFloat(years) || 0; const m = parseFloat(months) || 0;
  const totalMonths = y * 12 + m;
  const qualYears = y + (m > 6 ? 1 : 0);
  const perYear = GRAT_PROV[prov];
  const blocked = (prov === 'Punjab' && totalMonths < 12) ? 'In Punjab you need at least 12 months of service for gratuity.' : (qualYears < 1 ? 'You need more than 6 months of service: a part-year over 6 months counts as a full year.' : misconduct ? 'No gratuity is payable if you were dismissed for misconduct.' : (pf && prov !== 'Balochistan') ? 'No gratuity is payable for a period covered by a qualifying provident fund (employer contributed at least as much as you). In Balochistan the provident fund is paid in addition to gratuity.' : null);
  const gratuity = blocked ? 0 : w * qualYears * perYear;
  return (<Wrap note="Gratuity under Standing Order 12(6) of the Industrial and Commercial Employment (Standing Orders) Ordinance 1968 and the provincial equivalents. Applies to industrial and commercial establishments with 20 or more workers in Punjab and Islamabad, and 10 or more elsewhere. The Punjab Labour Code 2026 (passed Feb 2026) is confirmed not in force as of 13 Nov 2026 - no Gazette commencement notification - so the 1968 Ordinance still governs Punjab until it commences. Outside Punjab, the Standing Orders text states no separate one-year minimum, so 7-11 months counts as a year there; employers and courts may read this differently.">
    <TextField fullWidth label="Last month's wages (Rs)" type="number" value={wage} onChange={(e) => setWage(e.target.value)} sx={{ mb: 2 }} />
    <TextField fullWidth label="Years of service" type="number" value={years} onChange={(e) => setYears(e.target.value)} sx={{ mb: 2 }} />
    <TextField fullWidth label="Extra months of service (more than 6 counts as a full year)" type="number" value={months} onChange={(e) => setMonths(e.target.value)} sx={{ mb: 2 }} />
    <TextField select fullWidth label="Province" value={prov} onChange={(e) => setProv(e.target.value)} sx={{ mb: 1 }}>{Object.keys(GRAT_PROV).map((p) => (<MenuItem key={p} value={p}>{GRAT_LABEL[p]}</MenuItem>))}</TextField>
    <FormControlLabel control={<Checkbox checked={misconduct} onChange={(e) => setMisconduct(e.target.checked)} />} label="Dismissed for misconduct" />
    <FormControlLabel control={<Checkbox checked={pf} onChange={(e) => setPf(e.target.checked)} />} label="Period covered by a qualifying provident fund" />
    {w > 0 && (blocked ? (<Typography variant="body1" sx={{ mt: 2 }}>{blocked}</Typography>) : (<><Hero value={'Rs ' + fmt(gratuity)} unit="Gratuity" eq={'Rs ' + fmt(w) + ' x ' + fmt(qualYears) + ' years' + (perYear === 2 ? ' x 2 months a year (Balochistan)' : '')} /><Rows rows={[['Last month\'s wages', 'Rs ' + fmt(w)], ['Service', fmt(y) + ' years ' + fmt(m) + ' months'], ['Qualifying years', fmt(qualYears)], ['Gratuity per year', perYear === 2 ? '2 months\' wages' : '1 month\'s wages (30 days)'], ['Gratuity', 'Rs ' + fmt(gratuity)]]} /></>))}
    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>The law says 30 days' wages per year, which is (salary / 30) x 30 = one month's salary per year. Some calculators use (salary / 26) x 30, which pays about 15% more - that is India's 26-working-day rule, not Pakistan's.</Typography>
    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>Checks: Rs 100,000 x 8 years 7 months = 9 years = Rs 900,000. In Balochistan the same service gives Rs 1,800,000. Rs 60,000 x 7 years 8 months = 9 years = Rs 540,000.</Typography>
  </Wrap>);
}

// Provident fund projector: there is NO single statutory rate - the fund is
// employer-specific, typically 8.33% to 10% of basic salary from each side.
// The tool projects the fund value with compound growth on monthly
// contributions: each month's contribution grows at the monthly return
// (annual return / 12) for the months left. EOBI is SEPARATE (employer 5% +
// employee 1% of the notified minimum wage, not of salary) - do not confuse
// the two.
export function pfFutureValue(monthly, annualPct, months) {
  const r = annualPct / 100 / 12;
  if (months <= 0) return 0;
  if (r === 0) return monthly * months;
  return monthly * ((Math.pow(1 + r, months) - 1) / r);
}
export function ProvidentFundTool() {
  const [basic, setBasic] = useState('100000'); const [empPct, setEmpPct] = useState('10'); const [erPct, setErPct] = useState('10'); const [ret, setRet] = useState('10'); const [years, setYears] = useState('10');
  const b = parseFloat(basic) || 0; const ep = parseFloat(empPct) || 0; const rp = parseFloat(erPct) || 0; const rt = parseFloat(ret) || 0; const y = parseFloat(years) || 0;
  const empMonthly = b * ep / 100; const erMonthly = b * rp / 100; const totalMonthly = empMonthly + erMonthly;
  const months = y * 12;
  const totalContrib = totalMonthly * months;
  const fv = pfFutureValue(totalMonthly, rt, months);
  const growth = fv - totalContrib;
  return (<Wrap note="Provident fund is employer-specific: typically 8.33% to 10% of basic salary from each side, set by your employer's own fund rules, not by one law. EOBI is separate - employer 5% plus employee 1% of the notified minimum wage, not of your salary. This tool projects the fund value; the actual return depends on where your fund invests, so the result is an estimate, not a promise.">
    <TextField fullWidth label="Basic salary (Rs per month)" type="number" value={basic} onChange={(e) => setBasic(e.target.value)} sx={{ mb: 2 }} />
    <TextField fullWidth label="Employee contribution (% of basic salary, typically 8.33 to 10)" type="number" value={empPct} onChange={(e) => setEmpPct(e.target.value)} sx={{ mb: 2 }} />
    <TextField fullWidth label="Employer contribution (% of basic salary, typically 8.33 to 10)" type="number" value={erPct} onChange={(e) => setErPct(e.target.value)} sx={{ mb: 2 }} />
    <TextField fullWidth label="Expected annual return (%)" type="number" value={ret} onChange={(e) => setRet(e.target.value)} sx={{ mb: 2 }} />
    <TextField fullWidth label="Years in the fund" type="number" value={years} onChange={(e) => setYears(e.target.value)} />
    {b > 0 && (<><Hero value={'Rs ' + fmt(fv)} unit={'Projected fund value after ' + fmt(y) + ' years'} eq={'Rs ' + fmt(totalMonthly) + ' a month, growing at ' + fmt(rt) + '% a year'} /><Rows rows={[['Employee contribution', 'Rs ' + fmt(empMonthly) + ' a month'], ['Employer contribution', 'Rs ' + fmt(erMonthly) + ' a month'], ['Total contribution', 'Rs ' + fmt(totalMonthly) + ' a month'], ['Total paid in over ' + fmt(y) + ' years', 'Rs ' + fmt(totalContrib)], ['Growth from returns', 'Rs ' + fmt(growth)], ['Projected fund value', 'Rs ' + fmt(fv)]]} /></>)}
    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>How it grows: every month's contribution earns the monthly return (annual return / 12) for the months left, so money paid in early grows the most. The formula is monthly contribution x ((1 + monthly rate)^months - 1) / monthly rate.</Typography>
    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>Check: Rs 100,000 basic, 10% each side, 10% return, 10 years = Rs 20,000 a month, Rs 2,400,000 paid in, projected value about Rs 4,096,900.</Typography>
  </Wrap>);
}
