import React from 'react';
import ReactDOM from 'react-dom/client';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import App from './App.jsx';

// Kalkio brand theme (Nov 2026 redesign): a deep teal brand colour instead of
// the default MUI blue, warm off-white page background, soft rounded cards.
// System font stack only - no webfont, so PageSpeed stays fast.
const theme = createTheme({
  palette: {
    primary: { main: '#0F766E', dark: '#0B5E57', light: '#14B8A6', contrastText: '#ffffff' },
    secondary: { main: '#D97706', dark: '#B45309', contrastText: '#ffffff' },
    background: { default: '#FAFAF9', paper: '#ffffff' },
    text: { primary: '#1C1917', secondary: '#57534E' },
    divider: '#E7E5E4',
  },
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
    MuiCard: { styleOverrides: { root: { borderRadius: 16, border: '1px solid #E7E5E4' } } },
    MuiButton: { styleOverrides: { root: { borderRadius: 10 } } },
    MuiTextField: { styleOverrides: { root: { '& .MuiOutlinedInput-root': { borderRadius: 12, backgroundColor: '#ffffff' } } } },
    MuiToggleButton: { styleOverrides: { root: { borderRadius: 10, textTransform: 'none', fontWeight: 700 } } },
    MuiAccordion: { styleOverrides: { root: { borderRadius: 12, '&:before': { display: 'none' }, boxShadow: 'none', border: '1px solid #E7E5E4' } } },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(<ThemeProvider theme={theme}><App /></ThemeProvider>);
