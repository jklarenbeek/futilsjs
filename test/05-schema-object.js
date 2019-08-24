/* eslint-disable object-curly-newline */
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

// https://json-schema.org/understanding-json-schema/reference/object.html

const testObj1 = {
  key: 'value',
  another_key: 'another_value',
};

const testObj2 = {
  Sun: 1.9891e30,
  Jupiter: 1.8986e27,
  Saturn: 5.6846e26,
  Neptune: 10.243e25,
  Uranus: 8.6810e25,
  Earth: 5.9736e24,
  Venus: 4.8685e24,
  Mars: 6.4185e23,
  Mercury: 3.3022e23,
  Moon: 7.349e22,
  Pluto: 1.25e22,
};

describe('#objects()', function () {
  it('should validate an object type', function () {
    compileJSONSchema('objectBasic1', { type: 'object' });

    const root = getJSONSchema('objectBasic1');
    assert.isFalse(root.validate(null), 'not validates null');
    assert.isTrue(root.validate({}), 'validates an empty object literal');
    assert.isTrue(root.validate(testObj1), 'validates a simple object with strings');
    assert.isTrue(root.validate(testObj2), 'validates a simple object with numbers');
    assert.isTrue(root.validate(2.99792458e8), 'validates a float literal');
    assert.isFalse(root.validate('Is Not Valid'), 'not validates a string');
    assert.isFalse(root.validate(['is', 'not', 'an', 'object']), 'not validates an array');

  });

  it('should validate the object member size', function () {
    compileJSONSchema('objectSize1', {
      type: 'object',
      minProperties: 2,
      maxProperties: 3,
    });

    const root = getJSONSchema('objectSize1');
    assert.isFalse(root.validate(null), 'null object is not enough');
    assert.isFalse(root.validate({}), 'empty object is not enough');
    assert.isFalse(root.validate({ a: 0 }), 'single property is not enough');
    assert.isTrue(root.validate({ a: 0, b: 1 }), 'two properties are enough');
    assert.isTrue(root.validate({ a: 0, b: 1, c: 2 }), 'three properties are enough');
    assert.isFalse(root.validate({ a: 0, b: 1, c: 2, d: 3 }), 'four properties are to much');
  });

  it('should validate required properties of object', function () {
    compileJSONSchema('objectReq1', {
      type: 'object',
      properties: {
        name: { type: 'string' },
        email: { type: 'string' },
        address: { type: 'string' },
        telephone: { type: 'string' },
      },
      required: ['name', 'email'],
    });

    const root = getJSONSchema('objectReq1');
    assert.isTrue(root.validate({
      name: 'William Shakespeare',
      email: 'bill@stratford-upon-avon.co.uk',
    }), 'minimal required properties to validate');
    assert.isTrue(root.validate({
      name: 'William Shakespeare',
      email: 'bill@stratford-upon-avon.co.uk',
      address: 'Henley Street, Stratford-upon-Avon, Warwickshire, England',
      authorship: 'in question',
    }), 'required properties satisfied with addional properties');
    assert.isFalse(root.validate({
      name: 'William Shakespeare',
      address: 'Henley Street, Stratford-upon-Avon, Warwickshire, England',
    }), 'missing email address');
  });

  it('should validate true for unknown property names when additionalProperties is true', function () {
    compileJSONSchema('objectProps1a', {
      type: 'object',
      properties: {
        number: { type: 'number' },
        street_name: { type: 'string' },
        street_type: { enum: ['Street', 'Avenue', 'Boulevard'] },
      },
    });

    const root = getJSONSchema('objectProps1a');
    assert.isTrue(root.validate({
      number: 1600, street_name: 'Pennsylvania', street_type: 'Avenue',
    }), 'valid typed address');
    assert.isFalse(root.validate({
      number: '1600', street_name: 'Pennsylvania', street_type: 'Avenue',
    }), 'invalid address number');
    assert.isTrue(root.validate({ }), 'empty address object');
    assert.isTrue(root.validate({
      number: 1600, street_name: 'Pennsylvania',
    }), 'valid us address');
    assert.isTrue(root.validate({
      number: 1600, street_name: 'Pennsylvania', street_type: 'Avenue', direction: 'NW',
    }), 'additional properties is default true');
  });

  it('should validate object prohibiting additionalProperties', function () {
    compileJSONSchema('objectProps1b', {
      type: 'object',
      properties: {
        number: { type: 'number' },
        street_name: { type: 'string' },
        street_type: { enum: ['Street', 'Avenue', 'Boulevard'] },
      },
      additionalProperties: false,
    });

    const root = getJSONSchema('objectProps1b');
    assert.isTrue(root.validate({
      number: 1600, street_name: 'Pennsylvania', street_type: 'Avenue',
    }), 'valid typed address');
    assert.isFalse(root.validate({
      number: 1600, street_name: 'Pennsylvania', street_type: 'Avenue', direction: 'NW',
    }), 'to many keys typed address');

  });

  it('should validate object with typed additionalProperties', function () {
    compileJSONSchema('objectProps1c', {
      type: 'object',
      properties: {
        number: { type: 'number' },
        street_name: { type: 'string' },
        street_type: { enum: ['Street', 'Avenue', 'Boulevard'] },
      },
      additionalProperties: {
        type: 'string',
      },
    });

    const root = getJSONSchema('objectProps1c');
    assert.isTrue(root.validate({
      number: 1600, street_name: 'Pennsylvania', street_type: 'Avenue',
    }), 'valid typed address');
    assert.isTrue(root.validate({
      number: 1600, street_name: 'Pennsylvania', street_type: 'Avenue', direction: 'NW',
    }), 'valid typed address with typed additionalProperties');
    assert.isFalse(root.validate({
      number: 1600, street_name: 'Pennsylvania', street_type: 'Avenue', office_number: 201,
    }), 'invalid address wrongly typed additionalProperties');


  });

  it('should validate propertyNames', function () {
    compileJSONSchema('propertyNames1', {
      type: 'oject',
      propertyNames: {
        pattern: '^[A-Za-z_][A-Za-z0-9_]*$',
      },
    });

    const root = getJSONSchema('propertyNames');
    assert.isTrue(root.validate({ _a_proper_token_001: 'value' }), 'a valid id/key token');
    assert.isFalse(root.validate({ '001 invalid': 'key' }), 'an invalid id/key token');
  });

  it('should validate patternProperties 1', function () {
    compileJSONSchema('objectPatterns1', {
      type: 'object',
      patternProperties: {
        '^S_': { type: 'string' },
        '^I_': { type: 'integer' },
      },
      additionalProperties: false,
    });

    const root = getJSONSchema('objectPatterns1');
    assert.isTrue(root.validate({ S_25: 'This is a string' }), 'key within pattern with string value');
    assert.isTrue(root.validate({ I_42: 42 }), 'key within pattern with integer value');
    assert.isFalse(root.validate({ S_0: 108 }), 'key with pattern but wrong value type');
    assert.isFalse(root.validate({ I_42: '42' }), 'key integer within pattern but wrong value type');
    assert.isFalse(root.validate({ keyword: 'value' }), 'wrong key value pair');
  });

  it('should validate patternProperties 2', function () {
    compileJSONSchema('objectPatterns2', {
      type: 'object',
      properties: {
        buildin: { type: 'number' },
      },
      patternProperties: {
        '^S_': { type: 'string' },
        '^I_': { type: 'integer' },
      },
      additionalProperties: {
        type: 'string',
      },
    });

    const root = getJSONSchema('objectPatterns2');
    assert.isTrue(root.validate({ S_25: 'This is a string' }), 'key within pattern with string value');
    assert.isTrue(root.validate({ I_42: 42 }), 'key within integer pattern with integer value');
    assert.isFalse(root.validate({ S_0: 108 }), 'key within string pattern but wrong value type');
    assert.isFalse(root.validate({ I_42: '42' }), 'key within integer pattern but wrong value type');
    assert.isTrue(root.validate({ keyword: 'value' }), 'is of value type string');
    assert.isTrue(root.validate({ buildin: 5 }), 'buildin property is number type');
  });

  it('should validate dependencies 1a', function () {
    compileJSONSchema('objectDeps1a', {
      type: 'object',
      properties: {
        name: { type: 'string' },
        credit_card: { type: 'number' },
        billing_address: { type: 'string' },
      },
      required: ['name'],
      dependencies: {
        credit_card: ['billing_address'],
      },
    });

    const root = getJSONSchema('objectDeps1a');
    assert.isTrue(
      root.validate({
        name: 'Joham Doe',
        credit_card: 5555555555555555,
        billing_address: '555 Debtor\'s Lane',
      }),
      'creditcard and billing address are present',
    );
    assert.isFalse(
      root.validate({
        name: 'Joham Doe',
        credit_card: 5555555555555555,
      }),
      'credit card needs billing address',
    );
    assert.isTrue(
      root.validate({
        name: 'Joham Doe',
      }),
      'a single name is valid',
    );
    assert.isTrue(
      root.validate({
        name: 'Joham Doe',
        billing_address: '555 Debtor\'s Lane',
      }),
      'a name with billing address is valid',
    );
  });

  it('should validate dependencies 1b', function () {
    compileJSONSchema('objectDeps1b', {
      type: 'object',
      properties: {
        name: { type: 'string' },
        credit_card: { type: 'number' },
        billing_address: { type: 'string' },
      },
      required: ['name'],
      dependencies: {
        credit_card: ['billing_address'],
        billing_address: ['credit_card'],
      },
    });

    const root = getJSONSchema('objectDeps1b');
    assert.isTrue(
      root.validate({
        name: 'Joham Doe',
        credit_card: 5555555555555555,
        billing_address: '555 Debtor\'s Lane',
      }),
      'creditcard and billing address are present',
    );
    assert.isFalse(
      root.validate({
        name: 'Joham Doe',
        credit_card: 5555555555555555,
      }),
      'creditcard needs billing address',
    );
    assert.isFalse(
      root.validate({
        name: 'Joham Doe',
        billing_address: '555 Debtor\'s Lane',
      }),
      'a billing address needs a creditcard',
    );

  });

  it('should validate dependencies 2', function () {
    compileJSONSchema('objectDeps2', {
      type: 'object',
      properties: {
        name: { type: 'string' },
        credit_card: { type: 'number' },
        billing_address: { type: 'string' },
      },
      required: ['name'],
      dependencies: {
        credit_card: {
          properties: {
            billing_address: { type: 'string' },
          },
          required: ['billing_address'],
        },
      },
    });

    const root = getJSONSchema('objectDeps2');
    assert.isTrue(
      root.validate({
        name: 'Joham Doe',
        credit_card: 5555555555555555,
        billing_address: '555 Debtor\'s Lane',
      }),
      'creditcard and billing address are present',
    );
    assert.isFalse(
      root.validate({
        name: 'Joham Doe',
        credit_card: 5555555555555555,
      }),
      'creditcard needs billing address',
    );
    assert.isTrue(
      root.validate({
        name: 'Joham Doe',
        billing_address: '555 Debtor\'s Lane',
      }),
      'a billing address only is present',
    );

  });

});
