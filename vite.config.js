import fs from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const IMAGE_RE = /\.(jpe?g|png|webp|avif|gif|svg)$/i;

/**
 * `virtual:public-images` — the list of image files that really exist under
 * public/ (paths relative to it, e.g. "images/projects/ai-agents.jpg").
 *
 * Data files reference optional images by path; components ask `asset()`
 * (src/lib/assets.js) whether the file exists before rendering an <img>, so a
 * missing image never costs a 404 — it just shows the generated artwork.
 * Drop a file into public/ and it appears on the next build (the dev server
 * reloads by itself).
 */
function publicImages() {
  const id = 'virtual:public-images';
  const resolved = `\0${id}`;
  let publicDir = '';

  const scan = (dir, base = '') => {
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
      const rel = base ? `${base}/${entry.name}` : entry.name;
      if (entry.isDirectory()) return scan(path.join(dir, entry.name), rel);
      return IMAGE_RE.test(entry.name) ? [rel] : [];
    });
  };

  return {
    name: 'public-images',
    configResolved(config) { publicDir = config.publicDir; },
    resolveId(source) { return source === id ? resolved : null; },
    load(source) {
      return source === resolved ? `export default ${JSON.stringify(scan(publicDir))};` : null;
    },
    configureServer(server) {
      const refresh = (file) => {
        if (!file.startsWith(publicDir) || !IMAGE_RE.test(file)) return;
        const mod = server.moduleGraph.getModuleById(resolved);
        if (mod) server.moduleGraph.invalidateModule(mod);
        server.ws.send({ type: 'full-reload' });
      };
      server.watcher.on('add', refresh);
      server.watcher.on('unlink', refresh);
    },
  };
}

/**
 * Injects schema.org Person JSON-LD into index.html, built from the same data
 * modules the page renders from, so search metadata never drifts from the CV.
 */
function personJsonLd() {
  return {
    name: 'person-json-ld',
    async transformIndexHtml() {
      const { EMAIL, SOCIALS } = await import('./src/data/socials.js');
      const { SITE } = await import('./src/data/site.js');
      const data = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: SITE.owner,
        alternateName: SITE.name,
        url: SITE.url,
        image: `${SITE.url}me.jpg`,
        email: `mailto:${EMAIL}`,
        address: { '@type': 'PostalAddress', addressLocality: 'Arusha', addressCountry: 'TZ' },
        sameAs: SOCIALS.map((s) => s.href),
      };
      return [{
        tag: 'script',
        attrs: { type: 'application/ld+json' },
        children: JSON.stringify(data),
        injectTo: 'head',
      }];
    },
  };
}

export default defineConfig({
  base: '/Portfolio/',
  plugins: [react(), publicImages(), personJsonLd()],
  server: { port: 5173, open: true },
});
