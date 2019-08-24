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

  it('should validate number types', function () {
    compileJSONSchema('typesNumber1', { type: 'number' });

    const root = getJSONSchema('typesNumber1');
    assert.isFalse(root.validate(null), 'null is not a number');
    assert.isTrue(root.validate(42), 'validates an integer');
    assert.isTrue(root.validate(Math.PI), 'validates a float');
    assert.isFalse(root.validate('42'), 'not validates a string');
  });

  it('should validate integer types', function () {
    compileJSONSchema('typesInteger1', { type: 'integer' });

    const root = getJSONSchema('typesInteger1');
    assert.isFalse(root.validate(null), 'null is not an integer');
    assert.isTrue(root.validate(42), '42 is an integer');
    assert.isFalse(root.validate(Math.PI), 'PI is not an integer');
    assert.isFalse(root.validate('42'), 'a string is not valid');
  });

  it('should validate bigint types', function () {
    compileJSONSchema('typesBigInt1', { type: 'bigint' });

    const root = getJSONSchema('typesBigInt1');
    assert.isFalse(root.validate(null), 'null is not an bigint');
    assert.isFalse(root.validate(42), '42 is not an bigint');
    assert.isTrue(root.validate(BigInt(42)), '42n is a bigint');
    assert.isFalse(root.validate(Math.PI), 'PI is not an bigint');
    assert.isFalse(root.validate('42'), 'a string is not valid');
  });

  it('should validate string types', function () {
    compileJSONSchema('typesString1', { type: 'string' });

    const root = getJSONSchema('typesString1');
    assert.isFalse(root.validate(null), 'null is not a string');
    assert.isFalse(root.validate(42), 'integer is not a string');
    assert.isFalse(root.validate(Math.PI), 'PI is not a string');
    assert.isFalse(root.validate(BigInt(42)), 'bigint is not a string');
    assert.isTrue(root.validate('this is a string'), 'this is a valid string');
    assert.isFalse(root.validate(['this', 'is', 'an', 'array']), 'this array is not a string');
    assert.isFalse(root.validate({ keyword: 'value' }), 'this object is not a string');
  });

  it('should validate number or string types', function () {
    compileJSONSchema('typesArray1', { type: ['number', 'string'] });

    const root = getJSONSchema('typesArray1');
    assert.isFalse(root.validate(null), 'null is not a number or string');
    assert.isTrue(root.validate(42), 'validates an integer');
    assert.isTrue(root.validate(Math.PI), 'validates a number');
    assert.isTrue(root.validate('Math.PI'), 'validates a string');
    assert.isFalse(root.validate([42, '42']), 'does not validate an array');
    assert.isFalse(root.validate({}), 'does not validate an object');
  });
});
