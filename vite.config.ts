import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import basicSsl from '@vitejs/plugin-basic-ssl';

// Camera/microphone access requires a "secure context". localhost on
// the Mac already counts as one over plain HTTP, but an iPhone
// hitting the Mac's LAN IP does not — it needs HTTPS. Run
// `npm run dev:phone` (which sets VITE_HTTPS=true) for that; plain
// `npm run dev` stays fast, warning-free HTTP for Mac-only iteration.
const useHttps = process.env.VITE_HTTPS === 'true';

export default defineConfig({
  plugins: [react(), ...(useHttps ? [basicSsl()] : [])],
  server: {
    host: true, // bind 0.0.0.0 so the dev server is reachable from a phone on the same Wi-Fi
  },
});
