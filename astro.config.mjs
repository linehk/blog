import {defineConfig} from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwind from "@astrojs/tailwind";
import robotsTxt from "astro-robots-txt";
import {remarkReadingTime} from './remark-reading-time.mjs';
import partytown from "@astrojs/partytown";

// https://astro.build/config
export default defineConfig({
  site: 'https://www.sulinehk.com',
  integrations: [sitemap(), tailwind(), robotsTxt(), partytown()],
  markdown: {
    remarkPlugins: [remarkReadingTime],
  },
  vite: {
    build: {
      rollupOptions: {
        output: {
          entryFileNames: '[name]-[hash].js',
        },
      },
    },
  },
});