import * as pdfjsLib from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

/** Extract selectable text in the browser. No PDF bytes are uploaded or sent to an API. */
export async function extractPdfText(file, onProgress = () => {}) {
  if (!file || (!(file.type || '').toLowerCase().includes('pdf') && !/\.pdf$/i.test(file.name || ''))) {
    throw new Error('Choose a PDF file to extract.');
  }
  const data = new Uint8Array(await file.arrayBuffer());
  const task = pdfjsLib.getDocument({ data, useSystemFonts: true, isEvalSupported: false });
  const pdf = await task.promise;
  const pages = [];
  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
    onProgress({ page: pageNumber, pages: pdf.numPages });
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent({ includeMarkedContent: false });
    pages.push(layoutPageText(content.items));
    page.cleanup();
  }
  const text = pages.join('\n\n');
  if (text.replace(/\s/g, '').length < 20) {
    throw new Error('This PDF appears to be scanned or image-only; it has no selectable text. OCR is not available in this browser demo. Use a text-searchable PDF or paste de-identified text.');
  }
  return { text, pages: pdf.numPages };
}

function layoutPageText(items) {
  const rows = new Map();
  for (const item of items) {
    const value = String(item.str || '').trim();
    if (!value) continue;
    const transform = item.transform || [];
    const y = Math.round((transform[5] || 0) * 2) / 2;
    const x = transform[4] || 0;
    if (!rows.has(y)) rows.set(y, []);
    rows.get(y).push({ x, value });
  }
  return [...rows.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([, row]) => row.sort((a, b) => a.x - b.x).map(item => item.value).join(' ').replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .join('\n');
}

export { extractAbstractFromText } from './field-extractor.js';
