// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://thelocalgodd.me",
  // The Nixpacks Caddyfile only matches a directory when the path ends in "/".
  trailingSlash: "always",
  integrations: [
    react(),
    sitemap({ filter: (page) => !page.endsWith("/404/") }),
  ],
  markdown: {
    shikiConfig: { theme: "github-light" },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
