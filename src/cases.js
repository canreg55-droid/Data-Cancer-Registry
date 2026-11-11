/* Synthetic, non-identifiable demonstration cases. All names, identifiers,
   dates, facilities and records below are fictitious and for UI evaluation only. */

const common = {
  'H02': '2024', 'H03': '202400184', 'H04': 'CTR-017',
  'H05': 'Tripoli Central Oncology Institute (F-TRI-01)',
  'F05': 'Tripoli Center', 'F06': 'Bab Ben Ghashir',
  'F07': '001/03 - Tripoli Center', 'F08': '1 - Urban (City / Metropolitan)',
  'F09': '+218 91 555 0184', 'F11': 'Tripoli, Libya', 'F14': 'Libyan - LBY',
  'F15': '2 - Married', 'F16': '5 - University / Bachelor Degree',
  'F17': 'School administrator', 'F18': '0 - Never Smoker (<100 lifetime cigarettes)',
  'F19': '0 - Negative (No known family history of malignancy)',
  'F20': '1 - Outpatient Oncology / Specialty Clinic',
  'F21': '14 - Analytic: Dx & all 1st course Rx at reporting facility',
  'F22': 'Direct presentation - Family Medicine', 'F23': '00 - Retained In-House',
  'F24': 'Tripoli Central Oncology Institute', 'F25': '14/02/2024',
  'F26': '19/02/2024', 'F27': '7 - Histology of Primary Tumor (Core biopsy, excision, BM trephine)',
  'F28': 'TCI Department of Anatomic Pathology', 'F29': 'AP-24-0184 / 19/02/2024',
  'F30': '00 - One Malignant Primary Only', 'F33': '0 - Not a paired site',
  'F36': '/3 - Malignant, primary site (Invasive)', 'F37': '9 - Grade/differentiation unknown, not stated, or N/A',
  'F40': '99 - Not surgically resected / unknown',
  'F41': '99 - Unknown / Unstaged', 'F42': '88 - Not Applicable (Non-Lymphoma)',
  'F43': '8 - Not Applicable (Non-Lymphoma)', 'F44': '88 - Not Applicable (Non-Myeloma)',
  'F45': '88 - Not Applicable (Non-Gynecologic)', 'F46': '7 - Distant site(s) / distant lymph node(s) involved',
  'F47': '26/02/2024', 'F48': '2 - Palliative / Disease & Symptom Control',
  'F49': '00 - No surgery; medically inoperable / systemic treatment plan',
  'F50': '03 - Multi-agent; see regimen in narrative', 'F51': '00 - No radiotherapy documented',
  'F52': '00 - None', 'F53': '00 - None documented',
  'F54': '1 - Alive', 'F55': '12/09/2024', 'F56': '88/88/8888',
  'F57': '8888 - Not Applicable / Alive', 'F58': '8 - Not Applicable (Patient Alive)',
  'F59': '1 - Active Oncology Outpatient Clinic Visit'
};

function createCase(id, title, subtitle, overrides, evidence, recordText, tags = []) {
  const values = { ...common, ...overrides };
  values.H01 = values.H01 || `TRI-2024-${id.toUpperCase()}`;
  values.F04 = values.F04 || `MRN-24-${id.toUpperCase()}`;
  const remarks = {};
  Object.entries(evidence).forEach(([field, text]) => { remarks[field] = text; });
  return { id, title, subtitle, values, remarks, recordText, tags };
}

export const DEMO_CASES = [
  createCase('sclc', 'Small Cell Lung Carcinoma', 'Extensive-stage SCLC • fictional 67-year-old man', {
    'F01': '119870001842', 'F02': 'Omar Khalifa Saleh Al-Misrati', 'F03': 'Omar Khalifa Saleh Al-Misrati',
    'F04': 'MRN-24-SCLC-184', 'F06': 'Al-Dahra', 'F07': '001/08 - Al-Dahra',
    'F09': '+218 91 555 0184', 'F10': '22/08/1957', 'F11': 'Misrata, Libya', 'F12': '66',
    'F13': '1 - Male', 'F15': '2 - Married', 'F16': '3 - Secondary / High School',
    'F17': 'Retired port worker; 42 pack-years', 'F18': '2 - Former Cigarette Smoker (Quit >= 1 yr)',
    'F19': '0 - Negative (No known family history of malignancy)',
    'F20': '1 - Outpatient Oncology / Specialty Clinic',
    'F21': '20 - Analytic: Dx elsewhere, part of 1st course Rx at reporting facility',
    'F22': 'Misrata Medical Center', 'F24': 'Tripoli Central Oncology Institute',
    'F25': '14/02/2024', 'F26': '08/02/2024', 'F27': '7 - Histology of Primary Tumor (Core biopsy, excision, BM trephine)',
    'F28': 'TCI Department of Anatomic Pathology', 'F29': 'AP-24-0184 / 08/02/2024',
    'F31': 'Right upper lobe bronchus and lung', 'F32': 'C34.1 - Upper lobe, bronchus or lung',
    'F33': '1 - Right: origin of primary', 'F34': 'Small cell neuroendocrine carcinoma',
    'F35': 'M-8041/39 - Small cell carcinoma, NOS (undifferentiated)', 'F36': '/3 - Malignant, primary site (Invasive)',
    'F37': '4 - Grade IV: Undifferentiated / Anaplastic',
    'F38': 'cT3 cN3 cM1c (multiple extrathoracic metastases)', 'F39': 'Stage IV',
    'F40': '99 - Not surgically resected / unknown', 'F41': '99 - Unknown / Unstaged',
    'F42': '88 - Not Applicable (Non-Lymphoma)', 'F43': '8 - Not Applicable (Non-Lymphoma)',
    'F44': '88 - Not Applicable (Non-Myeloma)', 'F45': '88 - Not Applicable (Non-Gynecologic)',
    'F46': '7 - Distant site(s) / distant lymph node(s) involved',
    'F47': '26/02/2024', 'F48': '2 - Palliative / Disease & Symptom Control',
    'F49': '00 - None; extensive-stage disease', 'F50': '03 - Carboplatin + etoposide, first-line',
    'F51': '00 - None to date; consolidative RT under review', 'F52': '00 - None',
    'F53': '01 - Durvalumab concurrent with platinum/etoposide',
    'F59': '1 - Active Oncology Outpatient Clinic Visit',
    'F60': '67-year-old man with a 42 pack-year smoking history presented with persistent cough and weight loss. CT chest (06/02/2024) demonstrated a 5.8 cm right upper-lobe hilar mass with bulky mediastinal adenopathy; PET-CT identified FDG-avid hepatic and osseous lesions. CT-guided core biopsy (08/02/2024) showed small cell neuroendocrine carcinoma, INSM1 and synaptophysin positive, Ki-67 approximately 85%. Diagnosis established by primary-site histology. Clinical stage cT3 cN3 cM1c, AJCC 8th edition Stage IV / extensive stage. No resection. First-line carboplatin, etoposide and durvalumab commenced 26/02/2024 with palliative intent. Alive at oncology follow-up 12/09/2024. Fictional case; all identifiers and dates are synthetic.'
  }, {
    'F10': 'DOB transcribed from the fictional demographic header. Age at diagnosis is 66 completed years on the incidence date.',
    'F26': 'IARC/ENCR hierarchy: first positive primary-site tissue diagnosis, 08/02/2024, precedes admission and outpatient evaluation.',
    'F27': 'Primary tumor core biopsy confirms malignancy microscopically; code 7 is the highest basis achieved.',
    'F32': 'CT identifies the right upper lobe primary; specific lobar topography C34.1 is used rather than lung NOS.',
    'F33': 'Lung is paired; right-sided primary documented on CT and biopsy target. Laterality 1.',
    'F35': 'Small cell carcinoma maps to ICD-O-3 morphology 8041; grade 4 undifferentiated. Confirm against current ICD-O table.',
    'F38': 'Pretreatment CT/PET supports cT3 cN3 cM1c; registry demo only, verify AJCC lung staging source.',
    'F39': 'Distant hepatic and bone metastases support Stage IV. Registry abstracting should retain source and edition.',
    'F53': 'Durvalumab is a checkpoint inhibitor; classify under immunotherapy/biologics, separate from cytotoxic chemotherapy.',
    'F60': 'Narrative synthesized from fictional CT, pathology, treatment and follow-up excerpts; no real patient information.'
  }, 'TRIPOLI CENTRAL ONCOLOGY INSTITUTE — SYNTHETIC DEMONSTRATION RECORD\n\nPatient: Omar Khalifa Saleh Al-Misrati | MRN-24-SCLC-184 | DOB 22/08/1957 | Sex: Male\n\n06/02/2024 — Contrast CT chest: 5.8 cm right upper-lobe hilar mass, encasing segmental bronchus; bulky right paratracheal and subcarinal lymphadenopathy. Multiple low-attenuation liver lesions.\n\n08/02/2024 — CT-guided core biopsy, right upper lobe. Small cell neuroendocrine carcinoma. Synaptophysin+, INSM1+, chromogranin focal+, TTF-1+, Ki-67 ~85%.\n\n12/02/2024 — PET-CT: avid primary lesion, mediastinal nodes, multiple hepatic and osseous deposits. Clinical assessment: cT3 cN3 cM1c, extensive-stage disease.\n\n26/02/2024 — Cycle 1 carboplatin, etoposide and durvalumab initiated; palliative intent.\n\n12/09/2024 — Oncology follow-up: tolerating therapy, alive. Record is entirely fictional; dates and identifiers are synthetic.', ['Lung', 'SCLC', 'AJCC 8']),

  createCase('breast', 'Invasive Ductal Carcinoma — Breast', 'IDC, ER+/HER2− • fictional 54-year-old woman', {
    'F01': '119700002516', 'F02': 'Amina Mahmoud Yousef Al-Werfalli', 'F03': 'Amina Mahmoud Yousef Al-Werfalli',
    'F04': 'MRN-24-BR-2516', 'F06': 'Fashloum', 'F07': '001/12 - Fashloum',
    'F09': '+218 92 444 2516', 'F10': '04/11/1969', 'F11': 'Tripoli, Libya', 'F12': '54',
    'F13': '2 - Female', 'F15': '2 - Married', 'F16': '5 - University / Bachelor Degree',
    'F17': 'Accountant', 'F18': '0 - Never Smoker (<100 lifetime cigarettes)',
    'F19': '1 - Positive: First-Degree Relative(s)', 'F20': '1 - Outpatient Oncology / Specialty Clinic',
    'F21': '14 - Analytic: Dx & all 1st course Rx at reporting facility',
    'F22': 'Direct presentation - Breast clinic', 'F24': 'Tripoli Central Oncology Institute',
    'F25': '03/04/2024', 'F26': '21/03/2024', 'F27': '7 - Histology of Primary Tumor (Core biopsy, excision, BM trephine)',
    'F28': 'TCI Department of Anatomic Pathology', 'F29': 'AP-24-2516 / 21/03/2024',
    'F30': '00 - One Malignant Primary Only', 'F31': 'Left breast, upper-outer quadrant',
    'F32': 'C50.4 - Upper-outer quadrant of breast', 'F33': '2 - Left: origin of primary',
    'F34': 'Invasive carcinoma of no special type (invasive ductal carcinoma)',
    'F35': 'M-8500/32 - Infiltrating duct carcinoma, NOS (Grade 2)', 'F37': '2 - Grade II: Moderately differentiated',
    'F38': 'cT2 cN0 cM0', 'F39': 'Stage IIA', 'F40': 'pT2 pN0(sn) cM0', 'F41': 'Stage IIA',
    'F42': '88 - Not Applicable (Non-Lymphoma)', 'F43': '8 - Not Applicable (Non-Lymphoma)',
    'F44': '88 - Not Applicable (Non-Myeloma)', 'F45': '88 - Not Applicable (Non-Gynecologic)',
    'F46': '1 - Localized only', 'F47': '16/04/2024', 'F48': '1 - Curative / Definitive',
    'F49': 'Left lumpectomy with sentinel lymph node biopsy; margins negative, 0/3 nodes',
    'F50': '00 - No cytotoxic chemotherapy planned (low genomic recurrence score)',
    'F51': 'Whole-breast radiotherapy 40.05 Gy / 15 fractions, completed 18/06/2024',
    'F52': '01 - Letrozole 2.5 mg daily; planned 5 years', 'F53': '00 - None',
    'F59': '1 - Active Oncology Outpatient Clinic Visit',
    'F60': '54-year-old woman presented with a palpable left breast mass. Diagnostic mammography and ultrasound (18/03/2024) showed a 2.1 cm irregular lesion in the upper-outer quadrant; no suspicious axillary nodes. Core biopsy (21/03/2024): invasive carcinoma of no special type, Nottingham Grade 2; ER 95% strong, PR 70%, HER2 IHC 1+ (negative), Ki-67 18%. Clinical stage cT2 cN0 cM0, Stage IIA. Left lumpectomy and sentinel node biopsy (16/04/2024) demonstrated 2.2 cm invasive carcinoma, clear margins, 0/3 nodes; pT2 pN0(sn). Oncotype DX recurrence score 13. Adjuvant whole-breast RT 40.05 Gy/15 fractions completed 18/06/2024; letrozole initiated 20/06/2024, curative intent. Alive at follow-up 12/09/2024. Synthetic case only.'
  }, {
    'F19': 'Fictional history: mother diagnosed with breast cancer at age 63; report as first-degree positive, not a confirmed hereditary syndrome.',
    'F26': 'First positive core biopsy date 21/03/2024 takes precedence under the IARC incidence date hierarchy.',
    'F32': 'Imaging and pathology localize tumor to the left upper-outer quadrant; use specific subsite C50.4.',
    'F33': 'Breast is paired. Left primary is documented; laterality 2.',
    'F35': 'Invasive ductal/no-special-type carcinoma. Grade 2 morphology suffix shown for this demo; verify code year and grade per ICD-O/registry specifications.',
    'F38': 'Pretreatment clinical imaging supports cT2 cN0 cM0. Clinical stage group is distinct from postoperative stage.',
    'F40': 'Lumpectomy pathology documents pT2 pN0(sn); pM not assessed, so cM0 may be displayed for this synthetic example only.',
    'F46': 'No extension beyond breast or regional nodes; localized summary stage. Confirm with current SEER Summary Stage 2018 site schema.',
    'F52': 'Letrozole is endocrine therapy, not chemotherapy. Adjuvant treatment intent is curative.',
    'F60': 'Synthetic mammography, pathology, receptor and treatment details; verify staging against the correct AJCC edition and source record.'
  }, 'TRIPOLI CENTRAL ONCOLOGY INSTITUTE — SYNTHETIC DEMONSTRATION RECORD\n\nPatient: Amina Mahmoud Yousef Al-Werfalli | MRN-24-BR-2516 | DOB 04/11/1969 | Sex: Female\n\n18/03/2024 — Mammogram/ultrasound: 2.1 cm irregular mass, left breast upper-outer quadrant; axilla unremarkable.\n\n21/03/2024 — Core needle biopsy: invasive carcinoma, no special type (ductal), Nottingham grade 2. ER 95%, PR 70%, HER2 IHC 1+ (negative), Ki-67 18%.\n\n29/03/2024 — MRI: solitary 2.2 cm enhancing lesion, no multifocal or contralateral disease.\n\n16/04/2024 — Left lumpectomy and sentinel node biopsy: 2.2 cm invasive carcinoma, margins negative, 0/3 nodes; pT2 pN0(sn). Oncotype DX RS 13.\n\nRadiation: 40.05 Gy in 15 fractions completed 18/06/2024. Letrozole started 20/06/2024, curative adjuvant intent.\n\nFollow-up 12/09/2024: no evidence of recurrence. Synthetic case; no real patient data.', ['Breast', 'IDC', 'AJCC 8']),

  createCase('hodgkin', 'Classical Hodgkin Lymphoma', 'Nodular sclerosis • fictional 29-year-old woman', {
    'F01': '119950000731', 'F02': 'Sara Fathi Ibrahim Al-Zawawi', 'F03': 'Sara Fathi Ibrahim Al-Zawawi',
    'F04': 'MRN-24-HL-0731', 'F06': 'Gargaresh', 'F07': '001/15 - Gargaresh',
    'F10': '15/06/1995', 'F12': '28', 'F13': '2 - Female',
    'F16': '6 - Postgraduate (Master / PhD / MD)', 'F17': 'Graduate student',
    'F21': '14 - Analytic: Dx & all 1st course Rx at reporting facility',
    'F25': '10/05/2024', 'F26': '02/05/2024', 'F29': 'AP-24-0731 / 02/05/2024',
    'F31': 'Mediastinal lymph nodes', 'F32': 'C77.1 - Intrathoracic / Mediastinal lymph nodes',
    'F33': '0 - Not a paired site', 'F34': 'Classical Hodgkin lymphoma, nodular sclerosis subtype',
    'F35': 'M-9663/36 - Hodgkin lymphoma, nodular sclerosis, NOS (B-cell)',
    'F37': '6 - B-cell / Pre-B / B-precursor', 'F38': 'cT0 cN2 cM0', 'F39': 'Stage IIB',
    'F40': '99 - Not surgically resected / unknown', 'F41': '99 - Unknown / Unstaged',
    'F42': 'Stage IIBX (Bulky Nodal Disease)',
    'F43': '1 - Present (B: Fever >38°C, drenching night sweats, and/or >10% wt loss)',
    'F44': '88 - Not Applicable (Non-Myeloma)', 'F45': '88 - Not Applicable (Non-Gynecologic)',
    'F46': '3 - Regional lymph nodes only', 'F47': '17/05/2024', 'F48': '1 - Curative / Definitive',
    'F49': '00 - No resection; excisional lymph node biopsy for diagnosis only',
    'F50': '03 - ABVD x 6 cycles; bleomycin omitted after interim PET per protocol',
    'F51': 'ISRT 30 Gy / 15 fractions to mediastinum planned after chemotherapy',
    'F52': '00 - None', 'F53': '00 - None; checkpoint inhibitor not used first line',
    'F59': '1 - Active Oncology Outpatient Clinic Visit',
    'F60': '28-year-old woman presented with 6 weeks of cervical fullness, fever, drenching night sweats and 11% involuntary weight loss. CT/PET (28/04/2024) showed bulky anterior mediastinal and bilateral hilar FDG-avid adenopathy, disease confined above diaphragm. Excisional cervical node biopsy (02/05/2024): classical Hodgkin lymphoma, nodular sclerosis; CD30+, CD15+, weak PAX5+, CD45−. Ann Arbor/Lugano Stage IIBX with B symptoms. Curative intent ABVD initiated 17/05/2024; bleomycin omitted after interim PET complete metabolic response. Planned involved-site RT 30 Gy/15 fractions. Alive at follow-up 12/09/2024. Entirely synthetic.'
  }, {
    'F26': 'Lymph node excision pathology confirming lymphoma on 02/05/2024 is the earliest qualifying incidence date.',
    'F27': 'Excisional lymph node biopsy: histology of tissue confirms primary lymphoma; basis 7.',
    'F32': 'Mediastinal nodal origin coded to C77.1. For lymphoma, primary site assignment should follow registry-specific rules.',
    'F35': 'Nodular sclerosis classical Hodgkin lymphoma; check exact ICD-O morphology and behavior against current edition and local rules.',
    'F37': 'Lymphoid grade is lineage-coded where applicable; do not infer conventional solid-tumor grade.',
    'F38': 'Solid-tumor TNM fields are not applicable to lymphoma; Ann Arbor/Lugano SSDI carries stage. cT0/cN2 here is illustrative only.',
    'F42': 'Lugano Stage IIBX: nodal disease on one side of diaphragm with B symptoms and bulky disease.',
    'F43': 'Fever, drenching night sweats, >10% weight loss are documented; B symptoms present.',
    'F50': 'ABVD is multi-agent chemotherapy; immunotherapy absent in first course.',
    'F60': 'Narrative synthetic; staging, B symptoms and treatment detail are illustrative and require verification with source material.'
  }, 'TRIPOLI CENTRAL ONCOLOGY INSTITUTE — SYNTHETIC DEMONSTRATION RECORD\n\nPatient: Sara Fathi Ibrahim Al-Zawawi | MRN-24-HL-0731 | DOB 15/06/1995 | Sex: Female\n\n28/04/2024 — PET/CT: FDG-avid bulky anterior mediastinal mass (11.2 cm), bilateral hilar and lower cervical nodes; no disease below diaphragm.\n\n02/05/2024 — Excisional cervical lymph node biopsy: classical Hodgkin lymphoma, nodular sclerosis subtype. CD30+, CD15+, weak PAX5+, CD45−.\n\nClinical: Fever to 38.5 °C, drenching night sweats, 11% weight loss over 6 months. Ann Arbor/Lugano Stage IIBX.\n\n17/05/2024 — Curative ABVD initiated. Interim PET after 2 cycles: complete metabolic response; bleomycin omitted for cycles 3–6. Planned ISRT 30 Gy/15 fractions.\n\n12/09/2024 — In treatment, alive. This fictional record is for software demonstration only.', ['Lymphoma', 'Hodgkin', 'Lugano']),

  createCase('prostate', 'Prostate Adenocarcinoma', 'Acinar adenocarcinoma • fictional 71-year-old man', {
    'F01': '119530001129', 'F02': 'Mustafa Ali Ramadan Al-Tarhouni', 'F03': 'Mustafa Ali Ramadan Al-Tarhouni',
    'F04': 'MRN-24-PR-1129', 'F10': '09/02/1953', 'F12': '71', 'F13': '1 - Male',
    'F15': '2 - Married', 'F16': '2 - Preparatory / Middle School', 'F17': 'Retired civil engineer',
    'F18': '0 - Never Smoker (<100 lifetime cigarettes)', 'F19': '0 - Negative (No known family history of malignancy)',
    'F21': '14 - Analytic: Dx & all 1st course Rx at reporting facility', 'F25': '22/06/2024',
    'F26': '12/06/2024', 'F29': 'AP-24-1129 / 12/06/2024', 'F31': 'Prostate gland, bilateral peripheral zone',
    'F32': 'C61.9 - Prostate gland', 'F33': '0 - Not a paired site',
    'F34': 'Acinar adenocarcinoma of prostate', 'F35': 'M-8140/33 - Adenocarcinoma, NOS (poorly differentiated)',
    'F37': '3 - Grade III: Poorly differentiated', 'F38': 'cT3a cN0 cM0', 'F39': 'Stage IIIB',
    'F40': '99 - Not surgically resected / unknown', 'F41': '99 - Unknown / Unstaged',
    'F42': '88 - Not Applicable (Non-Lymphoma)', 'F43': '8 - Not Applicable (Non-Lymphoma)',
    'F44': '88 - Not Applicable (Non-Myeloma)', 'F45': '88 - Not Applicable (Non-Gynecologic)',
    'F46': '1 - Localized only', 'F47': '27/06/2024', 'F48': '1 - Curative / Definitive',
    'F49': '00 - No prostatectomy; definitive radiation selected',
    'F50': '00 - No cytotoxic chemotherapy', 'F51': 'IMRT 70 Gy / 28 fractions to prostate and seminal vesicles; completed 23/08/2024',
    'F52': '01 - Leuprolide ADT; started 27/06/2024, planned 18 months', 'F53': '00 - None',
    'F59': '1 - Active Oncology Outpatient Clinic Visit',
    'F60': '71-year-old man with PSA 27.6 ng/mL and abnormal DRE. Multiparametric MRI (08/06/2024): 2.8 cm PI-RADS 5 lesion with focal extracapsular extension, no seminal vesicle invasion or pelvic adenopathy. Transperineal biopsy (12/06/2024): acinar adenocarcinoma, Gleason 4+4=8, Grade Group 4, 8/14 cores positive. Bone scan negative. Clinical cT3a cN0 cM0; AJCC prognostic group IIIB (PSA and Grade Group considered). Definitive IMRT 70 Gy/28 fractions with 18-month leuprolide began 27/06/2024. Curative intent. Alive at follow-up 12/09/2024. Synthetic record.'
  }, {
    'F26': 'First positive prostate biopsy date, 12/06/2024, used under IARC hierarchy.',
    'F32': 'Prostate is unpaired; ICD-O-3 topography C61.9.',
    'F35': 'Acinar adenocarcinoma morphology and grade must be sourced from pathology; confirm ICD-O code and grade suffix in authoritative current table.',
    'F38': 'MRI and examination indicate extracapsular extension cT3a, no nodes or distant disease identified.',
    'F39': 'Stage group is a prognostic group incorporating PSA and Grade Group for prostate; verify current AJCC edition/registry abstraction rules.',
    'F46': 'No regional extension or distant metastases documented in this fictional record; localized summary stage.',
    'F51': 'Definitive IMRT; record dose and fractions from treatment summary.',
    'F52': 'Leuprolide androgen deprivation is hormone/endocrine therapy, not chemotherapy.',
    'F60': 'Synthetic case; TNM/prognostic stage is demonstration content and requires current staging validation.'
  }, 'TRIPOLI CENTRAL ONCOLOGY INSTITUTE — SYNTHETIC DEMONSTRATION RECORD\n\nPatient: Mustafa Ali Ramadan Al-Tarhouni | MRN-24-PR-1129 | DOB 09/02/1953 | Sex: Male\n\n08/06/2024 — PSA 27.6 ng/mL. Multiparametric MRI: PI-RADS 5, 2.8 cm lesion in left peripheral zone, focal extracapsular extension, no seminal vesicle invasion or pelvic nodes.\n\n12/06/2024 — Transperineal prostate biopsy: acinar adenocarcinoma, Gleason 4+4=8, Grade Group 4; 8/14 cores positive.\n\n20/06/2024 — Bone scan negative for osseous metastases. cT3a cN0 cM0.\n\n27/06/2024 — Leuprolide initiated; definitive IMRT 70 Gy in 28 fractions completed 23/08/2024. Curative intent.\n\n12/09/2024 — Follow-up, PSA response documented, alive. Entire case is fictitious.', ['Prostate', 'Adenocarcinoma', 'AJCC 8']),

  createCase('endometrial', 'Endometrioid Carcinoma — Endometrium', 'Endometrial adenocarcinoma • fictional 62-year-old woman', {
    'F01': '119620001944', 'F02': 'Najwa Salem Faraj Al-Qaddafi', 'F03': 'Najwa Salem Faraj Al-Qaddafi',
    'F04': 'MRN-24-EN-1944', 'F10': '27/03/1962', 'F12': '62', 'F13': '2 - Female',
    'F15': '3 - Widowed', 'F17': 'Retired teacher', 'F21': '14 - Analytic: Dx & all 1st course Rx at reporting facility',
    'F25': '18/07/2024', 'F26': '09/07/2024', 'F29': 'AP-24-1944 / 09/07/2024',
    'F31': 'Endometrium, uterine corpus', 'F32': 'C54.1 - Endometrium', 'F33': '0 - Not a paired site',
    'F34': 'Endometrioid adenocarcinoma, FIGO grade 1', 'F35': 'M-8380/31 - Endometrioid adenocarcinoma, NOS (well differentiated)',
    'F37': '1 - Grade I: Well differentiated', 'F38': 'cT1a cN0 cM0', 'F39': 'Stage IA',
    'F40': 'pT1a pN0 cM0', 'F41': 'Stage IA', 'F42': '88 - Not Applicable (Non-Lymphoma)',
    'F43': '8 - Not Applicable (Non-Lymphoma)', 'F44': '88 - Not Applicable (Non-Myeloma)',
    'F45': 'FIGO IA', 'F46': '1 - Localized only', 'F47': '25/07/2024', 'F48': '1 - Curative / Definitive',
    'F49': 'Total hysterectomy, bilateral salpingo-oophorectomy, sentinel pelvic nodes; no myometrial invasion, 0/4 nodes',
    'F50': '00 - No chemotherapy indicated', 'F51': '00 - No radiotherapy planned',
    'F52': '00 - None', 'F53': '00 - None',
    'F59': '1 - Active Oncology Outpatient Clinic Visit',
    'F60': '62-year-old postmenopausal woman presented with intermittent vaginal bleeding. Endometrial biopsy (09/07/2024): endometrioid adenocarcinoma, FIGO Grade 1. Pelvic MRI showed disease apparently confined to endometrium, no cervical or nodal involvement. Total hysterectomy, BSO and sentinel node mapping (25/07/2024): 1.3 cm tumor, no myometrial invasion, no LVSI, negative cervix/adnexa, 0/4 nodes; pT1a pN0. FIGO IA. Curative surgery; no adjuvant therapy recommended. Alive at 12/09/2024 visit. Fictional case only.'
  }, {
    'F26': 'Positive endometrial biopsy dated 09/07/2024 is the earliest diagnosis date.',
    'F32': 'Uterine corpus endometrium is coded C54.1.',
    'F35': 'Endometrioid adenocarcinoma; verify morphology/grade suffix with applicable ICD-O release.',
    'F40': 'Final hysterectomy pathology records no myometrial invasion and negative sentinel nodes.',
    'F45': 'Gynecologic primary: FIGO IA recorded alongside TNM.',
    'F49': 'Definitive resection performed; abstract extent and nodes from final synoptic report.',
    'F60': 'Fictional pathology and surgical details. Confirm FIGO/AJCC edition and coding against actual records.'
  }, 'TRIPOLI CENTRAL ONCOLOGY INSTITUTE — SYNTHETIC DEMONSTRATION RECORD\n\nPatient: Najwa Salem Faraj Al-Qaddafi | MRN-24-EN-1944 | DOB 27/03/1962 | Sex: Female\n\n03/07/2024 — Pelvic ultrasound: 15 mm endometrial stripe.\n\n09/07/2024 — Endometrial biopsy: endometrioid adenocarcinoma, FIGO grade 1.\n\n16/07/2024 — Pelvic MRI: lesion confined to endometrium; no myometrial invasion, cervical extension or adenopathy.\n\n25/07/2024 — Total hysterectomy, BSO, sentinel pelvic node mapping: 1.3 cm tumor; no myometrial invasion/LVSI, negative cervix and adnexa; 0/4 nodes. pT1a pN0, FIGO IA. No adjuvant treatment recommended.\n\n12/09/2024 — Postoperative follow-up, alive, no evidence of disease. Synthetic demonstration record.', ['Gynecologic', 'Endometrial', 'FIGO']),

  createCase('fibroadenoma', 'Benign Fibroepithelial Breast Mass', 'Benign example • intentionally not reportable under most population rules', {
    'F01': '119900001508', 'F02': 'Laila Hassan Salem Al-Mabrouk', 'F03': 'Laila Hassan Salem Al-Mabrouk',
    'F04': 'MRN-24-FA-1508', 'F10': '30/01/1990', 'F12': '34', 'F13': '2 - Female',
    'F21': '34 - Non-Analytic: Not required by CoC/ISCR (e.g., Benign non-CNS /0)',
    'F25': '10/08/2024', 'F26': '06/08/2024', 'F29': 'AP-24-1508 / 06/08/2024',
    'F31': 'Right breast, upper-outer quadrant', 'F32': 'C50.4 - Upper-outer quadrant of breast',
    'F33': '1 - Right: origin of primary', 'F34': 'Fibroadenoma, conventional',
    'F35': 'M-9010/09 - Fibroadenoma, NOS (Benign /0)',
    'F36': '/0 - Benign (Non-reportable outside CNS per ISCR/STORE)', 'F37': '9 - Grade/differentiation unknown, not stated, or N/A',
    'F38': '88 - Not Applicable (Benign / no AJCC stage)',
    'F39': '88 - Not Applicable (Benign / no AJCC stage)', 'F40': '88 - Not Applicable (Benign / no AJCC stage)',
    'F41': '88 - Not Applicable (Benign / no AJCC stage)', 'F46': '8 - Benign / Borderline neoplasm',
    'F47': '06/08/2024', 'F48': '8 - Not Applicable (Benign / Non-Reportable)',
    'F49': 'Ultrasound-guided vacuum-assisted excision; complete removal',
    'F50': '00 - Not applicable', 'F51': '00 - Not applicable', 'F52': '00 - Not applicable', 'F53': '00 - Not applicable',
    'F54': '1 - Alive', 'F56': '88/88/8888', 'F57': '8888 - Not Applicable / Alive', 'F58': '8 - Not Applicable (Patient Alive)',
    'F60': '34-year-old woman underwent ultrasound for a palpable right breast lump. Imaging showed a 1.7 cm oval, circumscribed, parallel mass, BI-RADS 3. Vacuum-assisted excision (06/08/2024): conventional fibroadenoma without atypia or malignancy. ICD-O behavior /0. This benign breast neoplasm is generally not reportable to a population cancer registry (unlike selected CNS benign neoplasms). Included solely to demonstrate benign behavior, non-analytic class of case 34, and validation safeguards. No cancer-directed therapy. Fictional case; not a reportable cancer abstract.'
  }, {
    'F21': 'This is a deliberately non-reportable benign non-CNS example; class-of-case 34 is included for audit/education only, not as an incidence record.',
    'F32': 'Breast topography is retained for demonstration; benign non-CNS tumors generally excluded from population incidence reporting.',
    'F33': 'Breast paired site; right-sided mass documented.',
    'F35': 'Fibroadenoma behavior /0. Verify current ICD-O coding. The benign exception is CNS sites, not breast.',
    'F36': 'Behavior /0 triggers a prominent reportability warning. Do not submit this example as an invasive cancer registry case.',
    'F46': 'Summary stage 8 represents benign/borderline in this demo schema; local registry rules may omit this case entirely.',
    'F60': 'Intentional educational example. The application warns it is not a reportable population cancer case.'
  }, 'TRIPOLI CENTRAL ONCOLOGY INSTITUTE — SYNTHETIC DEMONSTRATION RECORD\n\nPatient: Laila Hassan Salem Al-Mabrouk | MRN-24-FA-1508 | DOB 30/01/1990 | Sex: Female\n\n04/08/2024 — Breast ultrasound: 1.7 cm circumscribed oval parallel right upper-outer quadrant mass, BI-RADS 3.\n\n06/08/2024 — Vacuum-assisted excision: conventional fibroadenoma, no atypia or malignancy. Behavior /0.\n\nRegistry note: benign non-CNS breast neoplasm; typically non-reportable to population cancer registries. This example is for training/QA only and must not be represented as a reportable cancer case. No cancer-directed treatment. All details fictional.', ['Benign', 'Reportability', 'Education']),

  createCase('myeloma', 'Plasma Cell Myeloma', 'Multiple myeloma • fictional 63-year-old man', {
    'F01': '119610000392', 'F02': 'Yousef Ahmed Mansour Al-Badri', 'F03': 'Yousef Ahmed Mansour Al-Badri',
    'F04': 'MRN-24-MM-0392', 'F10': '01/12/1960', 'F12': '63', 'F13': '1 - Male',
    'F21': '14 - Analytic: Dx & all 1st course Rx at reporting facility', 'F25': '07/09/2024',
    'F26': '29/08/2024', 'F29': 'BM-24-0392 / 29/08/2024', 'F31': 'Bone marrow', 'F32': 'C42.1 - Bone marrow',
    'F33': '0 - Not a paired site', 'F34': 'Plasma cell myeloma', 'F35': 'M-9732/36 - Plasma cell myeloma / Multiple myeloma',
    'F37': '6 - B-cell / Pre-B / B-precursor', 'F38': '88 - Not Applicable (Hematologic malignancy)',
    'F39': '88 - Not Applicable (Hematologic malignancy)', 'F40': '88 - Not Applicable (Hematologic malignancy)',
    'F41': '88 - Not Applicable (Hematologic malignancy)', 'F42': '88 - Not Applicable (Non-Lymphoma)',
    'F43': '8 - Not Applicable (Non-Lymphoma)', 'F44': 'R-ISS Stage II', 'F45': '88 - Not Applicable (Non-Gynecologic)',
    'F46': '7 - Distant site(s) / distant lymph node(s) involved', 'F47': '13/09/2024', 'F48': '2 - Palliative / Disease & Symptom Control',
    'F49': '00 - No resection; hematologic malignancy',
    'F50': '03 - Daratumumab + bortezomib + lenalidomide + dexamethasone (D-VRd)',
    'F51': 'Palliative RT 8 Gy single fraction to painful T11 lesion, 13/09/2024',
    'F52': '00 - No endocrine therapy', 'F53': '01 - Daratumumab (anti-CD38 monoclonal antibody)',
    'F60': '63-year-old man presented with back pain, fatigue and anemia. CBC: Hb 8.9 g/dL; creatinine 1.4 mg/dL. Serum electrophoresis: IgG-kappa monoclonal protein 3.8 g/dL; free light chain ratio 86. Whole-body low-dose CT: multiple lytic lesions, including T11. Bone marrow biopsy (29/08/2024): 48% CD138+ kappa-restricted plasma cells; FISH t(4;14) negative, del17p negative. Plasma cell myeloma, ICD-O C42.1 / M-9732/3. R-ISS II (albumin 3.4 g/dL, beta-2 microglobulin 4.1 mg/L, LDH normal). D-VRd initiated 13/09/2024; palliative RT to T11. Alive at follow-up 25/10/2024. Synthetic case.'
  }, {
    'F26': 'Bone marrow biopsy positive for plasma cell neoplasm on 29/08/2024; first qualifying diagnostic confirmation.',
    'F27': 'Bone marrow trephine histology confirms primary hematologic malignancy (basis 7).',
    'F32': 'Plasma cell myeloma primary site is bone marrow, C42.1.',
    'F35': 'Plasma cell myeloma morphology 9732; verify grade/lineage suffix conventions in the registry dictionary.',
    'F38': 'AJCC solid-tumor TNM is not applicable. Use hematologic stage field 44 and summary stage per current registry rules.',
    'F44': 'R-ISS II is derived from beta-2 microglobulin, albumin, LDH and cytogenetics; demo values provided.',
    'F46': 'Myeloma is generally treated as distant stage in SEER summary staging; verify current hematopoietic schema.',
    'F50': 'D-VRd includes cytotoxic/targeted regimen components; capture regimen per current STORE definitions.',
    'F53': 'Daratumumab is an anti-CD38 biologic; therapy categories may overlap, abstract per applicable STORE year.',
    'F60': 'Entire record synthetic; consult hematopoietic manual for exact morphology, stage and therapy codes.'
  }, 'TRIPOLI CENTRAL ONCOLOGY INSTITUTE — SYNTHETIC DEMONSTRATION RECORD\n\nPatient: Yousef Ahmed Mansour Al-Badri | MRN-24-MM-0392 | DOB 01/12/1960 | Sex: Male\n\n25/08/2024 — CBC: Hb 8.9 g/dL. Creatinine 1.4 mg/dL. SPEP/IFE: IgG-kappa M-protein 3.8 g/dL; FLC ratio 86.\n\n27/08/2024 — Whole-body low-dose CT: multiple lytic lesions, including T11 vertebral body.\n\n29/08/2024 — Bone marrow biopsy: 48% CD138+ kappa-restricted plasma cells; FISH t(4;14) negative, del17p negative.\n\nR-ISS II: beta-2 microglobulin 4.1 mg/L, albumin 3.4 g/dL, LDH normal.\n\n13/09/2024 — D-VRd initiated; palliative radiotherapy 8 Gy x 1 to T11. Alive 25/10/2024. Entire case fictional.', ['Myeloma', 'Hematology', 'R-ISS'])
];

export const INITIAL_REFERENCE_TEXT = `SYNTHETIC REGISTRY DEMONSTRATION — NO REAL PATIENT INFORMATION\n\nThe sample records in this application are fictitious and intended only for software evaluation. Do not use them for clinical care or registry submission.\n\nThis application demonstrates a proposed abstracting workflow; its validation is illustrative and does not replace current official manuals, registrar judgment, source documentation, or authorized coding software. Verify every coded item against the current registry specifications and reference editions.`;
