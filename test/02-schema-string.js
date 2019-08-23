/* eslint-disable padded-blocks */
/* eslint-disable func-names */
/* eslint-env mocha */
import { expect, assert } from 'chai';

import {
  compileJSONSchema,
  getJSONSchema,
  registerDefaultFormatCompilers,
} from '../src/json';

registerDefaultFormatCompilers();

// https://json-schema.org/understanding-json-schema/reference/string.html

describe('#strings()', function () {
  it('should validate strings only', function () {
    compileJSONSchema('stringBasic1', { type: 'string' });

    const root = getJSONSchema('stringBasic1');
    assert.isTrue(root.validate('Déjà vu'), 'validates a string with accents');
    assert.isTrue(root.validate(''), 'validates an empty string');
    assert.isFalse(root.validate(null), 'not validates null');
    assert.isFalse(root.validate(42), 'not validates a number');
  });

  it('should validate strings by length', function () {
    compileJSONSchema('stringLength1', {
      type: 'string',
      minLength: 2,
      maxLength: 3,
    });

    const root = getJSONSchema('stringLength1');
    assert.isFalse(root.validate('A'), 'A string is too small');
    assert.isTrue(root.validate('AB'), 'AB string has valid length');
    assert.isTrue(root.validate('ABC'), 'ABC string has valid length');
    assert.isFalse(root.validate('ABCD'), 'ABCD is to long');
  });

  it('should validate strings by pattern', function () {
    compileJSONSchema('stringPattern1', {
      type: 'string',
      pattern: '^(\\([0-9]{3}\\))?[0-9]{3}-[0-9]{4}$',
    });

    const root = getJSONSchema('stringPattern1');
    assert.isTrue(root.validate('555-1212'), '555-1212 is a local phonenumber');
    assert.isTrue(root.validate('(888)555-1212'), 'is valid phonenumber with area code');
    assert.isFalse(root.validate('(888)555-1212 ext. 532'), 'is not valid phonenumber with extension');
    assert.isFalse(root.validate('(800)FLOWERS'), 'is not valid phonenumber by letters');
  });
});
