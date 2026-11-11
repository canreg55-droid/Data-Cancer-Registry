# Cancer Registry Office — Data Extraction

A single-page, browser-based demonstration of a clinical cancer-registry abstracting workflow. It contains 65 editable fields (five administrative/header fields plus the 60 numbered core fields), seven synthetic demo cases, evidence/rationale notes, illustrative cross-field validation, local PDF text extraction and field suggestions, reference-rule summaries, and clipboard/CSV/JSON/print exports.

## Run locally

Install the project dependencies, then start the Vite development server:

```bash
npm install
npm run dev
```

Open the local or forwarded preview URL printed by Vite. Create a production bundle with `npm run build`; use `npm run preview` to inspect that bundle. The interface is responsive, with a desktop-width abstracting workspace and a compact layout for smaller screens.

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

Drop a text-searchable PDF into **Clinical case files**. The browser reads its text with PDF.js, shows the original PDF alongside extracted text, then proposes values for fields it can match. The interface and field values are configured for English; non-English source phrases are not automatically translated, and suggestions containing Arabic script are left blank rather than silently transliterated. Each populated suggestion displays a confidence label and the source excerpt used. You can edit every value and its rationale before export; fields without a verified English match remain blank. The **Extract PDF & fill fields** button can re-run extraction for the active document. Text files can be processed from the same button. Multiple documents can be selected from the source tabs and processed individually.

PDF parsing and matching run locally in the browser; this app has no backend, LLM, database, telemetry, or external document-processing service. It does **not** perform OCR: scanned/image-only, password-protected, or otherwise textless PDFs cannot be extracted. DOC/DOCX files are not parsed. Field matching is deterministic and illustrative, not clinical abstraction by a qualified registrar. It may miss fields or suggest incorrect values, especially for complex reports, ambiguous dates, staging, and coding. Always compare every suggestion with the original record and current official standards. **Do not use this demo for clinical care or registry submission. Do not upload identifiable health information unless your organization has independently approved the environment and workflow.**

The validation engine is a set of transparent illustrative front-end checks, not an approved registry validator. Consult current official ISCR/STORE, ICD-O, AJCC, SEER, IARC/ENCR, and jurisdictional specifications and a qualified registrar. Manual editions and rules can change; the bundled short summaries are not the full standards.

## Project files

- `index.html` — Single-page interface shell
- `src/styles.css` — Responsive design system and printer-friendly layout
- `src/schema.js` — 65 field definitions, options, icons, and illustrative guideline summaries
- `src/cases.js` — Fictional prefilled cases and source excerpts
- `src/app.js` — UI, editing, local upload flow, evidence linking, validation, and export logic
- `src/pdf-extractor.js` — Browser-local PDF.js text extraction
- `src/field-extractor.js` — Conservative field-matching rules and source-grounded suggestions
