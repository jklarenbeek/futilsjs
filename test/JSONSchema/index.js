import {
  compileJSONSchema,
  getJSONSchema,
  // registerDefaultFormatCompilers,
} from '../../src/json';

import {
  assert,
} from './util';

// registerDefaultFormatCompilers();

compileJSONSchema('objectBasic1', { type: 'object' });

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

const root = getJSONSchema('objectBasic1');
assert.isTrue(root.validate(undefined), 'undefined is always true!');
assert.isFalse(root.validate(null), 'not validates null!');
assert.isTrue(root.validate({}), 'validates an empty object literal');
assert.isTrue(root.validate(testObj1), 'validates a simple object with strings');
assert.isTrue(root.validate(testObj2), 'validates a simple object with numbers');
assert.isFalse(root.validate(2.99792458e8), 'not validates a float literal');
assert.isFalse(root.validate('Is Not Valid'), 'not validates a string');
assert.isFalse(root.validate(['is', 'not', 'an', 'object']), 'not validates an array');
