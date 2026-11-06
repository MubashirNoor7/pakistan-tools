// GTA 6 tools (Nov 2026 launch). All facts are the verified launch facts:
// release 19 Nov 2026 on PS5 + Xbox Series X|S only; Standard $79.99, Ultimate
// $99.99; download about 210 GB (up to 212 GB reported); pre-load 10 Nov 2026;
// no disc in the box (download code only); no PC version announced and no
// official PC specs - the PC checker uses predicted specs and says so plainly.
// USD to PKR default 277 matches the site's Currency tool default.
import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, TextField, Box, MenuItem, ToggleButton, ToggleButtonGroup, Alert, Button } from '@mui/material';
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

const LAUNCH = Date.parse('2026-11-19T00:00:00+05:00');
export function Gta6CountdownTool() {
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);
  const diff = Math.max(0, LAUNCH - now);
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  const secs = Math.floor((diff % 60000) / 1000);
  const out = diff <= 0;
  return (<Wrap note="Pakistan has no PlayStation Store, so most players use a UAE or US account. The game unlocks at local midnight in each store region - on a UAE account that is 1:00 AM PKT on 19 November, on a US (Eastern) account 10:00 AM PKT. Pre-load starts 10 November.">
    {out ? (<Hero value="GTA 6 is out!" unit="Released 19 November 2026 on PS5 and Xbox Series X|S" />) : (<><Hero value={days + ' days'} unit="until GTA 6 launches" eq={hours + 'h ' + mins + 'm ' + secs + 's to go'} /><Rows rows={[['Launch date', '19 November 2026'], ['Pre-load starts', '10 November 2026'], ['Platforms', 'PS5 and Xbox Series X|S'], ['PC version', 'Not announced yet'], ['Disc in the box', 'No - download code only']]} /></>)}
    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>The countdown counts down to midnight Pakistan time (PKT) on 19 November 2026.</Typography>
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
