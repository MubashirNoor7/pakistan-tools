import React, { useState, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import App from './App.jsx';

// Kalkio brand theme (Nov 2026 redesign): a deep teal brand colour instead
// of the default MUI blue, warm off-white page background, soft rounded
// cards. System font stack only - no webfont, so PageSpeed stays fast.
// Dark mode (12 Nov 2026): same brand, dark surfaces, lighter teal accent.
const LIGHT = {
  primary: { main: '#0F766E', dark: '#0B5E57', light: '#14B8A6', contrastText: '#ffffff' },
  secondary: { main: '#D97706', dark: '#B45309', contrastText: '#ffffff' },
  background: { default: '#FAFAF9', paper: '#ffffff' },
  text: { primary: '#1C1917', secondary: '#57534E' },
  divider: '#E7E5E4',
};
const DARK = {
  primary: { main: '#14B8A6', dark: '#0B5E57', light: '#2DD4BF', contrastText: '#ffffff' },
  secondary: { main: '#F59E0B', dark: '#D97706', contrastText: '#1C1917' },
  background: { default: '#121212', paper: '#1C1917' },
  text: { primary: '#FAFAF9', secondary: '#D6D3D1' },
  divider: '#44403C',
  // Lighter success/error/warning/info so outlined buttons and alerts stay
  // readable on dark surfaces (MUI dark-mode defaults).
  success: { main: '#66BB6A', dark: '#388E3C', light: '#81C784', contrastText: '#1C1917' },
  error: { main: '#EF5350', dark: '#D32F2F', light: '#E57373', contrastText: '#ffffff' },
  warning: { main: '#FFA726', dark: '#F57C00', light: '#FFB74D', contrastText: '#1C1917' },
  info: { main: '#29B6F6', dark: '#0288D1', light: '#4FC3F7', contrastText: '#1C1917' },
};

function buildTheme(mode) {
  const dark = mode === 'dark';
  const pal = dark ? DARK : LIGHT;
  return createTheme({
    palette: { mode, ...pal },
    typography: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      h1: { fontWeight: 800, letterSpacing: '-0.02em' },
      h2: { fontWeight: 800, letterSpacing: '-0.01em' },
      h4: { fontWeight: 800, letterSpacing: '-0.01em' },
      h5: { fontWeight: 700 },
      h6: { fontWeight: 700 },
      button: { textTransform: 'none', fontWeight: 700 },
    },
    shape: { borderRadius: 12 },
    components: {
      MuiCard: {
        styleOverrides: {
          root: ({ theme }) => ({ borderRadius: 16, border: `1px solid ${theme.palette.divider}` }),
        },
      },
      MuiButton: { styleOverrides: { root: { borderRadius: 10 } } },
      MuiTextField: {
        styleOverrides: {
          root: ({ theme }) => ({
            '& .MuiOutlinedInput-root': { borderRadius: 12, backgroundColor: theme.palette.background.paper },
          }),
        },
      },
      MuiToggleButton: { styleOverrides: { root: { borderRadius: 10, textTransform: 'none', fontWeight: 700 } } },
      MuiAccordion: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: 12, '&:before': { display: 'none' }, boxShadow: 'none',
            border: `1px solid ${theme.palette.divider}`,
          }),
        },
      },
    },
  });
}

// Mode lives here so every component re-themes together. Stored choice wins;
// with nothing stored the visitor's system preference decides.
function Root() {
  const [mode, setMode] = useState(() => {
    try {
      const stored = window.localStorage.getItem('kalkio-theme');
      if (stored === 'light' || stored === 'dark') return stored;
    } catch (e) { /* localStorage unavailable - fall through to system */ }
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });
  const toggleMode = () => setMode((m) => {
    const next = m === 'dark' ? 'light' : 'dark';
    try { window.localStorage.setItem('kalkio-theme', next); } catch (e) { /* ignore */ }
    return next;
  });
  const theme = useMemo(() => buildTheme(mode), [mode]);
  return (<ThemeProvider theme={theme}><App mode={mode} onToggleMode={toggleMode} /></ThemeProvider>);
}

ReactDOM.createRoot(document.getElementById('root')).render(<Root />);
