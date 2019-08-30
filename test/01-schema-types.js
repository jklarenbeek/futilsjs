/* eslint-disable padded-blocks */
/* eslint-disable func-names */
/* eslint-env mocha */
import { assert } from 'chai';

import {
  compileJSONSchema,
  getJSONSchema,
  // registerDefaultFormatCompilers,
} from '../src/json';

// registerDefaultFormatCompilers();

// https://json-schema.org/understanding-json-schema/reference/type.html

describe('JSON Schema Types', function () {
  describe('#types()', function () {
    it('should validate number types', function () {
      compileJSONSchema('typesNumber1', { type: 'number' });

      const root = getJSONSchema('typesNumber1');
      assert.isTrue(root.validate(undefined), 'undefined is always true!');
      assert.isFalse(root.validate(null), 'null is not a number');
      assert.isTrue(root.validate(42), 'validates an integer');
      assert.isTrue(root.validate(Math.PI), 'validates a float');
      assert.isFalse(root.validate('42'), 'not validates a string');
      assert.isFalse(root.validate([]), 'not validates an empty array');
      assert.isFalse(root.validate({}), 'not validates an object');
    });

    it('should validate integer types', function () {
      compileJSONSchema('typesInteger1', { type: 'integer' });

      const root = getJSONSchema('typesInteger1');
      assert.isTrue(root.validate(undefined), 'undefined is always true!');
      assert.isFalse(root.validate(null), 'null is not an integer');
      assert.isTrue(root.validate(42), '42 is an integer');
      assert.isFalse(root.validate(Math.PI), 'PI is not an integer');
      assert.isFalse(root.validate('42'), 'a string is not valid');
      assert.isFalse(root.validate([]), 'not validates an empty array');
      assert.isFalse(root.validate({}), 'not validates an object');
    });

    it('should validate bigint types', function () {
      compileJSONSchema('typesBigInt1', { type: 'bigint' });

      const root = getJSONSchema('typesBigInt1');
      assert.isTrue(root.validate(undefined), 'undefined is always true!');
      assert.isFalse(root.validate(null), 'null is not an bigint');
      assert.isFalse(root.validate(42), '42 is not an bigint');
      assert.isTrue(root.validate(BigInt(42)), '42n is a bigint');
      assert.isFalse(root.validate(Math.PI), 'PI is not an bigint');
      assert.isFalse(root.validate('42'), 'a string is not valid');
      assert.isFalse(root.validate([]), 'not validates an empty array');
      assert.isFalse(root.validate({}), 'not validates an object');
    });

    it('should validate string types', function () {
      compileJSONSchema('typesString1', { type: 'string' });

      const root = getJSONSchema('typesString1');
      assert.isTrue(root.validate(undefined), 'undefined is always true!');
      assert.isFalse(root.validate(null), 'null is not a string');
      assert.isFalse(root.validate(42), 'integer is not a string');
      assert.isFalse(root.validate(Math.PI), 'PI is not a string');
      assert.isFalse(root.validate(BigInt(42)), 'bigint is not a string');
      assert.isTrue(root.validate('this is a string'), 'this is a valid string');
      assert.isFalse(root.validate(['this', 'is', 'an', 'array']), 'this array is not a string');
      assert.isFalse(root.validate({ keyword: 'value' }), 'this object is not a string');
    });

    it('should validate multi type string or number', function () {
      compileJSONSchema('typesArray1', { type: ['number', 'string'] });

      const root = getJSONSchema('typesArray1');
      assert.isTrue(root.validate(undefined), 'undefined is always true!');
      assert.isFalse(root.validate(null), 'null is not a number or string');
      assert.isTrue(root.validate(42), 'validates an integer');
      assert.isTrue(root.validate(Math.PI), 'validates a number');
      assert.isTrue(root.validate('Math.PI'), 'validates a string');
      assert.isFalse(root.validate([42, '42']), 'does not validate an array');
      assert.isFalse(root.validate({}), 'does not validate an object');
    });

    it('should validate an object type', function () {
      compileJSONSchema('objectBasic1', { type: 'object' });

      const testObj1 = {
        key: 'value',
        another_key: 'another_value',
      };

      const testObj2 = {
        Sun: 1.9891e30,
        Jupiter: 1.8986e27,
        Saturn: 5.6846e26,
        Neptune: 10.243e25,
        Uranus: 8.6810e25,
        Earth: 5.9736e24,
        Venus: 4.8685e24,
        Mars: 6.4185e23,
        Mercury: 3.3022e23,
        Moon: 7.349e22,
        Pluto: 1.25e22,
      };

      const root = getJSONSchema('objectBasic1');
      assert.isTrue(root.validate(undefined), 'undefined is always true!');
      assert.isFalse(root.validate(null), 'not validates null!');
      assert.isTrue(root.validate({}), 'validates an empty object literal');
      assert.isTrue(root.validate(testObj1), 'validates a simple object with strings');
      assert.isTrue(root.validate(testObj2), 'validates a simple object with numbers');
      assert.isFalse(root.validate(2.99792458e8), 'not validates a float literal');
      assert.isFalse(root.validate('Is Not Valid'), 'not validates a string');
      assert.isFalse(root.validate(['is', 'not', 'an', 'object']), 'not validates an array');

    });

    it('should validate array types', function () {
      compileJSONSchema('arrayType1', { type: 'array' });
      const root = getJSONSchema('arrayType1');
      assert.isTrue(root.validate(undefined), 'undefined is always true!');
      assert.isFalse(root.validate(null), 'not validates null!');
      assert.isTrue(root.validate([]), 'validates an empty array literal');
      assert.isTrue(root.validate([1, 2, 3, 4, 5]), 'validates array of integers');
      assert.isTrue(root.validate([1, '2', null, {}, 5]), 'validates array of integers');
      assert.isTrue(root.validate([3, 'different', { types: 'of values' }]), 'validates array of objects');
      assert.isFalse(root.validate({ Not: 'an array' }), 'not an array type');
      assert.isFalse(root.validate(2.99792458e8), 'not a number type');
      assert.isFalse(root.validate('This is not valid'), 'not a string type');
    });
  });

  describe('#required()', function () {

    it('should validate a required number', function () {
      compileJSONSchema('requiredNumber1', { type: 'number', required: true });

      const root = getJSONSchema('requiredNumber1');
      assert.isFalse(root.validate(undefined), 'undefined returns always false!');
      assert.isFalse(root.validate(null), 'null is not a number');
      assert.isTrue(root.validate(42), 'validates an integer');
      assert.isTrue(root.validate(Math.PI), 'validates a float');
      assert.isFalse(root.validate('42'), 'not validates a string');
      assert.isFalse(root.validate([]), 'not validates an empty array');
      assert.isFalse(root.validate({}), 'not validates an object');
    });

    it('should validate a required integer', function () {
      compileJSONSchema('requiredInteger1', { type: 'integer', required: true });

      const root = getJSONSchema('requiredInteger1');
      assert.isFalse(root.validate(undefined), 'undefined returns always false!');
      assert.isFalse(root.validate(null), 'null is not an integer');
      assert.isTrue(root.validate(42), '42 is an integer');
      assert.isFalse(root.validate(Math.PI), 'PI is not an integer');
      assert.isFalse(root.validate('42'), 'a string is not valid');
      assert.isFalse(root.validate([]), 'not validates an empty array');
      assert.isFalse(root.validate({}), 'not validates an object');
    });

    it('should validate a required bigint', function () {
      compileJSONSchema('requiredBigInt1', { type: 'bigint', required: true });

      const root = getJSONSchema('requiredBigInt1');
      assert.isFalse(root.validate(undefined), 'undefined returns always false!');
      assert.isFalse(root.validate(null), 'null is not an bigint');
      assert.isFalse(root.validate(42), '42 is not an bigint');
      assert.isTrue(root.validate(BigInt(42)), '42n is a bigint');
      assert.isFalse(root.validate(Math.PI), 'PI is not an bigint');
      assert.isFalse(root.validate('42'), 'a string is not valid');
      assert.isFalse(root.validate([]), 'not validates an empty array');
      assert.isFalse(root.validate({}), 'not validates an object');
    });

    it('should validate a required string', function () {
      compileJSONSchema('requiredString1', { type: 'string', required: true });

      const root = getJSONSchema('requiredString1');
      assert.isFalse(root.validate(undefined), 'undefined returns always false!');
      assert.isFalse(root.validate(null), 'null is not a string');
      assert.isFalse(root.validate(42), 'integer is not a string');
      assert.isFalse(root.validate(Math.PI), 'PI is not a string');
      assert.isFalse(root.validate(BigInt(42)), 'bigint is not a string');
      assert.isTrue(root.validate('this is a string'), 'this is a valid string');
      assert.isFalse(root.validate(['this', 'is', 'an', 'array']), 'this array is not a string');
      assert.isFalse(root.validate({ keyword: 'value' }), 'this object is not a string');
    });

  });

  describe('#nullable()', function () {
    it('should validate a simple null type', function () {
      assert.isTrue(compileJSONSchema('nullableType1', { type: 'null' }));
      const root = getJSONSchema('nullableType1');
      assert.isFalse(root.validate(0), 'zero is not null');
      assert.isFalse(root.validate(1), 'an integer is not null');
      assert.isFalse(root.validate(Math.PI), 'a float is not null');
      assert.isFalse(root.validate('foobar'), 'string is not null');
      assert.isFalse(root.validate(''), 'an empty string is not null');
      assert.isFalse(root.validate({}), 'an object is not null');
      assert.isFalse(root.validate([]), 'an array is not null');
      assert.isFalse(root.validate(true), 'boolean true is not null');
      assert.isFalse(root.validate(false), 'boolean false is not null');
      assert.isTrue(root.validate(null), 'null equals null');
    });

    it('should validate multi type string or number', function () {
      compileJSONSchema('nullableTypeArray1', { type: ['number', 'string', 'null'] });

      const root = getJSONSchema('nullableTypeArray1');
      assert.isTrue(root.validate(undefined), 'undefined is always true!');
      assert.isTrue(root.validate(null), 'null is not a number or string');
      assert.isTrue(root.validate(42), 'validates an integer');
      assert.isTrue(root.validate(Math.PI), 'validates a number');
      assert.isTrue(root.validate('Math.PI'), 'validates a string');
      assert.isFalse(root.validate([42, '42']), 'does not validate an array');
      assert.isFalse(root.validate({}), 'does not validate an object');
    });

  });

});
