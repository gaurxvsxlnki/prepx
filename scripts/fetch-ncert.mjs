/**
 * PrepX — NCERT page asset builder (Phase 1).
 *
 * Downloads REAL official NCERT chapter PDFs (ncert.nic.in) and renders
 * each page to a JPEG page-image asset that is bundled with the app at
 * public/assets/pages/<book-code>/p0XX.jpg.
 *
 * The reader displays these real page images (original typography,
 * diagrams, layout, page numbers and margins preserved) — it never
 * rebuilds textbook pages in HTML.
 *
 * Requires the `mupdf` devDependency (prebuilt WASM, no system tools).
 * Usage:  npm run ncert:pages
 */
import { mkdirSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as mupdf from 'mupdf';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_ROOT = join(__dirname, '..', 'public', 'assets', 'pages');

const BOOKS = [
  {
    code: 'bio-11-living-world',
    pdfUrl: 'https://ncert.nic.in/textbook/pdf/kebo101.pdf',
    label: 'Biology Class 11 — The Living World (Ch 1)',
    maxPages: 40,
  },
  {
    code: 'bio-11-classification',
    pdfUrl: 'https://ncert.nic.in/textbook/pdf/kebo102.pdf',
    label: 'Biology Class 11 — Biological Classification (Ch 2)',
    maxPages: 40,
  },
  {
    code: 'chem-11-basic-concepts',
    pdfUrl: 'https://ncert.nic.in/textbook/pdf/kech101.pdf',
    label: 'Chemistry Class 11 — Some Basic Concepts of Chemistry (Ch 1)',
    maxPages: 99,
  },
  {
    code: 'phys-11-units',
    pdfUrl: 'https://ncert.nic.in/textbook/pdf/keph102.pdf',
    label: 'Physics Class 11 — Units and Measurements (Ch 2)',
    maxPages: 99,
  },
];

const SCALE = 1.9; // ~155 DPI for crisp reading + zoom

async function download(url, attempts = 3) {
  for (let i = 1; i <= attempts; i++) {
    try {
      const res = await fetch(url, {
        headers: { 'user-agent': 'Mozilla/5.0 (PrePX asset builder)' },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return new Uint8Array(await res.arrayBuffer());
    } catch (err) {
      if (i === attempts) throw err;
      console.log(`   attempt ${i} failed (${err.message}) — retrying ...`);
      await new Promise((r) => setTimeout(r, 2500 * i));
    }
  }
  throw new Error('unreachable');
}

async function buildBook(book, force = false) {
  const outDir = join(OUT_ROOT, book.code);
  mkdirSync(outDir, { recursive: true });
  console.log(`\n== ${book.label}`);
  const existing = existsSync(outDir) ? readdirSync(outDir).filter((f) => f.endsWith('.jpg')).length : 0;
  if (existing > 0 && !force) {
    console.log(`   ${existing} page images already present — skipping (use --force to rebuild)`);
    return;
  }
  console.log(`   downloading ${book.pdfUrl} ...`);
  const pdfBytes = await download(book.pdfUrl);
  const doc = mupdf.PDFDocument.openDocument(pdfBytes, 'application/pdf');
  const pageCount = doc.countPages();
  const limit = Math.min(book.maxPages ?? pageCount, pageCount);
  console.log(`   ${pageCount} pages in PDF — rendering ${limit}`);
  const matrix = mupdf.Matrix.scale(SCALE, SCALE);
  for (let i = 0; i < limit; i++) {
    const page = doc.loadPage(i);
    const pixmap = page.toPixmap(matrix, mupdf.ColorSpace.DeviceRGB, false, true);
    const jpg = pixmap.asJPEG(86);
    const file = join(outDir, `p${String(i + 1).padStart(3, '0')}.jpg`);
    writeFileSync(file, jpg);
    console.log(`   [${i + 1}/${limit}] ${file} (${Math.round(jpg.length / 1024)} KB)`);
    page.destroy?.();
    pixmap.destroy?.();
  }
  doc.destroy?.();
  console.log(`   done -> ${outDir}`);
}

for (const book of BOOKS) {
  try {
    await buildBook(book, process.argv.includes('--force'));
  } catch (err) {
    console.error(`   FAILED: ${err.message}`);
  }
}

console.log('\nAll NCERT page assets built.');
console.log('NOTE: These are real NCERT textbook page images used under the');
console.log('public-education terms of NCERT (ncert.nic.in) for non-commercial');
console.log('study purposes. Commercial redistribution requires NCERT permission.');