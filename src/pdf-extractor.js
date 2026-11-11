import * as pdfjsLib from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { createWorker, OEM } from 'tesseract.js';
import tesseractWorkerUrl from 'tesseract.js/dist/worker.min.js?url';
import tesseractCoreUrl from 'tesseract.js-core/tesseract-core-lstm.wasm.js?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;
const PAGE_TEXT_THRESHOLD = 120;

/**
 * Read a text PDF page when it has a useful text layer; otherwise rasterize the
 * page and perform local English+Arabic OCR with bundled Tesseract models.
 * File bytes are never posted to a server or a third-party API.
 */
export async function extractPdfText(file, onProgress = () => {}) {
  if (!file || (!(file.type || '').toLowerCase().includes('pdf') && !/\.pdf$/i.test(file.name || ''))) {
    throw new Error('Choose a PDF file to extract.');
  }

  const task = pdfjsLib.getDocument({
    data: new Uint8Array(await file.arrayBuffer()),
    useSystemFonts: true,
    isEvalSupported: false
  });
  const pdf = await task.promise;
  const pages = [];
  let ocrWorker = null;
  let ocrPages = 0;

  try {
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
      const page = await pdf.getPage(pageNumber);
      const content = await page.getTextContent({ includeMarkedContent: false });
      const selectableText = layoutPageText(content.items);
      const visibleCharacters = (selectableText.match(/[A-Za-z0-9\u0600-\u06FF]/g) || []).length;
      let pageText = selectableText;
      let mode = 'PDF text';

      if (visibleCharacters < PAGE_TEXT_THRESHOLD) {
        mode = 'OCR';
        if (!ocrWorker) {
          ocrWorker = await createWorker('eng+ara', OEM.LSTM_ONLY, {
            workerPath: tesseractWorkerUrl,
            corePath: tesseractCoreUrl,
            langPath: new URL(`${import.meta.env.BASE_URL}ocr/`, window.location.href).href,
            gzip: true,
            cacheMethod: 'write',
            logger: message => {
              if (message.status === 'recognizing text') {
                onProgress({
                  page: pageNumber,
                  pages: pdf.numPages,
                  mode,
                  detail: 'Recognizing page text',
                  progress: message.progress || 0
                });
              } else if (message.status && ['loading tesseract core', 'loading language traineddata', 'initializing tesseract'].includes(message.status)) {
                onProgress({ page: pageNumber, pages: pdf.numPages, mode, detail: message.status, progress: message.progress || 0 });
              }
            }
          });
          await ocrWorker.setParameters({ preserve_interword_spaces: '1' });
        }

        onProgress({ page: pageNumber, pages: pdf.numPages, mode, detail: 'Preparing scanned page', progress: 0 });
        const baseViewport = page.getViewport({ scale: 1 });
        const scale = Math.min(2.4, Math.max(1.8, 1900 / baseViewport.width));
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement('canvas');
        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);
        const context = canvas.getContext('2d', { alpha: false });
        if (!context) throw new Error('Could not prepare the page for local OCR. Try a smaller PDF or another browser.');
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, canvas.width, canvas.height);
        await page.render({ canvasContext: context, canvas, viewport }).promise;
        const recognition = await ocrWorker.recognize(canvas);
        pageText = String(recognition.data?.text || '').trim();
        ocrPages++;
        canvas.width = 0;
        canvas.height = 0;
      }

      pages.push(`--- PAGE ${pageNumber} | ${mode}${mode === 'OCR' ? ' · English + Arabic' : ''} ---\n${pageText}`.trim());
      page.cleanup();
      onProgress({ page: pageNumber, pages: pdf.numPages, mode, detail: 'Page complete', progress: 1 });
    }
  } finally {
    if (ocrWorker) await ocrWorker.terminate();
    await task.destroy();
  }

  const text = pages.join('\n\n');
  if (text.replace(/\s/g, '').length < 20) {
    throw new Error('No readable text was found. The scan may be blank, extremely faint, or handwritten; try a clearer scan or enter the field manually.');
  }
  return { text, pages: pdf.numPages, ocrPages };
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
