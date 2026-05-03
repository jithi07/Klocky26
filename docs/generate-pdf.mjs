/**
 * Klocky — PDF Generator
 * Converts klocky-diagrams.html → klocky-design-document.pdf
 * Uses Puppeteer (auto-installs Chromium on first run)
 *
 * Run:  node docs/generate-pdf.mjs
 */

import { execSync } from 'child_process';
import { createRequire } from 'module';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);

const HTML_FILE = resolve(__dirname, 'klocky-diagrams.html');
const OUT_PDF   = resolve(__dirname, 'klocky-design-document.pdf');

// ── Install puppeteer if not present ──────────────────────────────────────────
const puppeteerPath = resolve(__dirname, '../node_modules/puppeteer');
if (!existsSync(puppeteerPath)) {
  console.log('📦  puppeteer not found — installing (this downloads Chromium ~150MB)…');
  execSync('npm install puppeteer --no-save', { cwd: resolve(__dirname, '..'), stdio: 'inherit' });
  console.log('✅  puppeteer installed.\n');
}

// ── Dynamic import after install ──────────────────────────────────────────────
const require   = createRequire(import.meta.url);
const puppeteer = require('puppeteer');

(async () => {
  console.log('🚀  Launching Chromium…');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  // Load HTML file (use file:// URL so local fonts/scripts resolve)
  const fileUrl = 'file:///' + HTML_FILE.replace(/\\/g, '/');
  console.log(`📄  Loading: ${fileUrl}`);
  await page.goto(fileUrl, { waitUntil: 'networkidle0', timeout: 60_000 });

  // Wait for Mermaid to finish rendering all diagrams
  console.log('⏳  Waiting for Mermaid diagrams to render…');
  await page.waitForFunction(
    () => document.querySelectorAll('.mermaid svg').length >= 4,
    { timeout: 30_000 }
  ).catch(() => console.warn('⚠️  Some diagrams may still be loading — proceeding anyway.'));

  // Extra settle time for complex ER diagram
  await new Promise(r => setTimeout(r, 2000));

  console.log('🖨️  Generating PDF…');
  await page.pdf({
    path: OUT_PDF,
    format: 'A3',
    printBackground: true,
    margin: { top: '15mm', bottom: '15mm', left: '12mm', right: '12mm' },
    displayHeaderFooter: true,
    headerTemplate: `
      <div style="font-size:9px;color:#94a3b8;width:100%;text-align:center;font-family:Segoe UI,sans-serif;padding-top:6px;">
        Klocky — Technical Design Documentation
      </div>`,
    footerTemplate: `
      <div style="font-size:9px;color:#94a3b8;width:100%;display:flex;justify-content:space-between;padding:0 15mm;font-family:Segoe UI,sans-serif;">
        <span>Confidential</span>
        <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
        <span>April 2026</span>
      </div>`,
  });

  await browser.close();

  console.log(`\n✅  PDF saved to:\n    ${OUT_PDF}\n`);
})().catch(err => {
  console.error('❌  PDF generation failed:', err.message);
  process.exit(1);
});
