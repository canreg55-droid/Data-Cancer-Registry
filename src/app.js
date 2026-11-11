import { ICONS, SECTIONS, SCHEMA_FIELDS, ICDO_TOPOGRAPHY_LIST, ICDO_MORPHOLOGY_LIST, BUILTIN_REFERENCE_MANUALS } from './schema.js';
import { DEMO_CASES, INITIAL_REFERENCE_TEXT } from './cases.js';
import { extractAbstractFromText } from './field-extractor.js';

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const escapeHTML = (value = '') => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const todayDisplay = () => new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date());

const state = {
  caseId: DEMO_CASES[0].id,
  values: {},
  remarks: {},
  edited: new Set(),
  activeSection: 'all',
  filter: 'all',
  search: '',
  drawerOpen: true,
  leftTab: 'ingestion',
  sourceCollapsed: false,
  activeSource: 'demo',
  documents: [],
  referenceFiles: [],
  pastedText: '',
  refEnabled: new Set(BUILTIN_REFERENCE_MANUALS.map(ref => ref.id)),
  processStatus: 'idle',
  customCase: null,
  customSource: null,
  extraction: { status: 'idle', pages: 0, fields: 0, message: '' },
  confidence: {},
  evidenceSource: {},
  extractionConflicts: {}
};

const activeCase = () => state.customCase || DEMO_CASES.find(item => item.id === state.caseId) || DEMO_CASES[0];
const getField = id => SCHEMA_FIELDS.find(field => field.id === id);
const sectionName = id => SECTIONS.find(section => section.id === id)?.title || '';

function initData(caseId = state.caseId) {
  const demo = DEMO_CASES.find(item => item.id === caseId) || DEMO_CASES[0];
  state.caseId = demo.id;
  state.customCase = null;
  state.customSource = null;
  state.values = { ...demo.values };
  state.remarks = { ...demo.remarks };
  state.edited = new Set();
  state.confidence = {};
  state.evidenceSource = {};
  state.extractionConflicts = {};
  state.extraction = { status: 'idle', pages: 0, fields: 0, message: '' };
}

function setIconsAndStaticLabels() {
  $('#brand-icon').innerHTML = ICONS.shield;
  $('#case-selector-icon').innerHTML = `${ICONS.folderOpen} DEMO CASE`;
  $('#layout-toggle').innerHTML = `${ICONS.columns}<span>Source panel</span>`;
  $('#reset-button').innerHTML = `${ICONS.rotateCcw}<span>Reset case</span>`;
  $('#export-trigger').innerHTML = `${ICONS.download}<span>Copy / Export</span>${ICONS.chevronDown}`;
  $('#ingestion-tab').innerHTML = `${ICONS.upload}<span>Ingestion</span>`;
  $('#source-tab').innerHTML = `${ICONS.fileText}<span>Source record</span>`;
  $('#case-ingest-title').innerHTML = `${ICONS.fileText} Clinical case files`;
  $('#paste-title').innerHTML = `${ICONS.fileText} Paste source text`;
  $('#ref-ingest-title').innerHTML = `${ICONS.book} Reference guidelines`;
  $('#case-upload-icon').innerHTML = ICONS.upload;
  $('#ref-upload-icon').innerHTML = ICONS.book;
  $('#pipeline-title').innerHTML = `${ICONS.activity} Abstracting pipeline`;
  $('#process-button').innerHTML = `${ICONS.sparkles}<span>Run demo validation</span>`;
  $('#search-icon').innerHTML = ICONS.search;
  $('#references-button').innerHTML = `${ICONS.book}<span>Rules & standards</span>`;
  $('#modal-close').innerHTML = ICONS.x;
  const menuItems = {
    'copy-markdown': [ICONS.copy, 'Copy Markdown table', 'All 65 administrative and clinical fields'],
    'copy-json': [ICONS.code, 'Copy JSON object', 'Structured values, evidence & metadata'],
    'copy-tsv': [ICONS.table, 'Copy TSV for Excel', 'Tab-separated row data'],
    'download-csv': [ICONS.download, 'Download CSV', 'UTF-8 with BOM for spreadsheet compatibility'],
    'download-json': [ICONS.download, 'Download JSON', 'Full structured abstract'],
    'print': [ICONS.printer, 'Print / Save as PDF', 'Formal registry review layout']
  };
  $$('.dropdown-item').forEach(button => {
    const [icon, title, sub] = menuItems[button.dataset.action];
    button.innerHTML = `${icon}<span>${title}<span class="item-sub">${sub}</span></span>`;
  });
  $('#validation-heading').innerHTML = `${ICONS.activity}<span>Live validation & cross-field edits</span>`;
}

function renderCaseSelector() {
  const customOption = state.customCase ? `<option value="uploaded">Uploaded source — ${escapeHTML(state.customCase.title)}</option>` : '';
  $('#demo-case-select').innerHTML = customOption + DEMO_CASES.map(item => `<option value="${escapeHTML(item.id)}">${escapeHTML(item.title)} — ${escapeHTML(item.subtitle)}</option>`).join('');
  $('#demo-case-select').value = state.customCase ? 'uploaded' : state.caseId;
}

function initCaseSelector() {
  renderCaseSelector();
  $('#demo-case-select').addEventListener('change', event => { if (event.target.value === 'uploaded') return;
    initData(event.target.value);
    state.activeSource = 'demo';
    state.processStatus = 'idle';
    state.activeSection = 'all';
    state.filter = 'all';
    state.search = '';
    $('#field-search').value = '';
    renderAll();
    toast(`Loaded synthetic ${activeCase().title} case.`, 'info');
  });
}

function valueFor(field) { return String(state.values[field.id] ?? ''); }
function isUnknown(value) { return /(^|\b)(unknown|not stated|not documented|not assessed|not applicable|\b99\b|\b88\b|999|n\/a)(\b|$)/i.test(value || ''); }
function parsePrefix(value) { return String(value || '').match(/^\s*([^\s-]+)/)?.[1] || ''; }

function validateAbstract() {
  const results = [];
  const add = (id, severity, message, rule = 'DATA QUALITY') => results.push({ id, severity, message, rule });
  for (const field of SCHEMA_FIELDS) {
    const value = valueFor(field).trim();
    if (field.required && !value) add(field.id, 'error', `${field.code} ${field.name} is required.`, 'COMPLETENESS');
  }
  for (const [fieldId, conflict] of Object.entries(state.extractionConflicts)) {
    add(fieldId, 'warning', `PDFs disagree: “${conflict.first.value}” in ${conflict.first.source} versus “${conflict.second.value}” in ${conflict.second.source}. Review both excerpts and choose a value.`, 'SOURCE CONFLICT');
  }
  const nid = valueFor(getField('F01')).replace(/\D/g, '');
  if (nid && nid !== '999999999999' && !/^\d{12}$/.test(nid)) add('F01', 'error', 'National ID must contain exactly 12 digits (or the approved unknown sentinel).', 'FORMAT');
  const englishName = valueFor(getField('F03')).trim();
  if (englishName && /[\u0600-\u06FF]/.test(englishName)) add('F03', 'error', 'This field is configured for English/Latin-script spelling. Enter the documented English transliteration.', 'LANGUAGE');
  const dates = ['F10', 'F25', 'F26', 'F47', 'F55'];
  for (const id of dates) {
    const value = valueFor(getField(id)).trim();
    if (value && !/^(\d{2}\/\d{2}\/\d{4}|99\/99\/9999|00\/00\/0000)$/.test(value)) add(id, 'error', `Use DD/MM/YYYY format for ${getField(id).name}.`, 'DATE FORMAT');
  }
  const dob = valueFor(getField('F10'));
  const incidence = valueFor(getField('F26'));
  if (dob && incidence && /^\d{2}\/\d{2}\/\d{4}$/.test(dob) && /^\d{2}\/\d{2}\/\d{4}$/.test(incidence)) {
    const [dd, mm, yyyy] = dob.split('/').map(Number);
    const [di, mi, yi] = incidence.split('/').map(Number);
    let age = yi - yyyy;
    if (mi < mm || (mi === mm && di < dd)) age--;
    const reportedAge = Number.parseInt(valueFor(getField('F12')), 10);
    if (Number.isFinite(reportedAge) && reportedAge < 121 && Math.abs(age - reportedAge) > 1) add('F12', 'warning', `Reported age (${reportedAge}) differs from age calculated from DOB and incidence date (${age}). Confirm dates and age.` , 'CROSS-CHECK');
    if (age < 0) add('F10', 'error', 'Date of birth occurs after date of incidence.', 'CHRONOLOGY');
  }
  const sex = valueFor(getField('F13'));
  const site = valueFor(getField('F32')).toUpperCase();
  if (/C50\./.test(site) && !sex.startsWith('2 -') && !sex.startsWith('9 -')) add('F13', 'warning', 'Breast primary with sex coded other than female; verify source and coding rules (male breast cancer is possible).', 'SEX / SITE');
  if (/C53\.|C54\.|C56\.|C57\./.test(site) && sex.startsWith('1 -')) add('F13', 'error', 'Primary topography is ordinarily incompatible with sex coded male. Review source, anatomy, and registry rules.', 'SEX / SITE');
  const paired = /^(C34\.|C50\.|C56\.|C62\.|C64\.|C69\.|C07\.|C08\.)/.test(site);
  const laterality = parsePrefix(valueFor(getField('F33')));
  if (paired && ['0', ''].includes(laterality)) add('F33', 'error', 'Paired site requires an applicable laterality value (1–5 or 9); code 0 is not appropriate for this site.', 'ICD-O SITE EDIT');
  if (!paired && laterality && !['0', '9'].includes(laterality) && /C61\.|C42\.|C77\.|C54\.|C53\./.test(site)) add('F33', 'warning', 'Laterality is populated for an unpaired/lymphatic site; verify site and laterality.', 'ICD-O SITE EDIT');
  const behavior = valueFor(getField('F36'));
  const morph = valueFor(getField('F35'));
  if (morph && behavior && !morph.includes(behavior.match(/\/\d/)?.[0] || '___')) {
    const morphBehavior = morph.match(/\/(\d)/)?.[1];
    const fieldBehavior = behavior.match(/\/(\d)/)?.[1];
    if (morphBehavior && fieldBehavior && morphBehavior !== fieldBehavior) add('F36', 'error', `Behavior field /${fieldBehavior} does not match morphology code suffix /${morphBehavior}.`, 'ICD-O CONSISTENCY');
  }
  const classCode = parsePrefix(valueFor(getField('F21')));
  if (behavior.includes('/0') && !site.startsWith('C70.') && !site.startsWith('C71.') && !site.startsWith('C72.') && !site.startsWith('C75.1') && !classCode.startsWith('34')) {
    add('F36', 'warning', 'Benign non-CNS neoplasm is generally not reportable to a population registry. Confirm reportability; consider non-analytic class 34 only if locally retained for QA.', 'ISCR REPORTABILITY');
  }
  const morphologyForType = valueFor(getField('F35'));
  const lymphoma = /M-9(5|6|7)\d\d/.test(morphologyForType) || /lymphoma/i.test(valueFor(getField('F34')));
  const myeloma = /myeloma|M-9732/i.test(`${valueFor(getField('F34'))} ${morphologyForType}`);
  const gynecologic = /^C5[3-8]\./.test(site);
  const benign = /\/0|\/1/.test(behavior);
  if (!lymphoma && !myeloma && !benign && site && !valueFor(getField('F38')).trim()) add('F38', 'error', 'Clinical TNM is missing for a solid malignant primary; use an applicable unknown/not-applicable value only when justified.', 'STAGING');
  if (!lymphoma && !myeloma && !benign && site && isUnknown(valueFor(getField('F39'))) && !valueFor(getField('F39')).includes('99')) add('F39', 'warning', 'Clinical stage group is not known or applicable; verify stage derivation.', 'STAGING');
  if (lymphoma && valueFor(getField('F42')).startsWith('88')) add('F42', 'warning', 'Lymphoma morphology detected but Ann Arbor/Lugano stage is marked not applicable.', 'HEME STAGING');
  if (!lymphoma && !valueFor(getField('F42')).startsWith('88')) add('F42', 'warning', 'Ann Arbor/Lugano is entered for a non-lymphoma morphology; verify field applicability.', 'HEME STAGING');
  if (myeloma && valueFor(getField('F44')).startsWith('88')) add('F44', 'warning', 'Myeloma morphology detected but ISS/R-ISS stage is marked not applicable.', 'HEME STAGING');
  if (!myeloma && !valueFor(getField('F44')).startsWith('88')) add('F44', 'warning', 'ISS/R-ISS is entered for a non-myeloma; verify field applicability.', 'HEME STAGING');
  if (gynecologic && valueFor(getField('F45')).startsWith('88')) add('F45', 'warning', 'Gynecologic primary detected but FIGO is marked not applicable.', 'FIGO STAGING');
  if (!gynecologic && !valueFor(getField('F45')).startsWith('88')) add('F45', 'warning', 'FIGO stage entered for a non-gynecologic primary; verify applicability.', 'FIGO STAGING');
  const status = valueFor(getField('F54'));
  const deathDate = valueFor(getField('F56'));
  if (status.startsWith('1 -') && deathDate && !deathDate.startsWith('88/')) add('F56', 'error', 'Vital status is alive but a death date is present.', 'OUTCOME CONSISTENCY');
  if (status.startsWith('2 -') && (!deathDate || deathDate.startsWith('88/'))) add('F56', 'error', 'Vital status is dead but a valid date of death is missing.', 'OUTCOME CONSISTENCY');
  const firstContact = valueFor(getField('F25'));
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(firstContact) && /^\d{2}\/\d{2}\/\d{4}$/.test(incidence)) {
    const toDate = text => { const [d,m,y] = text.split('/').map(Number); return new Date(Date.UTC(y,m-1,d)); };
    if (toDate(incidence) > toDate(firstContact)) add('F26', 'warning', 'Incidence date is later than first facility contact; verify referral and pathology chronology.', 'CHRONOLOGY');
  }
  if (!state.values.F60 || state.values.F60.trim().length < 50) add('F60', 'warning', 'Narrative summary is very short; document source, diagnosis, staging and treatment or state why unavailable.', 'NARRATIVE');
  if (state.processStatus === 'done') results.push({ id: 'H01', severity: 'info', message: 'Demonstration checks are illustrative only. They do not certify reportability, coding, stage, or compliance with current standards.', rule: 'DEMO NOTICE' });
  return results;
}

function renderRibbon() {
  const demo = activeCase();
  $('#demo-notice-title').textContent = state.customCase ? 'LOCAL PDF EXTRACTION · HUMAN REVIEW REQUIRED' : 'FICTIONAL TRAINING DATA';
  $('#demo-notice-copy').textContent = state.customCase
    ? 'Automated suggestions may be incomplete or wrong. Confirm every value against the source and current registry standards before export.'
    : 'Do not use for clinical care or registry submission. Verify all abstracts against source records and current official standards.';
  const name = state.values.F02 || 'Patient identity not entered';
  const englishTransliteration = state.values.F03 || '';
  const initials = name.split(/\s+/).slice(0,2).map(word => word[0] || '').join('').toUpperCase();
  const issues = validateAbstract();
  const errors = issues.filter(item => item.severity === 'error').length;
  const warnings = issues.filter(item => item.severity === 'warning').length;
  const populated = SCHEMA_FIELDS.filter(field => valueFor(field).trim()).length;
  const percent = Math.round(populated / SCHEMA_FIELDS.length * 100);
  const site = state.values.F32 || 'Site pending';
  const stage = state.values.F39 || state.values.F42 || 'Stage pending';
  $('#patient-ribbon').innerHTML = `
    <div class="patient-identity-block"><div class="patient-avatar">${escapeHTML(initials || '—')}</div><div class="patient-names"><div class="patient-name-row"><span class="patient-name-en">${escapeHTML(name)}</span>${englishTransliteration && englishTransliteration !== name ? `<span class="patient-name-alt">${escapeHTML(englishTransliteration)}</span>` : ''}</div><div class="patient-submeta"><span>MRN <code>${escapeHTML(state.values.F04 || '—')}</code></span><span>DOB ${escapeHTML(state.values.F10 || '—')}</span><span>${escapeHTML(state.values.F13 || 'Sex pending')}</span><span>${escapeHTML(demo.title)}</span></div></div></div>
    <div class="ribbon-metrics"><span class="clinical-pill icdo">${ICONS.activity}${escapeHTML(site)}</span><span class="clinical-pill stage">${escapeHTML(stage)}</span><button class="clinical-pill ${errors ? 'valid-err' : warnings ? 'valid-warn' : 'valid-ok'}" id="ribbon-validation">${errors ? ICONS.alertOctagon : warnings ? ICONS.alertTriangle : ICONS.checkCircle}<span>${errors ? `${errors} errors` : warnings ? `${warnings} review` : 'Checks clear'}</span></button><div class="completeness-box"><div class="completeness-label"><span>COMPLETENESS</span><span>${percent}%</span></div><div class="completeness-bar"><div class="completeness-fill" style="width:${percent}%"></div></div></div></div>`;
  $('#ribbon-validation').addEventListener('click', () => { state.drawerOpen = true; renderValidation(); $('#validation-drawer').scrollIntoView({ block: 'nearest' }); });
  $('#print-registry-id').textContent = `${state.values.H01 || '—'} / ${state.values.H03 || '—'}`;
  $('#print-subtitle').textContent = state.customCase ? 'PDF-extracted review copy • Verify every suggestion against the source document and current standards' : 'Evidence-linked review copy • Synthetic demonstration only • Verify all fields against authoritative sources';
  $('#print-footer-notice').textContent = state.customCase ? 'Automated suggestions are not validated coding • Human review required' : 'Not for clinical use • Synthetic record';
  $('#print-patient-banner').innerHTML = `<div><strong>Patient:</strong> ${escapeHTML(name)} ${englishTransliteration && englishTransliteration !== name ? `(${escapeHTML(englishTransliteration)})` : ''} &nbsp; <strong>MRN:</strong> ${escapeHTML(state.values.F04 || '—')} &nbsp; <strong>Sex:</strong> ${escapeHTML(state.values.F13 || '—')} &nbsp; <strong>DOB:</strong> ${escapeHTML(state.values.F10 || '—')}</div>`;
  $('#print-abstractor').textContent = state.values.H04 || '—';
  $('#print-date').textContent = todayDisplay();
}

function fieldResultsMap() {
  const map = new Map();
  validateAbstract().forEach(result => {
    if (!map.has(result.id)) map.set(result.id, []);
    map.get(result.id).push(result);
  });
  return map;
}

function renderFilterPills() {
  const items = [
    ['all', 'All fields', SCHEMA_FIELDS.length],
    ['incomplete', 'Incomplete', SCHEMA_FIELDS.filter(field => field.required && !valueFor(field).trim()).length],
    ['issues', 'Needs review', new Set(validateAbstract().filter(item => ['error','warning'].includes(item.severity)).map(item => item.id)).size],
    ['edited', 'Edited', state.edited.size]
  ];
  $('#filter-pills').innerHTML = items.map(([id, label, count]) => `<button class="filter-pill ${state.filter === id ? 'active' : ''}" data-filter="${id}">${label}<span class="pill-count">${count}</span></button>`).join('');
  $$('#filter-pills [data-filter]').forEach(button => button.addEventListener('click', () => { state.filter = button.dataset.filter; renderForm(); renderFilterPills(); }));
}

function renderSections() {
  const counts = new Map();
  validateAbstract().filter(item => ['error','warning'].includes(item.severity)).forEach(item => {
    const field = getField(item.id);
    if (field) counts.set(field.section, (counts.get(field.section) || 0) + 1);
  });
  const tabs = [{ id: 'all', label: `All (${SCHEMA_FIELDS.length})` }, ...SECTIONS.map(section => ({ id: section.id, label: section.shortLabel }))];
  $('#section-tabs').innerHTML = tabs.map(tab => {
    const issue = counts.get(tab.id) || 0;
    return `<button class="sec-tab ${state.activeSection === tab.id ? 'active' : ''}" data-section="${tab.id}">${escapeHTML(tab.label)}${issue ? `<span class="sec-tab-issue">${issue}</span>` : ''}</button>`;
  }).join('');
  $$('#section-tabs [data-section]').forEach(button => button.addEventListener('click', () => { state.activeSection = button.dataset.section; renderSections(); renderForm(); }));
}

function isVisible(field, resultMap) {
  if (state.activeSection !== 'all' && field.section !== state.activeSection) return false;
  if (state.filter === 'incomplete' && !(field.required && !valueFor(field).trim())) return false;
  if (state.filter === 'issues' && !resultMap.has(field.id)) return false;
  if (state.filter === 'edited' && !state.edited.has(field.id)) return false;
  const query = state.search.trim().toLowerCase();
  if (query) {
    const haystack = [field.id, field.code, field.name, field.standard, field.hint, sectionName(field.section), valueFor(field), state.remarks[field.id] || ''].join(' ').toLowerCase();
    if (!haystack.includes(query)) return false;
  }
  return true;
}

function fieldControl(field) {
  const value = valueFor(field);
  const attrs = `data-field="${field.id}" aria-label="${escapeHTML(field.name)}"`;
  if (field.type === 'select') {
    const options = field.options || [];
    const present = options.some(option => option === value);
    return `<select class="field-select" ${attrs}><option value="">— Select / unknown —</option>${!present && value ? `<option value="${escapeHTML(value)}" selected>${escapeHTML(value)}</option>` : ''}${options.map(option => `<option value="${escapeHTML(option)}" ${option === value ? 'selected' : ''}>${escapeHTML(option)}</option>`).join('')}</select>`;
  }
  const classes = ['field-input'];
  if (field.mono) classes.push('mono-input');
  if (field.arabic) classes.push('arabic-input');
  const list = field.listId ? ` list="${field.listId}"` : '';
  const dir = field.arabic ? ' dir="rtl" lang="ar"' : '';
  if (field.type === 'textarea') return `<textarea class="field-textarea" ${attrs} placeholder="Enter a concise, source-grounded summary…">${escapeHTML(value)}</textarea>`;
  return `<input class="${classes.join(' ')}" type="text" ${attrs}${list}${dir} value="${escapeHTML(value)}" placeholder="${escapeHTML(field.hint || '')}" />`;
}

function renderField(field, resultMap) {
  const issues = resultMap.get(field.id) || [];
  const primary = issues.find(item => item.severity === 'error') || issues.find(item => item.severity === 'warning');
  const rowClass = [
    'field-row', field.isNarrative ? 'narrative-row' : '',
    primary?.severity === 'error' ? 'row-error' : primary?.severity === 'warning' ? 'row-warning' : '',
    state.edited.has(field.id) ? 'row-edited' : ''
  ].filter(Boolean).join(' ');
  const evidence = state.remarks[field.id] || 'No field-specific evidence note supplied. Verify this value against the source record and current registry rules.';
  const confidence = state.confidence[field.id];
  return `<div class="${rowClass}" id="row-${field.id}" data-row-field="${field.id}">
    <div class="field-meta-col"><div class="field-code-line"><span class="field-num-badge ${field.isHeader ? 'header-badge' : ''}">${escapeHTML(field.code)}</span><span class="field-std-tag">${escapeHTML(field.standard || 'NCR')}</span>${confidence ? `<span class="extraction-tag ${confidence}">PDF · ${escapeHTML(confidence)}</span>` : ''}${state.edited.has(field.id) ? '<span class="edited-tag">EDITED</span>' : ''}</div><div class="field-label-text">${escapeHTML(field.name)}${field.required ? ' <span style="color:#dc2626">*</span>' : ''}</div><div class="field-hint-text">${escapeHTML(field.hint || '')}</div></div>
    <div class="field-value-col">${fieldControl(field)}${issues.map(item => `<div class="inline-validation-msg ${item.severity}"><span><strong>${escapeHTML(item.rule)}:</strong> ${escapeHTML(item.message)}</span></div>`).join('')}</div>
    <div class="field-remarks-col"><div class="remarks-box"><div class="remarks-top-bar"><span class="evidence-badge">${ICONS.fileText} Source / rationale</span><button class="locate-btn" data-locate="${field.id}" title="Locate supporting evidence in source record">${ICONS.locate} Locate</button></div><textarea class="remarks-input" data-remark="${field.id}" aria-label="Evidence and rationale for ${escapeHTML(field.name)}">${escapeHTML(evidence)}</textarea></div></div>
  </div>`;
}

function renderForm() {
  const container = $('#form-container');
  const oldActive = document.activeElement;
  const focusedId = oldActive?.dataset?.field || oldActive?.dataset?.remark || null;
  const selectionStart = oldActive && typeof oldActive.selectionStart === 'number' ? oldActive.selectionStart : null;
  const selectionEnd = oldActive && typeof oldActive.selectionEnd === 'number' ? oldActive.selectionEnd : null;
  const map = fieldResultsMap();
  const selectedFields = SCHEMA_FIELDS.filter(field => isVisible(field, map));
  const groups = SECTIONS.map(section => ({ section, fields: selectedFields.filter(field => field.section === section.id) })).filter(group => group.fields.length);
  if (!groups.length) {
    container.innerHTML = `<div class="empty-filter-state">${ICONS.search}<h3>No matching fields</h3><p>Try a different keyword, section, or filter.</p><button class="btn btn-light" id="clear-search">Clear filters</button></div>`;
    $('#clear-search').addEventListener('click', () => { state.search = ''; state.activeSection = 'all'; state.filter = 'all'; $('#field-search').value = ''; renderAll(); });
    return;
  }
  container.innerHTML = groups.map(({ section, fields }) => `<section class="section-card" id="${section.id}"><div class="section-card-header"><div class="section-card-title"><span class="section-code-pill">${escapeHTML(section.code)}</span><h2>${escapeHTML(section.title)}</h2></div><span class="section-card-subtitle">${fields.length} field${fields.length === 1 ? '' : 's'}</span></div><div class="dual-table-head"><span>Field name &amp; code</span><span>Extracted / curated value</span><span>Remarks, justification &amp; evidence</span></div>${fields.map(field => renderField(field, map)).join('')}</section>`).join('');
  $$('#form-container [data-field]').forEach(control => {
    control.addEventListener('input', onFieldInput);
    control.addEventListener('change', onFieldInput);
  });
  $$('#form-container [data-remark]').forEach(control => control.addEventListener('input', onRemarkInput));
  $$('#form-container [data-locate]').forEach(button => button.addEventListener('click', () => locateEvidence(button.dataset.locate)));
  if (focusedId) {
    const next = $(`[data-field="${focusedId}"], [data-remark="${focusedId}"]`, container);
    if (next) {
      next.focus({ preventScroll: true });
      if (selectionStart !== null && next.setSelectionRange) next.setSelectionRange(selectionStart, selectionEnd);
    }
  }
}

let renderTimer;
function refreshDynamic() {
  renderRibbon();
  renderFilterPills();
  renderSections();
  renderValidation();
  renderPipeline();
  renderSourceViewer();
}
function onFieldInput(event) {
  const field = event.currentTarget.dataset.field;
  state.values[field] = event.currentTarget.value;
  state.edited.add(field);
  delete state.extractionConflicts[field];
  clearTimeout(renderTimer);
  renderRibbon();
  renderFilterPills();
  renderSections();
  renderValidation();
  renderTimer = setTimeout(() => renderForm(), 250);
}
function onRemarkInput(event) {
  state.remarks[event.currentTarget.dataset.remark] = event.currentTarget.value;
}

function renderValidation() {
  const drawer = $('#validation-drawer');
  drawer.style.display = state.drawerOpen ? '' : 'none';
  if (!state.drawerOpen) return;
  const issues = validateAbstract();
  const errors = issues.filter(item => item.severity === 'error');
  const warnings = issues.filter(item => item.severity === 'warning');
  const infos = issues.filter(item => item.severity === 'info');
  const ordered = [...errors, ...warnings, ...infos];
  if (!ordered.length) {
    $('#validation-list').innerHTML = `<div class="validation-item info"><div class="validation-item-main">${ICONS.checkCircle}<span>No active validation findings. Automated checks are illustrative and are not a coding or compliance certification.</span></div></div>`;
  } else {
    $('#validation-list').innerHTML = ordered.slice(0, 12).map(item => `<div class="validation-item ${item.severity}"><div class="validation-item-main">${item.severity === 'error' ? ICONS.alertOctagon : item.severity === 'warning' ? ICONS.alertTriangle : ICONS.activity}<span><strong>${escapeHTML(item.message)}</strong></span></div><button class="validation-rule-tag" data-jump="${escapeHTML(item.id)}">${escapeHTML(item.rule)} · ${escapeHTML(getField(item.id)?.code || '')}</button></div>`).join('');
    if (ordered.length > 12) $('#validation-list').insertAdjacentHTML('beforeend', `<div style="font-size:11px;color:#64748b">Showing 12 of ${ordered.length} findings. Review section badges for additional items.</div>`);
    $$('[data-jump]', $('#validation-list')).forEach(button => button.addEventListener('click', () => jumpToField(button.dataset.jump)));
  }
  $('#validation-heading').innerHTML = `${ICONS.activity}<span>Live validation: ${errors.length} errors · ${warnings.length} review items${infos.length ? ` · ${infos.length} notice` : ''}</span>`;
}

function renderPipeline() {
  const hasCaseFiles = state.documents.length > 0 || Boolean(state.pastedText);
  const extracting = state.extraction.status === 'extracting';
  const ready = state.extraction.status === 'complete' || state.processStatus === 'done';
  const steps = [
    ['Source ingestion', hasCaseFiles ? 'done' : 'done'],
    ['Reference rules selected', state.refEnabled.size || state.referenceFiles.length ? 'done' : 'running'],
    ['PDF text extraction & field suggestions', ready ? 'done' : 'running'],
    ['Registrar review & correction', 'running']
  ];
  $('#pipeline-steps').innerHTML = steps.map(([label, status], index) => `<div class="pipeline-step ${status}"><span class="step-dot"></span><span>${index + 1}. ${label}${status === 'done' ? ' — complete' : status === 'running' ? ' — pending review' : ''}</span></div>`).join('');
  const isCustom = Boolean(state.customCase || state.pastedText.trim());
  $('#process-button').disabled = extracting;
  $('#process-button').innerHTML = extracting
    ? `${ICONS.activity}<span>${escapeHTML(state.extraction.message || 'Reading PDF…')}</span>`
    : isCustom
      ? `${ICONS.sparkles}<span>${ready ? 'Re-extract source fields' : state.customCase ? (/\.pdf$/i.test(state.customSource?.name || '') ? 'Extract PDF & fill fields' : 'Extract source text & fill fields') : 'Extract pasted text & fill fields'}</span>`
      : `${ICONS.checkCircle}<span>Run demo validation</span>`;
  const status = state.extraction.status === 'complete'
    ? `<div class="extraction-status success">${ICONS.checkCircle}<span>Read ${state.extraction.pages} page${state.extraction.pages === 1 ? '' : 's'} · suggested ${state.extraction.fields} field${state.extraction.fields === 1 ? '' : 's'}. Verify every suggestion and edit as needed.</span></div>`
    : state.extraction.status === 'error'
      ? `<div class="extraction-status error">${ICONS.alertTriangle}<span>${escapeHTML(state.extraction.message)}</span></div>`
      : isCustom ? `<div class="extraction-status">${ICONS.shield}<span>Runs locally in your browser. No OCR for scanned PDFs; no data is uploaded.</span></div>` : `<div class="extraction-status">${ICONS.shield}<span>Built-in demo checks are illustrative; not registry certification.</span></div>`;
  $('#pipeline-status').innerHTML = status;
}

function renderReferenceStandards() {
  $('#ref-standards').innerHTML = BUILTIN_REFERENCE_MANUALS.map(ref => `<button class="ref-std-chip ${state.refEnabled.has(ref.id) ? 'active' : ''}" data-ref-toggle="${ref.id}" title="Toggle ${escapeHTML(ref.fullName)}">${ICONS.book}${escapeHTML(ref.shortName)}</button>`).join('');
  $$('[data-ref-toggle]').forEach(button => button.addEventListener('click', () => {
    const id = button.dataset.refToggle;
    state.refEnabled.has(id) ? state.refEnabled.delete(id) : state.refEnabled.add(id);
    renderReferenceStandards();
    renderPipeline();
  }));
}

function renderFileList(type) {
  const files = type === 'case' ? state.documents : state.referenceFiles;
  const target = type === 'case' ? $('#case-file-list') : $('#ref-file-list');
  target.innerHTML = files.map((file, index) => `<div class="file-chip"><div class="file-chip-info">${ICONS.fileText}<span class="file-chip-name" title="${escapeHTML(file.name)}">${escapeHTML(file.name)}</span></div><span class="file-chip-meta">${formatBytes(file.size)}</span><button class="btn btn-subtle btn-xs" data-remove-file="${type}:${index}" title="Remove file">${ICONS.x}</button></div>`).join('');
  $$('[data-remove-file]', target).forEach(button => button.addEventListener('click', () => {
    const [kind, rawIndex] = button.dataset.removeFile.split(':');
    const arr = kind === 'case' ? state.documents : state.referenceFiles;
    const removed = arr.splice(Number(rawIndex), 1)[0];
    if (removed?.url) URL.revokeObjectURL(removed.url);
    if (kind === 'case' && state.customSource?.id === removed?.id) {
      state.customSource = state.documents.at(-1) || null;
      state.activeSource = state.customSource?.id || 'demo';
      if (state.customSource && !state.customSource.text) state.extraction = { status: 'idle', pages: 0, fields: 0, message: '' };
      renderAll();
      return;
    }
    if (kind === 'case' && state.activeSource === removed?.id) state.activeSource = state.documents.at(-1)?.id || 'demo';
    renderFileList(kind);
    renderSourceViewer();
    renderPipeline();
  }));
}
function formatBytes(bytes = 0) { return bytes < 1024 ? `${bytes} B` : bytes < 1048576 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / 1048576).toFixed(1)} MB`; }

async function acceptFiles(files, type) {
  const added = [];
  for (const file of files) {
    const isText = /\.txt$/i.test(file.name) || file.type === 'text/plain';
    const isPdf = /\.pdf$/i.test(file.name) || file.type === 'application/pdf';
    const entry = { id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, name: file.name, size: file.size, type: file.type || (isPdf ? 'application/pdf' : ''), file, url: URL.createObjectURL(file), text: '', pages: 0, unsupported: false };
    if (isText) {
      try { entry.text = await file.text(); } catch { entry.text = ''; }
    } else if (!isPdf) {
      entry.unsupported = true;
    }
    if (type === 'case') state.documents.push(entry); else state.referenceFiles.push(entry);
    added.push(entry);
  }
  renderFileList(type);
  if (type === 'case' && added.length) {
    const target = added.at(-1);
    state.activeSource = target.id;
    if (!target.unsupported) {
      startCustomCase(target);
      toast('Reading the uploaded document locally and matching source evidence to abstract fields…', 'info');
      await extractDocument(target);
    } else {
      renderSourceViewer(); renderPipeline();
      toast('This file can be attached but automatic extraction supports text-based PDF and TXT only.', 'warn');
    }
  } else {
    renderSourceViewer(); renderPipeline();
    toast(`${files.length} reference file${files.length === 1 ? '' : 's'} attached locally. Reference manuals are not automatically parsed in this demo.`, 'info');
  }
}

function startCustomCase(documentFile) {
  state.customSource = documentFile;
  state.customCase = {
    id: 'uploaded',
    title: documentFile.name.replace(/\.[^.]+$/, ''),
    subtitle: 'Uploaded document · local field suggestions require human verification',
    recordText: documentFile.text || '',
    values: Object.fromEntries(SCHEMA_FIELDS.map(field => [field.id, ''])),
    remarks: {}
  };
  state.caseId = 'uploaded';
  state.values = { ...state.customCase.values };
  state.remarks = {};
  state.edited = new Set();
  state.confidence = {};
  state.evidenceSource = {};
  state.extractionConflicts = {};
  state.extraction = { status: 'idle', pages: 0, fields: 0, message: '' };
  state.processStatus = 'idle';
  state.activeSection = 'all'; state.filter = 'all'; state.search = '';
  $('#field-search').value = '';
  renderCaseSelector();
  renderRibbon(); renderFilterPills(); renderSections(); renderForm(); renderValidation();
  renderSourceViewer(); renderPipeline();
}

async function extractDocument(documentFile = state.customSource || state.documents.find(item => item.id === state.activeSource)) {
  if (!documentFile) {
    toast('Upload a text-searchable PDF to extract and suggest abstract fields.', 'warn');
    return;
  }
  if (documentFile.unsupported) {
    state.extraction = { status: 'error', pages: 0, fields: 0, message: 'Automatic extraction supports text-based PDF and TXT only.' };
    renderPipeline();
    return;
  }
  state.extraction = { status: 'extracting', pages: 0, fields: 0, message: 'Preparing local extraction…' };
  renderPipeline();
  let text = documentFile.text || '';
  try {
    if (/\.pdf$/i.test(documentFile.name) || documentFile.type === 'application/pdf') {
      const { extractPdfText } = await import('./pdf-extractor.js');
      const result = await extractPdfText(documentFile.file, ({ page, pages }) => {
        state.extraction.message = `Reading PDF page ${page} of ${pages}…`;
        state.extraction.pages = pages;
        renderPipeline();
      });
      text = result.text;
      documentFile.pages = result.pages;
    }
    if (!text.trim()) throw new Error('No readable text was found in this document. A scanned/image PDF may require OCR, which is not enabled in this demo.');
    documentFile.text = text;
    state.customCase.recordText = text;
    const suggestions = extractAbstractFromText(text);
    for (const [fieldId, suggestion] of Object.entries(suggestions)) {
      const priorValue = state.values[fieldId];
      const priorSourceId = state.evidenceSource[fieldId];
      const priorSourceName = state.documents.find(item => item.id === priorSourceId)?.name || (state.edited.has(fieldId) ? 'Manual edit' : 'Earlier source');
      const differentSource = priorSourceId && priorSourceId !== documentFile.id;
      if (priorValue && priorValue !== suggestion.value && (differentSource || state.edited.has(fieldId))) {
        const previous = state.extractionConflicts[fieldId]?.first || { value: priorValue, source: priorSourceName };
        const incoming = { value: suggestion.value, source: documentFile.name };
        state.extractionConflicts[fieldId] = { first: previous, second: incoming };
        state.remarks[fieldId] = `Conflicting source suggestions. ${previous.source}: “${previous.value}”. ${incoming.source}: “${incoming.value}”. Excerpts — earlier: “${state.remarks[fieldId] || ''}” · new: “${suggestion.evidence}”`;
        state.confidence[fieldId] = 'medium';
      } else {
        if (!state.edited.has(fieldId)) state.values[fieldId] = suggestion.value;
        state.remarks[fieldId] = `PDF excerpt: “${suggestion.evidence}”`;
        state.confidence[fieldId] = suggestion.confidence;
        state.evidenceSource[fieldId] = documentFile.id;
      }
    }
    const count = Object.keys(suggestions).length;
    state.extraction = { status: 'complete', pages: documentFile.pages || 1, fields: count, message: '' };
    state.processStatus = 'done';
    renderSourceViewer(); renderRibbon(); renderFilterPills(); renderSections(); renderForm(); renderValidation(); renderPipeline();
    toast(count ? `Extracted text and proposed values for ${count} fields. Review every suggestion against the PDF.` : 'PDF text was read, but no confident field matches were found. Review the extracted text and enter values manually.', count ? 'success' : 'warn');
  } catch (error) {
    state.extraction = { status: 'error', pages: documentFile.pages || 0, fields: 0, message: error?.message || 'Could not read this document.' };
    state.processStatus = 'idle';
    renderPipeline(); renderSourceViewer();
    toast(state.extraction.message, 'warn');
  }
}

function setupUploads() {
  const mappings = [
    ['case-dropzone', 'case-file-input', 'case'],
    ['ref-dropzone', 'ref-file-input', 'reference']
  ];
  mappings.forEach(([zoneId, inputId, type]) => {
    const zone = $(`#${zoneId}`);
    const input = $(`#${inputId}`);
    zone.addEventListener('click', () => input.click());
    zone.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); input.click(); } });
    input.addEventListener('change', event => { if (event.target.files?.length) acceptFiles([...event.target.files], type === 'case' ? 'case' : 'reference'); input.value = ''; });
    zone.addEventListener('dragover', event => { event.preventDefault(); zone.classList.add('dragover'); });
    zone.addEventListener('dragleave', () => zone.classList.remove('dragover'));
    zone.addEventListener('drop', event => { event.preventDefault(); zone.classList.remove('dragover'); if (event.dataTransfer.files.length) acceptFiles([...event.dataTransfer.files], type === 'case' ? 'case' : 'reference'); });
  });
  $('#raw-text').addEventListener('input', event => {
    state.pastedText = event.target.value;
    if (state.pastedText) state.activeSource = 'pasted';
    if (state.customCase) {
      if (state.customSource?.id !== 'pasted') state.customSource = { id: 'pasted', name: 'Pasted source text.txt', text: '', type: 'text/plain', pages: 1 };
      state.customSource.text = state.pastedText;
      state.customCase.recordText = state.pastedText;
      state.extraction = { status: 'idle', pages: 1, fields: 0, message: '' };
      state.processStatus = 'idle';
    }
    renderSourceViewer();
    renderPipeline();
  });
}

function sourceData() {
  if (state.activeSource === 'pasted') return { id: 'pasted', name: 'Pasted source text', text: state.pastedText || state.customCase?.recordText || '', type: 'text/plain' };
  const doc = state.documents.find(item => item.id === state.activeSource);
  if (doc) return doc;
  if (state.customCase) return state.customSource || { id: 'uploaded-text', name: state.customCase.title, text: state.customCase.recordText, type: 'text/plain' };
  return { id: 'demo', name: `${activeCase().title} — synthetic source`, text: activeCase().recordText, type: 'text/plain', demo: true };
}
function renderSourceViewer() {
  const sources = state.customCase ? [] : [{ id: 'demo', name: 'Demo source' }];
  if (state.pastedText) sources.push({ id: 'pasted', name: 'Pasted text' });
  state.documents.forEach(doc => sources.push({ id: doc.id, name: doc.name }));
  $('#document-tabs').innerHTML = sources.map(source => `<button class="doc-subtab ${source.id === state.activeSource ? 'active' : ''}" data-source="${source.id}">${ICONS.fileText}${escapeHTML(source.name)}</button>`).join('');
  $$('[data-source]').forEach(button => button.addEventListener('click', () => { state.activeSource = button.dataset.source; renderSourceViewer(); }));
  const source = sourceData();
  const header = `<div class="pdf-sheet-header"><strong>${ICONS.fileText}${escapeHTML(source.name)}</strong><span class="pdf-sheet-meta">${source.demo ? 'SYNTHETIC DEMO' : escapeHTML(source.type || 'SOURCE FILE')}</span></div>`;
  if (source.type === 'application/pdf' || /\.pdf$/i.test(source.name)) {
    const extractedText = source.text ? `<details class="pdf-text-details" open><summary>Extracted text · ${source.pages || state.extraction.pages || '—'} page(s)</summary><div class="pdf-sheet-content" id="source-text-content">${escapeHTML(source.text)}</div></details>` : `<div class="pdf-text-placeholder">${ICONS.activity}<span>Upload started. PDF text will appear here after local extraction.</span></div>`;
    $('#source-viewer').innerHTML = `${header}<iframe class="pdf-embed-frame" title="Local PDF preview" src="${escapeHTML(source.url)}"></iframe>${extractedText}`;
  } else if (source.text) {
    $('#source-viewer').innerHTML = `${header}<div class="pdf-sheet-content" id="source-text-content">${escapeHTML(source.text)}</div>`;
  } else if (source.unsupported) {
    $('#source-viewer').innerHTML = `${header}<div class="pdf-sheet-content">This file type is not parsed in the browser-only demo. Open it locally and paste only de-identified text if needed. No content was sent to a server.</div>`;
  } else {
    $('#source-viewer').innerHTML = `${header}<div class="pdf-sheet-content">${escapeHTML(INITIAL_REFERENCE_TEXT)}</div>`;
  }
}

function locateEvidence(fieldId) {
  const field = getField(fieldId);
  const evidenceDoc = state.documents.find(item => item.id === state.evidenceSource[fieldId]);
  if (evidenceDoc) state.activeSource = evidenceDoc.id;
  else if (state.customSource?.id === state.evidenceSource[fieldId]) state.activeSource = state.customSource.id;
  const source = sourceData();
  const rawEvidence = (state.remarks[fieldId] || '').replace(/^PDF excerpt:\s*[“\"]?/, '').replace(/[”\"]\s*$/, '');
  const candidates = [rawEvidence, state.values[fieldId], ...(state.remarks[fieldId] || '').split(/[.;\n]/)].filter(item => item && item.length > 8);
  const text = source.text || '';
  let index = -1;
  let match = '';
  for (const candidate of candidates) {
    const cleaned = candidate.replace(/^\s*\d+\s*-\s*/, '').replace(/\s+/g, ' ').trim();
    const probes = [cleaned, cleaned.slice(0, 180), cleaned.slice(0, 80)];
    for (const probe of probes) {
      if (probe.length > 8) index = text.toLowerCase().indexOf(probe.toLowerCase());
      if (index >= 0) { match = probe; break; }
    }
    if (index >= 0) break;
  }
  if (state.leftTab !== 'source') {
    state.leftTab = 'source';
    syncLeftTab();
  }
  renderSourceViewer();
  const content = $('#source-text-content');
  if (content && index >= 0) {
    const start = Math.max(0, index - 160);
    const end = Math.min(text.length, index + match.length + 240);
    content.innerHTML = `${start ? '…' : ''}${escapeHTML(text.slice(start, index))}<mark class="evidence-highlight">${escapeHTML(text.slice(index, index + match.length))}</mark>${escapeHTML(text.slice(index + match.length, end))}${end < text.length ? '…' : ''}`;
    content.scrollTop = Math.max(0, content.scrollHeight * index / Math.max(1, text.length) - 100);
    toast(`Located a matching excerpt for ${field.code} ${field.name}.`, 'info');
  } else {
    toast(`No exact text match for ${field.code}; review the source record manually.`, 'warn');
  }
}

function jumpToField(id) {
  const field = getField(id);
  if (!field) return;
  if (state.activeSection !== 'all') state.activeSection = field.section;
  if (state.filter !== 'all') state.filter = 'all';
  if (state.search) { state.search = ''; $('#field-search').value = ''; }
  renderSections(); renderFilterPills(); renderForm();
  requestAnimationFrame(() => {
    const row = $(`#row-${id}`);
    row?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    row?.classList.add('row-flash');
    setTimeout(() => row?.classList.remove('row-flash'), 1700);
  });
}

function syncLeftTab() {
  $$('.panel-tab').forEach(button => button.classList.toggle('active', button.dataset.leftTab === state.leftTab));
  $('#left-ingestion').style.display = state.leftTab === 'ingestion' ? '' : 'none';
  $('#left-source').style.display = state.leftTab === 'source' ? '' : 'none';
}

function showReferences() {
  const manuals = BUILTIN_REFERENCE_MANUALS.map(manual => `<div class="rule-block"><h4>${escapeHTML(manual.fullName)}</h4>${manual.rules.map(rule => `<div style="padding:8px 0;border-top:1px solid #e2e8f0"><strong style="color:#334155">${escapeHTML(rule.title)}</strong><p style="margin-top:4px">${escapeHTML(rule.body)}</p></div>`).join('')}</div>`).join('');
  const notes = `<div class="rule-block" style="background:#fffbeb;border-color:#fde68a"><h4 style="color:#b45309">Important limitations</h4><p>Text-searchable PDFs are extracted locally in your browser with PDF.js, then deterministic rules propose field values from explicit source text. The interface and abstract labels are English; source evidence is quoted verbatim. This is not an LLM, OCR, authoritative coding engine, or registry service. Suggestions may be incomplete or wrong; verify every field with the source and a qualified registrar.</p><p style="margin-top:8px"><strong>Privacy:</strong> PDF bytes and extracted text are not sent to this app's server. Use only records approved by your organization's privacy and security policies.</p></div>`;
  openModal('Reference standards & illustrative rules', `${notes}${manuals}`);
}
function openModal(title, html) {
  $('#modal-title').innerHTML = `${ICONS.book}<span>${escapeHTML(title)}</span>`;
  $('#modal-body').innerHTML = html;
  $('#modal-backdrop').classList.add('open');
}
function closeModal() { $('#modal-backdrop').classList.remove('open'); }

function renderAll() {
  setIconsAndStaticLabels();
  renderCaseSelector();
  renderReferenceStandards();
  renderFileList('case'); renderFileList('reference');
  renderRibbon(); renderFilterPills(); renderSections(); renderForm(); renderValidation(); renderPipeline(); renderSourceViewer();
  syncLeftTab();
  $('#workspace-shell').classList.toggle('layout-collapsed-left', state.sourceCollapsed);
  $('#layout-toggle').innerHTML = `${ICONS.columns}<span>${state.sourceCollapsed ? 'Show source' : 'Hide source'}</span>`;
}

function setupInteractions() {
  $('#field-search').addEventListener('input', event => { state.search = event.target.value; renderForm(); });
  document.addEventListener('keydown', event => {
    if (event.key === '/' && !['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName) && !event.ctrlKey && !event.metaKey) { event.preventDefault(); $('#field-search').focus(); }
    if (event.key === 'Escape') { $('#modal-backdrop').classList.remove('open'); $('#export-dropdown').classList.remove('open'); }
  });
  $('#layout-toggle').addEventListener('click', () => { state.sourceCollapsed = !state.sourceCollapsed; $('#workspace-shell').classList.toggle('layout-collapsed-left', state.sourceCollapsed); $('#layout-toggle').innerHTML = `${ICONS.columns}<span>${state.sourceCollapsed ? 'Show source' : 'Hide source'}</span>`; });
  $('#reset-button').addEventListener('click', () => { initData(); state.activeSource = 'demo'; state.processStatus = 'idle'; renderAll(); toast('Selected synthetic case restored.'); });
  $$('.panel-tab').forEach(button => button.addEventListener('click', () => { state.leftTab = button.dataset.leftTab; syncLeftTab(); }));
  $('#process-button').addEventListener('click', async () => {
    state.drawerOpen = true;
    if (state.customCase) {
      await extractDocument(state.documents.find(item => item.id === state.activeSource));
    } else if (state.pastedText.trim()) {
      const pasted = { id: 'pasted', name: 'Pasted source text.txt', text: state.pastedText, type: 'text/plain', pages: 1 };
      state.activeSource = 'pasted';
      startCustomCase(pasted);
      await extractDocument(pasted);
    } else {
      state.processStatus = 'done';
      renderAll();
      toast('Illustrative demo checks completed. Human registrar review is still required.', 'info');
    }
  });
  $('#validation-close').addEventListener('click', () => { state.drawerOpen = false; $('#validation-drawer').style.display = 'none'; });
  $('#references-button').addEventListener('click', showReferences);
  $('#modal-close').addEventListener('click', closeModal);
  $('#modal-done').addEventListener('click', closeModal);
  $('#modal-backdrop').addEventListener('click', event => { if (event.target === $('#modal-backdrop')) closeModal(); });
  $('#export-trigger').addEventListener('click', () => { const menu = $('#export-dropdown'); menu.classList.toggle('open'); $('#export-trigger').setAttribute('aria-expanded', menu.classList.contains('open')); });
  document.addEventListener('click', event => { if (!$('#export-dropdown').contains(event.target)) $('#export-dropdown').classList.remove('open'); });
  $$('.dropdown-item').forEach(button => button.addEventListener('click', () => handleExport(button.dataset.action)));
  $('#print-date').textContent = todayDisplay();
}

function rowsForExport() {
  return SCHEMA_FIELDS.map(field => ({
    code: field.code,
    fieldId: field.id,
    section: sectionName(field.section),
    field: field.name,
    value: state.values[field.id] || '',
    evidence: state.remarks[field.id] || '',
    confidence: state.confidence[field.id] || '',
    evidenceSource: state.documents.find(item => item.id === state.evidenceSource[field.id])?.name || '',
    standard: field.standard || ''
  }));
}
function abstractObject() {
  return {
    metadata: {
      application: 'Cancer Registry Office — Data Extraction',
      case: activeCase().title,
      syntheticDemo: !state.customCase,
      sourceFileName: state.customSource?.name || null,
      extractionMethod: state.customCase ? 'Browser-local PDF.js text extraction plus deterministic field matching' : 'Prefilled synthetic demonstration case',
      generatedAt: new Date().toISOString(),
      notice: 'For software demonstration only. Not clinical advice or registry submission. Verify values against source documents and current authoritative standards.'
    },
    abstract: Object.fromEntries(SCHEMA_FIELDS.map(field => [field.code, { fieldId: field.id, name: field.name, section: sectionName(field.section), value: state.values[field.id] || '', evidence: state.remarks[field.id] || '', extractionConfidence: state.confidence[field.id] || null, evidenceSource: state.documents.find(item => item.id === state.evidenceSource[field.id])?.name || null }])),
    validation: validateAbstract()
  };
}
function markdownTable() {
  const esc = text => String(text || '').replace(/\|/g, '\\|').replace(/[\r\n]+/g, '<br>');
  const notice = state.customCase ? 'PDF-extracted suggestions; verify each field against the source before use.' : 'Synthetic demonstration only; verify all data against authoritative source material.';
  return `# Cancer Registry Office — Data Extraction\n## Registry Abstract — ${activeCase().title}\n\n> ${notice}\n\n| Code | Field | Value | Evidence / rationale | Confidence / source |\n|---|---|---|---|---|\n${rowsForExport().map(row => `| ${esc(row.code)} | ${esc(row.field)} | ${esc(row.value)} | ${esc(row.evidence)} | ${esc(row.confidence)} ${esc(row.evidenceSource)} |`).join('\n')}`;
}
function tsv() {
  const quote = value => String(value || '').replace(/\t/g, ' ').replace(/\r?\n/g, ' ');
  return ['Code\tSection\tField\tValue\tEvidence / rationale\tConfidence\tEvidence source', ...rowsForExport().map(row => [row.code, row.section, row.field, row.value, row.evidence, row.confidence, row.evidenceSource].map(quote).join('\t'))].join('\n');
}
function csv() {
  const safe = value => {
    let text = String(value ?? '');
    if (/^[\s]*[=+@\-]/.test(text)) text = `'${text}`;
    return `"${text.replace(/"/g, '""')}"`;
  };
  const lines = [['Code','Section','Field','Value','Evidence / rationale','Extraction confidence','Evidence source','Standard'], ...rowsForExport().map(row => [row.code,row.section,row.field,row.value,row.evidence,row.confidence,row.evidenceSource,row.standard])];
  return '\ufeff' + lines.map(line => line.map(safe).join(',')).join('\r\n');
}
async function copyText(text, what) {
  try {
    await navigator.clipboard.writeText(text);
    toast(`${what} copied to clipboard.`);
  } catch {
    const textarea = document.createElement('textarea');
    textarea.value = text; textarea.style.position = 'fixed'; textarea.style.opacity = '0';
    document.body.append(textarea); textarea.select();
    const success = document.execCommand('copy'); textarea.remove();
    toast(success ? `${what} copied to clipboard.` : 'Clipboard access unavailable. Use download instead.', success ? 'success' : 'warn');
  }
}
function downloadFile(name, content, mime) {
  const blob = new Blob([content], { type: `${mime};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a'); anchor.href = url; anchor.download = name; anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}
function handleExport(action) {
  $('#export-dropdown').classList.remove('open');
  const stamp = new Date().toISOString().slice(0,10);
  const slug = activeCase().id;
  if (action === 'copy-markdown') copyText(markdownTable(), 'Markdown abstract');
  if (action === 'copy-json') copyText(JSON.stringify(abstractObject(), null, 2), 'JSON abstract');
  if (action === 'copy-tsv') copyText(tsv(), 'TSV abstract');
  if (action === 'download-csv') { downloadFile(`cancer-registry-extraction-${slug}-${stamp}.csv`, csv(), 'text/csv'); toast('CSV export downloaded.'); }
  if (action === 'download-json') { downloadFile(`cancer-registry-extraction-${slug}-${stamp}.json`, JSON.stringify(abstractObject(), null, 2), 'application/json'); toast('JSON export downloaded.'); }
  if (action === 'print') { window.print(); }
}

function toast(message, type = 'success') {
  const el = document.createElement('div');
  el.className = `toast ${type === 'info' ? 'toast-info' : type === 'warn' ? 'toast-warn' : ''}`;
  el.innerHTML = `${type === 'warn' ? ICONS.alertTriangle : type === 'info' ? ICONS.activity : ICONS.checkCircle}<span>${escapeHTML(message)}</span>`;
  $('#toast-container').append(el);
  setTimeout(() => el.remove(), 3800);
}

function init() {
  initData();
  setIconsAndStaticLabels();
  initCaseSelector();
  setupUploads();
  setupInteractions();
  $('#demo-case-select').value = state.caseId;
  $('#icdo-topography-datalist').innerHTML = ICDO_TOPOGRAPHY_LIST.map(item => `<option value="${escapeHTML(item)}"></option>`).join('');
  $('#icdo-morphology-datalist').innerHTML = ICDO_MORPHOLOGY_LIST.map(item => `<option value="${escapeHTML(item)}"></option>`).join('');
  renderAll();
}

init();
