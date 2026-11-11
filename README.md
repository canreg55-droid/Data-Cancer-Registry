# Sijill Cancer Registry | سِجِلّ السرطان

A single-page, browser-based demonstration of a clinical cancer-registry abstracting workflow. It contains 65 editable fields (five administrative/header fields plus the 60 numbered core fields), seven synthetic demo cases, evidence/rationale notes, illustrative cross-field validation, local PDF text extraction and field suggestions, reference-rule summaries, and clipboard/CSV/JSON/print exports.

## Run locally

Install the project dependencies, then start the Vite development server:

```bash
npm install
npm run dev
```

Open the local or forwarded preview URL printed by Vite. Create a production bundle with `npm run build`; use `npm run preview` to inspect that bundle. The interface is responsive, with a desktop-width abstracting workspace and a compact layout for smaller screens.

## Windows desktop app

The desktop product is named **Sijill Cancer Registry (سِجِلّ السرطان)**. Install dependencies with `npm install`, then use `npm run app:dev` to open the bundled application in its secure local desktop shell. On Windows, `npm run app:installer:win` builds an installer; `npm run app:pack:win` creates an unpacked Windows app whose executable is in `release/win-unpacked/` (keep the full folder together). The UI, OCR engine, and English/Arabic trained-data files are packaged with the app so document processing does not need an OCR API or a network connection. Downloads are saved by the operating system; there is no central database or automatic cloud save.

## Included demo cases

- Small cell lung carcinoma
- Invasive ductal breast carcinoma
- Classical Hodgkin lymphoma
- Prostate adenocarcinoma
- Endometrioid carcinoma
- Benign breast fibroadenoma (explicitly labeled as generally non-reportable)
- Plasma cell myeloma

All names, identifiers, dates, records, clinical findings, and reference excerpts are fictional or abbreviated demonstrations. Do not interpret them as medical advice, authoritative coding guidance, a compliance determination, or records for submission.

## PDF extraction and processing limits

Drop a text-based or scanned PDF into **Clinical case files**. The browser reads selectable text with PDF.js and applies local OCR to pages with little selectable text, then shows the PDF alongside extracted text and proposes values for fields it can match. Field 02 stores the documented full name in English and field 03 stores the documented full name in Arabic; all other field labels and values are configured in English. OCR can recognize English and Arabic, but it does not translate. Arabic script is accepted only for the Arabic-name field; other Arabic clinical text is not silently translated into English. Each populated suggestion displays a confidence label and the source excerpt used, including its PDF page. You can edit every value and its rationale before export; fields without a verified match remain blank. The **Extract PDF & fill fields** button can re-run extraction for the active document. Text files can be processed from the same button. Multiple documents can be selected from the source tabs and processed individually.

PDF parsing, OCR, and field matching run locally in the browser; this app has no backend, LLM, database, telemetry, or external document-processing service. Text-searchable PDF pages use PDF.js; pages with little selectable text are rendered in the browser and processed with bundled Tesseract English and Arabic models. OCR can misread text and does not translate Arabic; handwriting, faint scans, complex layouts, and poor image quality may produce incomplete or incorrect results. Password-protected PDFs may not be readable, and DOC/DOCX files are not parsed. Field matching is deterministic and illustrative, not clinical abstraction by a qualified registrar. Always compare every suggestion with the original page and current official standards. **Human review is required. This demo is not for clinical care or registry submission. Do not upload identifiable health information unless your organization has independently approved the environment and workflow.**

Use **Copy / Export → Download JSON** for the full structured abstract, including evidence and validation notes, or **Download CSV** for a spreadsheet-compatible file. On a phone or desktop these are saved to the device's downloads location; the app does not keep a separate persistent draft when the page closes.

The validation engine is a set of transparent illustrative front-end checks, not an approved registry validator. Consult current official ISCR/STORE, ICD-O, AJCC, SEER, IARC/ENCR, and jurisdictional specifications and a qualified registrar. Manual editions and rules can change; the bundled short summaries are not the full standards.

## Project files

- `index.html` — Single-page interface shell
- `src/styles.css` — Responsive design system and printer-friendly layout
- `src/schema.js` — 65 field definitions, options, icons, and illustrative guideline summaries
- `src/cases.js` — Fictional prefilled cases and source excerpts
- `src/app.js` — UI, editing, local upload flow, evidence linking, validation, and export logic
- `src/pdf-extractor.js` — Browser-local PDF.js text extraction
- `src/field-extractor.js` — Conservative field-matching rules and source-grounded suggestions
