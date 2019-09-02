/* eslint-disable padded-blocks */
/* eslint-disable func-names */
/* eslint-env mocha */
import { assert } from 'chai';

import {
  compileJSONSchema,
  getJSONSchema,
  registerDefaultFormatCompilers,
} from '../src/json';

registerDefaultFormatCompilers();

// https://json-schema.org/understanding-json-schema/reference/numeric.html

describe('Schema Numeric Type', function () {

  describe('#numeric()', function () {
    it('should validate numbers', function () {
      compileJSONSchema('numberBasic1', { type: 'number' });

      const root = getJSONSchema('numberBasic1');
      assert.isTrue(root.validate(42), 'validates an integer');
      assert.isTrue(root.validate(-1), 'validates a negative integer');
      assert.isTrue(root.validate(Math.PI), 'validates a number');
      assert.isTrue(root.validate(2.99792458e8), 'validates a float literal');
      assert.isFalse(root.validate('42'), 'not validates a string');
    });

    it('should validate exclusiveMaximum', function () {
      assert.isTrue(compileJSONSchema('exclusiveMaximum1', {
        exclusiveMaximum: 3.0,
      }));

      const root = getJSONSchema('exclusiveMaximum1');
      assert.isTrue(root.validate(2.2), 'below the exclusiveMaximum is valid');
      assert.isFalse(root.validate(3.0), 'boundary point is invalid');
      assert.isFalse(root.validate(3.5), 'above the exclusiveMaximum is invalid');
      assert.isTrue(root.validate('x'), 'ignores non-numbers');
    });

    it('should validate exclusiveMinimum', function () {
      assert.isTrue(compileJSONSchema('exclusiveMinimum1', {
        exclusiveMinimum: 1.1,
      }));

      const root = getJSONSchema('exclusiveMinimum1');
      assert.isTrue(root.validate(1.2), 'above the exclusiveMinimum is valid');
      assert.isFalse(root.validate(1.1), 'boundary point is invalid');
      assert.isFalse(root.validate(0.6), 'below the exclusiveMinimum is invalid');
      assert.isTrue(root.validate('x'), 'ignores non-numbers');
    });

    it('should validate number maximum', function () {
      assert.isTrue(compileJSONSchema('numberMaximum1', {
        maximum: 3.0,
      }));

      const root = getJSONSchema('numberMaximum1');
      assert.isTrue(root.validate(2.6), 'below the maximum is valid');
      assert.isTrue(root.validate(3.0), 'boundary point is valid');
      assert.isFalse(root.validate(3.5), 'above the maximum is invalid');
      assert.isTrue(root.validate('x'), 'ignores non-numbers');
    });

    it('should validate number minimum', function () {
      assert.isTrue(compileJSONSchema('numberMinimum1', {
        minimum: 1.1,
      }));

      const root = getJSONSchema('numberMinimum1');
      assert.isTrue(root.validate(1.2), 'above the minimum is valid');
      assert.isTrue(root.validate(1.1), 'boundary point is valid');
      assert.isFalse(root.validate(0.6), 'below the minimum is invalid');
      assert.isTrue(root.validate('x'), 'ignores non-numbers');
    });

    it('should validate multipleOf numbers', function () {
      compileJSONSchema('numberMulOf1', { multipleOf: 1.5 });

      const root = getJSONSchema('numberMulOf1');
      assert.isTrue(root.validate(0), 'zero is multipleOf everything');
      assert.isTrue(root.validate(4.5), 'four point five is a multipleOf one point five');
      assert.isTrue(root.validate(30), 'tortyfive is a not a multipleOf one point five');
      assert.isTrue(root.validate('42'), 'ignores a string');
    });

  });

  describe('#integer()', function () {
    it('should validate integers', function () {
      compileJSONSchema('integerBasic1', { type: 'integer' });

      const root = getJSONSchema('integerBasic1');
      assert.isTrue(root.validate(42), 'validates an integer');
      assert.isTrue(root.validate(-1), 'validates a negative integer');
      assert.isFalse(root.validate(Math.PI), 'not validates a float');
      assert.isFalse(root.validate('42'), 'not validates a string');
      assert.isFalse(root.validate({}), 'does not validate an object');
      assert.isFalse(root.validate([]), 'does not validate an array');
    });

    it('should validate minimum with signed integer', function () {
      assert.isTrue(compileJSONSchema('integerMinimum1', {
        minimum: -2,
      }));

      const root = getJSONSchema('integerMinimum1');
      assert.isTrue(root.validate(-1), 'negative above the minimum is valid');
      assert.isTrue(root.validate(0), 'positive above the minimum is valid');
      assert.isTrue(root.validate(-2), 'boundary point is valid');
      assert.isFalse(root.validate(-3), 'below the minimum is invalid');
      assert.isTrue(root.validate('x'), 'ignores non-numbers');
    });

    it('should validate multipleOf integers', function () {
      compileJSONSchema('integerMulOf1', { multipleOf: 2 });

      const root = getJSONSchema('integerMulOf1');
      assert.isTrue(root.validate(10), 'ten is multipleOf 2');
      assert.isFalse(root.validate(7), 'seven is not a multipleOf 2');
      assert.isTrue(root.validate('42'), 'ignores a string');
    });

  });

  describe('#bigint()', function () {
    it('should validate bigint type', function () {
      compileJSONSchema('bigintBasic1', { type: 'bigint' });

      const root = getJSONSchema('bigintBasic1');
      assert.isTrue(root.validate(BigInt(42)), 'validates a big integer');
      assert.isTrue(root.validate(BigInt(-1)), 'validates a negative big integer');
      assert.isFalse(root.validate(42), 'not validates an integer');
      assert.isFalse(root.validate(-1), 'not validates a negative integer');
      assert.isFalse(root.validate(Math.PI), 'validates a number');
      assert.isFalse(root.validate('42'), 'not validates a string');
    });

    it('should validate bigint exclusiveMaximum', function () {
      assert.isTrue(compileJSONSchema('bigintExclusiveMaximum1', {
        exclusiveMaximum: BigInt(42),
      }));

      const root = getJSONSchema('bigintExclusiveMaximum1');
      assert.isTrue(root.validate(BigInt(32)), 'below the exclusiveMaximum is valid');
      assert.isFalse(root.validate(BigInt(42)), 'boundary point is invalid');
      assert.isFalse(root.validate(BigInt(52)), 'above the exclusiveMaximum is invalid');
      assert.isTrue(root.validate('x'), 'ignores non-numbers');
    });

    it('should validate bigint exclusiveMinimum', function () {
      assert.isTrue(compileJSONSchema('bigintExclusiveMinimum1', {
        exclusiveMinimum: BigInt(16),
      }));

      const root = getJSONSchema('bigintExclusiveMinimum1');
      assert.isTrue(root.validate(BigInt(21)), 'above the exclusiveMinimum is valid');
      assert.isFalse(root.validate(BigInt(16)), 'boundary point is invalid');
      assert.isFalse(root.validate(BigInt(10)), 'below the exclusiveMinimum is invalid');
      assert.isTrue(root.validate('x'), 'ignores non-numbers');
    });

    it('should validate bigint maximum', function () {
      assert.isTrue(compileJSONSchema('bigintMaximum1', {
        maximum: BigInt(42),
      }));

      const root = getJSONSchema('bigintMaximum1');
      assert.isTrue(root.validate(BigInt(32)), 'below the maximum is valid');
      assert.isTrue(root.validate(BigInt(42)), 'boundary point is valid');
      assert.isFalse(root.validate(BigInt(52)), 'above the maximum is invalid');
      assert.isTrue(root.validate('x'), 'ignores non-numbers');
    });

    it('should validate bigint minimum', function () {
      assert.isTrue(compileJSONSchema('bigintMinimum1', {
        minimum: BigInt(16),
      }));

      const root = getJSONSchema('bigintMinimum1');
      assert.isTrue(root.validate(BigInt(21)), 'above the minimum is valid');
      assert.isTrue(root.validate(BigInt(16)), 'boundary point is valid');
      assert.isFalse(root.validate(BigInt(10)), 'below the minimum is invalid');
      assert.isTrue(root.validate('x'), 'ignores non-numbers');
    });

    it('should validate multipleOf bigint', function () {
      compileJSONSchema('bigintMulOf1', { multipleOf: BigInt(2) });

      const root = getJSONSchema('bigintMulOf1');
      assert.isTrue(root.validate(BigInt(10)), 'ten is multipleOf 2');
      assert.isFalse(root.validate(BigInt(7)), 'seven is not a multipleOf 2');
      assert.isTrue(root.validate('42'), 'ignores a string');
    });

  });

});
