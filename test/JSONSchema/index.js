import {
  compileJSONSchema,
  getJSONSchema,
  // registerDefaultFormatCompilers,
} from '../../src/json';

import {
  assert,
} from './util';

// registerDefaultFormatCompilers();

compileJSONSchema('nullableTypeArray1', { type: ['number', 'string', 'null'] });

const root = getJSONSchema('nullableTypeArray1');
assert.isTrue(root.validate(undefined), 'undefined is always true!');
assert.isTrue(root.validate(null), 'null is not a number or string');
assert.isTrue(root.validate(42), 'validates an integer');
assert.isTrue(root.validate(Math.PI), 'validates a number');
assert.isTrue(root.validate('Math.PI'), 'validates a string');
assert.isFalse(root.validate([42, '42']), 'does not validate an array');
assert.isFalse(root.validate({}), 'does not validate an object');
