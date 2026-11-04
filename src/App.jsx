import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Container, Card, CardContent, Box, TextField, InputAdornment, ToggleButton, ToggleButtonGroup, Chip, Stack, Button, List, ListItem, ListItemText, ListItemButton, Divider, Accordion, AccordionSummary, AccordionDetails, Table, TableBody, TableRow, TableCell, CssBaseline } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CalculateIcon from '@mui/icons-material/Calculate';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { KanalTool, PlotSizeTool, fmt } from './tools/property.jsx';
import { SalaryTaxTool, BpsTool, PtaTool, FreelancerTool, ZakatTool } from './tools/tax.jsx';
import { FuelTool, HeicTool, AvifTool, WebpTool } from './tools/utility.jsx';
import { RentVsBuyTool, TaxSlabTool, GoldTool, PrizeBondTool, JpgToPdfTool, FuelAverageTool, CurrencyTool } from './tools/newtools.jsx';
import { LoanEmiTool, MortgageTool, QrTool, BmiTool, AgeTool, PercentageTool, WordCounterTool, PasswordTool, CgpaTool, PngToJpgTool, PdfToJpgTool } from './tools/globaltools.jsx';
import { SalaryCalcTool, SipTool, DateCalcTool, AreaCalcTool, HomeLoanTool, UnitConverterTool, FontTool, LoveTool, AttendanceTool, CarLoanTool } from './tools/countrytools.jsx';

function MarlaTool() {
  const [std, setStd] = useState('272.25'); const [custom, setCustom] = useState('225'); const [mode, setMode] = useState('marla'); const [val, setVal] = useState('5');
  const s = std === 'custom' ? parseFloat(custom) || 0 : parseFloat(std); const v = parseFloat(val) || 0; const valid = v > 0 && s > 0;
  const sqft = mode === 'marla' ? v * s : v; const marla = mode === 'marla' ? v : v / s;
  return (<Card elevation={2} sx={{ borderRadius: 3 }}><CardContent sx={{ p: 3 }}>
    <ToggleButtonGroup value={std} exclusive fullWidth onChange={(_, nv) => nv && setStd(nv)} sx={{ mb: 2 }}>
      <ToggleButton value="225">225 sq ft</ToggleButton><ToggleButton value="272.25">272.25 sq ft</ToggleButton><ToggleButton value="custom">Custom</ToggleButton>
    </ToggleButtonGroup>
    {std === 'custom' && <TextField fullWidth label="Custom sq ft per Marla" type="number" value={custom} onChange={(e) => setCustom(e.target.value)} sx={{ mb: 2 }} />}
    <TextField fullWidth label={mode === 'marla' ? 'Marla' : 'Square Feet'} type="number" value={val} onChange={(e) => setVal(e.target.value)} inputProps={{ inputMode: 'decimal' }} InputProps={{ endAdornment: <InputAdornment position="end">{mode === 'marla' ? 'Marla' : 'Sq Ft'}</InputAdornment> }} sx={{ '& input': { fontSize: 26, fontWeight: 700 } }} />
    {mode === 'marla' && <Stack direction="row" spacing={1} sx={{ mt: 2 }}>{[1, 5, 10, 20].map((n) => (<Chip key={n} label={n} variant="outlined" clickable onClick={() => setVal(String(n))} />))}</Stack>}
    <Box textAlign="center" sx={{ py: 3 }}><Typography variant="h2" fontWeight={800}>{valid ? fmt(mode === 'marla' ? sqft : marla) : '—'}</Typography><Typography color="text.secondary">{mode === 'marla' ? 'Square Feet' : 'Marla'}</Typography><Typography variant="body2" color="text.disabled" sx={{ mt: 1 }}>{valid && (mode === 'marla' ? `${fmt(v)} Marla × ${fmt(s)} sq ft` : `${fmt(v)} sq ft ÷ ${fmt(s)} sq ft`)}</Typography></Box>
    {valid && <List disablePadding>{mode === 'marla' ? (<><ListItem disableGutters><ListItemText primary="Square Yards" /><Typography fontWeight={700}>{fmt(sqft / 9)}</Typography></ListItem><Divider /><ListItem disableGutters><ListItemText primary="Square Metres" /><Typography fontWeight={700}>{fmt(sqft / 10.7639)}</Typography></ListItem><Divider /><ListItem disableGutters><ListItemText primary="Kanal" /><Typography fontWeight={700}>{fmt(v / 20)}</Typography></ListItem><Divider /><ListItem disableGutters><ListItemText primary="Acre" /><Typography fontWeight={700}>{fmt(v / 160)}</Typography></ListItem></>) : (<><ListItem disableGutters><ListItemText primary="Kanal" /><Typography fontWeight={700}>{fmt(marla / 20)}</Typography></ListItem><Divider /><ListItem disableGutters><ListItemText primary="Square Yards" /><Typography fontWeight={700}>{fmt(v / 9)}</Typography></ListItem></>)}</List>}
    <Button fullWidth variant="outlined" startIcon={<SwapHorizIcon />} sx={{ mt: 3 }} onClick={() => { if (mode === 'marla') { setMode('sqft'); setVal(valid ? String(sqft) : val); } else { setMode('marla'); setVal(valid ? String(marla) : val); } }}>{mode === 'marla' ? 'Switch to Sq Ft → Marla' : 'Switch to Marla → Sq Ft'}</Button>
  </CardContent></Card>);
}

const TOOLS = [
  { id: 'marla', title: 'Marla to Sq Ft Converter Pakistan (2026)', cat: 'Property', el: <MarlaTool /> },
  { id: 'kanal', title: 'Kanal to Marla Converter Pakistan', cat: 'Property', el: <KanalTool /> },
  { id: 'plotsize', title: 'Plot Size Calculator: Length × Width to Marla', cat: 'Property', el: <PlotSizeTool /> },
  { id: 'salarytax', title: 'Pakistan Salary Tax Calculator 2026-27', cat: 'Tax & salary', el: <SalaryTaxTool /> },
  { id: 'bps', title: 'BPS Salary Calculator Pakistan 2026-27', cat: 'Tax & salary', el: <BpsTool /> },
  { id: 'pta', title: 'PTA Tax Calculator Pakistan by Phone Model', cat: 'Tax & salary', el: <PtaTool /> },
  { id: 'freelancer', title: 'Freelancer Tax Calculator Pakistan (154A)', cat: 'Tax & salary', el: <FreelancerTool /> },
  { id: 'zakat', title: 'Zakat Calculator Pakistan 2026: Cash, Gold', cat: 'Tax & salary', el: <ZakatTool /> },
  { id: 'fuel', title: 'Fuel Trip Cost Calculator Pakistan (OGRA)', cat: 'Utility', el: <FuelTool /> },
  { id: 'heic', title: 'HEIC to JPG Converter Online (Free, Private)', cat: 'Files — private', el: <HeicTool /> },
  { id: 'avif', title: 'AVIF to PNG Converter Online Free', cat: 'Files — private', el: <AvifTool /> },
  { id: 'webp', title: 'WebP to JPG Converter Online Free', cat: 'Files — private', el: <WebpTool /> },
  { id: 'rentvsbuy', title: 'Rent vs Buy Calculator Pakistan', cat: 'Property', el: <RentVsBuyTool /> },
  { id: 'taxslab', title: 'Pakistan Tax Slab 2026-27: Which Slab Are You In?', cat: 'Tax & salary', el: <TaxSlabTool /> },
  { id: 'gold', title: 'Gold Price Pakistan Today: 1 Tola Calculator', cat: 'Prices', el: <GoldTool /> },
  { id: 'prizebond', title: 'Prize Bond Pakistan: Prize After Tax Calculator', cat: 'Prices', el: <PrizeBondTool /> },
  { id: 'jpgtopdf', title: 'JPG to PDF Converter Online (Free, Private)', cat: 'Files — private', el: <JpgToPdfTool /> },
  { id: 'fuelavg', title: 'Fuel Average Calculator Pakistan (km per litre)', cat: 'Utility', el: <FuelAverageTool /> },
  { id: 'currency', title: 'Currency Converter: USD to PKR & More', cat: 'Prices', el: <CurrencyTool /> },
  { id: 'loanemi', title: 'Loan EMI Calculator', cat: 'Finance — global', el: <LoanEmiTool /> },
  { id: 'mortgage', title: 'Mortgage Calculator: How Much House Can I Afford?', cat: 'Finance — global', el: <MortgageTool /> },
  { id: 'qr', title: 'QR Code Generator (Free, Private)', cat: 'Tools — global', el: <QrTool /> },
  { id: 'bmi', title: 'BMI Calculator', cat: 'Health — global', el: <BmiTool /> },
  { id: 'age', title: 'Age Calculator (Date of Birth)', cat: 'Tools — global', el: <AgeTool /> },
  { id: 'percentage', title: 'Percentage Calculator', cat: 'Tools — global', el: <PercentageTool /> },
  { id: 'wordcounter', title: 'Word Counter & Character Counter', cat: 'Tools — global', el: <WordCounterTool /> },
  { id: 'password', title: 'Password Generator (Secure, Private)', cat: 'Tools — global', el: <PasswordTool /> },
  { id: 'cgpa', title: 'CGPA Calculator (4.0 Scale)', cat: 'Study — global', el: <CgpaTool /> },
  { id: 'pngtojpg', title: 'PNG to JPG Converter Online (Free, Private)', cat: 'Files — global', el: <PngToJpgTool /> },
  { id: 'pdftojpg', title: 'PDF to JPG Converter Online (Free, Private)', cat: 'Files — global', el: <PdfToJpgTool /> },
  { id: 'salarycalc', title: 'Salary Calculator (Net Salary After Tax)', cat: 'Finance — global', el: <SalaryCalcTool /> },
  { id: 'sip', title: 'SIP Calculator (Monthly Investment + Step-up)', cat: 'Finance — India/global', el: <SipTool /> },
  { id: 'datecalc', title: 'Date Calculator: Days Between Dates & Weekday', cat: 'Tools — global', el: <DateCalcTool /> },
  { id: 'areacalc', title: 'Area Calculator (Room & Land Area)', cat: 'Tools — global', el: <AreaCalcTool /> },
  { id: 'homeloan', title: 'Home Loan Calculator (EMI + Total Interest)', cat: 'Finance — global', el: <HomeLoanTool /> },
  { id: 'unitconv', title: 'Unit Converter: Length, Weight & Temperature', cat: 'Tools — global', el: <UnitConverterTool /> },
  { id: 'fontconv', title: 'Font Converter: Stylish Text Generator', cat: 'Tools — global', el: <FontTool /> },
  { id: 'love', title: 'Love Calculator (For Fun Only)', cat: 'Fun — global', el: <LoveTool /> },
  { id: 'attendance', title: 'Attendance Calculator (Students)', cat: 'Study — global', el: <AttendanceTool /> },
  { id: 'carloan', title: 'Car Loan Calculator (EMI + Total Interest)', cat: 'Finance — global', el: <CarLoanTool /> },
];

export default function App() {
  const [tool, setTool] = useState(null);
  const cur = TOOLS.find((t) => t.id === tool);
  return (<>
    <CssBaseline />
    <AppBar position="static" color="primary" elevation={0}><Toolbar><Box sx={{ bgcolor: 'rgba(255,255,255,0.2)', borderRadius: 2, p: 0.5, mr: 1.5, display: 'flex' }}><CalculateIcon /></Box><Typography variant="h6" fontWeight={700}>Pakistan Tools</Typography></Toolbar></AppBar>
    <Box sx={{ bgcolor: '#f5f7fa', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="sm">
        {!cur ? (<>
          <Typography variant="h4" fontWeight={800} gutterBottom>What do you want to calculate?</Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>{TOOLS.length} tools, one style. No sign-up.</Typography>
          <Card elevation={1} sx={{ borderRadius: 3, mt: 2 }}><List>{TOOLS.map((t, i) => (<React.Fragment key={t.id}>{i > 0 && <Divider />}<ListItemButton onClick={() => setTool(t.id)}><ListItemText primary={t.title} secondary={t.cat} /></ListItemButton></React.Fragment>))}</List></Card>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 3, textAlign: 'center' }}>Tax, bill and fuel results are estimates — confirm official rates before a financial decision.</Typography>
        </>) : (<>
          <Button startIcon={<ArrowBackIcon />} onClick={() => setTool(null)} sx={{ mb: 2 }}>All tools</Button>
          <Typography variant="h4" fontWeight={800} gutterBottom>{cur.title}</Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>{cur.cat} · No sign-up.</Typography>
          {cur.el}
          {cur.id === 'marla' && (<>
            <Box sx={{ bgcolor: '#fff8e1', borderRadius: 2, p: 2, mt: 2 }}><Typography variant="body2">225 sq ft is common in housing societies like DHA and Bahria Town. 272.25 sq ft is the revenue-record Marla. Confirm from your plot documents which one applies to you.</Typography></Box>
            <Accordion sx={{ mt: 2 }}><AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography fontWeight={700}>How it works</Typography></AccordionSummary><AccordionDetails><Typography variant="body2" color="text.secondary">Square feet = Marla × sq ft per Marla. Square yards = square feet ÷ 9. Square metres = square feet ÷ 10.7639. Kanal = Marla ÷ 20. Acre = Marla ÷ 160.</Typography></AccordionDetails></Accordion>
            <Accordion><AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography fontWeight={700}>225 vs 272.25 — quick table</Typography></AccordionSummary><AccordionDetails><Table size="small"><TableBody>{[[1, 225, 272.25], [5, 1125, 1361.25], [10, 2250, 2722.5], [20, 4500, 5445]].map(([m, a, b]) => (<TableRow key={m}><TableCell>{m === 20 ? '20 = 1 Kanal' : `${m} Marla`}</TableCell><TableCell>{fmt(a)}</TableCell><TableCell>{fmt(b)}</TableCell></TableRow>))}</TableBody></Table></AccordionDetails></Accordion>
            <Accordion><AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography fontWeight={700}>Common questions</Typography></AccordionSummary><AccordionDetails><Typography variant="body2" color="text.secondary" paragraph><b>How many Marla in 1 Kanal?</b> 20 Marla, under both standards.</Typography><Typography variant="body2" color="text.secondary"><b>Which standard should I use?</b> The one written in your plot documents.</Typography></AccordionDetails></Accordion>
          </>)}
        </>)}
      </Container>
    </Box>
  </>);
}
