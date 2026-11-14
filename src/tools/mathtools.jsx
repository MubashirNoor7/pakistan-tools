import React, { useState } from 'react';
import { Card, CardContent, Typography, TextField, Box, MenuItem, Alert } from '@mui/material';
import { fmt, Hero, Rows } from './shared.jsx';

function Wrap({ children, note }) {
  return (<><Card elevation={2} sx={{ borderRadius: 3 }}><CardContent sx={{ p: 3 }}>{children}</CardContent></Card>{note && <Alert severity="info" sx={{ mt: 2 }}>{note}</Alert>}</>);
}
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) { const t = a % b; a = b; b = t; } return a; };
const SUP = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
const sup = (n) => String(n).split('').map((d) => SUP[d] || '').join('');
const fracStr = (n, d) => d === 1 ? String(n) : n + '/' + d;
const mixedStr = (n, d) => {
  if (d === 1) return String(n);
  if (Math.abs(n) < d) return fracStr(n, d);
  const whole = Math.trunc(n / d); const rem = Math.abs(n % d);
  return rem === 0 ? String(whole) : whole + ' ' + rem + '/' + d;
};

// Fraction calculator - add, subtract, multiply and divide two fractions.
// Everything is simplified with the GCD, so the answer is always in lowest terms.
export function FractionTool() {
  const [n1, setN1] = useState('1'); const [d1, setD1] = useState('2');
  const [n2, setN2] = useState('1'); const [d2, setD2] = useState('3');
  const [op, setOp] = useState('+');
  const a = parseInt(n1, 10); const b = parseInt(d1, 10); const c = parseInt(n2, 10); const d = parseInt(d2, 10);
  const valid = [a, b, c, d].every((x) => Number.isInteger(x)) && b !== 0 && d !== 0;
  const divZero = valid && op === '÷' && c === 0;
  let rn = 0, rd = 1, steps = '';
  if (valid && !divZero) {
    if (op === '+') { rn = a * d + c * b; rd = b * d; steps = `${a}/${b} + ${c}/${d} = ${a * d}/${b * d} + ${c * b}/${b * d} = ${rn}/${rd}`; }
    else if (op === '−') { rn = a * d - c * b; rd = b * d; steps = `${a}/${b} − ${c}/${d} = ${a * d}/${b * d} − ${c * b}/${b * d} = ${rn}/${rd}`; }
    else if (op === '×') { rn = a * c; rd = b * d; steps = `${a}/${b} × ${c}/${d} = ${a * c}/${b * d} = ${rn}/${rd}`; }
    else { rn = a * d; rd = b * c; steps = `${a}/${b} ÷ ${c}/${d} = ${a}/${b} × ${d}/${c} = ${rn}/${rd}`; }
    const g = gcd(rn, rd); rn = rn / g; rd = rd / g;
  }
  const dec = valid && !divZero && rd !== 0 ? rn / rd : 0;
  return (<Wrap note="Fractions are simplified to lowest terms with the greatest common divisor (GCD). Whole numbers work too: enter a whole number over 1, for example 3/1.">
    <Box sx={{ display: 'flex', gap: 1, mb: 2, alignItems: 'center' }}>
      <TextField fullWidth label="First numerator" type="number" value={n1} onChange={(e) => setN1(e.target.value)} />
      <Typography variant="h6">/</Typography>
      <TextField fullWidth label="First denominator" type="number" value={d1} onChange={(e) => setD1(e.target.value)} />
    </Box>
    <TextField select fullWidth label="Operation" value={op} onChange={(e) => setOp(e.target.value)} sx={{ mb: 2 }}>
      <MenuItem value="+">Add (+)</MenuItem>
      <MenuItem value="−">Subtract (−)</MenuItem>
      <MenuItem value="×">Multiply (×)</MenuItem>
      <MenuItem value="÷">Divide (÷)</MenuItem>
    </TextField>
    <Box sx={{ display: 'flex', gap: 1, mb: 2, alignItems: 'center' }}>
      <TextField fullWidth label="Second numerator" type="number" value={n2} onChange={(e) => setN2(e.target.value)} />
      <Typography variant="h6">/</Typography>
      <TextField fullWidth label="Second denominator" type="number" value={d2} onChange={(e) => setD2(e.target.value)} />
    </Box>
    {!valid && <Typography variant="body1" sx={{ mt: 2 }}>Enter whole numbers for both fractions. Denominators cannot be 0.</Typography>}
    {valid && divZero && <Typography variant="body1" sx={{ mt: 2 }}>You cannot divide by zero. Change the second fraction.</Typography>}
    {valid && !divZero && (<><Hero value={fracStr(rn, rd)} unit={'= ' + mixedStr(rn, rd) + ' = ' + fmt(dec)} eq={steps} /><Rows rows={[['Simplified fraction', fracStr(rn, rd)], ['As a mixed number', mixedStr(rn, rd)], ['As a decimal', fmt(dec)], ['As a percentage', fmt(dec * 100) + '%']]} /></>)}
    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>Check: 1/2 + 1/3 = 5/6 = 0.83. 3/4 − 1/8 = 5/8. 2/3 × 3/5 = 2/5. 3/4 ÷ 2/5 = 15/8 = 1 7/8.</Typography>
  </Wrap>);
}

// Factor calculator - every factor of a whole number, plus its prime factorization.
export function FactorTool() {
  const [raw, setRaw] = useState('60');
  const n = parseInt(raw, 10);
  const ok = Number.isInteger(n) && n >= 1 && n <= 1000000000;
  let factors = []; let primes = [];
  if (ok) {
    for (let i = 1; i * i <= n; i++) { if (n % i === 0) { factors.push(i); if (i !== n / i) factors.push(n / i); } }
    factors.sort((a, b) => a - b);
    let rem = n;
    for (let p = 2; p * p <= rem; p++) { let count = 0; while (rem % p === 0) { rem /= p; count++; } if (count) primes.push([p, count]); }
    if (rem > 1) primes.push([rem, 1]);
  }
  const primeStr = n === 1 ? '1 has no prime factors' : primes.map(([p, c]) => c === 1 ? String(p) : p + sup(c)).join(' × ');
  return (<Wrap note="Factors are the whole numbers that divide your number exactly, with no remainder. Prime factorization breaks the number into prime numbers multiplied together.">
    <TextField fullWidth label="Whole number (1 to 1,000,000,000)" type="number" value={raw} onChange={(e) => setRaw(e.target.value)} sx={{ mb: 2 }} />
    {!ok && <Typography variant="body1" sx={{ mt: 2 }}>Enter a whole number from 1 to 1,000,000,000. Decimals, 0 and negative numbers have no factor list.</Typography>}
    {ok && (<><Hero value={primeStr} unit={n === 1 ? 'Prime factorization of 1' : 'Prime factorization of ' + fmt(n)} /><Rows rows={[['Number of factors', fmt(factors.length)], ['Smallest factor', '1'], ['Largest factor', fmt(n)], ['Is it prime?', primes.length === 1 && primes[0][1] === 1 && n > 1 ? 'Yes - only 1 and itself divide it' : 'No']]} />
      <Typography variant="subtitle1" fontWeight={700} sx={{ mt: 3, mb: 1 }}>All factors of {fmt(n)}</Typography>
      <Typography variant="body1">{factors.map((f) => fmt(f)).join(', ')}</Typography></>)}
    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>Check: 60 = 2² × 3 × 5, with 12 factors: 1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60.</Typography>
  </Wrap>);
}

// LCM calculator - lowest common multiple of two or three whole numbers.
export function LcmTool() {
  const [aRaw, setARaw] = useState('12'); const [bRaw, setBRaw] = useState('18'); const [cRaw, setCRaw] = useState('');
  const a = parseInt(aRaw, 10); const b = parseInt(bRaw, 10); const c = cRaw.trim() === '' ? null : parseInt(cRaw, 10);
  const nums = [a, b, ...(c === null ? [] : [c])];
  const ok = nums.every((x) => Number.isInteger(x) && x >= 1 && x <= 1000000000);
  const lcm2 = (x, y) => x * y / gcd(x, y);
  let lcm = 0; let steps = '';
  if (ok) {
    lcm = lcm2(a, b);
    steps = `GCD(${a}, ${b}) = ${gcd(a, b)}, so LCM = ${a} × ${b} ÷ ${gcd(a, b)} = ${lcm}`;
    if (c !== null) { const prev = lcm; lcm = lcm2(lcm, c); steps += `. Then GCD(${prev}, ${c}) = ${gcd(prev, c)}, so LCM = ${prev} × ${c} ÷ ${gcd(prev, c)} = ${lcm}`; }
  }
  const tooBig = ok && !Number.isSafeInteger(lcm);
  return (<Wrap note="The lowest common multiple is the smallest number that all your numbers divide into exactly. It is worked out with the GCD: LCM(a, b) = a × b ÷ GCD(a, b).">
    <TextField fullWidth label="First number" type="number" value={aRaw} onChange={(e) => setARaw(e.target.value)} sx={{ mb: 2 }} />
    <TextField fullWidth label="Second number" type="number" value={bRaw} onChange={(e) => setBRaw(e.target.value)} sx={{ mb: 2 }} />
    <TextField fullWidth label="Third number (optional)" type="number" value={cRaw} onChange={(e) => setCRaw(e.target.value)} sx={{ mb: 2 }} />
    {!ok && <Typography variant="body1" sx={{ mt: 2 }}>Enter whole numbers from 1 to 1,000,000,000. Decimals, 0 and negative numbers have no LCM.</Typography>}
    {ok && tooBig && <Typography variant="body1" sx={{ mt: 2 }}>The LCM of these numbers is too large to show exactly. Try smaller numbers.</Typography>}
    {ok && !tooBig && (<><Hero value={fmt(lcm)} unit={'LCM of ' + nums.map((x) => fmt(x)).join(', ')} eq={steps} /><Rows rows={nums.map((x) => ['Multiples of ' + fmt(x), [1, 2, 3].map((k) => fmt(x * k)).join(', ') + ', …'])} /></>)}
    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>Check: LCM(12, 18) = 36. LCM(4, 6) = 12. LCM(6, 8, 12) = 24.</Typography>
  </Wrap>);
}
