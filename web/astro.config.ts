import cloudflare from "@astrojs/cloudflare";
import { defineConfig } from "astro/config";

export default defineConfig({
  // No KV sessions or Cloudflare Images until a feature needs them, so deploys don't provision extra resources.
  adapter: cloudflare({ imageService: "compile" }),
  session: false,
});
