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
    it('should validate a RFC3339 date-time format', function () {
      compileJSONSchema('fdatetime1', { format: 'date-time' });

      const root = getJSONSchema('fdatetime1');
      assert.isTrue(root.validate(undefined), 'undefined is true');
      assert.isTrue(root.validate(null), 'null is true');
      assert.isTrue(root.validate('1963-06-19T08:30:06.283185Z'), 'a valid date-time string');
      assert.isTrue(root.validate('1963-06-19T08:30:06Z'), 'a valid date-time string without second fraction');
      assert.isTrue(root.validate('1937-01-01T12:00:27.87+00:20'), 'a valid date-time string with plus offset');
      assert.isTrue(root.validate('1990-12-31T15:59:50.123-08:00'), 'a valid date-time string with minus offset');
      assert.isFalse(root.validate('1990-02-31T15:59:60.123-08:00'), 'an invalid day in date-time string');
      assert.isFalse(root.validate('1990-12-31T15:59:60-24:00'), 'an invalid offset in date-time string');
      assert.isFalse(root.validate('06/19/1963 08:30:06 PST'), 'an invalid date-time string');
      // assert.isTrue(root.validate('06/19/1963 08:30:06 PST'), 'a local date-time string');
      assert.isTrue(root.validate('1963-06-19t08:30:06.283185z'), 'case-insensitive T and Z');
      assert.isFalse(root.validate('2013-350T01:01:01'), 'only RFC3339 not all of ISO 8601 are valid');
    });
    it('should validate a RFC3339 date string', function () {
      compileJSONSchema('fdate1', { format: 'date' });

      const root = getJSONSchema('fdate1');
      assert.isTrue(root.validate(undefined), 'undefined is true');
      assert.isTrue(root.validate(null), 'null is true');
      assert.isTrue(root.validate('1963-06-19'), 'a valid date string');
      assert.isFalse(root.validate('06/19/1963'), 'a different valid date string');
      // assert.isFalse(root.validate('06/19/1963'), 'an invalid date string');
      assert.isFalse(root.validate('2013-350'), 'only RFC3339 not all of ISO 8601 are valid');
    });
    it('should validate a RFC3339 time string', function () {
      compileJSONSchema('ftime1', { format: 'time' });

      const root = getJSONSchema('ftime1');
      assert.isTrue(root.validate(undefined), 'undefined is true');
      assert.isTrue(root.validate(null), 'null is true');
      assert.isTrue(root.validate('08:30:06Z'), 'a valid time string');
      assert.isTrue(root.validate('08:30:06.283185Z'), 'a valid time string with milliseconds');
      assert.isTrue(root.validate('08:30:06+01:00'), 'a valid time string with plus offset');
      assert.isTrue(root.validate('08:30:06.123+01:00'), 'a valid time string with millseconds and plus offset');
      assert.isTrue(root.validate('08:30:06-01:00'), 'a valid time string with min offset');
      assert.isFalse(root.validate('08:30:06'), 'an invalid time string without Z');
      assert.isFalse(root.validate('08:30:06 PST'), 'an invalid time string');
      assert.isFalse(root.validate('01:01:01,1111'), 'only RFC3339 not all of ISO 8601 are valid');
    });
    it('should validate an email address', function () {
      compileJSONSchema('femail1', { format: 'email' });
      const root = getJSONSchema('femail1');
      assert.isTrue(root.validate(undefined), 'undefined is true');
      assert.isTrue(root.validate(null), 'null is true');
      assert.isTrue(root.validate('john.doe@example.com'), 'a valid email address');
      assert.isFalse(root.validate('2962'), 'an invalid email address');
    });
    it('should validate a hostname', function () {
      compileJSONSchema('fhostname1', { format: 'hostname' });
      const root = getJSONSchema('fhostname1');
      assert.isTrue(root.validate(undefined), 'undefined is true');
      assert.isTrue(root.validate(null), 'null is true');
      assert.isTrue(root.validate('www.example.com'), 'a valid hostname');
      assert.isTrue(root.validate('xn--4gbwdl.xn--wgbh1c'), 'a valid punycoded IDN hostname');
      assert.isFalse(root.validate('-a-host-name-that-starts-with--'), 'a host name starting with an illegal character');
      assert.isFalse(root.validate('not_a_valid_host_name'), 'a host name containing illegal characters');
      assert.isFalse(root.validate('a-vvvvvvvvvvvvvvvveeeeeeeeeeeeeeeerrrrrrrrrrrrrrrryyyyyyyyyyyyyyyy-long-host-name-component'), 'a host name with a component too long');
    });
    it('should validate an idn-email address', function () {
      compileJSONSchema('femail2', { format: 'idn-email' });
      const root = getJSONSchema('femail2');
      assert.isTrue(root.validate(undefined), 'undefined is true');
      assert.isTrue(root.validate(null), 'null is true');
      assert.isTrue(root.validate('실례@실례.테스트'), 'a valid idn e-mail (example@example.test in Hangul)');
      assert.isFalse(root.validate('2962'), 'an invalid idn e-mail address');
    });
    it('should validate internationalized hostnames', function () {
      compileJSONSchema('fhostname2', { format: 'idn-hostname' });
      const root = getJSONSchema('fhostname2');
      assert.isTrue(root.validate(undefined), 'undefined is true');
      assert.isTrue(root.validate(null), 'null is true');
      assert.isTrue(root.validate('실례.테스트'), 'a valid host name (example.test in Hangul)');
      assert.isFalse(root.validate('〮실례.테스트'), 'illegal first char U+302E Hangul single dot tone mark');
      assert.isFalse(root.validate('실〮례.테스트'), 'contains illegal char U+302E Hangul single dot tone mark');
      assert.isFalse(root.validate('실실실실실실실실실실실실실실실실실실실실실실실실실실실실실실실실실실실실실실실실실실실실실실실실실실실실례례테스트례례례례례례례례례례례례례례례례례테스트례례례례례례례례례례례례례례례례례례례테스트례례례례례례례례례례례례테스트례례실례.테스트'), 'a host name with a component too long');
    });
    it('should validate an ipv4 address', function () {
      compileJSONSchema('fipv41', { format: 'ipv4' });
      const root = getJSONSchema('fipv41');
      assert.isTrue(root.validate(undefined), 'undefined is true');
      assert.isTrue(root.validate(null), 'null is true');
      assert.isTrue(root.validate('192.168.0.1'), 'a valid IP address');
      assert.isFalse(root.validate('127.0.0.0.1'), 'an IP address with too many components');
      assert.isFalse(root.validate('256.256.256.256'), 'an IP address with out-of-range values');
      assert.isFalse(root.validate('127.0'), 'an IP address without 4 components');
      assert.isFalse(root.validate('0x7f000001'), 'an IP address as an integer');
    });
    it('should validate an ipv6 address', function () {
      compileJSONSchema('fipv61', { format: 'ipv6' });
      const root = getJSONSchema('fipv61');
      assert.isTrue(root.validate(undefined), 'undefined is true');
      assert.isTrue(root.validate(null), 'null is true');
      assert.isTrue(root.validate('::1'), 'a valid IPv6 address');
      assert.isFalse(root.validate('12345::'), 'an IPv6 address with out-of-range values');
      assert.isFalse(root.validate('1:1:1:1:1:1:1:1:1:1:1:1:1:1:1:1'), 'an IPv6 address with too many components');
      assert.isFalse(root.validate('::laptop'), 'an IPv6 address containing illegal characters');
    });

  });
});
