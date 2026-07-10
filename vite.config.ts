// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  // Nitro preset is controlled by the NITRO_PRESET environment variable:
  //   - Vercel:  set NITRO_PRESET=vercel in Vercel project env vars
  //   - Railway: set NITRO_PRESET=node  (or leave unset, node is the default)
  // This keeps the same codebase deployable to both platforms without changes.
  nitro: {},
  // Proxy /api to the Express backend (port 4000) in dev AND preview
  vite: {
    server: {
      proxy: {
        "/api": {
          target: "https://rm-mobile-emporium-main-production-d107.up.railway.app",
          changeOrigin: true,
        },
      },
    },
    preview: {
      proxy: {
        "/api": {
          target: "https://rm-mobile-emporium-main-production-d107.up.railway.app",
          changeOrigin: true,
        },
      },
    },
  },
});
