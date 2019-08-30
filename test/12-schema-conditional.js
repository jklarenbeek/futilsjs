/* eslint-disable object-curly-newline */
/* eslint-disable padded-blocks */
/* eslint-disable func-names */
/* eslint-env mocha */
import { assert } from 'chai';

import {
  compileJSONSchema,
  getJSONSchema,
} from '../src/json';

// https://json-schema.org/understanding-json-schema/reference/conditionals.html

describe('Schema Conditionals', function () {
  describe('#if()', function () {
    // https://json-schema.org/understanding-json-schema/reference/conditionals.html
    it('should not be a very scalable postal code', function () {
      assert.isTrue(compileJSONSchema('conditionIf1', {
        type: 'object',
        properties: {
          street_address: {
            type: 'string',
          },
          country: {
            enum: ['United States of America', 'Canada'],
          },
        },
        if: {
          properties: { country: { const: 'United States of America' } },
        },
        then: {
          properties: { postal_code: { pattern: '[0-9]{5}(-[0-9]{4})?' } },
        },
        else: {
          properties: { postal_code: { pattern: '[A-Z][0-9][A-Z] [0-9][A-Z][0-9]' } },
        },
      }), 'compiling');

      const root = getJSONSchema('conditionIf1');
      assert.isTrue(root.validate({
        street_address: '1600 Pennsylvania Avenue NW',
        country: 'United States of America',
        postal_code: '20500',
      }), 'a valid postal code for the US.');
      assert.isTrue(root.validate({
        street_address: '24 Sussex Drive',
        country: 'Canada',
        postal_code: 'K1M 1M4',
      }), 'a valid postal code for canada');
      assert.isFalse(root.validate({
        street_address: '24 Sussex Drive',
        country: 'Canada',
        postal_code: '10000',
      }), 'an invalid postal code for canada');
    });

    it('should be a better scalable postal code', function () {
      assert.isTrue(compileJSONSchema('conditionIf2', {
        type: 'object',
        properties: {
          street_address: {
            type: 'string',
          },
          country: {
            enum: ['United States of America', 'Canada', 'Netherlands'],
          },
        },
        allOf: [
          {
            if: {
              properties: { country: { const: 'United States of America' } },
            },
            then: {
              properties: { postal_code: { pattern: '[0-9]{5}(-[0-9]{4})?' } },
            },
          },
          {
            if: {
              properties: { country: { const: 'Canada' } },
            },
            then: {
              properties: { postal_code: { pattern: '[A-Z][0-9][A-Z] [0-9][A-Z][0-9]' } },
            },
          },
          {
            if: {
              properties: { country: { const: 'Netherlands' } },
            },
            then: {
              properties: { postal_code: { pattern: '[0-9]{4} [A-Z]{2}' } },
            },
          },
        ],
      }), 'compiling');

      const root = getJSONSchema('conditionIf2');
      assert.isTrue(root.validate({
        street_address: '1600 Pennsylvania Avenue NW',
        country: 'United States of America',
        postal_code: '20500',
      }), 'a valid us postal code');
      assert.isTrue(root.validate({
        street_address: '24 Sussex Drive',
        country: 'Canada',
        postal_code: 'K1M 1M4',
      }), 'a valid canadian postal code');
      assert.isTrue(root.validate({
        street_address: 'Adriaan Goekooplaan',
        country: 'Netherlands',
        postal_code: '2517 JX',
      }), 'a valid dutch postal code');
      assert.isFalse(root.validate({
        street_address: '24 Sussex Drive',
        country: 'Canada',
        postal_code: '10000',
      }), 'an invalid canadian postal code');
    });

    it('should validate without the else keyword', function () {
      assert.isTrue(compileJSONSchema('withoutIf1', {
        if: { exclusiveMaximum: 0 },
        then: { minimum: -10 },
      }), 'compiling');

      const root = getJSONSchema('withoutIf1');
      assert.isTrue(root.validate(-1), 'valid through then');
      assert.isFalse(root.validate(-100), 'invalid through then');
      assert.isTrue(root.validate(3), 'valid when if test fails');
    });

    it('should validate without the then keyword', function () {
      assert.isTrue(compileJSONSchema('withoutIf2', {
        if: { exclusiveMaximum: 0 },
        else: { multipleOf: 2 },
      }));
      const root = getJSONSchema('withoutIf2');
      assert.isTrue(root.validate(-1), 'valid when if test passes');
      assert.isTrue(root.validate(4), 'valid through else');
      assert.isFalse(root.validate(3), 'invalid through else');
    });

    it('should validate against the correct branch', function () {
      assert.isTrue(compileJSONSchema('branchIf1', {
        if: { exclusiveMaximum: 0 },
        then: { minimum: -10 },
        else: { multipleOf: 2 },
      }), 'compiling');
      const root = getJSONSchema('branchIf1');
      assert.isTrue(root.validate(-1), 'valid through then');
      assert.isFalse(root.validate(-100), 'invalid through then');
      assert.isTrue(root.validate(4), 'valid through else');
      assert.isFalse(root.validate(3), 'invalid through else');
    });
  });
});
