/* ==========================================================================
   Cancer Registry Office — Data Extraction Schema, SVG Icons & Reference Guide Summaries
   Covers Section 0 (5 Admin Fields) + Sections I–VII (60 Numbered Fields)
   ========================================================================== */

export const ICONS = {
  shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>',
  activity: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',
  upload: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>',
  book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
  fileText: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>',
  sparkles: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/><path d="M5 3v4"/><path d="M3 5h4"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
  copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
  download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
  printer: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>',
  checkCircle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
  alertTriangle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
  alertOctagon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
  locate: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v3"/><path d="M12 19v3"/><path d="M2 12h3"/><path d="M19 12h3"/></svg>',
  rotateCcw: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>',
  columns: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="3" x2="9" y2="21"/></svg>',
  chevronDown: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>',
  settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
  trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
  wand: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 4V2"/><path d="M15 16v-2"/><path d="M8 9h2"/><path d="M20 9h2"/><path d="M17.8 11.8 19 13"/><path d="M15 9h0"/><path d="M17.8 6.2 19 5"/><path d="m3 21 9-9"/><path d="M12.2 6.2 11 5"/></svg>',
  folderOpen: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 14 1.45-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.55 6a2 2 0 0 1-1.94 1.5H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H18a2 2 0 0 1 2 2v2"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
  table: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/></svg>',
  code: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>'
};

export const SECTIONS = [
  {
    id: 'sec0',
    code: 'SEC 0',
    shortLabel: '0. Header',
    title: 'Section 0: Header & Administrative Information',
    subtitle: 'Registry Identification, Accession Tracking & Reporting Facility Metadata'
  },
  {
    id: 'sec1',
    code: 'SEC I',
    shortLabel: 'I. Identity',
    title: 'Section I: Patient Identity',
    subtitle: 'Demographics, 12-Digit National ID, Bilingual Name, Geocode & Birth Record (Fields 01–13)'
  },
  {
    id: 'sec2',
    code: 'SEC II',
    shortLabel: 'II. Social',
    title: 'Section II: Social & Biological Data',
    subtitle: 'Socioeconomic Determinants, Tobacco Exposure & Hereditary Risk Profile (Fields 14–19)'
  },
  {
    id: 'sec3',
    code: 'SEC III',
    shortLabel: 'III. Pathway',
    title: 'Section III: Case Identification & Pathway',
    subtitle: 'Referral Trajectory, ISCR/STORE Class of Case, IARC Incidence & Diagnostic Basis (Fields 20–29)'
  },
  {
    id: 'sec4',
    code: 'SEC IV',
    shortLabel: 'IV. Pathology',
    title: 'Section IV: Tumor & Pathology',
    subtitle: 'ICD-O-3.2 Topography, Paired Laterality, Histomorphology, Behavior & Differentiation (Fields 30–37)'
  },
  {
    id: 'sec5',
    code: 'SEC V',
    shortLabel: 'V. Staging',
    title: 'Section V: Staging System',
    subtitle: 'AJCC 8th Clinical/Pathologic TNM, Lugano/Ann Arbor, R-ISS, FIGO & SEER Summary Stage (Fields 38–46)'
  },
  {
    id: 'sec6',
    code: 'SEC VI',
    shortLabel: 'VI. Treatment',
    title: 'Section VI: Treatment Modalities',
    subtitle: 'First Course Cancer-Directed Therapy Date, Intent & Multimodal Regimens (Fields 47–53)'
  },
  {
    id: 'sec7',
    code: 'SEC VII',
    shortLabel: 'VII. Outcomes',
    title: 'Section VII: Outcomes & Remarks / Clinical Notes',
    subtitle: 'Vital Status, Survival Follow-Up, Mortality Coding & Structured Clinical Narrative (Fields 54–60)'
  }
];

export const ICDO_TOPOGRAPHY_LIST = [
  'C34.1 - Upper lobe, bronchus or lung',
  'C34.3 - Lower lobe, bronchus or lung',
  'C34.9 - Bronchus or lung, NOS',
  'C50.2 - Upper-inner quadrant of breast',
  'C50.4 - Upper-outer quadrant of breast',
  'C50.9 - Breast, NOS',
  'C61.9 - Prostate gland',
  'C77.1 - Intrathoracic / Mediastinal lymph nodes',
  'C77.0 - Lymph nodes of head, face and neck',
  'C77.9 - Lymph node, NOS',
  'C54.1 - Endometrium',
  'C53.9 - Cervix uteri',
  'C56.9 - Ovary',
  'C42.1 - Bone marrow',
  'C18.7 - Sigmoid colon',
  'C20.9 - Rectum, NOS',
  'C16.9 - Stomach, NOS',
  'C22.0 - Liver cell carcinoma site',
  'C25.0 - Head of pancreas',
  'C64.9 - Kidney, NOS',
  'C67.9 - Urinary bladder, NOS',
  'C71.9 - Brain, NOS',
  'C73.9 - Thyroid gland'
];

export const ICDO_MORPHOLOGY_LIST = [
  'M-8041/39 - Small cell carcinoma, NOS (undifferentiated)',
  'M-8500/32 - Infiltrating duct carcinoma, NOS (Grade 2)',
  'M-8500/33 - Infiltrating duct carcinoma, NOS (Grade 3)',
  'M-9663/36 - Hodgkin lymphoma, nodular sclerosis, NOS (B-cell)',
  'M-8140/33 - Adenocarcinoma, NOS (poorly differentiated)',
  'M-8380/31 - Endometrioid adenocarcinoma, NOS (well differentiated)',
  'M-9010/09 - Fibroadenoma, NOS (Benign /0)',
  'M-9732/36 - Plasma cell myeloma / Multiple myeloma',
  'M-8070/32 - Squamous cell carcinoma, NOS',
  'M-9680/36 - Diffuse large B-cell lymphoma (DLBCL), NOS',
  'M-8260/32 - Papillary adenocarcinoma, NOS',
  'M-9440/34 - Glioblastoma, IDH-wildtype'
];

export const STAGE_GROUP_OPTIONS = [
  'Stage 0',
  'Stage I',
  'Stage IA',
  'Stage IA1',
  'Stage IA2',
  'Stage IB',
  'Stage II',
  'Stage IIA',
  'Stage IIB',
  'Stage IIC',
  'Stage III',
  'Stage IIIA',
  'Stage IIIB',
  'Stage IIIC',
  'Stage IV',
  'Stage IVA',
  'Stage IVB',
  'Stage IVC',
  '88 - Not Applicable (Heme / Lymphoma / Benign / No AJCC)',
  '99 - Unknown / Unstaged'
];

export const SCHEMA_FIELDS = [
  // ================= SECTION 0: HEADER & ADMIN =================
  {
    id: 'H01', code: 'H-01', section: 'sec0', isHeader: true,
    name: 'Registry Code / Case Identifier',
    standard: 'ISCR / NCR',
    type: 'text', mono: true, required: true,
    hint: 'Unique institutional or central cancer registry abstract ID'
  },
  {
    id: 'H02', code: 'H-02', section: 'sec0', isHeader: true,
    name: 'Registration Year',
    standard: 'STORE #0550',
    type: 'text', mono: true, required: true,
    hint: '4-digit year of accession/registration (YYYY)'
  },
  {
    id: 'H03', code: 'H-03', section: 'sec0', isHeader: true,
    name: 'Accession Number',
    standard: 'STORE #0550',
    type: 'text', mono: true, required: true,
    hint: '9-digit facility accession number (YYYYNNNNN)'
  },
  {
    id: 'H04', code: 'H-04', section: 'sec0', isHeader: true,
    name: 'Abstractor ID',
    standard: 'ISCR Admin',
    type: 'text', mono: true, required: true,
    hint: 'Certified Tumor Registrar (CTR / ODS) identifier'
  },
  {
    id: 'H05', code: 'H-05', section: 'sec0', isHeader: true,
    name: 'Facility ID (FIN)',
    standard: 'STORE #0540',
    type: 'text', mono: false, required: true,
    hint: 'Reporting hospital / oncology center facility code & name'
  },

  // ================= SECTION I: PATIENT IDENTITY (01-13) =================
  {
    id: 'F01', code: '01', section: 'sec1',
    name: 'National ID Number (12-digit)',
    standard: 'NCR Core',
    type: 'text', mono: true, required: true,
    hint: 'Strict 12-digit civil NID (or 999999999999 if unknown)'
  },
  {
    id: 'F02', code: '02', section: 'sec1',
    name: 'Full Name (English)',
    standard: 'ISCR / STORE',
    type: 'text', required: true,
    hint: 'First, Father, Grandfather, Family / Surname in Latin characters'
  },
  {
    id: 'F03', code: '03', section: 'sec1',
    name: 'Full Name (English Transliteration)',
    standard: 'NCR Core',
    type: 'text', required: true,
    hint: 'Full legal name in Latin/English characters; use the documented English spelling and verify against the source identity record.'
  },
  {
    id: 'F04', code: '04', section: 'sec1',
    name: 'Medical Record Number (MRN)',
    standard: 'STORE #2300',
    type: 'text', mono: true, required: true,
    hint: 'Hospital permanent chart / EHR identifier'
  },
  {
    id: 'F05', code: '05', section: 'sec1',
    name: 'Municipality',
    standard: 'NCR Geo',
    type: 'select', required: true,
    options: [
      'Tripoli Center',
      'Hay Al-Andalus',
      'Tajoura',
      'Janzour',
      'Ain Zara',
      'Souq Al-Jumaa',
      'Abu Salim',
      'Benghazi',
      'Misrata',
      'Sabratha',
      'Zawiya',
      'Zliten',
      'Gharyan',
      'Sebha',
      'Sirte',
      'Derna',
      'Tobruk',
      'Out-of-Region / International Referral',
      '99 - Unknown'
    ],
    hint: 'Usual residential municipality at time of diagnosis'
  },
  {
    id: 'F06', code: '06', section: 'sec1',
    name: 'Municipality Branch (Al-Mahalla)',
    standard: 'NCR Geo',
    type: 'text', required: true,
    hint: 'Sub-municipal district / Al-Mahalla (or 99 - Unknown)'
  },
  {
    id: 'F07', code: '07', section: 'sec1',
    name: 'Address Code',
    standard: 'NCR Geo',
    type: 'text', mono: true, required: true,
    hint: 'Formatted geocode (e.g., 011/04 - Hay Al-Andalus, or 999/99 - Unknown)'
  },
  {
    id: 'F08', code: '08', section: 'sec1',
    name: 'Residence Type',
    standard: 'IARC Demo',
    type: 'select', required: true,
    options: [
      '1 - Urban (City / Metropolitan)',
      '2 - Suburban / Peri-Urban',
      '3 - Rural / Agricultural',
      '4 - Remote / Desert Settlement',
      '8 - Foreign / Non-Resident',
      '9 - Unknown'
    ],
    hint: 'Urban-rural classification at time of incidence'
  },
  {
    id: 'F09', code: '09', section: 'sec1',
    name: 'Phone Number',
    standard: 'NCR Admin',
    type: 'text', mono: true, required: false,
    hint: 'Active patient or next-of-kin contact number (or 9999999999)'
  },
  {
    id: 'F10', code: '10', section: 'sec1',
    name: 'Date of Birth',
    standard: 'ISCR / IARC',
    type: 'text', mono: true, required: true,
    hint: 'Strict DD/MM/YYYY format (or 99/99/9999 if unknown)'
  },
  {
    id: 'F11', code: '11', section: 'sec1',
    name: 'Place of Birth',
    standard: 'ISCR Demo',
    type: 'text', required: false,
    hint: 'City / Country of birth (or 99 - Unknown)'
  },
  {
    id: 'F12', code: '12', section: 'sec1',
    name: 'Age at Diagnosis',
    standard: 'IARC / STORE',
    type: 'text', mono: true, required: true,
    hint: 'Completed years at Date of Incidence (000–120, or 999 Unknown)'
  },
  {
    id: 'F13', code: '13', section: 'sec1',
    name: 'Sex',
    standard: 'ISCR / ICD-O',
    type: 'select', required: true,
    options: [
      '1 - Male',
      '2 - Female',
      '3 - Other (Intersex / Transsexual)',
      '9 - Unknown'
    ],
    hint: 'Biological sex cross-edited against NID & primary topography'
  },

  // ================= SECTION II: SOCIAL & BIOLOGICAL DATA (14-19) =================
  {
    id: 'F14', code: '14', section: 'sec2',
    name: 'Nationality',
    standard: 'NCR / IARC',
    type: 'text', required: true,
    hint: 'Country of citizenship & ISO code (e.g., Libyan - LBY)'
  },
  {
    id: 'F15', code: '15', section: 'sec2',
    name: 'Marital Status',
    standard: 'ISCR #0150',
    type: 'select', required: true,
    options: [
      '1 - Single (Never Married)',
      '2 - Married',
      '3 - Widowed',
      '4 - Divorced',
      '5 - Separated',
      '9 - Unknown'
    ],
    hint: 'Marital status at time of initial diagnosis'
  },
  {
    id: 'F16', code: '16', section: 'sec2',
    name: 'Education Level',
    standard: 'NCR Social',
    type: 'select', required: false,
    options: [
      '0 - Illiterate / No Formal Schooling',
      '1 - Primary / Basic Education',
      '2 - Preparatory / Middle School',
      '3 - Secondary / High School',
      '4 - Vocational / Higher Technical Diploma',
      '5 - University / Bachelor Degree',
      '6 - Postgraduate (Master / PhD / MD)',
      '9 - Unknown / Not Stated'
    ],
    hint: 'Highest completed educational attainment'
  },
  {
    id: 'F17', code: '17', section: 'sec2',
    name: 'Occupation',
    standard: 'ISCR / NIOSH',
    type: 'text', required: false,
    hint: 'Longest-held occupation / occupational exposure context'
  },
  {
    id: 'F18', code: '18', section: 'sec2',
    name: 'Smoking History',
    standard: 'ISCR Risk',
    type: 'select', required: true,
    options: [
      '0 - Never Smoker (<100 lifetime cigarettes)',
      '1 - Current Cigarette Smoker',
      '2 - Former Cigarette Smoker (Quit >= 1 yr)',
      '3 - Shisha / Waterpipe / Cigar / Pipe Smoker',
      '4 - Smokeless Tobacco Only',
      '9 - Unknown / Not Documented'
    ],
    hint: 'Tobacco use status & pack-year risk documentation'
  },
  {
    id: 'F19', code: '19', section: 'sec2',
    name: 'Family History of Cancer',
    standard: 'ISCR Risk',
    type: 'select', required: true,
    options: [
      '0 - Negative (No known family history of malignancy)',
      '1 - Positive: First-Degree Relative(s)',
      '2 - Positive: Second-Degree Relative(s) only',
      '3 - Positive: Confirmed Hereditary Cancer Syndrome',
      '9 - Unknown / Adopted / Not Documented'
    ],
    hint: 'Oncologic family history in 1st/2nd-degree blood relatives'
  },

  // ================= SECTION III: CASE IDENTIFICATION & PATHWAY (20-29) =================
  {
    id: 'F20', code: '20', section: 'sec3',
    name: 'Source of Referral',
    standard: 'NCR / CanReg5',
    type: 'select', required: true,
    options: [
      '1 - Outpatient Oncology / Specialty Clinic',
      '2 - Inpatient Medical or Surgical Ward',
      '3 - Histopathology / Cytopathology Laboratory',
      '4 - Diagnostic Imaging / Nuclear Medicine Unit',
      '5 - Emergency Department',
      '6 - External Hospital / Private Clinic Referral',
      '7 - Organized Screening Program',
      '8 - Death Certificate Only (DCO)',
      '9 - Unknown'
    ],
    hint: 'Primary casefinding source bringing tumor to registry'
  },
  {
    id: 'F21', code: '21', section: 'sec3',
    name: 'Class of Case (Analytic vs Non-Analytic)',
    standard: 'STORE #0610 / ISCR',
    type: 'select', required: true,
    options: [
      '00 - Analytic: Dx at reporting facility, all 1st course Rx elsewhere',
      '10 - Analytic: Dx & Rx at reporting facility (prior status unknown)',
      '11 - Analytic: Dx in staff physician office, Rx at reporting facility',
      '12 - Analytic: Dx in staff office, part of 1st course Rx here',
      '13 - Analytic: Dx & part of 1st course Rx here, part elsewhere',
      '14 - Analytic: Dx & all 1st course Rx at reporting facility',
      '20 - Analytic: Dx elsewhere, part of 1st course Rx at reporting facility',
      '21 - Analytic: Dx elsewhere, all 1st course Rx at reporting facility',
      '22 - Analytic: Dx elsewhere, palliative/single modality Rx here',
      '30 - Non-Analytic: Consultation / Dx step only, no Rx here',
      '32 - Non-Analytic: Dx & 1st course Rx prior, presents w/ recurrence',
      '34 - Non-Analytic: Not required by CoC/ISCR (e.g., Benign non-CNS /0)',
      '38 - Non-Analytic: Diagnosed at Autopsy',
      '43 - Non-Analytic: Pathology specimen only (Lab-only report)',
      '49 - Non-Analytic: Death Certificate Only (DCO)',
      '99 - Non-Analytic: Unknown'
    ],
    hint: '00–22 Analytic (included in incidence) vs 30–99 Non-Analytic'
  },
  {
    id: 'F22', code: '22', section: 'sec3',
    name: 'Facility Referred From',
    standard: 'STORE #2410',
    type: 'text', required: false,
    hint: 'Originating clinic/hospital (or 00 - Direct Presentation / Walk-in)'
  },
  {
    id: 'F23', code: '23', section: 'sec3',
    name: 'Facility Referred To',
    standard: 'STORE #2420',
    type: 'text', required: false,
    hint: 'Downstream facility for adjuvant RT/surgery (or 00 - Retained In-House)'
  },
  {
    id: 'F24', code: '24', section: 'sec3',
    name: 'Place of Diagnosis',
    standard: 'IARC / ISCR',
    type: 'text', required: true,
    hint: 'Institution where definitive clinical or microscopic dx occurred'
  },
  {
    id: 'F25', code: '25', section: 'sec3',
    name: 'Date of First Contact / Admission',
    standard: 'STORE #0580',
    type: 'text', mono: true, required: true,
    hint: 'DD/MM/YYYY of first encounter at reporting facility for this tumor'
  },
  {
    id: 'F26', code: '26', section: 'sec3',
    name: 'Date of Incidence (IARC/ENCR Standard)',
    standard: 'IARC / ENCR',
    type: 'text', mono: true, required: true,
    hint: 'DD/MM/YYYY — Hierarchical priority: 1) 1st positive pathology, 2) Admission, 3) Outpatient evaluation'
  },
  {
    id: 'F27', code: '27', section: 'sec3',
    name: 'Bases of Diagnosis (1–9)',
    standard: 'IARC / CanReg5',
    type: 'select', required: true,
    options: [
      '0 - Death Certificate Only (DCO)',
      '1 - Clinical Only (History & physical exam before special workup)',
      '2 - Clinical Investigation (CT, MRI, PET-CT, Endoscopy, Ultrasound)',
      '4 - Specific Biochemical / Immunologic Tumor Markers (PSA, AFP, Ig)',
      '5 - Cytology / Hematology (FNA, effusion cytology, blood smear)',
      '6 - Histology of a Metastasis',
      '7 - Histology of Primary Tumor (Core biopsy, excision, BM trephine)',
      '9 - Unknown'
    ],
    hint: 'Highest microscopic or non-microscopic basis attained'
  },
  {
    id: 'F28', code: '28', section: 'sec3',
    name: 'Laboratory Name',
    standard: 'ISCR Path',
    type: 'text', required: false,
    hint: 'Anatomic pathology / molecular diagnostics laboratory'
  },
  {
    id: 'F29', code: '29', section: 'sec3',
    name: 'Lab Report No. / Lab Date',
    standard: 'STOREPath',
    type: 'text', mono: true, required: false,
    hint: 'Surgical pathology accession number & sign-out date (DD/MM/YYYY)'
  },

  // ================= SECTION IV: TUMOR & PATHOLOGY (30-37) =================
  {
    id: 'F30', code: '30', section: 'sec4',
    name: 'Sequence Number',
    standard: 'STORE #0560 / ISCR',
    type: 'select', required: true,
    options: [
      '00 - One Malignant Primary Only',
      '01 - First of Two or More Malignant Primaries',
      '02 - Second of Multiple Malignant Primaries',
      '03 - Third of Multiple Malignant Primaries',
      '60 - Only One Non-Malignant (/0 or /1) Neoplasm',
      '61 - First of Multiple Non-Malignant Neoplasms',
      '99 - Unspecified / Unknown Sequence'
    ],
    hint: 'Chronological lifetime primary tumor sequence'
  },
  {
    id: 'F31', code: '31', section: 'sec4',
    name: 'Primary Site Topography Text',
    standard: 'ICD-O-3.2',
    type: 'text', required: true,
    hint: 'Anatomic primary site & subsite description'
  },
  {
    id: 'F32', code: '32', section: 'sec4',
    name: 'Topography ICD-O Code',
    standard: 'ICD-O-3.2',
    type: 'text', mono: true, required: true, listId: 'icdo-topography-datalist',
    hint: '4-character ICD-O-3.2 topography (e.g., C34.1, C50.4, C61.9, C77.1)'
  },
  {
    id: 'F33', code: '33', section: 'sec4',
    name: 'Laterality',
    standard: 'STORE #0410 / ISCR',
    type: 'select', required: true,
    options: [
      '0 - Not a paired site',
      '1 - Right: origin of primary',
      '2 - Left: origin of primary',
      '3 - Only one side involved, right or left origin unspecified',
      '4 - Bilateral involvement at dx, lateral origin unknown (single primary)',
      '5 - Paired site: midline tumor',
      '9 - Paired site, laterality unknown'
    ],
    hint: 'Mandatory 1–5/9 for paired organs (Lung, Breast, Kidney, Ovary, etc.)'
  },
  {
    id: 'F34', code: '34', section: 'sec4',
    name: 'Primary Histology Morphology Text',
    standard: 'ICD-O-3.2',
    type: 'text', required: true,
    hint: 'Histopathologic cell type & lineage terminology'
  },
  {
    id: 'F35', code: '35', section: 'sec4',
    name: 'Morphology ICD-O Code',
    standard: 'ICD-O-3.2',
    type: 'text', mono: true, required: true, listId: 'icdo-morphology-datalist',
    hint: 'ICD-O-3.2 code M-XXXX/B or M-XXXX/BG (e.g., M-8041/39, M-8500/32)'
  },
  {
    id: 'F36', code: '36', section: 'sec4',
    name: 'Behavior Code',
    standard: 'ICD-O-3.2',
    type: 'select', required: true,
    options: [
      '/0 - Benign (Non-reportable outside CNS per ISCR/STORE)',
      '/1 - Uncertain whether benign or malignant (Borderline)',
      '/2 - Carcinoma in situ / Non-invasive',
      '/3 - Malignant, primary site (Invasive)',
      '/6 - Malignant, metastatic site'
    ],
    hint: '5th digit of ICD-O morphology (/0, /1, /2, /3)'
  },
  {
    id: 'F37', code: '37', section: 'sec4',
    name: 'Grade / Differentiation',
    standard: 'ICD-O-3.2 / STORE',
    type: 'select', required: true,
    options: [
      '1 - Grade I: Well differentiated',
      '2 - Grade II: Moderately differentiated',
      '3 - Grade III: Poorly differentiated',
      '4 - Grade IV: Undifferentiated / Anaplastic',
      '5 - T-cell / T-precursor',
      '6 - B-cell / Pre-B / B-precursor',
      '8 - NK (Natural Killer) cell',
      '9 - Grade/differentiation unknown, not stated, or N/A'
    ],
    hint: '6th digit histologic grade or immunophenotype (1–4, 5/6/8, 9)'
  },

  // ================= SECTION V: STAGING SYSTEM (38-46) =================
  {
    id: 'F38', code: '38', section: 'sec5',
    name: 'Clinical TNM Stage (cT, cN, cM)',
    standard: 'AJCC 8th / STORE',
    type: 'text', mono: true, required: true,
    hint: 'Pre-treatment AJCC clinical categories (e.g., cT3 cN3 cM1c, or 88 N/A)'
  },
  {
    id: 'F39', code: '39', section: 'sec5',
    name: 'Clinical Stage Group',
    standard: 'AJCC 8th / STORE',
    type: 'select', required: true,
    options: STAGE_GROUP_OPTIONS,
    hint: 'Stage I–IV group derived from cTNM & prognostic factors (88 N/A, 99 Unk)'
  },
  {
    id: 'F40', code: '40', section: 'sec5',
    name: 'Pathologic TNM Stage (pT, pN, pM)',
    standard: 'AJCC 8th / STORE',
    type: 'text', mono: true, required: true,
    hint: 'Post-resection pTNM or ypTNM (99 if no surgical resection, 88 N/A)'
  },
  {
    id: 'F41', code: '41', section: 'sec5',
    name: 'Pathologic Stage Group',
    standard: 'AJCC 8th / STORE',
    type: 'select', required: true,
    options: STAGE_GROUP_OPTIONS,
    hint: 'Surgical pathologic stage group (88 N/A, 99 Not Resected / Unknown)'
  },
  {
    id: 'F42', code: '42', section: 'sec5',
    name: 'Ann Arbor / Lugano Stage (Lymphoma)',
    standard: 'Lugano / AJCC',
    type: 'select', required: true,
    options: [
      '88 - Not Applicable (Non-Lymphoma)',
      'Stage I',
      'Stage IE',
      'Stage II',
      'Stage IIE',
      'Stage IIA',
      'Stage IIB',
      'Stage IIBX (Bulky Nodal Disease)',
      'Stage III',
      'Stage IIIS',
      'Stage IV',
      'Stage IVA',
      'Stage IVB',
      '99 - Unknown (Lymphoma Unstaged)'
    ],
    hint: 'Required for Hodgkin & Non-Hodgkin Lymphomas (M-9590–9729)'
  },
  {
    id: 'F43', code: '43', section: 'sec5',
    name: 'B Symptoms (Lymphoma)',
    standard: 'STORE #3812',
    type: 'select', required: true,
    options: [
      '8 - Not Applicable (Non-Lymphoma)',
      '0 - Absent (A: No unexplained fever, night sweats, or >10% wt loss)',
      '1 - Present (B: Fever >38°C, drenching night sweats, and/or >10% wt loss)',
      '9 - Unknown / Not Documented in Lymphoma'
    ],
    hint: 'Constitutional B symptoms SSDI for lymphoma staging'
  },
  {
    id: 'F44', code: '44', section: 'sec5',
    name: 'ISS / R-ISS Stage (Plasma Cell Myeloma)',
    standard: 'STORE #3856',
    type: 'select', required: true,
    options: [
      '88 - Not Applicable (Non-Myeloma)',
      'R-ISS Stage I',
      'R-ISS Stage II',
      'R-ISS Stage III',
      'ISS Stage I',
      'ISS Stage II',
      'ISS Stage III',
      '99 - Unknown (Myeloma Unstaged)'
    ],
    hint: 'Revised International Staging System (B2M, Albumin, LDH, High-risk FISH)'
  },
  {
    id: 'F45', code: '45', section: 'sec5',
    name: 'FIGO Stage (Gynecologic)',
    standard: 'STORE #3836',
    type: 'select', required: true,
    options: [
      '88 - Not Applicable (Non-Gynecologic)',
      'FIGO IA',
      'FIGO IB',
      'FIGO II',
      'FIGO IIIA',
      'FIGO IIIB',
      'FIGO IIIC1',
      'FIGO IIIC2',
      'FIGO IVA',
      'FIGO IVB',
      '99 - Unknown (Gynecologic Unstaged)'
    ],
    hint: 'Required for Vulva, Vagina, Cervix, Endometrium, Ovary & Fallopian Tube'
  },
  {
    id: 'F46', code: '46', section: 'sec5',
    name: 'Summary Stage (SEER 2018 / ISCR)',
    standard: 'SEER SS2018 / ISCR',
    type: 'select', required: true,
    options: [
      '0 - In situ (Non-invasive)',
      '1 - Localized only',
      '2 - Regional by direct extension only',
      '3 - Regional lymph nodes only',
      '4 - Regional by BOTH direct extension and regional lymph node(s)',
      '7 - Distant site(s) / distant lymph node(s) involved',
      '8 - Benign / Borderline neoplasm',
      '9 - Unknown if extension or metastasis (Unstaged)'
    ],
    hint: 'Mandatory population surveillance stage across all tumor types'
  },

  // ================= SECTION VI: TREATMENT MODALITIES (47-53) =================
  {
    id: 'F47', code: '47', section: 'sec6',
    name: 'Date First Course of Cancer-Directed Therapy',
    standard: 'STORE #1270',
    type: 'text', mono: true, required: true,
    hint: 'Earliest initiation DD/MM/YYYY across all modalities (or 00/00/0000 if no Rx)'
  },
  {
    id: 'F48', code: '48', section: 'sec6',
    name: 'Intent to Treatment',
    standard: 'ISCR / Clinical',
    type: 'select', required: true,
    options: [
      '1 - Curative / Definitive',
      '2 - Palliative / Disease & Symptom Control',
      '0 - No Cancer-Directed Therapy / Active Surveillance',
      '8 - Not Applicable (Benign / Non-Reportable)',
      '9 - Unknown'
    ],
    hint: 'Primary therapeutic intent documented by multidisciplinary tumor board'
  },
  {
    id: 'F49', code: '49', section: 'sec6',
    name: 'Surgery (Resection / Palliative)',
    standard: 'STORE #1290',
    type: 'text', required: true,
    hint: 'Site-specific surgery code & procedure (00 - None, or surgical resection details)'
  },
  {
    id: 'F50', code: '50', section: 'sec6',
    name: 'Chemotherapy',
    standard: 'STORE #1390',
    type: 'text', required: true,
    hint: '00 - None, 01 - NOS, 02 - Single-agent, 03 - Multi-agent + cytotoxic regimen'
  },
  {
    id: 'F51', code: '51', section: 'sec6',
    name: 'Radiotherapy',
    standard: 'STORE #1430',
    type: 'text', required: true,
    hint: '00 - None, or EBRT/IMRT/Brachytherapy dose (Gy), fractions & target volume'
  },
  {
    id: 'F52', code: '52', section: 'sec6',
    name: 'Hormone / Endocrine Therapy',
    standard: 'STORE #1400',
    type: 'text', required: true,
    hint: '00 - None, 01 - Administered (AI, SERM, GnRH ADT, Corticosteroids in heme)'
  },
  {
    id: 'F53', code: '53', section: 'sec6',
    name: 'Immunotherapy / Biologics',
    standard: 'STORE #1410',
    type: 'text', required: true,
    hint: '00 - None, 01 - Administered (ICI PD-1/PD-L1, Anti-HER2, Anti-CD20/CD38)'
  },

  // ================= SECTION VII: OUTCOMES & REMARKS (54-60) =================
  {
    id: 'F54', code: '54', section: 'sec7',
    name: 'Vital Status',
    standard: 'STORE #1760 / ISCR',
    type: 'select', required: true,
    options: [
      '1 - Alive',
      '2 - Dead',
      '9 - Unknown'
    ],
    hint: 'Patient status as of Date of Last Contact'
  },
  {
    id: 'F55', code: '55', section: 'sec7',
    name: 'Date of Last Contact',
    standard: 'STORE #1750',
    type: 'text', mono: true, required: true,
    hint: 'DD/MM/YYYY of latest verified clinical contact or date of death'
  },
  {
    id: 'F56', code: '56', section: 'sec7',
    name: 'Date of Death',
    standard: 'ISCR Mortality',
    type: 'text', mono: true, required: true,
    hint: 'DD/MM/YYYY if Vital Status = 2 (or 88/88/8888 if Alive)'
  },
  {
    id: 'F57', code: '57', section: 'sec7',
    name: 'Cause of Death',
    standard: 'ICD-10 #1910',
    type: 'text', mono: true, required: true,
    hint: 'Underlying ICD-10 cause of death (or 8888 - Not Applicable / Alive)'
  },
  {
    id: 'F58', code: '58', section: 'sec7',
    name: 'Place of Death',
    standard: 'ISCR Mortality',
    type: 'select', required: true,
    options: [
      '8 - Not Applicable (Patient Alive)',
      '1 - Hospital Inpatient / ICU',
      '2 - Patient Residence / Home',
      '3 - Hospice / Palliative Unit',
      '4 - Nursing / Extended Care Facility',
      '9 - Unknown'
    ],
    hint: 'Location where death occurred (8 if Alive)'
  },
  {
    id: 'F59', code: '59', section: 'sec7',
    name: 'Type of Follow-Up',
    standard: 'ISCR Follow-Up',
    type: 'select', required: true,
    options: [
      '1 - Active Oncology Outpatient Clinic Visit',
      '2 - Inpatient Readmission / Pathology / Imaging Encounter',
      '3 - Direct Telephone Contact (Patient / Family)',
      '4 - Civil Vital Statistics / Death Registry Match',
      '5 - Referring Physician Report',
      '9 - Unknown'
    ],
    hint: 'Method used to ascertain Vital Status & Date of Last Contact'
  },
  {
    id: 'F60', code: '60', section: 'sec7',
    name: 'Remarks / Narrative Clinical Notes',
    standard: 'ISCR / NAACCR Text',
    type: 'textarea', isNarrative: true, required: true,
    hint: 'Comprehensive synthetic registry abstract: H&P, Imaging, Pathology/IHC, Staging & Rx'
  }
];

export const BUILTIN_REFERENCE_MANUALS = [
  {
    id: 'ref-iscr',
    shortName: 'ISCR Manual 2021',
    fullName: 'Indiana State Cancer Registry (ISCR) Policy & Procedure Manual (2021)',
    active: true,
    rules: [
      {
        title: 'ISCR §2.1 — Reportability & Behavior Exclusion Rule',
        body: 'All primary invasive malignancies (/3) and in situ neoplasms (/2, excluding CIN III/CIS of cervix) are reportable. Benign (/0) and borderline (/1) neoplasms are ONLY reportable for Intracranial and Central Nervous System sites (C70.0–C72.9, C75.1–C75.3). Benign tumors of non-CNS sites (e.g., breast fibroadenoma M-9010/0) are non-reportable (assign Class of Case 34 if logged for QA).'
      },
      {
        title: 'ISCR §3.4 — Class of Case Analytic vs Non-Analytic',
        body: 'Analytic cases (Codes 00–22) were diagnosed and/or received all or part of first-course therapy at the reporting facility. Non-Analytic cases (Codes 30–99) include consultation-only (30), recurrence after prior completed first-course therapy (32), non-reportable conditions (34), pathology-specimen-only (43), and DCO (49).'
      },
      {
        title: 'ISCR §6.2 — Paired Organ Laterality Requirement',
        body: 'Paired organs (C34.0–C34.3 lung lobes, C50.0–C50.9 breast, C56.9 ovary, C62.0–C62.9 testis, C64.9 kidney, C69.0–C69.9 eye, C07.9/C08.x salivary glands) MUST have Laterality coded 1–5 or 9; Code 0 is invalid except for C34.0 main carina or unpaired subsites.'
      }
    ]
  },
  {
    id: 'ref-store',
    shortName: 'ACS STORE 2021+',
    fullName: 'Commission on Cancer Standards for Oncology Registry Entry (STORE)',
    active: true,
    rules: [
      {
        title: 'STORE #1270 — Date of First Course of Treatment',
        body: 'Record the earliest date on which any first-course cancer-directed treatment (surgery, radiation, systemic chemo, hormone, immunotherapy, or active surveillance decision) was initiated. Use 00/00/0000 when patient receives no treatment.'
      },
      {
        title: 'STORE #1390/#1410 — Chemo vs Immunotherapy Separation',
        body: 'Immune checkpoint inhibitors (pembrolizumab, nivolumab, atezolizumab, durvalumab), monoclonal antibodies (trastuzumab, pertuzumab, rituximab, daratumumab) are coded under Immunotherapy/Biologic Response Modifiers (#1410 / Field 53), NOT cytotoxic Chemotherapy (#1390 / Field 50).'
      },
      {
        title: 'STORE SSDI — Site-Specific Staging (Lugano, R-ISS, FIGO)',
        body: 'Lymphomas use Lugano/Ann Arbor Stage + B Symptoms; Plasma Cell Myeloma uses R-ISS (B2M, Albumin, LDH, high-risk cytogenetics) and Summary Stage 7; Gynecologic primaries record FIGO alongside TNM.'
      }
    ]
  },
  {
    id: 'ref-icdo',
    shortName: 'WHO ICD-O-3.2',
    fullName: 'International Classification of Diseases for Oncology, 3rd Ed., 2nd Revision (ICD-O-3.2)',
    active: true,
    rules: [
      {
        title: 'ICD-O-3.2 Rule F — Behavior Code Matrix (/0, /1, /2, /3)',
        body: 'The 5th digit after the slash denotes biological behavior: /0 Benign, /1 Uncertain/Borderline, /2 In situ/Intraepithelial, /3 Malignant primary site. The 6th digit denotes histological differentiation (1 Well, 2 Moderate, 3 Poor, 4 Undifferentiated) or lineage for lymphoid/hematopoietic neoplasms (5 T-cell, 6 B-cell, 8 NK-cell, 9 Unknown).'
      },
      {
        title: 'ICD-O-3.2 Rule H — Site-Associated Morphology & Subsite Coding',
        body: 'Code the specific quadrant/lobe subsite when documented (e.g., C50.4 Upper-outer quadrant of breast rather than C50.9 Breast NOS; C34.1 Upper lobe bronchus/lung rather than C34.9). Plasma cell myeloma (M-9732/3) is assigned primary site C42.1 (Bone marrow).'
      }
    ]
  },
  {
    id: 'ref-iarc',
    shortName: 'IARC / ENCR Rules',
    fullName: 'IARC / ENCR International Rules for Cancer Registries & CanReg5 Standard',
    active: true,
    rules: [
      {
        title: 'IARC Incidence Date Hierarchy (Field 26)',
        body: 'Priority 1: Date of first histological or cytological confirmation of malignancy (specimen collection or biopsy report date). Priority 2: Date of hospital admission because of this malignancy. Priority 3: Date of first outpatient clinical consultation diagnosing malignancy.'
      },
      {
        title: 'IARC Basis of Diagnosis Hierarchy (Field 27)',
        body: 'Code highest level achieved: 7 (Histology of primary tumor) > 6 (Histology of metastasis) > 5 (Cytology / Hematology) > 4 (Specific tumor markers e.g., PSA/AFP/Monoclonal Ig) > 2 (Clinical investigation/imaging) > 1 (Clinical only) > 0 (DCO).'
      }
    ]
  }
];
