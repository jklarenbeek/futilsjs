/* eslint-disable object-curly-newline */
/* eslint-disable padded-blocks */
/* eslint-disable func-names */
/* eslint-env mocha */
import { assert } from 'chai';

import {
  compileJSONSchema,
  getJSONSchema,
} from '../src/json';

describe('Schema References', function () {
  context('#allOf()', function () {
    // https://json-schema.org/understanding-json-schema/reference/combining.html
    it('should be a type of inheritance 3a', function () {
      compileJSONSchema('combineAllOf3a', {
        definitions: {
          address: {
            type: 'object',
            properties: {
              street_address: { type: 'string' },
              city: { type: 'string' },
              state: { type: 'string' },
            },
            required: ['street_address', 'city', 'state'],
          },
        },
        allOf: [
          { $ref: '#/definitions/address' },
          {
            properties: {
              type: { enum: ['residential', 'business'] },
            },
          },
        ],
      });

      const root = getJSONSchema('combineAllOf3a');
      assert.isTrue(root.validate({
        street_address: '1600 Pennsylvania Avenue NW',
        city: 'Washington',
        state: 'DC',
        type: 'business',
      }), 'a valid address with reference');
    });

    it('should be a type of inheritance 3b', function () {
      compileJSONSchema('combineAllOf3b', {
        definitions: {
          address: {
            type: 'object',
            properties: {
              street_address: { type: 'string' },
              city: { type: 'string' },
              state: { type: 'string' },
            },
            required: ['street_address', 'city', 'state'],
          },
        },
        allOf: [
          { $ref: '#/definitions/address' },
          {
            properties: {
              type: { enum: ['residential', 'business'] },
            },
          },
        ],
        additionalProperties: false,
      });

      const root = getJSONSchema('combineAllOf3b');
      assert.isFalse(root.validate({
        street_address: '1600 Pennsylvania Avenue NW',
        city: 'Washington',
        state: 'DC',
        type: 'business',
      }), 'same with no additional properties');
    });

  });
  context('#items()', function () {
    it('should validate items and subitems', function () {
      // https://github.com/json-schema-org/JSON-Schema-Test-Suite/blob/master/tests/draft7/items.json
      compileJSONSchema('refItems1', {
        definitions: {
          item: {
            type: 'array',
            additionalItems: false,
            items: [
              { $ref: '#/definitions/sub-item' },
              { $ref: '#/definitions/sub-item' },
            ],
          },
          'sub-item': {
            type: 'object',
            required: ['foo'],
          },
        },
        type: 'array',
        additionalItems: false,
        items: [
          { $ref: '#/definitions/item' },
          { $ref: '#/definitions/item' },
          { $ref: '#/definitions/item' },
        ],
      });

      const root = getJSONSchema('refItems1');
      assert.isTrue(root.validate([
        [{ foo: null }, { foo: null }],
        [{ foo: null }, { foo: null }],
        [{ foo: null }, { foo: null }],
      ]), 'valid items');
      assert.isFalse(root.validate([
        [{ foo: null }, { foo: null }],
        [{ foo: null }, { foo: null }],
        [{ foo: null }, { foo: null }],
        [{ foo: null }, { foo: null }],
      ]), 'too many items');
      assert.isFalse(root.validate([
        [{ foo: null }, { foo: null }, { foo: null }],
        [{ foo: null }, { foo: null }],
        [{ foo: null }, { foo: null }],
      ]), 'too many sub-items');
      assert.isFalse(root.validate([
        { foo: null },
        [{ foo: null }, { foo: null }],
        [{ foo: null }, { foo: null }],
      ]), 'wrong item');
      assert.isFalse(root.validate([
        [{}, { foo: null }],
        [{ foo: null }, { foo: null }],
        [{ foo: null }, { foo: null }],
      ]), 'wrong sub-item');
      assert.isTrue(root.validate([
        [{ foo: null }],
        [{ foo: null }],
      ]), 'fewer items is valid');
    });
  });
});
