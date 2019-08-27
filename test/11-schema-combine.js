/* eslint-disable object-curly-newline */
/* eslint-disable padded-blocks */
/* eslint-disable func-names */
/* eslint-env mocha */
import { assert } from 'chai';

import {
  compileJSONSchema,
  getJSONSchema,
} from '../src/json';

describe('Schema Combination', function () {
  describe('#allOf()', function () {
    // https://json-schema.org/understanding-json-schema/reference/combining.html
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

    // https://github.com/json-schema-org/JSON-Schema-Test-Suite/blob/master/tests/draft7/allOf.json
    it('should validate multiple properties from different objects', function () {
      compileJSONSchema('testAllOf1', {
        allOf: [
          {
            properties: {
              bar: { type: 'integer' },
            },
            required: ['bar'],
          },
          {
            properties: {
              foo: { type: 'string' },
            },
            required: ['foo'],
          },
        ],
      });

      const root = getJSONSchema('testAllOf1');
      assert.isTrue(root.validate({ foo: 'baz', bar: 2 }), 'both properties are required');
      assert.isFalse(root.validate({ foo: 'baz' }), 'missing second property');
      assert.isFalse(root.validate({ bar: 2 }), 'missing first property');
      assert.isFalse(root.validate({ foo: 'baz', bar: 'quux' }), 'wong type second property');
    });

    it('should validate allOf with base schema', function () {
      compileJSONSchema('testAllOf2', {
        properties: { bar: { type: 'integer' } },
        required: ['bar'],
        allOf: [
          {
            properties: {
              foo: { type: 'string' },
            },
            required: ['foo'],
          },
          {
            properties: {
              baz: { type: 'null' },
            },
            required: ['baz'],
          },
        ],
      });
      const root = getJSONSchema('testAllOf2');
      assert.isTrue(root.validate({ foo: 'quux', bar: 2, baz: null }), 'all properties available');
      assert.isFalse(root.validate({ foo: 'quux', baz: null }), 'missing property base schema');
      assert.isFalse(root.validate({ bar: 2, baz: null }), 'missing first allOf');
      assert.isFalse(root.validate({ foo: 'quux', bar: 2 }), 'mismatch second allOf');
      assert.isFalse(root.validate({ bar: 2 }), 'mismatch both allOf\'s');
    });

    it('should validate allOf with simple type constraints', function () {
      compileJSONSchema('numberAllOf3', {
        allOf: [
          { maximum: 30 },
          { minimum: 20 },
        ],
      });
      const root = getJSONSchema('numberAllOf3');
      assert.isTrue(root.validate(25), '25 is between 20 and 30');
      assert.isFalse(root.validate(35), '35 is higher then 30');
    });

    it('should validate with boolean schemas, all true', function () {
      compileJSONSchema('booleanAllOf4', {
        allOf: [true, true],
      });
      const root = getJSONSchema('booleanAllOf4');
      assert.isTrue(root.validate('foo'), 'any value is valid');
    });

    it('should validate with boolean schemas, some false', function () {
      compileJSONSchema('booleanAllOf5', {
        allOf: [true, false],
      });
      const root = getJSONSchema('booleanAllOf5');
      assert.isFalse(root.validate('foo'), 'any value is invalid');
    });

    it('should validate with boolean schemas, all false', function () {
      compileJSONSchema('booleanAllOf6', {
        allOf: [false, false],
      });
      const root = getJSONSchema('booleanAllOf6');
      assert.isFalse(root.validate('foo'), 'any value is invalid');
    });

    it('should validate with one empty schema', function () {
      compileJSONSchema('emptyAllOf1', {
        allOf: [{}],
      });
      const root = getJSONSchema('emptyAllOf1');
      assert.isTrue(root.validate(1), 'any value is valid');
    });

    it('should validate with two empty schemas', function () {
      compileJSONSchema('emptyAllOf2', {
        allOf: [{}, {}],
      });
      const root = getJSONSchema('emptyAllOf2');
      assert.isTrue(root.validate(1), 'any value is valid');
    });

    it('should validate with first empty schemas', function () {
      compileJSONSchema('emptyAllOf3', {
        allOf: [
          {},
          { type: 'number' },
        ],
      });
      const root = getJSONSchema('emptyAllOf3');
      assert.isTrue(root.validate(1), 'number is valid');
      assert.isFalse(root.validate('foo'), 'string is invalid');
    });

    it('should validate with last empty schemas', function () {
      compileJSONSchema('emptyAllOf4', {
        allOf: [
          { type: 'number' },
          {},
        ],
      });
      const root = getJSONSchema('emptyAllOf4');
      assert.isTrue(root.validate(1), 'number is valid');
      assert.isFalse(root.validate('foo'), 'string is invalid');
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

    // https://github.com/json-schema-org/JSON-Schema-Test-Suite/blob/master/tests/draft7/anyOf.json
    it('should validate an integer or number of minimum 2', function () {
      assert.isTrue(compileJSONSchema('simpleAnyOf1', {
        anyOf: [
          { type: 'integer' },
          { minimum: 2 },
        ],
      }));
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
