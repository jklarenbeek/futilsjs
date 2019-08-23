/* eslint-disable object-curly-newline */
/* eslint-disable padded-blocks */
/* eslint-disable func-names */
/* eslint-env mocha */
import { assert } from 'chai';

import {
  compileJSONSchema,
  getJSONSchema,
} from '../src/json';

describe('Schema Combinations', function () {
  it('should be all or nothing string size', function () {
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
    assert.isTrue(root.validate('Yes Way'), 'a string will validate');
    assert.isTrue(root.validate(42), 'a number will validate');
    assert.isFalse(root.validate([]), 'an array will not validate');
    assert.isFalse(root.Validate({}), 'an object will not validate either');
  });
});

