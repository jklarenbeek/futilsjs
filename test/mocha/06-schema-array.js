/* eslint-disable max-len */
/* eslint-disable padded-blocks */
/* eslint-disable func-names */
/* eslint-env mocha */
import { assert } from 'chai';

import {
  compileJSONSchema,
  getJSONSchema,
} from '../../src/json';

// https://json-schema.org/understanding-json-schema/reference/type.html

describe('Schema Array Type', function () {
  describe('#arrayBasic()', function () {
    it('should constraint length of array', function () {
      assert.isTrue(compileJSONSchema('arrayLength1', {
        type: 'array',
        minItems: 2,
        maxItems: 3,
      }), 'compiling');

      const root = getJSONSchema('arrayLength1');
      assert.isFalse(root.validate([]), 'empty array not allowed');
      assert.isFalse(root.validate([1]), 'one item is invalid');
      assert.isTrue(root.validate([1, 2]), 'min two items');
      assert.isTrue(root.validate([1, 2, 3]), 'min and max three items');
      assert.isFalse(root.validate([1, 2, 3, 4]), 'four items are invalid');
    });
    it('should ensure uniqueness of array', function () {
      assert.isTrue(compileJSONSchema('arrayUniqueness1', {
        type: 'array',
        uniqueItems: true,
      }));

      const root = getJSONSchema('arrayUniqueness1');
      assert.isTrue(root.validate([1, 2, 3, 4, 5]), 'data is unique');
      assert.isFalse(root.validate([1, 2, 3, 4, 4]), 'data is not unique');
      assert.isTrue(root.validate([]), 'empty array passes');
    });

  });

  describe('#arrayItems()', function () {
    it('should validate each item with number', function () {
      compileJSONSchema('arrayNumber1', {
        type: 'array',
        items: {
          type: 'number',
        },
      });

      const root = getJSONSchema('arrayNumber1');
      assert.isTrue(root.validate([1, 2, 3, 4, 5]), 'array of numbers');
      assert.isFalse(root.validate([1, 2, '3', 4, 5]), 'A single “non-number” causes the whole array to be invalid');
      assert.isTrue(root.validate([]), 'an empty array is valid');
    });

    it('should validate nested items', function () {
      compileJSONSchema('arrayNested1', {
        type: 'array',
        items: {
          type: 'array',
          items: {
            type: 'array',
            items: {
              type: 'array',
              items: {
                type: 'number',
              },
            },
          },
        },
      });
      const root = getJSONSchema('arrayNested1');
      assert.isTrue(root.validate([[[[1]], [[2], [3]]], [[[4], [5], [6]]]]),
        'valid nested array');
      assert.isFalse(root.validate([[[['1']], [[2], [3]]], [[[4], [5], [6]]]]),
        'nested array with invalid type');
      assert.isFalse(root.validate([[[1], [2], [3]], [[4], [5], [6]]]),
        'not deep enough');

    });

    it('should validate items with boolean schema true', function () {
      compileJSONSchema('arrayBoolean1', { items: true });

      const root = getJSONSchema('arrayBoolean1');
      assert.isTrue(root.validate([1, 'foo', true]), 'any array is valid');
      assert.isTrue(root.validate([]), 'an empty array is valid');
      assert.isTrue(root.validate('string'), 'a string is valid');

    });

    it('should validate items with boolean schema false', function () {
      compileJSONSchema('arrayBoolean2', { items: false });

      const root = getJSONSchema('arrayBoolean2');
      assert.isFalse(root.validate([1, 'foo', true]), 'a non-empty array is invalid');
      assert.isTrue(root.validate([]), 'an empty array is valid');

    });
  });

  describe('#arrayContains()', function () {
    it('can contain number to validate', function () {
      compileJSONSchema('arrayContainsNumber1a', {
        contains: {
          type: 'number',
        },
      });
      const root = getJSONSchema('arrayContainsNumber1a');
      assert.isTrue(root.validate(undefined), 'undefined is true');
      assert.isTrue(root.validate(null), 'null is valid');
      assert.isTrue(root.validate({}), 'object is ignored');
      assert.isTrue(root.validate(new Map([['a', 1]])), 'map is ignored');
      assert.isTrue(root.validate('validate this'), 'string is ignored');
      assert.isFalse(root.validate([]), 'an empty array is invalid');
      assert.isTrue(root.validate([1]), 'A single number is valid');
      assert.isTrue(root.validate([1, 2, 3, 4, 5]), 'All numbers is also okay');
      assert.isTrue(root.validate([1, 'foo']), 'a single number as first item is valid');
      assert.isTrue(root.validate(['life', 'universe', 'everything', 42]), 'A single number is enough to make this pass');
      assert.isFalse(root.validate(['life', 'universe', 'everything', 'forty-two']), 'But if we have no number, it fails');
      // assert.isFalse(root.validate({ '0': 'invalid', length: 1 }), 'Javascript pseudo array is valid');
    });

    it('should contain number to validate', function () {
      compileJSONSchema('arrayContainsNumber1b', {
        type: 'array',
        contains: {
          type: 'number',
        },
      });
      const root = getJSONSchema('arrayContainsNumber1b');
      assert.isTrue(root.validate(undefined), 'undefined is true');
      assert.isFalse(root.validate(null), 'null is not allowed');
      assert.isFalse(root.validate({}), 'object is invalid');
      assert.isFalse(root.validate(new Map([['a', 1]])), 'map is invalid');
      assert.isFalse(root.validate('validate this'), 'string is invalid');
      assert.isFalse(root.validate([]), 'an empty array is invalid');
      assert.isTrue(root.validate([1]), 'A single number is valid');
      assert.isTrue(root.validate([1, 2, 3, 4, 5]), 'All numbers is also okay');
      assert.isTrue(root.validate([1, 'foo']), 'a single number as first item is valid');
      assert.isTrue(root.validate(['life', 'universe', 'everything', 42]), 'A single number is enough to make this pass');
      assert.isFalse(root.validate(['life', 'universe', 'everything', 'forty-two']), 'But if we have no number, it fails');
      // assert.isFalse(root.validate({ '0': 'invalid', length: 1 }), 'Javascript pseudo array is valid');
    });

    it('should contain a minimum of 5 to validate', function () {
      compileJSONSchema('arrayContains2', { contains: { minimum: 5 } });
      const root = getJSONSchema('arrayContains2');
      assert.isTrue(root.validate([3, 4, 5]), 'last item 5 is valid');
      assert.isTrue(root.validate([3, 4, 6]), 'last item 6 is valid');
      assert.isTrue(root.validate([3, 4, 5, 6]), 'last two items are valid');
      assert.isFalse(root.validate([2, 3, 4]), 'no matching lower items');
      assert.isFalse(root.validate([]), 'empty array is invalid');
      assert.isTrue(root.validate({}), 'not array is valid');
    });

    it('should contains const of 5 to validate', function () {
      compileJSONSchema('containsConst1', { contains: { const: 5 } });
      const root = getJSONSchema('containsConst1');
      assert.isTrue(root.validate([3, 4, 5]), 'array contains number 5');
      assert.isTrue(root.validate([3, 4, 5, 5]), 'array with two items 5 is valid');
      assert.isFalse(root.validate([1, 2, 3, 4]), 'array does not contain number 5');
    });

    it('should validate contains with boolean schema true', function () {
      compileJSONSchema('containsTrue1', { contains: true });
      const root = getJSONSchema('containsTrue1');
      assert.isTrue(root.validate(['foo']), 'any non empty array is valid');
      assert.isFalse(root.validate([]), 'any empty array is invalid');
    });

    it('should validate contains with boolean schema false', function () {
      compileJSONSchema('containsFalse1', { contains: false });
      const root = getJSONSchema('containsFalse1');
      assert.isFalse(root.validate(['foo']), 'any non empty array is invalid');
      assert.isFalse(root.validate([]), 'any empty array is invalid');
      assert.isTrue(root.validate('contains does not apply'), 'non-arrays are valid');
    });
  });

  describe('#tupleItems()', function () {
    it('should validate each item with number', function () {
      compileJSONSchema('tupleSimple1', {
        type: 'array',
        items: [
          { type: 'iteger' },
          { type: 'string' },
        ],
      });

      const root = getJSONSchema('tupleSimple1');
      assert.isTrue(root.validate([1, 'foo']), 'correct types');
      assert.isFalse(root.validate(['foo', 1]), 'wrong types');
      assert.isTrue(root.validate([1]), 'incomplete array of items');
      assert.isTrue(root.validate([1, 'foo', true]), 'array with additional items');
      assert.isTrue(root.validate([]), 'empty array');
      // assert.isTrue(root.validate({ '0': 'invalid', '1': 'valid', length: 2 }), 'Javascript pseudo-array is valid');
    });

    it('should validate with boolean schemas', function () {
      compileJSONSchema('tupleBoolean1', { items: [true, false] });

      const root = getJSONSchema('tupleBoolean1');
      assert.isTrue(root.validate([1]), 'array with one item is valid');
      assert.isFalse(root.validate([1, 'foo']), 'array with two items is invalid');
      assert.isTrue(root.validate([]), 'empty array is valid');
    });
  });

  describe('#tupleAdditionalItems', function () {
    it('it should validate additional items by default', function () {
      compileJSONSchema('tupleAddItems1', {
        type: 'array',
        items: [
          { type: 'number' },
          { type: 'string' },
          { type: 'string', enum: ['Street', 'Avenue', 'Boulevard'] },
          { type: 'string', enum: ['NW', 'NE', 'SW', 'SE'] },
        ],
      });

      const root = getJSONSchema('tupleAddItems1');
      assert.isTrue(root.validate([1600, 'Pennsylvania', 'Avenue', 'NW']), 'valid address');
      assert.isFalse(root.validate([24, 'Sussex', 'Drive']), 'invalid value at item 3');
      assert.isFalse(root.validate(['Palais de l\'Élysée']), 'missing street number');
      assert.isTrue(root.validate([10, 'Downing', 'Street']), 'does not need all items');
      assert.isTrue(root.validate([1600, 'Pennsylvania', 'Avenue', 'NW', 'Washington']), 'additionalItems is default true');
    });

    it('should not allow additional items', function () {
      compileJSONSchema('tupleAddItems2', {
        type: 'array',
        items: [
          { type: 'number' },
          { type: 'string' },
          { type: 'string', enum: ['Street', 'Avenue', 'Boulevard'] },
          { type: 'string', enum: ['NW', 'NE', 'SW', 'SE'] },
        ],
        additionalItems: false,
      });

      const root = getJSONSchema('tupleAddItems2');
      assert.isTrue(root.validate([1600, 'Pennsylvania', 'Avenue', 'NW']), 'valid address');
      assert.isTrue(root.validate([1600, 'Pennsylvania', 'Avenue']), 'not all fields are necessary');
      assert.isFalse(root.validate([1600, 'Pennsylvania', 'Avenue', 'NW', 'Washington']), 'do not allow additional items');
    });

    it('should allow strings as additional items', function () {
      compileJSONSchema('tupleAddItems3', {
        type: 'array',
        items: [
          { type: 'number' },
          { type: 'string' },
          { type: 'string', enum: ['Street', 'Avenue', 'Boulevard'] },
          { type: 'string', enum: ['NW', 'NE', 'SW', 'SE'] },
        ],
        additionalItems: { type: 'string' },
      });

      const root = getJSONSchema('tupleAddItems3');
      assert.isTrue(root.validate([1600, 'Pennsylvania', 'Avenue', 'NW', 'Washington']), 'additional string items are ok');
      assert.isFalse(root.validate([1600, 'Pennsylvania', 'Avenue', 'NW', 20500]), 'but nothing else');
    });

  });
});
