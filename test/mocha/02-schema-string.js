/* eslint-disable padded-blocks */
/* eslint-disable func-names */
/* eslint-env mocha */
import { assert } from 'chai';

import {
  compileJSONSchema,
  getJSONSchema,
  registerDefaultFormatCompilers,
} from '../../src/json';

registerDefaultFormatCompilers();

// https://json-schema.org/understanding-json-schema/reference/string.html

describe('Schema String Type', function () {

  describe('#stringBasic()', function () {
    it('should validate string types only', function () {
      compileJSONSchema('stringBasic1', { type: 'string' });

      const root = getJSONSchema('stringBasic1');
      assert.isFalse(root.validate(null), 'not validates null');
      assert.isTrue(root.validate('Déjà vu'), 'validates a string with accents');
      assert.isTrue(root.validate(''), 'validates an empty string');
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

  describe('#stringFormat()', function () {
    it('should validate a date-time format', function () {
      compileJSONSchema('fstring1', { format: 'date-time' });

      const root = getJSONSchema('fstring1');
      assert.isTrue(root.validate('1963-06-19T08:30:06.283185Z'), 'a valid date-time string');
      assert.isTrue(root.validate('1963-06-19T08:30:06Z'), 'a valid date-time string without second fraction');
      assert.isTrue(root.validate('1937-01-01T12:00:27.87+00:20'), 'a valid date-time string with plus offset');
      assert.isTrue(root.validate('1990-12-31T15:59:50.123-08:00'), 'a valid date-time string with minus offset');
      assert.isFalse(root.validate('1990-02-31T15:59:60.123-08:00'), 'an invalid day in date-time string');
      assert.isFalse(root.validate('1990-12-31T15:59:60-24:00'), 'an invalid offset in date-time string');
      // assert.isFalse(root.validate('06/19/1963 08:30:06 PST'), 'an invalid date-time string');
      assert.isTrue(root.validate('06/19/1963 08:30:06 PST'), 'a local date-time string');
      assert.isTrue(root.validate('1963-06-19t08:30:06.283185z'), 'case-insensitive T and Z');
      assert.isFalse(root.validate('2013-350T01:01:01'), 'only RFC3339 not all of ISO 8601 are valid');
    });
  });
});
