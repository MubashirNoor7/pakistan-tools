// GTA 6 tools (Nov 2026 launch). Global-first: USA is the default country,
// Canada second, Pakistan kept as an option. All facts are verified:
// release 19 Nov 2026 on PS5 + Xbox Series X|S only; Standard $79.99,
// Ultimate $99.99 (USA, before tax); Canada C$109.99 / C$139.99 (before tax,
// store prices, not a currency conversion); download up to 212 GB (Rockstar
// Newswire, 3 Nov 2026 - supersedes the old 210 GB figure); digital pre-load
// 10 Nov 2026 (PS5 midnight local, Xbox 12:00 AM GMT = 7 PM ET 9 Nov);
// boxed copies (download code only, no disc) from 12 Nov; buy before
// 20 Nov gets the Vintage Vice City Pack; digital pre-order also gets
// 1 month of GTA+. No PC version announced and no official PC specs - the
// PC checker uses predicted specs and says so plainly.
// Console list prices (Nov 2026, before tax, editable in the tool):
// USA - PS5 Slim Disc $649.99, PS5 Pro $899.99, Xbox Series S $499.99,
// Xbox Series X $799.99 (PlayStation Direct / Microsoft Store, Oct 2026).
// Canada - PS5 Slim Disc C$819.99, PS5 Pro C$1,099.99 (Sony Canada, Apr 2026),
// Xbox Series S C$649.99, Xbox Series X C$999.99 (Microsoft Store Canada,
// Oct 2026). Pakistan console prices are shop estimates (unchanged).
// USD to PKR default 277 matches the site's Currency tool default.
import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, TextField, Box, MenuItem, ToggleButton, ToggleButtonGroup, Alert, Button, Checkbox, FormControlLabel } from '@mui/material';
import { fmt, Hero, Rows } from './shared.jsx';

function Wrap({ children, note }) {
  return (<><Card elevation={2} sx={{ borderRadius: 3 }}><CardContent sx={{ p: 3 }}>{children}</CardContent></Card>{note && <Alert severity="info" sx={{ mt: 2 }}>{note}</Alert>}</>);
}

const USD_RATE = 277;
const COUNTRIES = {
  usa: { label: 'USA', sym: '$', game: { standard: 79.99, ultimate: 99.99 } },
  canada: { label: 'Canada', sym: 'C$', game: { standard: 109.99, ultimate: 139.99 } },
  pakistan: { label: 'Pakistan', sym: 'Rs ', game: null },
};
const EDITIONS = { standard: { label: 'Standard' }, ultimate: { label: 'Ultimate' } };
const money = (sym, n, dec) => sym + fmt(dec ? Math.round(n * 100) / 100 : Math.round(n));
function CountryPicker({ value, onChange }) {
  return (<><Typography variant="body2" color="text.secondary" gutterBottom>Country</Typography><ToggleButtonGroup value={value} exclusive fullWidth onChange={(_, nv) => nv && onChange(nv)} sx={{ mb: 2 }}><ToggleButton value="usa">USA</ToggleButton><ToggleButton value="canada">Canada</ToggleButton><ToggleButton value="pakistan">Pakistan</ToggleButton></ToggleButtonGroup></>);
}

export function Gta6PriceTool({ defaultCountry }) {
  const [country, setCountry] = useState(defaultCountry || 'usa');
  const [edition, setEdition] = useState('standard');
  const [rate, setRate] = useState(String(USD_RATE));
  const [salary, setSalary] = useState('');
  const c = COUNTRIES[country];
  const usd = EDITIONS[edition] && (country === 'pakistan' ? (edition === 'standard' ? 79.99 : 99.99) : c.game[edition]);
  const r = parseFloat(rate) || 0;
  const pkr = usd * r;
  const withCharges = pkr * 1.05;
  const sal = parseFloat(salary) || 0;
  const days = sal > 0 ? pkr / (sal / 30) : 0;
  const storePrice = country === 'pakistan' ? null : c.game[edition];
  return (<Wrap note={country === 'pakistan' ? 'No official price in rupees - Pakistan has no PlayStation Store, so most players use a UAE or US account and pay in dollars. The rupee figure is an estimate at the rate you enter. Bank and card charges on international payments are about 5%. Local game stores list the Standard Edition around Rs 22,999 to Rs 28,499.' : 'Prices are the official store prices before tax - tax is added at checkout and varies by state (USA) or province (Canada). Buy before 20 November 2026 and you also get the Vintage Vice City Pack; a digital pre-order also includes 1 month of GTA+.'}>
    <CountryPicker value={country} onChange={setCountry} />
    <ToggleButtonGroup value={edition} exclusive fullWidth onChange={(_, nv) => nv && setEdition(nv)} sx={{ mb: 2 }}><ToggleButton value="standard">Standard - {country === 'pakistan' ? '$79.99' : money(c.sym, c.game.standard, true)}</ToggleButton><ToggleButton value="ultimate">Ultimate - {country === 'pakistan' ? '$99.99' : money(c.sym, c.game.ultimate, true)}</ToggleButton></ToggleButtonGroup>
    {country === 'pakistan' && (<><TextField fullWidth label="USD to PKR rate (Rs per $1)" type="number" value={rate} onChange={(e) => setRate(e.target.value)} sx={{ mb: 2 }} /><TextField fullWidth label="Your monthly salary in Rs (optional)" type="number" value={salary} onChange={(e) => setSalary(e.target.value)} sx={{ mb: 2 }} /></>)}
    {country !== 'pakistan' && (<><Hero value={money(c.sym, storePrice, true)} unit={'GTA 6 ' + EDITIONS[edition].label + ' Edition in ' + c.label + ' (before tax)'} eq={'Release date: 19 November 2026 - PS5 and Xbox Series X|S'} /><Rows rows={[['Edition', EDITIONS[edition].label + ' - ' + money(c.sym, storePrice, true)], ['Price before tax', money(c.sym, storePrice, true)], ['Tax', 'Added at checkout - varies by ' + (country === 'usa' ? 'state' : 'province')], ['Release date', '19 November 2026'], ['Platforms', 'PS5 and Xbox Series X|S']]} /></>)}
    {country === 'pakistan' && r > 0 && (<><Hero value={'Rs ' + fmt(Math.round(pkr))} unit={'GTA 6 ' + EDITIONS[edition].label + ' Edition in Pakistan'} eq={'$' + usd + ' × Rs ' + fmt(r) + ' per $1'} /><Rows rows={[['Edition', EDITIONS[edition].label + ' - $' + usd], ['Price in rupees', 'Rs ' + fmt(Math.round(pkr))], ['With bank charges (about 5%)', 'Rs ' + fmt(Math.round(withCharges))], ['Release date', '19 November 2026'], ['Platforms', 'PS5 and Xbox Series X|S']]} /></>)}
    {country === 'pakistan' && sal > 0 && (<Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>At a monthly salary of Rs {fmt(sal)}, the {EDITIONS[edition].label} Edition costs about {fmt(days)} days of your salary.</Typography>)}
    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>{country === 'pakistan' ? 'Checks: Pakistan Standard $79.99 × Rs 277 = Rs 22,157; Ultimate $99.99 × Rs 277 = Rs 27,697.' : country === 'canada' ? 'Checks: Canada Standard C$109.99, Ultimate C$139.99 (before tax).' : 'Checks: USA Standard $79.99, Ultimate $99.99 (before tax).'}</Typography>
    <Box sx={{ mt: 2 }}><Button variant="outlined" component="a" href="/tools/gta-6-download-time-calculator/">How long will the 212 GB download take?</Button></Box>
  </Wrap>);
}

const SPEEDS = ['10', '20', '50', '100'];
export function Gta6DownloadTool() {
  const [gb, setGb] = useState('212');
  const [speed, setSpeed] = useState('50');
  const g = parseFloat(gb) || 0;
  const s = parseFloat(speed) || 0;
  const secs = s > 0 ? (g * 8 * 1000) / s : 0;
  const h = Math.floor(secs / 3600);
  const m = Math.round((secs % 3600) / 60);
  const timeStr = secs > 0 ? (h > 0 ? h + 'h ' + m + 'm' : m + 'm') : '-';
  return (<Wrap note="Download size is up to 212 GB (Rockstar, 3 November 2026). Pre-load starts 10 November 2026 and the game unlocks 19 November. Actual download time also depends on your connection and how busy the store servers are.">
    <TextField fullWidth label="Download size (GB)" type="number" value={gb} onChange={(e) => setGb(e.target.value)} sx={{ mb: 2 }} />
    <Typography variant="body2" color="text.secondary" gutterBottom>Your internet speed (Mbps)</Typography>
    <ToggleButtonGroup value={speed} exclusive fullWidth onChange={(_, nv) => nv && setSpeed(nv)} sx={{ mb: 2 }}>{SPEEDS.map((v) => (<ToggleButton key={v} value={v}>{v} Mbps</ToggleButton>))}</ToggleButtonGroup>
    <TextField fullWidth label="Or type your speed (Mbps)" type="number" value={speed} onChange={(e) => setSpeed(e.target.value)} sx={{ mb: 2 }} />
    {g > 0 && s > 0 && (<><Hero value={timeStr} unit={'to download ' + fmt(g) + ' GB at ' + fmt(s) + ' Mbps'} eq={fmt(Math.round(secs / 3600 * 10) / 10) + ' hours'} /><Rows rows={[['Download size', fmt(g) + ' GB'], ['Your speed', fmt(s) + ' Mbps'], ['Download time', timeStr], ['Pre-load starts', '10 November 2026'], ['Game unlocks', '19 November 2026']]} /></>)}
    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>Checks: 212 GB at 50 Mbps = 33,920 seconds = 9h 25m. At 100 Mbps = 4h 43m. At 20 Mbps = 23h 33m.</Typography>
    <Box sx={{ mt: 2 }}><Button variant="outlined" component="a" href="/tools/gta-6-price/">How much is GTA 6?</Button></Box>
  </Wrap>);
}

// Countdown targets are midnight Eastern Time (New York / Toronto) - the
// main US/Canada unlock moment. The unlock row and note show only the
// country the visitor picked, so a USA/Canada visitor never sees the
// Pakistan unlock time on this page.
const PRELOAD = Date.parse('2026-11-10T00:00:00-05:00');
const LAUNCH = Date.parse('2026-11-19T00:00:00-05:00');
export function Gta6CountdownTool({ defaultCountry }) {
  const [country, setCountry] = useState(defaultCountry || 'usa');
  const [now, setNow] = useState(Date.now());
  const [target, setTarget] = useState('preload');
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);
  const end = target === 'preload' ? PRELOAD : LAUNCH;
  const diff = Math.max(0, end - now);
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  const secs = Math.floor((diff % 60000) / 1000);
  const out = diff <= 0;
  const label = target === 'preload' ? 'until pre-load opens' : 'until GTA 6 launches';
  const dateStr = target === 'preload' ? '10 November 2026' : '19 November 2026';
  const isPk = country === 'pakistan';
  const unlockLabel = isPk ? 'Unlocks (Pakistan)' : 'Unlocks (USA & Canada)';
  const unlockValue = isPk ? '10:00 AM PKT, 19 November' : 'Midnight Eastern, 19 November';
  const note = isPk
    ? 'Pre-load: on PS5 it opens at midnight local time on 10 November; on Xbox it opens at the same moment worldwide, 12:00 AM GMT on 10 November (7:00 PM Eastern on 9 November). Launch: the game unlocks at 10:00 AM PKT on 19 November in Pakistan (1:00 AM PKT on a UAE account).'
    : 'Pre-load: on PS5 it opens at midnight local time on 10 November; on Xbox it opens at the same moment worldwide, 12:00 AM GMT on 10 November (7:00 PM Eastern on 9 November). Launch: the game unlocks at local midnight on 19 November - midnight Eastern in the USA and Canada.';
  return (<Wrap note={note}>
    <CountryPicker value={country} onChange={setCountry} />
    <ToggleButtonGroup value={target} exclusive fullWidth onChange={(_, nv) => nv && setTarget(nv)} sx={{ mb: 2 }}><ToggleButton value="preload">Pre-load - 10 Nov</ToggleButton><ToggleButton value="launch">Launch - 19 Nov</ToggleButton></ToggleButtonGroup>
    {out ? (<Hero value={target === 'preload' ? 'Pre-load is open!' : 'GTA 6 is out!'} unit={target === 'preload' ? 'Pre-load opened 10 November 2026' : 'Released 19 November 2026 on PS5 and Xbox Series X|S'} />) : (<><Hero value={days + ' days'} unit={label} eq={hours + 'h ' + mins + 'm ' + secs + 's to go'} /><Rows rows={[['Pre-load starts', '10 November 2026'], ['Launch date', '19 November 2026'], [unlockLabel, unlockValue], ['Platforms', 'PS5 and Xbox Series X|S'], ['PC version', 'Not announced yet'], ['Disc in the box', 'No - download code only']]} /></>)}
    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>The countdown counts down to midnight Eastern Time (New York / Toronto) on {dateStr}.</Typography>
    <Box sx={{ mt: 2 }}><Button variant="outlined" component="a" href="/tools/gta-6-price/">How much is GTA 6?</Button></Box>
  </Wrap>);
}

// PC checker - PREDICTED specs only. Rockstar has not announced a PC version
// or official specs. Tiers: 0 below minimum, 1 minimum, 2 recommended, 3 ultra.
const GPU_OPTS = [
  { label: 'GTX 1660 or older / RX 5600 XT or older', tier: 0 },
  { label: 'RTX 2060 / RTX 3060 / RX 5700 / RX 6600', tier: 1 },
  { label: 'RTX 3070 / RTX 4070 / RX 6700 XT / RX 7800 XT', tier: 2 },
  { label: 'RTX 4080 / RTX 4090 / RX 7900 XTX', tier: 3 },
];
const CPU_OPTS = [
  { label: 'i5-9400 / Ryzen 5 3600 or older', tier: 0 },
  { label: 'i5-12400 / Ryzen 5 5600', tier: 1 },
  { label: 'i7-12700K / Ryzen 7 5800X', tier: 2 },
  { label: 'i9-14900K / Ryzen 7 7800X3D', tier: 3 },
];
const RAM_OPTS = [
  { label: '8 GB', tier: 0 },
  { label: '16 GB', tier: 1 },
  { label: '32 GB', tier: 2 },
  { label: '64 GB', tier: 3 },
];
const STORAGE_OPTS = [
  { label: 'Hard drive (HDD)', tier: 0 },
  { label: 'SATA SSD', tier: 1 },
  { label: 'NVMe SSD', tier: 2 },
  { label: 'Fast NVMe SSD (Gen 4)', tier: 3 },
];
const VERDICTS = [
  { title: 'Below minimum - upgrade needed', sub: 'At least one part is below the predicted minimum. See the weakest part below.' },
  { title: 'Minimum - 1080p, 30 fps, Low settings', sub: 'The game should run, but on low settings. Expect 30 fps at 1080p.' },
  { title: 'Recommended - 1440p, 60 fps, High settings', sub: 'Smooth play at 1440p on high settings.' },
  { title: 'Ultra - 4K, 60 fps, Ultra settings', sub: 'Top-tier hardware - ready for 4K on ultra settings.' },
];
export function Gta6PcCheckTool() {
  const [gpu, setGpu] = useState(1);
  const [cpu, setCpu] = useState(1);
  const [ram, setRam] = useState(1);
  const [storage, setStorage] = useState(1);
  const parts = [['Graphics card', GPU_OPTS[gpu].tier], ['Processor', CPU_OPTS[cpu].tier], ['RAM', RAM_OPTS[ram].tier], ['Storage', STORAGE_OPTS[storage].tier]];
  const minTier = Math.min(...parts.map(([, t]) => t));
  const weakest = parts.filter(([, t]) => t === minTier).map(([n]) => n).join(', ');
  const v = VERDICTS[minTier];
  return (<Wrap note="Rockstar has not announced a PC version or official system specs. These are predicted specs from experts and the community, not official requirements. This page will be updated when Rockstar publishes official specs. The PC version is expected about a year after the console launch.">
    <TextField select fullWidth label="Graphics card (GPU)" value={gpu} onChange={(e) => setGpu(parseInt(e.target.value, 10))} sx={{ mb: 2 }}>{GPU_OPTS.map((o, i) => (<MenuItem key={i} value={i}>{o.label}</MenuItem>))}</TextField>
    <TextField select fullWidth label="Processor (CPU)" value={cpu} onChange={(e) => setCpu(parseInt(e.target.value, 10))} sx={{ mb: 2 }}>{CPU_OPTS.map((o, i) => (<MenuItem key={i} value={i}>{o.label}</MenuItem>))}</TextField>
    <TextField select fullWidth label="RAM" value={ram} onChange={(e) => setRam(parseInt(e.target.value, 10))} sx={{ mb: 2 }}>{RAM_OPTS.map((o, i) => (<MenuItem key={i} value={i}>{o.label}</MenuItem>))}</TextField>
    <TextField select fullWidth label="Storage" value={storage} onChange={(e) => setStorage(parseInt(e.target.value, 10))} sx={{ mb: 2 }}>{STORAGE_OPTS.map((o, i) => (<MenuItem key={i} value={i}>{o.label}</MenuItem>))}</TextField>
    <Hero value={v.title} unit={v.sub} eq={'Weakest part: ' + weakest} />
    <Rows rows={[['Graphics card', GPU_OPTS[gpu].label], ['Processor', CPU_OPTS[cpu].label], ['RAM', RAM_OPTS[ram].label], ['Storage', STORAGE_OPTS[storage].label]]} />
    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>Predicted minimum (1080p, 30 fps, Low): RTX 2060 / RX 5700, i5-12400 / Ryzen 5 5600, 16 GB RAM, 150 GB SSD. Predicted recommended (1440p, 60 fps, High): RTX 4070 / RX 7800 XT, i7-12700K / Ryzen 7 5800X, 32 GB RAM, NVMe SSD. An SSD is required - a hard drive will not run the game well.</Typography>
  </Wrap>);
}

// Total cost to play GTA 6: console + game (+ optional extras), in the
// currency you pick. USA/Canada console prices are the official list prices
// (before tax - tax is added at checkout); the game is the local store price,
// so there are no bank charges. Pakistan console prices are shop estimates
// (editable) and the game is bought in dollars, so the rupee figure uses the
// rate you enter plus about 5% bank charges.
const CONSOLES_BY_COUNTRY = {
  usa: [
    { label: 'PS5 Slim (Disc)', price: 649.99 },
    { label: 'PS5 Pro', price: 899.99 },
    { label: 'Xbox Series S', price: 499.99 },
    { label: 'Xbox Series X', price: 799.99 },
  ],
  canada: [
    { label: 'PS5 Slim (Disc)', price: 819.99 },
    { label: 'PS5 Pro', price: 1099.99 },
    { label: 'Xbox Series S', price: 649.99 },
    { label: 'Xbox Series X', price: 999.99 },
  ],
  pakistan: [
    { label: 'PS5 Slim (Disc)', price: 247000 },
    { label: 'PS5 Pro', price: 380000 },
    { label: 'Xbox Series S', price: 158000 },
    { label: 'Xbox Series X', price: 200000 },
  ],
};
// Extras: USA controller $74.99 (GameStop/Best Buy, Oct 2026) and headset
// $99.99 (PlayStation Pulse, Sony, 19 Nov 2026) are verified; the 1TB SSD
// $129.99 is an estimate - edit it. Canada controller C$109.99 is verified
// (Best Buy Canada); headset C$139.99 and SSD C$179.99 are estimates - edit
// them. Pakistan extras are the old shop estimates (unchanged).
const EXTRAS_BY_COUNTRY = {
  usa: [
    { key: 'controller', label: 'Extra controller', price: 74.99, est: false },
    { key: 'headset', label: 'Headset (PlayStation Pulse)', price: 99.99, est: false },
    { key: 'ssd', label: 'Extra 1TB SSD', price: 129.99, est: true },
  ],
  canada: [
    { key: 'controller', label: 'Extra controller', price: 109.99, est: false },
    { key: 'headset', label: 'Headset', price: 139.99, est: true },
    { key: 'ssd', label: 'Extra 1TB SSD', price: 179.99, est: true },
  ],
  pakistan: [
    { key: 'controller', label: 'Extra controller', price: 25000, est: false },
    { key: 'headset', label: 'Headset', price: 15000, est: false },
    { key: 'ssd', label: 'Extra 1TB SSD', price: 28000, est: false },
  ],
};
export function Gta6TotalCostTool({ defaultCountry }) {
  const dc = defaultCountry || 'usa';
  const [country, setCountry] = useState(dc);
  const [consoleIdx, setConsoleIdx] = useState(0);
  const [consolePrice, setConsolePrice] = useState(() => String(CONSOLES_BY_COUNTRY[dc][0].price));
  const [edition, setEdition] = useState('standard');
  const [rate, setRate] = useState(String(USD_RATE));
  const [extras, setExtras] = useState({ controller: false, headset: false, ssd: false });
  const [extraPrices, setExtraPrices] = useState(() => { const ep = {}; EXTRAS_BY_COUNTRY[dc].forEach((e) => { ep[e.key] = String(e.price); }); return ep; });
  const c = COUNTRIES[country];
  const consoles = CONSOLES_BY_COUNTRY[country];
  const extraDefs = EXTRAS_BY_COUNTRY[country];
  const isPk = country === 'pakistan';
  const cp = parseFloat(consolePrice) || 0;
  const r = parseFloat(rate) || 0;
  const gameUsd = edition === 'standard' ? 79.99 : 99.99;
  const gamePrice = isPk ? gameUsd * r : c.game[edition];
  const gameCharges = isPk ? gamePrice * 0.05 : 0;
  const extrasTotal = extraDefs.reduce((sum, e) => sum + (extras[e.key] ? (parseFloat(extraPrices[e.key]) || 0) : 0), 0);
  const total = cp + gamePrice + gameCharges + extrasTotal;
  const changeCountry = (nc) => {
    setCountry(nc); setConsoleIdx(0); setConsolePrice(String(CONSOLES_BY_COUNTRY[nc][0].price));
    const ep = {}; EXTRAS_BY_COUNTRY[nc].forEach((e) => { ep[e.key] = String(e.price); }); setExtraPrices(ep);
    setExtras({ controller: false, headset: false, ssd: false });
  };
  const changeConsole = (i) => { setConsoleIdx(i); setConsolePrice(String(consoles[i].price)); };
  const dec = !isPk;
  const priceLabel = isPk ? 'Console price in Rs (shop price)' : 'Console price (' + c.label + ' list price, before tax)';
  return (<Wrap note={isPk ? 'Console prices are shop estimates - enter the price your shop charges. The game is bought in dollars (no Pakistani PlayStation Store), so the rupee figure is an estimate at the rate you enter, plus about 5% bank charges. As a cross-check: Teefa Gaming put PS5 + game at about Rs 265,000 and Xbox Series S + game at about Rs 180,000.' : 'Console prices are the official list prices before tax - tax is added at checkout and varies by state (USA) or province (Canada). The game is the local store price, so there are no bank charges. Prices change - type the price your store charges if it is different.'}>
    <CountryPicker value={country} onChange={changeCountry} />
    <TextField select fullWidth label="Console" value={consoleIdx} onChange={(e) => changeConsole(parseInt(e.target.value, 10))} sx={{ mb: 2 }}>{consoles.map((co, i) => (<MenuItem key={i} value={i}>{co.label}</MenuItem>))}</TextField>
    <TextField fullWidth label={priceLabel} type="number" value={consolePrice} onChange={(e) => setConsolePrice(e.target.value)} sx={{ mb: 2 }} />
    <ToggleButtonGroup value={edition} exclusive fullWidth onChange={(_, nv) => nv && setEdition(nv)} sx={{ mb: 2 }}><ToggleButton value="standard">Standard - {isPk ? '$79.99' : money(c.sym, c.game.standard, true)}</ToggleButton><ToggleButton value="ultimate">Ultimate - {isPk ? '$99.99' : money(c.sym, c.game.ultimate, true)}</ToggleButton></ToggleButtonGroup>
    {isPk && (<TextField fullWidth label="USD to PKR rate (Rs per $1)" type="number" value={rate} onChange={(e) => setRate(e.target.value)} sx={{ mb: 2 }} />)}
    <Typography variant="body2" color="text.secondary" gutterBottom>Optional extras (tick to add)</Typography>
    {extraDefs.map((e) => (<Box key={e.key} sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}><FormControlLabel control={<Checkbox checked={extras[e.key]} onChange={(ev) => setExtras({ ...extras, [e.key]: ev.target.checked })} />} label={e.label + (e.est ? ' (estimate)' : '')} sx={{ flexGrow: 1 }} /><TextField label={isPk ? 'Rs' : c.sym} type="number" size="small" value={extraPrices[e.key]} onChange={(ev) => setExtraPrices({ ...extraPrices, [e.key]: ev.target.value })} sx={{ width: 130 }} disabled={!extras[e.key]} /></Box>))}
    {cp > 0 && (isPk ? r > 0 : true) && (<><Hero value={money(c.sym, total, dec)} unit={'Total cost to play GTA 6 in ' + c.label + ' (' + consoles[consoleIdx].label + ' + ' + EDITIONS[edition].label + ')'} eq={'Console ' + money(c.sym, cp, dec) + ' + Game ' + money(c.sym, gamePrice, dec) + (gameCharges > 0 ? ' + charges ' + money(c.sym, gameCharges, dec) : '') + (extrasTotal > 0 ? ' + extras ' + money(c.sym, extrasTotal, dec) : '') + ' (before tax)'} /><Rows rows={[['Console', consoles[consoleIdx].label + ' - ' + money(c.sym, cp, dec)], ['Game (' + EDITIONS[edition].label + ')', money(c.sym, gamePrice, dec)], ['Bank charges on game', gameCharges > 0 ? money(c.sym, gameCharges, dec) + ' (about 5%)' : 'None - bought in the local store'], ['Extras', extrasTotal > 0 ? money(c.sym, extrasTotal, dec) : 'None'], ['Total (before tax)', money(c.sym, total, dec)]]} /></>)}
    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>{isPk ? 'Checks: Pakistan PS5 Slim (Disc) Rs 247,000 + Standard Rs 22,157 + charges Rs 1,108 = Rs 270,265.' : country === 'canada' ? 'Checks: Canada PS5 Slim (Disc) C$819.99 + Standard C$109.99 = C$929.98. Canada Xbox Series S C$649.99 + Standard C$109.99 = C$759.98.' : 'Checks: USA PS5 Slim (Disc) $649.99 + Standard $79.99 = $729.98. USA Xbox Series S $499.99 + Standard $79.99 = $579.98.'}</Typography>
    <Box sx={{ mt: 2 }}><Button variant="outlined" component="a" href="/tools/gta-6-price/">How much is GTA 6?</Button></Box>
  </Wrap>);
}
