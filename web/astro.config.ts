import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import { defineConfig, fontProviders } from "astro/config";

export default defineConfig({
  // No KV sessions or Cloudflare Images until a feature needs them, so deploys don't provision extra resources.
  adapter: cloudflare({ imageService: "compile" }),
  session: false,
  // React components render to static HTML; without a client:* directive they ship no JavaScript.
  integrations: [react()],
  // Subset variable WOFF2 files from the pitch; Astro generates the metric-matched fallback faces.
  fonts: [
    {
      provider: fontProviders.local(),
      name: "Bricolage Grotesque",
      cssVariable: "--font-display",
      fallbacks: ["system-ui", "sans-serif"],
      display: "swap",
      options: {
        variants: [
          {
            src: ["./src/assets/fonts/bricolage-display.woff2"],
            weight: "500 800",
            style: "normal",
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: "Figtree",
      cssVariable: "--font-text",
      fallbacks: ["system-ui", "sans-serif"],
      display: "swap",
      options: {
        variants: [
          {
            src: ["./src/assets/fonts/figtree.woff2"],
            weight: "400 800",
            style: "normal",
          },
        ],
      },
    },
  ],
});
