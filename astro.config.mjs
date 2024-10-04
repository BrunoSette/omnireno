import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import AutoImport from "astro-auto-import";
import { defineConfig, squooshImageService } from "astro/config";
import remarkCollapse from "remark-collapse";
import remarkToc from "remark-toc";
import config from "./src/config/config.json";
import vercel from "@astrojs/vercel/serverless";
import sitemap from "@astrojs/sitemap";
import sharp from "sharp";
import sentry from "@sentry/astro";

// https://astro.build/config
export default defineConfig({
  site: config.site.base_url ? config.site.base_url : "http://www.omnireno.ca",
  base: config.site.base_path ? config.site.base_path : "/",
  trailingSlash: config.site.trailing_slash ? "always" : "never",
  output: "server",
  adapter: vercel(),
  image: {
    service: sharp(),
  },
  integrations: [
    react(),
    sentry({
      dsn: "https://bf32ad7da6eca09a4bd543960427cd7c@o4508059553955840.ingest.us.sentry.io/4508061763502080",
      sourceMapsUploadOptions: {
        project: "omnireno",
        authToken: process.env.SENTRY_AUTH_TOKEN,
      },
    }),
    sitemap(),
    tailwind({
      config: {
        applyBaseStyles: false,
      },
    }),
    AutoImport({
      imports: [
        "@/shortcodes/Button",
        "@/shortcodes/Accordion",
        "@/shortcodes/Notice",
        "@/shortcodes/Video",
        "@/shortcodes/Youtube",
        "@/shortcodes/Tabs",
        "@/shortcodes/Tab",
      ],
    }),
    mdx(),
  ],
  markdown: {
    remarkPlugins: [
      remarkToc,
      [
        remarkCollapse,
        {
          test: "Table of contents",
        },
      ],
    ],
    shikiConfig: {
      theme: "one-dark-pro",
      wrap: true,
    },
    extendDefaultPlugins: true,
  },
});
