import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, Typography, Box, Alert, Button, Stack } from '@mui/material';

function Wrap({ children, note }) {
  return (<><Card elevation={2} sx={{ borderRadius: 3 }}><CardContent sx={{ p: 3 }}>{children}</CardContent></Card>{note && <Alert severity="info" sx={{ mt: 2 }}>{note}</Alert>}</>);
}

// What's My IP - shows the visitor's public IP address, location and ISP.
// The IP is fetched in the visitor's browser from a public IP service:
// ipapi.co first, ipwho.is as a second full-data fallback (no key needed),
// ipify.org last with IP only. Kalkio does not store the IP.
// ASN, coordinates and the IPv4/IPv6 label come from the same lookup;
// the hostname comes from a reverse-DNS (PTR) lookup, best effort -
// most IPs have no PTR record, so a miss just means no hostname shown.

// Shape every lookup into the same fields, whichever service answered.
function normalizeIpapi(j) {
  return { ip: j.ip || '', city: [j.city, j.region].filter(Boolean).join(', '), country: j.country_name || '', org: j.org || '', tz: j.timezone || '', asn: j.asn || '', version: j.version || '', lat: j.latitude, lon: j.longitude };
}
function normalizeIpwho(j) {
  const c = j.connection || {};
  const t = j.timezone || {};
  return { ip: j.ip || '', city: [j.city, j.region].filter(Boolean).join(', '), country: j.country || '', org: c.isp || c.org || '', tz: t.id || '', asn: c.asn ? 'AS' + c.asn : '', version: j.type || '', lat: j.latitude, lon: j.longitude };
}

// Reverse-DNS name for an IP, for a PTR lookup over DNS-over-HTTPS.
function reverseName(ip) {
  if (ip.includes(':')) {
    // IPv6: expand :: to 8 groups, split into nibbles, reverse, add .ip6.arpa
    const parts = ip.split('::');
    const head = parts[0] ? parts[0].split(':') : [];
    const tail = parts[1] ? parts[1].split(':') : [];
    const missing = 8 - head.length - tail.length;
    const groups = [...head, ...Array(Math.max(0, missing)).fill('0'), ...tail];
    return groups.map((g) => g.padStart(4, '0')).join('').split('').reverse().join('.') + '.ip6.arpa';
  }
  return ip.split('.').reverse().join('.') + '.in-addr.arpa';
}

async function fetchHostname(ip) {
  try {
    const r = await fetch('https://dns.google/resolve?name=' + encodeURIComponent(reverseName(ip)) + '&type=PTR');
    if (!r.ok) return '';
    const j = await r.json();
    const ans = (j.Answer || []).find((a) => a.type === 12);
    return ans && ans.data ? String(ans.data).replace(/\.$/, '') : '';
  } catch { return ''; }
}

export function WhatsMyIpTool() {
  const [ip, setIp] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [org, setOrg] = useState('');
  const [tz, setTz] = useState('');
  const [asn, setAsn] = useState('');
  const [version, setVersion] = useState('');
  const [coords, setCoords] = useState('');
  const [hostname, setHostname] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const load = useCallback(async () => {
    setLoading(true); setError(''); setCopied(false);
    setHostname(''); setAsn(''); setVersion(''); setCoords('');
    let data = null;
    try {
      const r = await fetch('https://ipapi.co/json/');
      if (!r.ok) throw new Error('ipapi failed');
      const j = await r.json();
      if (!j.ip) throw new Error('no ip');
      data = normalizeIpapi(j);
    } catch {
      try {
        const r2 = await fetch('https://ipwho.is/');
        if (!r2.ok) throw new Error('ipwho failed');
        const j2 = await r2.json();
        if (!j2.ip || j2.success === false) throw new Error('no ip');
        data = normalizeIpwho(j2);
      } catch {
        try {
          const r3 = await fetch('https://api.ipify.org?format=json');
          if (!r3.ok) throw new Error('ipify failed');
          const j3 = await r3.json();
          if (!j3.ip) throw new Error('no ip');
          data = { ip: j3.ip, city: '', country: '', org: '', tz: '', asn: '', version: '', lat: undefined, lon: undefined };
        } catch {
          setError('Could not fetch your IP. Check your connection and try again.');
        }
      }
    }
    if (data) {
      setIp(data.ip); setCity(data.city); setCountry(data.country); setOrg(data.org); setTz(data.tz);
      setAsn(data.asn);
      setVersion(data.version || (data.ip.includes(':') ? 'IPv6' : 'IPv4'));
      setCoords(typeof data.lat === 'number' && typeof data.lon === 'number' ? data.lat.toFixed(4) + ', ' + data.lon.toFixed(4) : '');
      // Hostname lookup runs on its own - the result shows without it if
      // there is no PTR record or the lookup fails.
      fetchHostname(data.ip).then((h) => { if (h) setHostname(h); });
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
        {version && <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{version}</Typography>}
        {city && <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>{city}{country ? `, ${country}` : ''}</Typography>}
      </Box>
      {(org || tz || asn || hostname || coords) && (
        <Box sx={{ mt: 1 }}>
          {org && <Typography variant="body2" color="text.secondary" gutterBottom>Internet provider: {org}</Typography>}
          {asn && <Typography variant="body2" color="text.secondary" gutterBottom>Network (ASN): {asn}</Typography>}
          {hostname && <Typography variant="body2" color="text.secondary" gutterBottom>Hostname: {hostname}</Typography>}
          {coords && <Typography variant="body2" color="text.secondary" gutterBottom>Coordinates: {coords}</Typography>}
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
