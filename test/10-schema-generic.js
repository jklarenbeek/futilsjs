/* eslint-disable object-curly-newline */
/* eslint-disable padded-blocks */
/* eslint-disable func-names */
/* eslint-env mocha */
import { assert } from 'chai';

import {
  compileJSONSchema,
  getJSONSchema,
} from '../src/json';

describe('Schema Generics', function () {

  // https://json-schema.org/understanding-json-schema/reference/generic.html
  describe('#enums()', function () {
    it('should validate a string enum type', function () {
      compileJSONSchema('enumsBasic1', {
        type: 'string',
        enum: ['red', 'amber', 'green'],
      });

      const root = getJSONSchema('enumsBasic1');
      assert.isTrue(root.validate('amber'), 'amber is a valid enum value');
      assert.isFalse(root.validate('blue'), 'blue isn\'t a valid enum value');
    });

    it('should validate simple heterogeneous type', function () {
      compileJSONSchema('enumsBasic2', {
        enum: ['red', 'amber', 'green', null, 42],
      });

      const root = getJSONSchema('enumsBasic2');
      assert.isTrue(root.validate('red'), 'red is part of the collection');
      assert.isTrue(root.validate(null), 'its a null, which is part of the collection');
      assert.isFalse(root.validate(0), 'a zero is not ok!');
    });

    it('should validate string types only', function () {
      compileJSONSchema('enumsBasic3', {
        type: 'string',
        enum: ['red', 'amber', 'green', null, 42],
      });

      const root = getJSONSchema('enumsBasic3');
      assert.isTrue(root.validate('red'), 'red is a valid enum type');
      assert.isFalse(root.validate(null), 'null will not be accepted!');
    });

    it('should validate numbers only', function () {
      compileJSONSchema('enumsSimple1', { enum: [1, 2, 3] });
      const root = getJSONSchema('enumsSimple1');
      assert.isTrue(root.validate(1), 'one member of enum is valid');
      assert.isFalse(root.validate(4), 'something else is invalid');
    });

    it.skip('should deep validate heterogeneous types', function () {
      compileJSONSchema('enumHetero1', { enum: [6, 'foo', [], true, { foo: 12 }] });
      const root = getJSONSchema('enumHetero1');
      assert.isTrue(root.validate([]), 'empty array is valid');
      assert.isFalse(root.validate([754, 285]), 'other array is invalid');
      assert.isFalse(root.validate(null), 'null is invalid');
      assert.isFalse(root.validate({ foo: false }), 'other object is invalid');
      assert.isTrue(root.validate({ foo: 12 }), 'same object is valid');
    });

    it('should validate enums in properties', function () {
      compileJSONSchema('enumsProps1', {
        type: 'object',
        properties: {
          foo: { enum: ['foo'] },
          bar: { enum: ['bar'] },
        },
        required: ['bar'],
      });
      const root = getJSONSchema('enumsProps1');
      assert.isTrue(root.validate({ foo: 'foo', bar: 'bar' }), 'both properties are valid');
      assert.isTrue(root.validate({ bar: 'bar' }), 'missing optional property is valid');
      assert.isFalse(root.validate({ foo: 'foo' }), 'missing required property is invalid');
      assert.isFalse(root.validate({}), 'missing all properties is invalid');
    });

    it('should validate enum with escaped characters', function () {
      compileJSONSchema('enumsEscape1', { enum: ['foo\nbar', 'foo\rbar'] });
      const root = getJSONSchema('enumsEscape1');
      assert.isTrue(root.validate('foo\nbar'), 'member 1 is valid');
      assert.isTrue(root.validate('foo\rbar'), 'member 2 is valid');
      assert.isFalse(root.validate('abc'), 'another string is invalid');
    });

    it('should validate enum with false', function () {
      compileJSONSchema('enumsFalse1', { enum: [false] });
      const root = getJSONSchema('enumsFalse1');
      assert.isTrue(root.validate(false), 'false is valid');
      assert.isFalse(root.validate(0), 'integer zero is invalid');
      assert.isFalse(root.validate('0'), 'string zero character is invalid');
    });

    it('should validate enum with true', function () {
      compileJSONSchema('enumsTrue1', { enum: [true] });
      const root = getJSONSchema('enumsTrue1');
      assert.isTrue(root.validate(true), 'true is valid');
      assert.isFalse(root.validate(1), 'integer one is invalid');
      assert.isFalse(root.validate('1'), 'string one character is invalid');
    });

    it('should validate enum with number 0', function () {
      compileJSONSchema('enumsZero1', { enum: [0] });
      const root = getJSONSchema('enumsZero1');
      assert.isTrue(root.validate(0), '0 is valid');
      assert.isFalse(root.validate(false), 'integer zero is invalid');
      assert.isFalse(root.validate('0'), 'string zero character is invalid');
    });

    it('should validate enum with true', function () {
      compileJSONSchema('enumsOne1', { enum: [1] });
      const root = getJSONSchema('enumsOne1');
      assert.isTrue(root.validate(1), '1 is valid');
      assert.isFalse(root.validate(true), 'bool true is invalid');
      assert.isFalse(root.validate('1'), 'string one character is invalid');
    });

  });

  describe('#consts()', function () {
    it('should validate a constant number', function () {
      compileJSONSchema('constNumber1', { const: 2 });
      const root = getJSONSchema('constNumber1');
      assert.isTrue(root.validate(2), 'same value is valid');
      assert.isFalse(root.validate(5), 'another value is invalid');
      assert.isFalse(root.validate('ABC'), 'another type is invalid');
    });

    it('should deep validate a constant object', function () {
      compileJSONSchema('constObject1', {
        const: { foo: 'bar', baz: 'bax' },
      });
      const root = getJSONSchema('constObject1');
      assert.isTrue(root.validate({ foo: 'bar', baz: 'bax' }), 'same object is valid');
      assert.isTrue(root.validate({ baz: 'bax', foo: 'bar' }), 'same object with different property order is valid');
      assert.isFalse(root.validate({ foo: 'bar' }), 'another object is invalid');
      assert.isFalse(root.validate([1, 2, 3]), 'another type is invalid');
    });

    it('should deep validate a constant array', function () {
      compileJSONSchema('constArray1', {
        const: [{ foo: 'bar' }],
      });
      const root = getJSONSchema('constArray1');
      assert.isTrue(root.validate([{ foo: 'bar' }]), 'same array is valid');
      assert.isFalse(root.validate([2]), 'another array item is invalid');
      assert.isFalse(root.validate([1, 2, 3]), 'array with additional items is invalid');
    });

    it('should validate a const null', function () {
      compileJSONSchema('constNull1', { const: null });
      const root = getJSONSchema('constNull1');
      assert.isTrue(root.validate(null), 'null is valid');
      assert.isFalse(root.validate(0), 'not null is invalid');
    });

    it('should validate const with false', function () {
      compileJSONSchema('constFalse1', { const: false });
      const root = getJSONSchema('constFalse1');
      assert.isTrue(root.validate(false), 'false is valid');
      assert.isFalse(root.validate(0), 'integer zero is invalid');
      assert.isFalse(root.validate('0'), 'string zero character is invalid');
    });

    it('should validate const with true', function () {
      compileJSONSchema('constTrue1', { const: true });
      const root = getJSONSchema('constTrue1');
      assert.isTrue(root.validate(true), 'true is valid');
      assert.isFalse(root.validate(1), 'integer one is invalid');
      assert.isFalse(root.validate('1'), 'string one character is invalid');
    });

    it('should validate const with number 0', function () {
      compileJSONSchema('constZero1', { const: 0 });
      const root = getJSONSchema('constZero1');
      assert.isTrue(root.validate(0), '0 is valid');
      assert.isFalse(root.validate(false), 'integer zero is invalid');
      assert.isFalse(root.validate('0'), 'string zero character is invalid');
    });

    it('should validate const with true', function () {
      compileJSONSchema('constOne1', { const: 1 });
      const root = getJSONSchema('constOne1');
      assert.isTrue(root.validate(1), '1 is valid');
      assert.isFalse(root.validate(true), 'bool true is invalid');
      assert.isFalse(root.validate('1'), 'string one character is invalid');
    });

    // https://json-schema.org/understanding-json-schema/reference/generic.html#const
    it('should be a country!', function () {
      compileJSONSchema('constObject2', {
        properties: {
          country: {
            const: 'Amsterdam',
          },
        },
      });

      const root = getJSONSchema('constObject2');
      assert.isTrue(root.validate({ country: 'Amsterdam' }), 'data === Amsterdam');
      assert.isFalse(root.validate({ country: 'The Netherlands' }), 'data != Amsterdam');
    });
  });

  describe('#content()', function () {
    // https://json-schema.org/understanding-json-schema/reference/non_json_data.html
    compileJSONSchema('contentBasic1', {
      type: 'string',
      contentMediaType: 'text/html',
    });

    const root = getJSONSchema('contentBasic1');
    assert.isTrue(root.validate('<!DOCTYPE html><html xmlns=\"http://www.w3.org/1999/xhtml\"><head></head></html>'), 'valid html');
  });

  describe('#encode()', function () {
    // https://json-schema.org/understanding-json-schema/reference/non_json_data.html
    compileJSONSchema('contentBasic2', {
      type: 'string',
      contentEncoding: 'base64',
      contentMediaType: 'image/png',
    });

    const root = getJSONSchema('contentBasic1');
    assert.isTrue(root.validate('iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAAA...'), 'base64 png image');
  });
});
