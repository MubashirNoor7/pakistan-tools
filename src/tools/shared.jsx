// Tiny shared helpers used by the tool modules (kept small on purpose: this file
// is the only tool code the home page loads up front).
import React from 'react';
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';
export const fmt = (n) => n.toLocaleString('en-US', { maximumFractionDigits: 2 });
export function Hero({ value, unit, eq }) {
  return (<Box textAlign="center" sx={{ py: 2 }}><Typography variant="h3" fontWeight={800}>{value}</Typography><Typography color="text.secondary">{unit}</Typography>{eq && <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{eq}</Typography>}</Box>);
}
export function Rows({ rows }) {
  return (<List disablePadding>{rows.map(([k, v], i) => (<ListItem key={k} disableGutters divider={i < rows.length - 1}><ListItemText primary={k} /><Typography fontWeight={700}>{v}</Typography></ListItem>))}</List>);
}
