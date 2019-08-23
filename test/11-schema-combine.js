/* eslint-disable object-curly-newline */
/* eslint-disable padded-blocks */
/* eslint-disable func-names */
/* eslint-env mocha */
import { assert } from 'chai';

import {
  compileJSONSchema,
  getJSONSchema,
} from '../src/json';

// https://json-schema.org/understanding-json-schema/reference/combining.html

describe('Schema Combination', function () {
  describe('#allOf()', function () {
    it('should  be all or nothing string size', function () {
      compileJSONSchema('combineAllOf1', {
        allOf: [
          { type: 'string' },
          { maxLength: 5 },
        ],
      });

      const root = getJSONSchema('combineAllOf1');
      assert.isTrue(root.validate('short'), 'some short value');
      assert.isFalse(root.validate('too long'), 'something to long');
    });

    it('should be multiple types', function () {
      compileJSONSchema('combineAllOf2', {
        allOf: [
          { type: 'string' },
          { type: 'number' },
        ],
      });

      const root = getJSONSchema('combineAllOf2');
      assert.isFalse(root.validate('Yes Way'), 'a string will not validate');
      assert.isFalse(root.validate(42), 'a number will not validate');
      assert.isFalse(root.validate([]), 'an array will not validate');
      assert.isFalse(root.Validate({}), 'an object will not validate either');
    });

    it('should be a type of inheritance 3a', function () {
      compileJSONSchema('combineAllOf3a', {
        definitions: {
          address: {
            type: 'object',
            properties: {
              street_address: { type: 'string' },
              city: { type: 'string' },
              state: { type: 'string' },
            },
            required: ['street_address', 'city', 'state'],
          },
        },
        allOf: [
          { $ref: '#/definitions/address' },
          {
            properties: {
              type: { enum: ['residential', 'business'] },
            },
          },
        ],
      });

      const root = getJSONSchema('combineAllOf3a');
      assert.isTrue(root.validate({
        street_address: '1600 Pennsylvania Avenue NW',
        city: 'Washington',
        state: 'DC',
        type: 'business',
      }), 'a valid address with reference');
    });

    it('should be a type of inheritance 3b', function () {
      compileJSONSchema('combineAllOf3b', {
        definitions: {
          address: {
            type: 'object',
            properties: {
              street_address: { type: 'string' },
              city: { type: 'string' },
              state: { type: 'string' },
            },
            required: ['street_address', 'city', 'state'],
          },
        },
        allOf: [
          { $ref: '#/definitions/address' },
          {
            properties: {
              type: { enum: ['residential', 'business'] },
            },
          },
        ],
        additionalProperties: false,
      });

      const root = getJSONSchema('combineAllOf3b');
      assert.isFalse(root.validate({
        street_address: '1600 Pennsylvania Avenue NW',
        city: 'Washington',
        state: 'DC',
        type: 'business',
      }), 'same with no additional properties');
    });

  });

  describe('#anyOf()', function () {
    it('should be valid against any (one or more) of the given subschemas.', function () {
      compileJSONSchema('combineAnyOf1', {
        anyOf: [
          { type: 'string' },
          { type: 'number' },
        ],
      });

      const root = getJSONSchema('combineAnyOf1');
      assert.isTrue(root.validate('Yes'), 'a string works');
      assert.isTrue(root.validate(42), 'a number works');
      assert.isFalse(root.validate({ 'an object': 'doesnt work' }));
    });
  });

  describe('#oneOf()', function () {
    it('should be valid against exactly one of the given subschemas.', function () {
      compileJSONSchema('combineOneOf1', {
        type: 'number',
        oneOf: [
          { multipleOf: 5 },
          { multipleOf: 3 },
        ],
      });

      const root = getJSONSchema('combineOneOf1');
      assert.isTrue(root.validate(10), 'multiple of 5');
      assert.isTrue(root.validate(9), 'multiple of 3');
      assert.isFalse(root.validate(2), '2 is not a multiple of 5 or 3');
      assert.isFalse(root.validate(15), 'multiple of 5 and 3 is rejected');

    });
  });

  describe('#not()', function () {
    it('should validate against anything that is not a string', function () {
      compileJSONSchema('combineNotOf1', {
        not: { type: 'string' },
      });

      const root = getJSONSchema('combineNotOf1');
      assert.isTrue(root.validate(42), 'validates against a number');
      assert.isTrue(root.validate({ key: 'value' }), 'validates against an object');
      assert.isFalse(root.validate('this is a string'), 'failes against a string');
    });
  });
});
