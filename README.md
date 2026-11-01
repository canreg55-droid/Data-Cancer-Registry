# OncoCurate — Cancer Registry Abstracting Workbench

A single-page, browser-based demonstration of a clinical cancer-registry abstracting workflow. It contains 65 editable fields (five administrative/header fields plus the 60 numbered core fields), six synthetic demo cases, evidence/rationale notes, illustrative cross-field validation, local source-document preview, reference-rule summaries, and clipboard/CSV/JSON/print exports.

## Run locally

No build step or dependency install is needed. Serve this directory over HTTP so JavaScript modules load correctly:

```bash
python3 -m http.server 8000 --bind 0.0.0.0
```

Then open `http://localhost:8000` (or the environment's forwarded preview URL). The page uses native browser ES modules and is designed for a desktop-width abstracting workspace, with responsive layouts for smaller screens.

## Included demo cases

- Small cell lung carcinoma
- Invasive ductal breast carcinoma
- Classical Hodgkin lymphoma
- Prostate adenocarcinoma
- Endometrioid carcinoma
- Benign breast fibroadenoma (explicitly labeled as generally non-reportable)
- Plasma cell myeloma

All names, identifiers, dates, records, clinical findings, and reference excerpts are fictional or abbreviated demonstrations. Do not interpret them as medical advice, authoritative coding guidance, a compliance determination, or records for submission.

## Privacy and processing limits

The application has no backend, LLM, database, telemetry, or external document-processing service. Files are previewed in the browser session; PDF preview uses the browser's local PDF viewer. Text files can be displayed as source. DOC/DOCX files are not parsed. Upload is not OCR, extraction, diagnosis, or registry coding. **Do not upload real or identifiable patient information to this demo.**

The validation engine is a set of transparent illustrative front-end checks, not an approved registry validator. Consult current official ISCR/STORE, ICD-O, AJCC, SEER, IARC/ENCR, and jurisdictional specifications and a qualified registrar. Manual editions and rules can change; the bundled short summaries are not the full standards.

## Project files

- `index.html` — Single-page interface shell
- `src/styles.css` — Responsive design system and printer-friendly layout
- `src/schema.js` — 65 field definitions, options, icons, and illustrative guideline summaries
- `src/cases.js` — Fictional prefilled cases and source excerpts
- `src/app.js` — UI, editing, validation, file preview, evidence linking, and export logic
