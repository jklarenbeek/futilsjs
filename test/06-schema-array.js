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

// https://json-schema.org/understanding-json-schema/reference/type.html

describe('#arrays()', function () {

  it('should validate array types', function () {
    compileJSONSchema('arrayType1', { type: 'number' });
    const root = getJSONSchema('arrayType1');
    assert.isTrue(root.validate([1, 2, 3, 4, 5]), 'validates array of integers');
    assert.isTrue(root.validate([3, 'different', { types: 'of values' }]), 'validates array of objects');
    assert.isFalse(root.validate({ Not: 'an array' }), 'not an array type');
  });

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

  it('should contains to validate', function () {
    compileJSONSchema('arrayContains1', {
      type: 'array',
      contains: {
        type: 'number',
      },
    });
    const root = getJSONSchema('arrayContains1');
    assert.isTrue(root.validate(['life', 'universe', 'everything', 42]), 'A single “number” is enough to make this pass');
    assert.isFalse(root.validate(['life', 'universe', 'everything', 'forty-two']), 'But if we have no number, it fails');
    assert.isTrue(root.validate([1, 2, 3, 4, 5]), 'All numbers is, of course, also okay');
  });
});
