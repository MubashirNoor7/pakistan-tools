import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, Typography, Box, Alert, Button, Stack } from '@mui/material';

function Wrap({ children, note }) {
  return (<><Card elevation={2} sx={{ borderRadius: 3 }}><CardContent sx={{ p: 3 }}>{children}</CardContent></Card>{note && <Alert severity="info" sx={{ mt: 2 }}>{note}</Alert>}</>);
}

// What's My IP - shows the visitor's public IP address, location and ISP.
// The IP is fetched in the visitor's browser from a public IP service
// (ipapi.co, with ipify.org as fallback). Kalkio does not store the IP.
export function WhatsMyIpTool() {
  const [ip, setIp] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [org, setOrg] = useState('');
  const [tz, setTz] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const load = useCallback(async () => {
    setLoading(true); setError(''); setCopied(false);
    try {
      const r = await fetch('https://ipapi.co/json/');
      if (!r.ok) throw new Error('ipapi failed');
      const j = await r.json();
      if (!j.ip) throw new Error('no ip');
      setIp(j.ip); setCity([j.city, j.region].filter(Boolean).join(', ')); setCountry(j.country_name || ''); setOrg(j.org || ''); setTz(j.timezone || '');
    } catch {
      try {
        const r2 = await fetch('https://api.ipify.org?format=json');
        if (!r2.ok) throw new Error('ipify failed');
        const j2 = await r2.json();
        setIp(j2.ip || ''); setCity(''); setCountry(''); setOrg(''); setTz('');
        if (!j2.ip) throw new Error('no ip');
      } catch {
        setError('Could not fetch your IP. Check your connection and try again.');
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const copy = async () => {
    if (!ip) return;
    try { await navigator.clipboard.writeText(ip); setCopied(true); }
    catch { setCopied(false); }
  };

  return (<Wrap note="Your IP is fetched from a public IP service and shown only to you. Kalkio does not store it. Location is approximate - it comes from your internet provider, not GPS.">
    {loading && <Typography variant="body1" color="text.secondary" align="center" sx={{ py: 3 }}>Finding your IP...</Typography>}
    {error && <Alert severity="warning" sx={{ mb: 2 }}>{error}</Alert>}
    {!loading && !error && ip && (<>
      <Box textAlign="center" sx={{ py: 2 }}>
        <Typography variant="body2" color="text.secondary">Your public IP address</Typography>
        <Typography variant="h3" fontWeight={800} sx={{ wordBreak: 'break-all' }}>{ip}</Typography>
        {city && <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>{city}{country ? `, ${country}` : ''}</Typography>}
      </Box>
      {(org || tz) && (
        <Box sx={{ mt: 1 }}>
          {org && <Typography variant="body2" color="text.secondary" gutterBottom>Internet provider: {org}</Typography>}
          {tz && <Typography variant="body2" color="text.secondary">Time zone: {tz}</Typography>}
        </Box>
      )}
      <Stack direction="row" spacing={1} sx={{ mt: 3 }}>
        <Button fullWidth variant="contained" onClick={copy}>{copied ? 'Copied!' : 'Copy IP'}</Button>
        <Button fullWidth variant="outlined" onClick={load}>Refresh</Button>
      </Stack>
    </>)}
    {!loading && error && <Button fullWidth variant="contained" onClick={load}>Try again</Button>}
  </Wrap>);
}
