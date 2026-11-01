import test from 'node:test';
import assert from 'node:assert/strict';
import { SCHEMA_FIELDS, SECTIONS, BUILTIN_REFERENCE_MANUALS } from '../src/schema.js';
import { DEMO_CASES } from '../src/cases.js';

test('the abstract contains exactly five administrative and sixty numbered fields', () => {
  assert.equal(SCHEMA_FIELDS.length, 65);
  assert.equal(SCHEMA_FIELDS.filter(field => field.isHeader).length, 5);
  assert.deepEqual(SCHEMA_FIELDS.filter(field => !field.isHeader).map(field => field.code), Array.from({ length: 60 }, (_, index) => String(index + 1).padStart(2, '0')));
  assert.equal(SECTIONS.length, 8);
});

test('all field ids are unique and assigned to a known section', () => {
  const ids = SCHEMA_FIELDS.map(field => field.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const field of SCHEMA_FIELDS) {
    assert.ok(SECTIONS.some(section => section.id === field.section), `${field.id} has a known section`);
    if (field.type === 'select') assert.ok(Array.isArray(field.options) && field.options.length > 0, `${field.id} select has options`);
  }
});

test('each synthetic case is fully prefilled and includes source/evidence context', () => {
  assert.ok(DEMO_CASES.length >= 4);
  for (const demo of DEMO_CASES) {
    for (const field of SCHEMA_FIELDS) assert.ok(String(demo.values[field.id] ?? '').trim(), `${demo.id} is populated for ${field.id}`);
    assert.ok(demo.recordText.includes('SYNTHETIC') || demo.recordText.includes('Synthetic'));
    assert.ok(Object.keys(demo.remarks).length > 0);
  }
});

test('reference summaries are present for core registry standards', () => {
  for (const id of ['ref-iscr', 'ref-store', 'ref-icdo', 'ref-iarc']) {
    const reference = BUILTIN_REFERENCE_MANUALS.find(manual => manual.id === id);
    assert.ok(reference, `reference ${id} exists`);
    assert.ok(reference.rules.length > 0);
    assert.ok(reference.rules.every(rule => rule.title && rule.body));
  }
});
