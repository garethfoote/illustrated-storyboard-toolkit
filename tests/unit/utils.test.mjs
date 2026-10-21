import test from 'node:test';
import assert from 'node:assert/strict';
import {
  clamp, normalizeHexColour, getContrastColour,
  parseSvgDimension, formatAssetLabel, canonicalizeLabel,
} from '../../src/utils.mjs';

test('zoom and scale limits clamp values without changing in-range input', () => {
  assert.equal(clamp(-1, 0.05, 1.2), 0.05);
  assert.equal(clamp(5, 0.05, 1.2), 1.2);
  assert.equal(clamp(0.7, 0.05, 1.2), 0.7);
  assert.equal(clamp(100, 0.2, Infinity), 100);
});

test('custom colours accept only full hex colours and normalize case', () => {
  assert.equal(normalizeHexColour('#Aa00Ff'), '#aa00ff');
  for (const invalid of [null, undefined, 123, '#fff', 'red', '#zz0000', '#12345678']) {
    assert.equal(normalizeHexColour(invalid), null);
  }
  assert.equal(getContrastColour('#ffffff'), '#161616');
  assert.equal(getContrastColour('#000000'), '#ffffff');
});

test('SVG dimensions preserve rounding and missing-value fallbacks', () => {
  assert.equal(parseSvgDimension('123.1px'), 124);
  assert.equal(parseSvgDimension('42'), 42);
  assert.equal(parseSvgDimension('100%'), 100);
  assert.equal(parseSvgDimension('auto'), null);
  assert.equal(parseSvgDimension(null), null);
});

test('asset filenames and calibration aliases retain their normalization rules', () => {
  assert.equal(formatAssetLabel('plain_sweater.SVG'), 'Plain Sweater');
  assert.equal(formatAssetLabel('  speech-bubble_02.svg'), 'Speech Bubble 02');
  assert.equal(canonicalizeLabel('  Shirt__Collar--2  '), 'shirt collar 2');
  assert.equal(canonicalizeLabel('Shirt   Collar'), canonicalizeLabel('shirt_collar'));
});
