import { ICDO_TOPOGRAPHY_LIST, ICDO_MORPHOLOGY_LIST, SCHEMA_FIELDS } from './schema.js';

const dateToRegistry = raw => {
  if (!raw) return '';
  const text = raw.trim();
  let match = text.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/);
  if (match) return `${match[3].padStart(2, '0')}/${match[2].padStart(2, '0')}/${match[1]}`;
  match = text.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/);
  if (match) return `${match[1].padStart(2, '0')}/${match[2].padStart(2, '0')}/${match[3]}`;
  const named = text.match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/);
  if (named) {
    const month = new Date(`${named[2]} 1, 2000`).getMonth() + 1;
    if (month) return `${named[1].padStart(2, '0')}/${String(month).padStart(2, '0')}/${named[3]}`;
  }
  return text;
};

function findLine(lines, pattern, { value = false } = {}) {
  const regex = pattern instanceof RegExp ? pattern : new RegExp(pattern, 'i');
  for (const line of lines) {
    const match = line.match(regex);
    if (match) return value ? (match[1] || '').trim() : line.trim();
  }
  return '';
}
function captureLabel(lines, labelPattern) {
  const line = findLine(lines, new RegExp(`^\\s*(?:${labelPattern})\\s*(?:#|no\\.?|number)?\\s*[:：=\\-]\\s*(.+)$`, 'i'), { value: true });
  return line.split(/\s{2,}|\s*\|\s*/)[0].trim();
}
function addSuggestion(output, field, value, evidence, confidence = 'high') {
  if (!value || !String(value).trim() || /[\u0600-\u06FF]/.test(String(value))) return;
  const cleanEvidence = String(evidence || '').replace(/\s+/g, ' ').trim().slice(0, 520);
  output[field] = { value: String(value).trim(), evidence: cleanEvidence || 'Value detected in source text; verify the full source document.', confidence };
}
function lineFor(lines, patterns) {
  const list = Array.isArray(patterns) ? patterns : [patterns];
  for (const pattern of list) {
    const line = findLine(lines, pattern);
    if (line) return line;
  }
  return '';
}
function optionStarts(list, prefix) { return list.find(option => option.startsWith(prefix)) || prefix; }
function schemaOption(fieldId, prefix) {
  const options = SCHEMA_FIELDS.find(field => field.id === fieldId)?.options || [];
  return options.find(option => option.startsWith(prefix)) || '';
}

function findDateNear(lines, labelPattern) {
  const pattern = new RegExp(`(?:${labelPattern})[^\\n]{0,70}?(\\d{4}[-/.]\\d{1,2}[-/.]\\d{1,2}|\\d{1,2}[-/.]\\d{1,2}[-/.]\\d{4}|\\d{1,2}\\s+[A-Za-z]+\\s+\\d{4})`, 'i');
  for (const line of lines) {
    const match = line.match(pattern);
    if (match) return { value: dateToRegistry(match[1]), evidence: line };
  }
  return null;
}

function findTnm(text, type) {
  // Accept common display styles: cT2 cN1 cM0, pT2N0M0, ypT1b pN0 cM0.
  const prefix = type === 'clinical' ? 'c' : 'p';
  const expression = type === 'clinical'
    ? /\bcT\s*(?:is|[0-4x](?:[a-d])?)\s*[,/ ]*\s*c?N\s*[0-3x](?:[a-c])?\s*[,/ ]*\s*c?M\s*[01x](?:[a-c])?/i
    : /\b(?:yp|p)T\s*(?:is|[0-4x](?:[a-d])?)\s*[,/ ]*\s*(?:yp|p)?N\s*[0-3x](?:[a-c])?\s*[,/ ]*\s*(?:c|p)?M\s*[01x](?:[a-c])?/i;
  const match = text.match(expression);
  if (match) return match[0].replace(/\s+/g, ' ').trim().replace(/([TNM])\s+/gi, '$1');
  const categoryPrefix = type === 'clinical' ? '(?:c)?' : '(?:yp|p)';
  const t = text.match(new RegExp(`\\b${categoryPrefix}T(?:is|[0-4x](?:[a-d])?)\\b`, 'i'));
  const n = text.match(new RegExp(`\\b${categoryPrefix}N[0-3x](?:[a-c])?\\b`, 'i'));
  const mPrefix = type === 'clinical' ? '(?:c)?' : '(?:c|yp|p)?';
  const m = text.match(new RegExp(`\\b${mPrefix}M[01x](?:[a-c])?\\b`, 'i'));
  return t && n ? `${t[0]} ${n[0]}${m ? ` ${m[0]}` : ''}` : '';
}

/**
 * Conservative, transparent rule-based field suggestions from extracted PDF text.
 * It deliberately does not infer a stage group or code when the document is unclear.
 */
export function extractAbstractFromText(rawText) {
  const text = String(rawText || '').replace(/\r/g, '\n').replace(/[\u00a0\t]+/g, ' ');
  const lines = text.split(/\n+/).map(line => line.trim()).filter(Boolean);
  const normalized = lines.join('\n');
  const results = {};
  if (!lines.length) return results;

  // Demographics and direct identifiers: only mapped when an explicit label is found.
  const patientName = captureLabel(lines, '(?:patient\\s+)?(?:full\\s+)?name|patient\\s+name');
  const patientNameLine = lineFor(lines, /^(?:patient\s+)?(?:full\s+)?name\s*[:：=\-]/i);
  const englishNameLine = lineFor(lines, /(?:english\s+name|name\s+in\s+english|english\s+transliteration|latin(?:\s+script)?\s+name)\s*[:：=\-]/i);
  const englishName = captureLabel(lines, '(?:english\\s+name|name\\s+in\\s+english|english\\s+transliteration|latin(?:\\s+script)?\\s+name)');
  if (patientName && !/[\u0600-\u06FF]/.test(patientName) && !/^(?:doctor|physician|surgeon|pathologist)/i.test(patientName)) {
    addSuggestion(results, 'F02', patientName, patientNameLine);
    addSuggestion(results, 'F03', englishName && !/[\u0600-\u06FF]/.test(englishName) ? englishName : patientName, englishNameLine || patientNameLine, englishName ? 'high' : 'medium');
  } else if (englishName && !/[\u0600-\u06FF]/.test(englishName)) {
    addSuggestion(results, 'F02', englishName, englishNameLine, 'medium');
    addSuggestion(results, 'F03', englishName, englishNameLine, 'high');
  }
  const mrn = captureLabel(lines, '(?:medical\\s+record\\s+(?:number|no\\.?)|MRN|chart\\s+(?:number|no\\.?))');
  if (mrn) addSuggestion(results, 'F04', mrn, lineFor(lines, /(?:medical\s+record|\bMRN\b|chart\s+(?:number|no\.?))/i));
  const nid = captureLabel(lines, '(?:national\\s+ID|national\\s+identity|civil\\s+(?:ID|number)|NID)');
  if (nid) addSuggestion(results, 'F01', nid, lineFor(lines, /(?:national\s+ID|national\s+identity|civil\s+(?:ID|number)|\bNID\b)/i));
  const dobMatch = findDateNear(lines, 'date\\s+of\\s+birth|DOB|born');
  if (dobMatch) addSuggestion(results, 'F10', dobMatch.value, dobMatch.evidence);
  const ageLine = lineFor(lines, /(?:\bage\s*(?:at\s+diagnosis)?\s*[:=\-]|\b\d{1,3}\s*(?:years?\s+old|y\/o)\b)/i);
  const ageMatch = ageLine.match(/(?:age\s*(?:at\s+diagnosis)?\s*[:=\-]?\s*)(\d{1,3})\b/i) || ageLine.match(/\b(\d{1,3})\s*(?:years?\s+old|y\/o)\b/i);
  if (ageMatch && Number(ageMatch[1]) <= 120) addSuggestion(results, 'F12', ageMatch[1], ageLine);
  const sexLine = lineFor(lines, /(?:sex|gender)\s*[:=\-]/i);
  const sexText = sexLine.match(/(?:sex|gender)\s*[:=\-]\s*(male|female|other|unknown|m\b|f\b)/i)?.[1]?.toLowerCase();
  if (sexText) {
    const sexOption = /^(male|m)$/.test(sexText) ? '1 - Male' : /^(female|f)$/.test(sexText) ? '2 - Female' : sexText === 'other' ? '3 - Other (Intersex / Transsexual)' : '9 - Unknown';
    addSuggestion(results, 'F13', sexOption, sexLine);
  }
  const phone = captureLabel(lines, '(?:phone|telephone|mobile|contact\\s+number)');
  if (phone) addSuggestion(results, 'F09', phone, lineFor(lines, /(?:phone|telephone|mobile|contact\s+number)/i));
  const municipality = captureLabel(lines, '(?:municipality|city|town|residence\\s+city)');
  if (municipality) addSuggestion(results, 'F05', municipality, lineFor(lines, /(?:municipality|city|town|residence\s+city)/i), 'medium');
  const branch = captureLabel(lines, '(?:municipality\\s+branch|district|mahalla|al[- ]?mahalla)');
  if (branch) addSuggestion(results, 'F06', branch, lineFor(lines, /(?:municipality\s+branch|district|mahalla)/i), 'medium');
  const address = captureLabel(lines, '(?:address|residential\\s+address)');
  if (address) addSuggestion(results, 'F07', address, lineFor(lines, /(?:address|residential\s+address)/i), 'medium');
  const placeOfBirth = captureLabel(lines, 'place\\s+of\\s+birth|birthplace');
  if (placeOfBirth) addSuggestion(results, 'F11', placeOfBirth, lineFor(lines, /place\s+of\s+birth|birthplace/i));
  const nationality = captureLabel(lines, 'nationality|citizenship');
  if (nationality) addSuggestion(results, 'F14', nationality, lineFor(lines, /nationality|citizenship/i));
  const maritalLine = lineFor(lines, /marital\s+status\s*[:=\-]/i);
  const maritalText = maritalLine.match(/marital\s+status\s*[:=\-]\s*(single|married|widowed|divorced|separated|unknown)/i)?.[1]?.toLowerCase();
  if (maritalText) {
    const map = { single: '1 - Single (Never Married)', married: '2 - Married', widowed: '3 - Widowed', divorced: '4 - Divorced', separated: '5 - Separated', unknown: '9 - Unknown' };
    addSuggestion(results, 'F15', map[maritalText], maritalLine);
  }
  const occupation = captureLabel(lines, 'occupation|profession|job\\s+title');
  if (occupation) addSuggestion(results, 'F17', occupation, lineFor(lines, /occupation|profession|job\s+title/i), 'medium');
  const smokingLine = lineFor(lines, /(?:smoking\s+history|tobacco\s+use|smoker\s+status)\s*[:=\-]/i);
  if (smokingLine) {
    const smoking = smokingLine.match(/(?:smoking\s+history|tobacco\s+use|smoker\s+status)\s*[:=\-]\s*(.*)/i)?.[1] || '';
    const value = /never|non[- ]?smoker/i.test(smoking) ? '0 - Never Smoker (<100 lifetime cigarettes)' : /former|ex[- ]?smoker|quit/i.test(smoking) ? '2 - Former Cigarette Smoker (Quit >= 1 yr)' : /current|active smoker/i.test(smoking) ? '1 - Current Cigarette Smoker' : '';
    if (value) addSuggestion(results, 'F18', value, smokingLine);
  }
  const familyLine = lineFor(lines, /family\s+history\s+(?:of\s+)?cancer\s*[:=\-]/i);
  if (familyLine) {
    const history = familyLine.replace(/^.*?family\s+history\s+(?:of\s+)?cancer\s*[:=\-]\s*/i, '');
    const firstDegree = /mother|father|sister|brother|son|daughter|first[- ]degree/i.test(history);
    const value = /negative|none|no\s+(?:known\s+)?family/i.test(history) ? '0 - Negative (No known family history of malignancy)' : firstDegree ? '1 - Positive: First-Degree Relative(s)' : '';
    if (value) addSuggestion(results, 'F19', value, familyLine, firstDegree ? 'medium' : 'high');
  }
  const residenceLine = lineFor(lines, /residence\s+type\s*[:=\-]/i);
  const residenceCode = residenceLine.match(/residence\s+type\s*[:=\-]\s*([1-4]|8|9)\b/i)?.[1];
  if (residenceCode) addSuggestion(results, 'F08', schemaOption('F08', `${residenceCode} -`), residenceLine);
  const sourceReferral = captureLabel(lines, 'source\\s+of\\s+referral|referral\\s+source');
  if (sourceReferral) addSuggestion(results, 'F20', sourceReferral, lineFor(lines, /source\s+of\s+referral|referral\s+source/i), 'medium');
  const classLine = lineFor(lines, /class\s+of\s+case\s*[:=\-]\s*(?:\d{2})/i);
  const classCode = classLine.match(/class\s+of\s+case\s*[:=\-]\s*(\d{2})/i)?.[1];
  if (classCode && schemaOption('F21', `${classCode} -`)) addSuggestion(results, 'F21', schemaOption('F21', `${classCode} -`), classLine);
  const firstFacility = captureLabel(lines, 'facility\\s+referred\\s+from|referred\\s+from');
  if (firstFacility) addSuggestion(results, 'F22', firstFacility, lineFor(lines, /facility\s+referred\s+from|referred\s+from/i));
  const nextFacility = captureLabel(lines, 'facility\\s+referred\\s+to|referred\\s+to');
  if (nextFacility) addSuggestion(results, 'F23', nextFacility, lineFor(lines, /facility\s+referred\s+to|referred\s+to/i));
  const diagnosisPlace = captureLabel(lines, 'place\\s+of\\s+diagnosis|diagnosing\\s+facility|diagnosed\\s+at');
  if (diagnosisPlace) addSuggestion(results, 'F24', diagnosisPlace, lineFor(lines, /place\s+of\s+diagnosis|diagnosing\s+facility|diagnosed\s+at/i));
  const basisLine = lineFor(lines, /basis\s+of\s+diagnosis\s*[:=\-]/i);
  const basisCode = basisLine.match(/basis\s+of\s+diagnosis\s*[:=\-]\s*([0-9])/i)?.[1];
  if (basisCode && schemaOption('F27', `${basisCode} -`)) addSuggestion(results, 'F27', schemaOption('F27', `${basisCode} -`), basisLine);
  const labName = captureLabel(lines, '(?:laboratory\\s+name|pathology\\s+laboratory|pathology\\s+lab(?:oratory)?\\s+name|lab\\s+name)');
  if (labName) addSuggestion(results, 'F28', labName, lineFor(lines, /(?:laboratory\s+name|pathology\s+laboratory|pathology\s+lab(?:oratory)?\s+name|lab\s+name)/i));
  const labReport = captureLabel(lines, '(?:lab\\s+report\\s+(?:no\\.?|number)|pathology\\s+(?:accession|report)\\s+(?:no\\.?|number)|accession\\s+(?:no\\.?|number))');
  if (labReport) addSuggestion(results, 'F29', labReport, lineFor(lines, /(?:lab\s+report|pathology\s+(?:accession|report)|accession\s+(?:no\.?|number))/i));
  const sequenceLine = lineFor(lines, /sequence\s+number\s*[:=\-]\s*\d{2}/i);
  const sequenceCode = sequenceLine.match(/sequence\s+number\s*[:=\-]\s*(\d{2})/i)?.[1];
  if (sequenceCode && schemaOption('F30', `${sequenceCode} -`)) addSuggestion(results, 'F30', schemaOption('F30', `${sequenceCode} -`), sequenceLine);

  // Build a disease context from diagnosis/pathology/imaging sections to reduce false matches
  // to family-history or unrelated incidental findings elsewhere in a long chart.
  const diseaseLines = lines.filter(line => !/(?:laboratory|lab\s+(?:name|report)|accession\s+no)/i.test(line) && /diagnos|patholog|histolog|biopsy|specimen|primary\s+site|impression|tumou?r|neoplasm|carcinoma|lymphoma|sarcoma|myeloma|stage\s+(?:group|[0-4i])|ICD[- ]?O|topograph|morpholog|laterality|\bTNM\b|\bFIGO\b|Ann\s+Arbor|R-?ISS|Nottingham|Gleason/i.test(line));
  const diseaseText = (diseaseLines.length ? diseaseLines.join('\n') : normalized).slice(0, 30000);
  const diagnosisEvidence = lineFor(lines, [/final\s+diagnos/i, /patholog(?:ic|y)\s+diagnos/i, /^diagnos(?:is)?\s*[:：=\-]/i, /impression\s*[:：=\-]/i]);
  const pathologyEvidence = lineFor(lines, [/^(?:histopathology|histology|biopsy|pathology)(?:\s+(?:report|result|diagnosis))?\s*[:：=\-]/i, /^pathologic(?:al)?\s+diagnos/i, /(?:core|excisional|needle)\s+biopsy.{0,100}(?:carcinoma|malignan|lymphoma|neoplasm)/i]);
  const generalDiagnosis = diagnosisEvidence || pathologyEvidence || '';
  if (generalDiagnosis) addSuggestion(results, 'F34', generalDiagnosis.replace(/^(?:final\s+)?(?:pathologic(?:al)?\s+)?diagnos(?:is)?\s*[:：=\-]\s*/i, '').slice(0, 240), generalDiagnosis, 'medium');

  // Exact ICD-O codes take precedence over any pattern-based site/morphology mapping.
  const explicitTopo = diseaseText.match(/\bC\d{2}\.\d\b/i)?.[0]?.toUpperCase();
  if (explicitTopo) {
    const topo = ICDO_TOPOGRAPHY_LIST.find(item => item.startsWith(explicitTopo));
    addSuggestion(results, 'F32', topo || explicitTopo, lineFor(lines, new RegExp(`\\b${explicitTopo.replace('.', '\\.')}\\b`, 'i')) || generalDiagnosis);
  }
  const explicitMorph = diseaseText.match(/\bM-?\d{4}\/\d{1,2}\b/i)?.[0]?.replace(/^M(?=\d)/i, 'M-').toUpperCase();
  if (explicitMorph) {
    const morphology = ICDO_MORPHOLOGY_LIST.find(item => item.startsWith(explicitMorph));
    addSuggestion(results, 'F35', morphology || explicitMorph, lineFor(lines, new RegExp(explicitMorph.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')) || generalDiagnosis);
    const behaviorDigit = explicitMorph.match(/\/(\d)/)?.[1];
    if (behaviorDigit) addSuggestion(results, 'F36', behaviorDigit === '0' ? '/0 - Benign (Non-reportable outside CNS per ISCR/STORE)' : behaviorDigit === '1' ? '/1 - Uncertain whether benign or malignant (Borderline)' : behaviorDigit === '2' ? '/2 - Carcinoma in situ / Non-invasive' : behaviorDigit === '3' ? '/3 - Malignant, primary site (Invasive)' : '/6 - Malignant, metastatic site', lineFor(lines, new RegExp(explicitMorph.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')) || generalDiagnosis);
  }

  const contextLower = diseaseText.toLowerCase();
  const lateralityWord = contextLower.match(/\b(right|left|bilateral)\b/);
  let inferredSite = '';
  if (/small[- ]cell\s+(?:lung\s+)?carcinoma|small cell neuroendocrine|lung\s+carcinoma|bronchogenic/i.test(diseaseText) && /lung|pulmonary|bronch/i.test(diseaseText)) {
    inferredSite = /upper\s+lobe/i.test(diseaseText) ? 'C34.1' : /lower\s+lobe/i.test(diseaseText) ? 'C34.3' : 'C34.9';
  } else if (/breast/i.test(diseaseText) && /carcinoma|malignan|tumou?r|mass|neoplasm/i.test(diseaseText)) {
    inferredSite = /upper[- ]outer/i.test(diseaseText) ? 'C50.4' : /upper[- ]inner/i.test(diseaseText) ? 'C50.2' : 'C50.9';
  } else if (/prostate/i.test(diseaseText) && /adenocarcinoma|carcinoma|malignan|neoplasm/i.test(diseaseText)) inferredSite = 'C61.9';
  else if (/endometr(?:ial|ium)/i.test(diseaseText) && /carcinoma|adenocarcinoma|malignan|neoplasm/i.test(diseaseText)) inferredSite = 'C54.1';
  else if (/cervix\s+uteri|cervical\s+(?:squamous|adenocarcinoma|carcinoma)/i.test(diseaseText)) inferredSite = 'C53.9';
  else if (/ovarian|ovary/i.test(diseaseText) && /carcinoma|adenocarcinoma|malignan|neoplasm/i.test(diseaseText)) inferredSite = 'C56.9';
  else if (/myeloma|plasma\s+cell\s+neoplasm/i.test(diseaseText)) inferredSite = 'C42.1';
  else if (/lymphoma/i.test(diseaseText) && /mediastin/i.test(diseaseText)) inferredSite = 'C77.1';
  else if (/lymphoma/i.test(diseaseText) && /cervical\s+(?:lymph|node)|neck\s+lymph/i.test(diseaseText)) inferredSite = 'C77.0';
  else if (/lymphoma/i.test(diseaseText) && /lymph\s+node/i.test(diseaseText)) inferredSite = 'C77.9';
  else if (/colorectal|colon\s+adenocarcinoma/i.test(diseaseText)) inferredSite = /sigmoid/i.test(diseaseText) ? 'C18.7' : 'C18.9';
  if (!explicitTopo && inferredSite) {
    const topography = ICDO_TOPOGRAPHY_LIST.find(item => item.startsWith(inferredSite));
    if (topography) addSuggestion(results, 'F32', topography, generalDiagnosis || lineFor(lines, new RegExp(inferredSite)), 'medium');
  }
  if (results.F32 && results.F32.value.startsWith('C')) {
    const code = results.F32.value.match(/C\d{2}\.\d/i)?.[0] || '';
    if (code) {
      const topoDescription = results.F32.value.replace(/^C\d{2}\.\d\s*-\s*/, '');
      addSuggestion(results, 'F31', topoDescription, results.F32.evidence, results.F32.confidence);
    }
  }
  if (lateralityWord && results.F32 && /C34\.|C50\.|C56\.|C64\./.test(results.F32.value)) {
    const laterality = lateralityWord[1].toLowerCase();
    const option = laterality === 'right' ? '1 - Right: origin of primary' : laterality === 'left' ? '2 - Left: origin of primary' : '4 - Bilateral involvement at dx, lateral origin unknown (single primary)';
    addSuggestion(results, 'F33', option, lineFor(lines, /right|left|bilateral/i) || generalDiagnosis, 'medium');
  }

  if (!results.F35) {
    const morphologyRules = [
      [/small[- ]cell\s+(?:neuroendocrine\s+)?carcinoma/i, 'M-8041/39 - Small cell carcinoma, NOS (undifferentiated)'],
      [/(?:invasive\s+)?ductal\s+carcinoma|invasive carcinoma of no special type/i, 'M-8500/32 - Infiltrating duct carcinoma, NOS (Grade 2)'],
      [/nodular\s+sclerosis.{0,45}hodgkin|hodgkin.{0,45}nodular\s+sclerosis/i, 'M-9663/36 - Hodgkin lymphoma, nodular sclerosis, NOS (B-cell)'],
      [/fibroadenoma/i, 'M-9010/09 - Fibroadenoma, NOS (Benign /0)'],
      [/endometrioid\s+adenocarcinoma/i, 'M-8380/31 - Endometrioid adenocarcinoma, NOS (well differentiated)'],
      [/plasma\s+cell\s+myeloma|multiple\s+myeloma/i, 'M-9732/36 - Plasma cell myeloma / Multiple myeloma'],
      [/acinar\s+adenocarcinoma\s+of\s+(?:the\s+)?prostate/i, 'M-8140/33 - Adenocarcinoma, NOS (poorly differentiated)']
    ];
    for (const [pattern, value] of morphologyRules) {
      if (pattern.test(diseaseText)) {
        let inferredMorphology = value;
        if (value.startsWith('M-8500/')) {
          const gradeDigit = diseaseText.match(/(?:nottingham\s+)?(?:histologic\s+)?grade\s*[:=\-]?\s*([1-4])\b/i)?.[1] || '9';
          inferredMorphology = `M-8500/3${gradeDigit} - Infiltrating duct carcinoma, NOS${gradeDigit === '9' ? ' (grade unknown)' : ` (Grade ${gradeDigit})`}`;
        }
        addSuggestion(results, 'F35', inferredMorphology, generalDiagnosis || lineFor(lines, pattern), 'medium');
        const behavior = inferredMorphology.includes('/0') ? '/0 - Benign (Non-reportable outside CNS per ISCR/STORE)' : '/3 - Malignant, primary site (Invasive)';
        addSuggestion(results, 'F36', behavior, generalDiagnosis, 'medium');
        break;
      }
    }
  }

  const gradeLine = lineFor(lines, /(?:nottingham\s+)?(?:histologic\s+)?grade\s*(?:[:=\-]|\b)(?:[1-4]|I{1,3}|IV)\b/i);
  const gradeMatch = gradeLine.match(/grade\s*(?:[:=\-]\s*)?(1|2|3|4|I{1,3}|IV)\b/i);
  if (gradeMatch) {
    const rawGrade = gradeMatch[1].toUpperCase();
    const grade = /^IV$/.test(rawGrade) ? 4 : /^III$/.test(rawGrade) ? 3 : /^II$/.test(rawGrade) ? 2 : /^I$/.test(rawGrade) ? 1 : Number(rawGrade);
    const options = ['1 - Grade I: Well differentiated','2 - Grade II: Moderately differentiated','3 - Grade III: Poorly differentiated','4 - Grade IV: Undifferentiated / Anaplastic'];
    addSuggestion(results, 'F37', options[grade - 1], gradeLine);
  }

  const clinicalTnm = findTnm(normalized, 'clinical');
  if (clinicalTnm) addSuggestion(results, 'F38', clinicalTnm, lineFor(lines, /\bcT/i) || clinicalTnm);
  const pathTnm = findTnm(normalized, 'pathologic');
  if (pathTnm) addSuggestion(results, 'F40', pathTnm, lineFor(lines, /\b(?:p|yp)T/i) || pathTnm);
  const clinicalStageLine = lineFor(lines, /(?:clinical\s+stage|AJCC(?:\s+clinical)?\s+stage|stage\s+group)\s*[:=\-]\s*(?:stage\s*)?(?:0|I{1,3}|IV|[1-4])(?:A|B|C|[1-4])?\b/i) || lineFor(lines, /^stage\s*[:=\-]\s*(?:stage\s*)?(?:0|I{1,3}|IV|[1-4])(?:A|B|C|[1-4])?\b/i);
  const stageText = clinicalStageLine.match(/\b(?:stage\s*)?(0|I{1,3}|IV|[1-4])(?:A|B|C|[1-4])?\b/i)?.[0];
  if (stageText) {
    const roman = stageText.replace(/^stage\s*/i, '').toUpperCase();
    const stageMap = { '0':'Stage 0','I':'Stage I','IA':'Stage IA','IB':'Stage IB','II':'Stage II','IIA':'Stage IIA','IIB':'Stage IIB','IIC':'Stage IIC','III':'Stage III','IIIA':'Stage IIIA','IIIB':'Stage IIIB','IIIC':'Stage IIIC','IV':'Stage IV','IVA':'Stage IVA','IVB':'Stage IVB','IVC':'Stage IVC' };
    if (stageMap[roman]) addSuggestion(results, 'F39', optionStarts(['Stage 0','Stage I','Stage IA','Stage IA1','Stage IA2','Stage IB','Stage II','Stage IIA','Stage IIB','Stage IIC','Stage III','Stage IIIA','Stage IIIB','Stage IIIC','Stage IV','Stage IVA','Stage IVB','Stage IVC'], stageMap[roman]), clinicalStageLine);
  }
  const lymphomaStageLine = lineFor(lines, /(?:ann\s+arbor|lugano)(?:\s+stage)?\s*[:=\-]?\s*(?:stage\s*)?(?:I{1,3}|IV)(?:E|S|A|B|X|BX)?/i);
  if (lymphomaStageLine) {
    const value = lymphomaStageLine.match(/(?:stage\s*)?(I{1,3}|IV)(?:E|S|A|B|X|BX)?/i)?.[0]?.replace(/^stage\s*/i, '').toUpperCase();
    if (value) {
      const label = `Stage ${value}`;
      addSuggestion(results, 'F42', label, lymphomaStageLine, 'medium');
    }
  }
  const bSymptoms = lineFor(lines, /B\s+symptoms?\s*[:=\-]/i);
  if (bSymptoms) {
    const present = /present|positive|yes|fever|night sweats|weight loss/i.test(bSymptoms) && !/absent|negative|no\s+B/i.test(bSymptoms);
    addSuggestion(results, 'F43', present ? '1 - Present (B: Fever >38°C, drenching night sweats, and/or >10% wt loss)' : '0 - Absent (A: No unexplained fever, night sweats, or >10% wt loss)', bSymptoms);
  }
  const rissLine = lineFor(lines, /(?:R-?ISS|revised\s+international\s+staging)\s*(?:stage)?\s*[:=\-]?\s*(?:stage\s*)?[I1-3]{1,3}/i);
  if (rissLine) {
    const stage = rissLine.match(/\b(?:R-?ISS\s*)?(?:stage\s*)?(I{1,3}|[1-3])\b/i)?.[1];
    if (stage) addSuggestion(results, 'F44', `R-ISS Stage ${stage.toUpperCase() === '1' ? 'I' : stage.toUpperCase() === '2' ? 'II' : stage.toUpperCase() === '3' ? 'III' : stage.toUpperCase()}`, rissLine);
  }
  const figoLine = lineFor(lines, /FIGO\s*(?:stage)?\s*[:=\-]?\s*(?:stage\s*)?(?:0|I{1,3}|IV)(?:A|B|C)?\b/i);
  if (figoLine) {
    const figo = figoLine.match(/FIGO\s*(?:stage)?\s*[:=\-]?\s*(?:stage\s*)?(0|I{1,3}|IV)(?:A|B|C)?\b/i)?.[0]?.replace(/^FIGO\s*(?:stage)?\s*[:=\-]?\s*/i, '').replace(/^stage\s*/i, '').toUpperCase();
    if (figo) addSuggestion(results, 'F45', `FIGO ${figo}`, figoLine);
  }
  const summaryStageLine = lineFor(lines, /(?:SEER\s+)?summary\s+stage\s*[:=\-]/i);
  if (summaryStageLine) {
    const rawStage = summaryStageLine.match(/(?:SEER\s+)?summary\s+stage\s*[:=\-]\s*(\d|in\s+situ|localized|regional|distant|unknown)/i)?.[1]?.toLowerCase();
    const stageMap = {
      '0': '0 -', 'in situ': '0 -', '1': '1 -', localized: '1 -', '2': '2 -', '3': '3 -', '4': '4 -', '7': '7 -', distant: '7 -', '8': '8 -', '9': '9 -', unknown: '9 -'
    };
    if (rawStage && stageMap[rawStage] && schemaOption('F46', stageMap[rawStage])) addSuggestion(results, 'F46', schemaOption('F46', stageMap[rawStage]), summaryStageLine, /^\d$/.test(rawStage) ? 'high' : 'medium');
  }
  const behaviorLine = lineFor(lines, /(?:ICD[- ]?O\s+)?behavior(?:\s+code)?\s*[:=\-]\s*\/[01236]/i);
  if (behaviorLine) {
    const code = behaviorLine.match(/\/(0|1|2|3|6)\b/)?.[1];
    const label = code === '0' ? '/0 - Benign (Non-reportable outside CNS per ISCR/STORE)' : code === '1' ? '/1 - Uncertain whether benign or malignant (Borderline)' : code === '2' ? '/2 - Carcinoma in situ / Non-invasive' : code === '3' ? '/3 - Malignant, primary site (Invasive)' : code === '6' ? '/6 - Malignant, metastatic site' : '';
    if (label) addSuggestion(results, 'F36', label, behaviorLine);
  }

  // Dates and treatments: copy only explicitly documented details. Never infer a regimen.
  const incidenceDate = findDateNear(lines, 'date\\s+of\\s+diagnosis|date\\s+of\\s+incidence|diagnosed\\s+on|biopsy\\s+(?:date|on)');
  if (incidenceDate) addSuggestion(results, 'F26', incidenceDate.value, incidenceDate.evidence, 'medium');
  const firstContact = findDateNear(lines, 'first\\s+contact|admission\\s+date|date\\s+of\\s+admission');
  if (firstContact) addSuggestion(results, 'F25', firstContact.value, firstContact.evidence);
  const treatmentDate = findDateNear(lines, 'treatment\\s+(?:started|start\\s+date|initiated)|therapy\\s+(?:started|initiated)|first\\s+course');
  if (treatmentDate) addSuggestion(results, 'F47', treatmentDate.value, treatmentDate.evidence, 'medium');
  const therapyLine = lineFor(lines, /(?:chemotherapy|systemic\s+therapy|regimen)\s*[:=\-]/i);
  if (therapyLine) addSuggestion(results, 'F50', therapyLine.replace(/^.*?(?:chemotherapy|systemic\s+therapy|regimen)\s*[:=\-]\s*/i, '').slice(0, 220), therapyLine, 'medium');
  const radiationLine = lineFor(lines, /(?:radiation|radiotherapy|radiotherapy|IMRT|EBRT)\s*[:=\-]/i);
  if (radiationLine) addSuggestion(results, 'F51', radiationLine.replace(/^.*?(?:radiation|radiotherapy|IMRT|EBRT)\s*[:=\-]\s*/i, '').slice(0, 220), radiationLine, 'medium');
  const surgeryLine = lineFor(lines, /(?:surgery|operation|resection|lumpectomy|mastectomy|prostatectomy|hysterectomy)\s*[:=\-]/i);
  if (surgeryLine) addSuggestion(results, 'F49', surgeryLine.slice(0, 220), surgeryLine, 'medium');
  const hormoneLine = lineFor(lines, /(?:hormone|endocrine|letrozole|tamoxifen|leuprolide|ADT)\s*[:=\-]/i);
  if (hormoneLine) addSuggestion(results, 'F52', hormoneLine.slice(0, 220), hormoneLine, 'medium');
  const immunotherapyLine = lineFor(lines, /(?:immunotherapy|biologic|pembrolizumab|nivolumab|durvalumab|trastuzumab|rituximab)\s*[:=\-]/i);
  if (immunotherapyLine) addSuggestion(results, 'F53', immunotherapyLine.slice(0, 220), immunotherapyLine, 'medium');
  const intentLine = lineFor(lines, /(?:treatment\s+)?intent\s*[:=\-]\s*(?:curative|palliative)/i);
  if (intentLine) addSuggestion(results, 'F48', /palliative/i.test(intentLine) ? '2 - Palliative / Disease & Symptom Control' : '1 - Curative / Definitive', intentLine);

  const vitalLine = lineFor(lines, /(?:vital\s+status|patient\s+status|status\s+at\s+last\s+follow[- ]?up)\s*[:=\-]/i);
  if (vitalLine) {
    const status = /dead|deceased|expired/i.test(vitalLine) ? '2 - Dead' : /alive|living/i.test(vitalLine) ? '1 - Alive' : '';
    if (status) addSuggestion(results, 'F54', status, vitalLine);
  }
  const deathDate = findDateNear(lines, 'date\\s+of\\s+death|died\\s+on|death\\s+date');
  if (deathDate) {
    addSuggestion(results, 'F56', deathDate.value, deathDate.evidence);
    if (!results.F54) addSuggestion(results, 'F54', '2 - Dead', deathDate.evidence, 'medium');
  }
  const causeDeath = captureLabel(lines, 'cause\\s+of\\s+death|underlying\\s+cause\\s+of\\s+death');
  if (causeDeath) addSuggestion(results, 'F57', causeDeath, lineFor(lines, /cause\s+of\s+death|underlying\s+cause\s+of\s+death/i));
  const deathPlaceLine = lineFor(lines, /place\s+of\s+death\s*[:=\-]/i);
  if (deathPlaceLine) {
    const place = deathPlaceLine.replace(/^.*?place\s+of\s+death\s*[:=\-]\s*/i, '');
    const placeCode = /hospital|ICU|inpatient/i.test(place) ? '1 -' : /home|residence/i.test(place) ? '2 -' : /hospice/i.test(place) ? '3 -' : /nursing|care facility/i.test(place) ? '4 -' : '';
    if (placeCode) addSuggestion(results, 'F58', schemaOption('F58', placeCode), deathPlaceLine, 'medium');
  }
  const lastContact = findDateNear(lines, 'date\\s+of\\s+last\\s+contact|last\\s+follow[- ]?up|follow[- ]?up\\s+date');
  if (lastContact) addSuggestion(results, 'F55', lastContact.value, lastContact.evidence);
  const followupLine = lineFor(lines, /(?:follow[- ]?up\s*[:=\-].*(?:oncology\s+)?clinic|oncology\s+clinic\s+visit)/i);
  if (followupLine) addSuggestion(results, 'F59', '1 - Active Oncology Outpatient Clinic Visit', followupLine, 'medium');

  const summaryLines = [];
  for (const pattern of [/^(?:final\s+)?(?:pathologic(?:al)?\s+)?diagnos(?:is)?\s*[:：=\-]/i, /^(?:histopathology|pathology(?:\s+report)?|biopsy)\s*[:：=\-]/i, /^(?:imaging|CT|MRI|PET(?:-CT)?|mammogram|ultrasound)\s*[:：=\-]/i, /^(?:clinical\s+)?stage\s*[:：=\-]/i, /^(?:treatment|chemotherapy|radiotherapy|surgery|regimen)\s*[:：=\-]/i]) {
    const line = lineFor(lines, pattern);
    if (line && !summaryLines.includes(line)) summaryLines.push(line);
  }
  if (!summaryLines.length) {
    const informative = lines.filter(line => !/(?:laboratory|lab\s+(?:name|report)|accession\s+no|basis\s+of\s+diagnosis)/i.test(line) && /diagnos|patholog|biopsy|tumou?r|carcinoma|lymphoma|myeloma|stage|treatment|therapy|imaging|metasta/i.test(line));
    summaryLines.push(...informative.slice(0, 5));
  }
  if (summaryLines.length) {
    const summary = `Source-grounded extraction for registrar review (not an independently generated clinical opinion): ${summaryLines.join(' | ').slice(0, 1600)}`;
    addSuggestion(results, 'F60', summary, summaryLines.join(' | '), 'medium');
  }
  return results;
}
