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

// https://json-schema.org/understanding-json-schema/reference/numeric.html

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

  it('should validate integers', function () {
    compileJSONSchema('numberBasic2', { type: 'integer' });

    const root = getJSONSchema('numberBasic2');
    assert.isTrue(root.validate(42), 'validates an integer');
    assert.isTrue(root.validate(-1), 'validates a negative integer');
    assert.isFalse(root.validate(Math.PI), 'not validates a float');
    assert.isTrue(root.validate(2.99792458e8), 'not validates a float literal');
    assert.isFalse(root.validate('42'), 'not validates a string');
  });

});
