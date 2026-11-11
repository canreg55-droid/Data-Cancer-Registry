import test from 'node:test';
import assert from 'node:assert/strict';
import { extractAbstractFromText } from '../src/field-extractor.js';

const breastReport = `
Patient Name: Jane Doe
Medical Record Number: MRN-7781
National ID: 123456789012
Date of Birth: 1970-01-02
Age at diagnosis: 54
Sex: Female
Final Diagnosis: Invasive ductal carcinoma of the left breast, upper outer quadrant
Pathology: Invasive ductal carcinoma, Nottingham grade 2; ER positive, HER2 negative
ICD-O-3 Topography: C50.4
ICD-O Morphology: M-8500/32
Clinical TNM: cT2 cN0 cM0
Clinical Stage: Stage IIA
Treatment Intent: Curative
Chemotherapy: not indicated
`;

test('extracts explicitly labeled demographics and preserves source evidence', () => {
  const fields = extractAbstractFromText(breastReport);
  assert.equal(fields.F02.value, 'Jane Doe');
  assert.equal(fields.F03, undefined);
  assert.equal(fields.F04.value, 'MRN-7781');
  assert.equal(fields.F01.value, '123456789012');
  assert.equal(fields.F10.value, '02/01/1970');
  assert.equal(fields.F13.value, '2 - Female');
  assert.match(fields.F02.evidence, /Patient Name: Jane Doe/);
});

test('extracts a bilingual name into English and Arabic fields without translating either value', () => {
  const fields = extractAbstractFromText('Patient Name: Layla Ali\nArabic Name: ليلى علي\nEnglish Name: Layla Ali');
  assert.equal(fields.F02.value, 'Layla Ali');
  assert.equal(fields.F03.value, 'ليلى علي');
  assert.match(fields.F03.evidence, /Arabic Name: ليلى علي/);
});

test('maps directly documented pathology, TNM, stage and treatment to suggestions', () => {
  const fields = extractAbstractFromText(breastReport);
  assert.match(fields.F32.value, /^C50\.4/);
  assert.match(fields.F35.value, /^M-8500\/32/);
  assert.equal(fields.F36.value, '/3 - Malignant, primary site (Invasive)');
  assert.equal(fields.F37.value, '2 - Grade II: Moderately differentiated');
  assert.equal(fields.F38.value, 'cT2 cN0 cM0');
  assert.equal(fields.F39.value, 'Stage IIA');
  assert.equal(fields.F48.value, '1 - Curative / Definitive');
  assert.match(fields.F60.value, /Source-grounded extraction/);
});

test('does not confuse lymphoma stage with a solid tumor clinical stage or pathologic TNM', () => {
  const fields = extractAbstractFromText(`Final diagnosis: classical Hodgkin lymphoma, nodular sclerosis\nPrimary site: mediastinal lymph nodes\nAnn Arbor stage: IIB\nB symptoms: present\nClinical TNM: cT0 cN2 cM0`);
  assert.equal(fields.F42.value, 'Stage IIB');
  assert.equal(fields.F39, undefined);
  assert.equal(fields.F40, undefined);
  assert.match(fields.F43.value, /^1 - Present/);
});

test('stores Arabic patient names only in the Arabic field and does not translate Arabic diagnoses', () => {
  const fields = extractAbstractFromText('Patient Name: أحمد علي\nFinal Diagnosis: سرطان الثدي');
  assert.equal(fields.F02, undefined);
  assert.equal(fields.F03.value, 'أحمد علي');
  assert.equal(fields.F34, undefined);
});

test('does not confuse staging or report metadata with patient age or diagnosis', () => {
  const fields = extractAbstractFromText(`Pathologic TNM: pT2 pN0 cM0\nSEER Summary Stage: 1\nPathology lab name: Central Pathology Lab\nBasis of Diagnosis: 7 - Histology of Primary Tumor`);
  assert.equal(fields.F12, undefined);
  assert.equal(fields.F34, undefined);
  assert.equal(fields.F40.value, 'pT2 pN0 cM0');
  assert.equal(fields.F46.value, '1 - Localized only');
  assert.equal(fields.F28.value, 'Central Pathology Lab');
});

test('does not invent identifiers, sex, dates or stage when they are absent', () => {
  const fields = extractAbstractFromText('Pathology: small cell carcinoma of the lung. Histology confirms malignancy.');
  assert.equal(fields.F01, undefined);
  assert.equal(fields.F02, undefined);
  assert.equal(fields.F10, undefined);
  assert.equal(fields.F13, undefined);
  assert.equal(fields.F39, undefined);
  assert.equal(fields.F38, undefined);
});
