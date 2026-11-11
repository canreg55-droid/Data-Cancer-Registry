import { copyFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = resolve(root, 'public', 'ocr');
mkdirSync(output, { recursive: true });

for (const language of ['eng', 'ara']) {
  const source = resolve(root, 'node_modules', `@tesseract.js-data/${language}`, '4.0.0_best_int', `${language}.traineddata.gz`);
  copyFileSync(source, resolve(output, `${language}.traineddata.gz`));
}

console.log('Prepared local English and Arabic OCR data in public/ocr.');
