// Tiny shared helpers used by the tool modules (kept small on purpose: this file
// is the only tool code the home page loads up front).
import React, { useState, useRef } from 'react';
import { Box, Typography, List, ListItem, ListItemText, Button, TextField } from '@mui/material';
import { alpha } from '@mui/material/styles';
export const fmt = (n) => n.toLocaleString('en-US', { maximumFractionDigits: 2 });
// Thousand separators for a digits-only string: '1000000' -> '1,000,000'.
export const formatCommas = (digits) => String(digits || '').replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');

// Copy text to the clipboard, with a fallback for browsers without it.
export async function copyText(text) {
  try { await navigator.clipboard.writeText(text); return true; }
  catch (e) {
    try {
      const ta = document.createElement('textarea');
      ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      document.execCommand('copy'); document.body.removeChild(ta); return true;
    } catch (e2) { return false; }
  }
}

// Small "Copy result" button with brief "Copied" feedback.
export function CopyResultButton({ text }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef(null);
  const onCopy = async () => {
    const ok = await copyText(text);
    if (ok) {
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
    }
  };
  return (<Button size="small" variant="outlined" onClick={onCopy} sx={{ mt: 1.5 }}>{copied ? 'Copied ✓' : 'Copy result'}</Button>);
}

export function Hero({ value, unit, eq }) {
  const text = value + (unit ? ' ' + unit : '') + (eq ? ' (' + eq + ')' : '');
  return (<Box textAlign="center" sx={{ py: 3, px: 2, mb: 2, borderRadius: 3, bgcolor: (theme) => alpha(theme.palette.primary.main, 0.10) }}><Typography variant="h3" fontWeight={800} color="primary.main">{value}</Typography><Typography color="text.secondary">{unit}</Typography>{eq && <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{eq}</Typography>}<CopyResultButton text={text} /></Box>);
}
export function Rows({ rows }) {
  return (<List disablePadding>{rows.map(([k, v], i) => (<ListItem key={k} disableGutters divider={i < rows.length - 1}><ListItemText primary={k} primaryTypographyProps={{ color: 'text.secondary' }} /><Typography fontWeight={700}>{v}</Typography></ListItem>))}</List>);
}

// A number input that shows thousand separators as you type (1,000,000)
// while the stored value stays digits-only, so the maths is untouched.
// The cursor is kept in place by counting the digits before it and putting
// it back after the same number of digits in the formatted value.
export function CommaInput({ label, value, onChange, sx }) {
  const ref = useRef(null);
  const handleChange = (e) => {
    const el = e.target;
    const raw = el.value;
    const cursor = el.selectionStart == null ? raw.length : el.selectionStart;
    const digitsBefore = raw.slice(0, cursor).replace(/\D/g, '').length;
    const digits = raw.replace(/\D/g, '');
    onChange(digits);
    const formatted = formatCommas(digits);
    el.value = formatted;
    let pos = 0, seen = 0;
    while (pos < formatted.length && seen < digitsBefore) { if (/\d/.test(formatted[pos])) seen++; pos++; }
    el.setSelectionRange(pos, pos);
  };
  return (<TextField inputRef={ref} fullWidth label={label} type="text" value={formatCommas(value)} onChange={handleChange} inputProps={{ inputMode: 'numeric', autoComplete: 'off' }} sx={sx} />);
}
