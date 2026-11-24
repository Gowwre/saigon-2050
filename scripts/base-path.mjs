#!/usr/bin/env node
/**
 * GitHub Pages project sites live under /<repo>/, but this site is authored with
 * root-absolute URLs so it also works at a domain root. This post-build pass adds
 * the project prefix to HTML, CSS and inline-script asset URLs. Run it only when
 * BASE_PATH is set; local builds stay at the root.
 */
import fs from 'node:fs';
import path from 'node:path';

const rawBase = (process.env.BASE_PATH || '').replace(/\/+$/, '');
if (!rawBase) {
  console.log('BASE_PATH not set; leaving the build at the domain root.');
  process.exit(0);
}
if (!/^\/[A-Za-z0-9._~-]+$/.test(rawBase)) {
  console.error(`Invalid BASE_PATH: ${rawBase}`);
  process.exit(1);
}

const dist = path.resolve('dist');
if (!fs.existsSync(dist)) {
  console.error('dist/ not found; run astro build first.');
  process.exit(1);
}

const prefix = rawBase;
const alreadyPrefixed = (url) => url === prefix || url.startsWith(`${prefix}/`);
const prefixUrl = (url) => {
  if (!url.startsWith('/') || url.startsWith('//') || alreadyPrefixed(url)) return url;
  return `${prefix}${url}`;
};

const assetRoots = ['/calib/', '/vendor/', '/plates/', '/fonts/', '/_astro/', '/favicon.svg', '/og.jpg'];

function rewriteCssUrls(text) {
  return text.replace(
    /url\(\s*(["']?)(\/(?!\/)[^)"']*)\1\s*\)/g,
    (match, quote, url) => `url(${quote}${prefixUrl(url)}${quote})`,
  );
}

function rewriteInlineAssetPaths(text) {
  for (const asset of assetRoots) {
    const escaped = asset.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`(["'\`])${escaped}`, 'g');
    text = text.replace(re, (match, quote) => `${quote}${prefix}${asset}`);
  }
  return text;
}

function rewriteHtml(html) {
  html = html.replace(
    /\b(href|src|poster|action)=("|')(\/(?!\/)[^"']*)\2/g,
    (match, attr, quote, url) => `${attr}=${quote}${prefixUrl(url)}${quote}`,
  );
  html = html.replace(/\bsrcset=("|')([^"']*)\1/g, (match, quote, value) => {
    const rewritten = value
      .split(',')
      .map((part) => {
        const bits = part.trim().split(/\s+/);
        bits[0] = prefixUrl(bits[0]);
        return bits.join(' ');
      })
      .join(', ');
    return `srcset=${quote}${rewritten}${quote}`;
  });
  return rewriteInlineAssetPaths(rewriteCssUrls(html));
}

let changed = 0;
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(file);
      continue;
    }
    const ext = path.extname(entry.name);
    if (!['.html', '.css', '.js'].includes(ext)) continue;
    const before = fs.readFileSync(file, 'utf8');
    const after = ext === '.html'
      ? rewriteHtml(before)
      : ext === '.css'
        ? rewriteCssUrls(before)
        : rewriteInlineAssetPaths(before);
    if (after !== before) {
      fs.writeFileSync(file, after);
      changed++;
    }
  }
}

walk(dist);
console.log(`Added ${prefix}/ to ${changed} built file(s).`);
