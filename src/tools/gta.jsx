// GTA 6 tools (Nov 2026 launch). All facts are the verified launch facts:
// release 19 Nov 2026 on PS5 + Xbox Series X|S only; Standard $79.99, Ultimate
// $99.99; download about 210 GB (up to 212 GB reported); pre-load 10 Nov 2026;
// no disc in the box (download code only); no PC version announced and no
// official PC specs - the PC checker uses predicted specs and says so plainly.
// USD to PKR default 277 matches the site's Currency tool default.
import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, TextField, Box, MenuItem, ToggleButton, ToggleButtonGroup, Alert, Button, Checkbox, FormControlLabel } from '@mui/material';
import { fmt, Hero, Rows } from './shared.jsx';

function Wrap({ children, note }) {
  return (<><Card elevation={2} sx={{ borderRadius: 3 }}><CardContent sx={{ p: 3 }}>{children}</CardContent></Card>{note && <Alert severity="info" sx={{ mt: 2 }}>{note}</Alert>}</>);
}

const USD_RATE = 277;
const EDITIONS = { standard: { label: 'Standard', usd: 79.99 }, ultimate: { label: 'Ultimate', usd: 99.99 } };
export function Gta6PriceTool() {
  const [edition, setEdition] = useState('standard');
  const [rate, setRate] = useState(String(USD_RATE));
  const [salary, setSalary] = useState('');
  const usd = EDITIONS[edition].usd;
  const r = parseFloat(rate) || 0;
  const pkr = usd * r;
  const withCharges = pkr * 1.05;
  const sal = parseFloat(salary) || 0;
  const days = sal > 0 ? pkr / (sal / 30) : 0;
  return (<Wrap note="No official price in rupees - Pakistan has no PlayStation Store, so most players use a UAE or US account and pay in dollars. The rupee figure is an estimate at the rate you enter. Bank and card charges on international payments are about 5%. Local game stores list the Standard Edition around Rs 22,999 to Rs 28,499.">
    <ToggleButtonGroup value={edition} exclusive fullWidth onChange={(_, nv) => nv && setEdition(nv)} sx={{ mb: 2 }}><ToggleButton value="standard">Standard - $79.99</ToggleButton><ToggleButton value="ultimate">Ultimate - $99.99</ToggleButton></ToggleButtonGroup>
    <TextField fullWidth label="USD to PKR rate (Rs per $1)" type="number" value={rate} onChange={(e) => setRate(e.target.value)} sx={{ mb: 2 }} />
    <TextField fullWidth label="Your monthly salary in Rs (optional)" type="number" value={salary} onChange={(e) => setSalary(e.target.value)} sx={{ mb: 2 }} />
    {r > 0 && (<><Hero value={'Rs ' + fmt(Math.round(pkr))} unit={'GTA 6 ' + EDITIONS[edition].label + ' Edition in Pakistan'} eq={'$' + usd + ' × Rs ' + fmt(r) + ' per $1'} /><Rows rows={[['Edition', EDITIONS[edition].label + ' - $' + usd], ['Price in rupees', 'Rs ' + fmt(Math.round(pkr))], ['With bank charges (about 5%)', 'Rs ' + fmt(Math.round(withCharges))], ['Release date', '19 November 2026'], ['Platforms', 'PS5 and Xbox Series X|S']]} /></>)}
    {sal > 0 && (<Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>At a monthly salary of Rs {fmt(sal)}, the {EDITIONS[edition].label} Edition costs about {fmt(days)} days of your salary.</Typography>)}
    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>Checks: Standard $79.99 × Rs 277 = Rs 22,157. Ultimate $99.99 × Rs 277 = Rs 27,697.</Typography>
    <Box sx={{ mt: 2 }}><Button variant="outlined" component="a" href="/tools/gta-6-download-time-calculator/">How long will the 210 GB download take?</Button></Box>
  </Wrap>);
}

const SPEEDS = ['10', '20', '50', '100'];
export function Gta6DownloadTool() {
  const [gb, setGb] = useState('210');
  const [speed, setSpeed] = useState('50');
  const g = parseFloat(gb) || 0;
  const s = parseFloat(speed) || 0;
  const secs = s > 0 ? (g * 8 * 1000) / s : 0;
  const h = Math.floor(secs / 3600);
  const m = Math.round((secs % 3600) / 60);
  const timeStr = secs > 0 ? (h > 0 ? h + 'h ' + m + 'm' : m + 'm') : '-';
  return (<Wrap note="Download size is about 210 GB (up to 212 GB reported). Pre-load starts 10 November 2026 and the game unlocks 19 November. Actual download time also depends on your connection and how busy the store servers are.">
    <TextField fullWidth label="Download size (GB)" type="number" value={gb} onChange={(e) => setGb(e.target.value)} sx={{ mb: 2 }} />
    <Typography variant="body2" color="text.secondary" gutterBottom>Your internet speed (Mbps)</Typography>
    <ToggleButtonGroup value={speed} exclusive fullWidth onChange={(_, nv) => nv && setSpeed(nv)} sx={{ mb: 2 }}>{SPEEDS.map((v) => (<ToggleButton key={v} value={v}>{v} Mbps</ToggleButton>))}</ToggleButtonGroup>
    <TextField fullWidth label="Or type your speed (Mbps)" type="number" value={speed} onChange={(e) => setSpeed(e.target.value)} sx={{ mb: 2 }} />
    {g > 0 && s > 0 && (<><Hero value={timeStr} unit={'to download ' + fmt(g) + ' GB at ' + fmt(s) + ' Mbps'} eq={fmt(Math.round(secs / 3600 * 10) / 10) + ' hours'} /><Rows rows={[['Download size', fmt(g) + ' GB'], ['Your speed', fmt(s) + ' Mbps'], ['Download time', timeStr], ['Pre-load starts', '10 November 2026'], ['Game unlocks', '19 November 2026']]} /></>)}
    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>Checks: 210 GB at 50 Mbps = 33,600 seconds = 9h 20m. At 100 Mbps = 4h 40m. At 20 Mbps = 23h 20m.</Typography>
    <Box sx={{ mt: 2 }}><Button variant="outlined" component="a" href="/tools/gta-6-price-in-pakistan/">What does GTA 6 cost in Pakistan?</Button></Box>
  </Wrap>);
}

const PRELOAD = Date.parse('2026-11-10T00:00:00+05:00');
const LAUNCH = Date.parse('2026-11-19T00:00:00+05:00');
export function Gta6CountdownTool() {
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
  return (<Wrap note="Pakistan has no PlayStation Store, so most players use a UAE or US account. The game unlocks at local midnight in each store region - on a UAE account that is 1:00 AM PKT on 19 November, on a US (Eastern) account 10:00 AM PKT. Pre-load starts 10 November (local midnight).">
    <ToggleButtonGroup value={target} exclusive fullWidth onChange={(_, nv) => nv && setTarget(nv)} sx={{ mb: 2 }}><ToggleButton value="preload">Pre-load - 10 Nov</ToggleButton><ToggleButton value="launch">Launch - 19 Nov</ToggleButton></ToggleButtonGroup>
    {out ? (<Hero value={target === 'preload' ? 'Pre-load is open!' : 'GTA 6 is out!'} unit={target === 'preload' ? 'Pre-load opened 10 November 2026' : 'Released 19 November 2026 on PS5 and Xbox Series X|S'} />) : (<><Hero value={days + ' days'} unit={label} eq={hours + 'h ' + mins + 'm ' + secs + 's to go'} /><Rows rows={[['Pre-load starts', '10 November 2026'], ['Launch date', '19 November 2026'], ['Platforms', 'PS5 and Xbox Series X|S'], ['PC version', 'Not announced yet'], ['Disc in the box', 'No - download code only']]} /></>)}
    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>The countdown counts down to midnight Pakistan time (PKT) on {dateStr}.</Typography>
    <Box sx={{ mt: 2 }}><Button variant="outlined" component="a" href="/tools/gta-6-price-in-pakistan/">What does GTA 6 cost in Pakistan?</Button></Box>
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

// Total cost to play GTA 6 in Pakistan: console + game (+ optional extras).
// Console prices are shop estimates (editable). PS5 Slim Disc Rs 247,000 and
// PS5 Pro Rs 380,000 from gamesource.pk; Xbox Series S Rs 158,000 from Teefa
// Gaming's Rs 180,000 total (Series S + game) minus the game; Xbox Series X
// Rs 200,000 is an estimate. Game is $79.99/$99.99 at the rate you enter,
// plus about 5% bank charges on the dollar payment.
const CONSOLES = [
  { label: 'PS5 Slim (Disc)', price: 247000 },
  { label: 'PS5 Pro', price: 380000 },
  { label: 'Xbox Series S', price: 158000 },
  { label: 'Xbox Series X', price: 200000 },
];
const EXTRAS = [
  { key: 'controller', label: 'Extra controller', price: 25000 },
  { key: 'headset', label: 'Headset', price: 15000 },
  { key: 'ssd', label: 'Extra 1TB SSD', price: 28000 },
];
export function Gta6TotalCostTool() {
  const [consoleIdx, setConsoleIdx] = useState(0);
  const [consolePrice, setConsolePrice] = useState(String(CONSOLES[0].price));
  const [edition, setEdition] = useState('standard');
  const [rate, setRate] = useState(String(USD_RATE));
  const [extras, setExtras] = useState({ controller: false, headset: false, ssd: false });
  const [extraPrices, setExtraPrices] = useState({ controller: '25000', headset: '15000', ssd: '28000' });
  const cp = parseFloat(consolePrice) || 0;
  const r = parseFloat(rate) || 0;
  const gamePkr = EDITIONS[edition].usd * r;
  const gameCharges = gamePkr * 0.05;
  const extrasTotal = EXTRAS.reduce((sum, e) => sum + (extras[e.key] ? (parseFloat(extraPrices[e.key]) || 0) : 0), 0);
  const total = cp + gamePkr + gameCharges + extrasTotal;
  const changeConsole = (i) => { setConsoleIdx(i); setConsolePrice(String(CONSOLES[i].price)); };
  return (<Wrap note="Console prices are shop estimates - enter the price your shop charges. The game is bought in dollars (no Pakistani PlayStation Store), so the rupee figure is an estimate at the rate you enter, plus about 5% bank charges. As a cross-check: Teefa Gaming put PS5 + game at about Rs 265,000 and Xbox Series S + game at about Rs 180,000.">
    <TextField select fullWidth label="Console" value={consoleIdx} onChange={(e) => changeConsole(parseInt(e.target.value, 10))} sx={{ mb: 2 }}>{CONSOLES.map((c, i) => (<MenuItem key={i} value={i}>{c.label}</MenuItem>))}</TextField>
    <TextField fullWidth label="Console price in Rs (shop price)" type="number" value={consolePrice} onChange={(e) => setConsolePrice(e.target.value)} sx={{ mb: 2 }} />
    <ToggleButtonGroup value={edition} exclusive fullWidth onChange={(_, nv) => nv && setEdition(nv)} sx={{ mb: 2 }}><ToggleButton value="standard">Standard - $79.99</ToggleButton><ToggleButton value="ultimate">Ultimate - $99.99</ToggleButton></ToggleButtonGroup>
    <TextField fullWidth label="USD to PKR rate (Rs per $1)" type="number" value={rate} onChange={(e) => setRate(e.target.value)} sx={{ mb: 2 }} />
    <Typography variant="body2" color="text.secondary" gutterBottom>Optional extras (tick to add)</Typography>
    {EXTRAS.map((e) => (<Box key={e.key} sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}><FormControlLabel control={<Checkbox checked={extras[e.key]} onChange={(ev) => setExtras({ ...extras, [e.key]: ev.target.checked })} />} label={e.label} sx={{ flexGrow: 1 }} /><TextField label="Rs" type="number" size="small" value={extraPrices[e.key]} onChange={(ev) => setExtraPrices({ ...extraPrices, [e.key]: ev.target.value })} sx={{ width: 130 }} disabled={!extras[e.key]} /></Box>))}
    {cp > 0 && r > 0 && (<><Hero value={'Rs ' + fmt(Math.round(total))} unit={'Total cost to play GTA 6 in Pakistan (' + CONSOLES[consoleIdx].label + ' + ' + EDITIONS[edition].label + ')'} eq={'Console Rs ' + fmt(cp) + ' + Game Rs ' + fmt(Math.round(gamePkr)) + ' + charges Rs ' + fmt(Math.round(gameCharges)) + (extrasTotal > 0 ? ' + extras Rs ' + fmt(extrasTotal) : '')} /><Rows rows={[['Console', CONSOLES[consoleIdx].label + ' - Rs ' + fmt(cp)], ['Game (' + EDITIONS[edition].label + ')', 'Rs ' + fmt(Math.round(gamePkr))], ['Bank charges on game (about 5%)', 'Rs ' + fmt(Math.round(gameCharges))], ['Extras', extrasTotal > 0 ? 'Rs ' + fmt(extrasTotal) : 'None'], ['Total', 'Rs ' + fmt(Math.round(total))]]} /></>)}
    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>Checks: PS5 Slim (Disc) Rs 247,000 + Standard Rs 22,157 + charges Rs 1,108 = Rs 270,265. Xbox Series S Rs 158,000 + Standard Rs 22,157 + charges Rs 1,108 = Rs 181,265.</Typography>
    <Box sx={{ mt: 2 }}><Button variant="outlined" component="a" href="/tools/gta-6-price-in-pakistan/">Just the game price in Pakistan</Button></Box>
  </Wrap>);
}
