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
    it('should validate a string enum of red, amber and green', function () {
      compileJSONSchema('enumsBasic1', {
        type: 'string',
        enum: ['red', 'amber', 'green'],
      });

      const root = getJSONSchema('enumsBasic1');
      assert.isTrue(root.validate('amber'), 'amber is a valid enum value');
      assert.isFalse(root.validate('blue'), 'blue isn\'t a valid enum value');
    });

    it('should validate a dynamic array of colors, numbers and null', function () {
      compileJSONSchema('enumsBasic2', {
        enum: ['red', 'amber', 'green', null, 42],
      });

      const root = getJSONSchema('enumsBasic2');
      assert.isTrue(root.validate('red'), 'red is part of the collection');
      assert.isTrue(root.validate(null), 'its a null, which is part of the collection');
      assert.isFalse(root.validate(0), 'a zero is not ok!');
    });

    it('should validate a composite type', function () {
      compileJSONSchema('enumBasic3', {
        type: 'string',
        enum: ['red', 'amber', 'green', null, 42],
      });

      const root = getJSONSchema('enumsBasic3');
      assert.isTrue(root.validate('red'), 'red is a valid enum type');
      assert.isFalse(root.validate(null), 'null will not be accepted!');
    });

  });

  describe('#consts()', function () {
    // https://json-schema.org/understanding-json-schema/reference/generic.html#const
    it('should be a country!', function () {
      compileJSONSchema('constBasic1', {
        properties: {
          country: {
            const: 'Amsterdam',
          },
        },
      });

      const root = getJSONSchema('constBasic1');
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
