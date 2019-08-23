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

  it('should validate simple types', function () {
    compileJSONSchema('typesBasic1', { type: 'number' });

    const root = getJSONSchema('typeBasic1');
    assert.isTrue(root.validate(42), 'validates an integer');
    assert.isTrue(root.validate(Math.PI), 'validates a float');
    assert.isFalse(root.validate('42'), 'not validates a string');
  });

  it('should validate multiple types', function () {
    compileJSONSchema('typesBasic2', { type: ['number', 'string'] });

    const root = getJSONSchema('typeBasic2');
    assert.isTrue(root.validate(42), 'validates an integer');
    assert.isTrue(root.validate('Math.PI'), 'validates a string');
    assert.isFalse(root.validate([42, '42']), 'not validates an array');
  });
});
