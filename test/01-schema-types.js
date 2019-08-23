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

// https://json-schema.org/understanding-json-schema/reference/type.html

describe('#types()', function () {

  it('should validate simple number types', function () {
    compileJSONSchema('typesBasic1', { type: 'number' });

    const root = getJSONSchema('typesBasic1');
    assert.isFalse(root.validate(null), 'null is not a number');
    assert.isTrue(root.validate(42), 'validates an integer');
    assert.isTrue(root.validate(Math.PI), 'validates a float');
    assert.isFalse(root.validate('42'), 'not validates a string');
  });

  it('should validate simple integer types', function () {
    compileJSONSchema('typesBasic2', { type: 'integer' });

    const root = getJSONSchema('typesBasic2');
    assert.isFalse(root.validate(null), 'null is not an integer');
    assert.isTrue(root.validate(42), '42 is an integer');
    assert.isTrue(root.validate(Math.PI), 'PI is not an integer');
    assert.isFalse(root.validate('42'), 'a string is not valid');
  });
  it('should validate multiple types', function () {
    compileJSONSchema('typesBasic2', { type: ['number', 'string'] });

    const root = getJSONSchema('typeBasic2');
    assert.isTrue(root.validate(42), 'validates an integer');
    assert.isTrue(root.validate('Math.PI'), 'validates a string');
    assert.isFalse(root.validate([42, '42']), 'not validates an array');
  });
});
