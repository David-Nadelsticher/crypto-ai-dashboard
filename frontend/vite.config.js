// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
//
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     port: 5173,
//     proxy: {
//       "^/login$": "http://127.0.0.1:8000",
//       "^/signup$": "http://127.0.0.1:8000",
//       "^/me": "http://127.0.0.1:8000",
//       "^/onboarding$": "http://127.0.0.1:8000",
//       "/api": "http://127.0.0.1:8000",
//     },
//   },
// });
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
});