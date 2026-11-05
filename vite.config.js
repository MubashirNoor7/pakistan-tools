import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import prerenderPlugin from './prerender-plugin.mjs';

export default defineConfig({
  plugins: [react(), prerenderPlugin()],
  preview: { port: 4174 },
  server: { port: 5174 },
});
