import {
  compileJSONSchema,
  getJSONSchema,
  // registerDefaultFormatCompilers,
} from '../../src/json';

import {
  assert,
} from './util';

// registerDefaultFormatCompilers();

compileJSONSchema('integerBasic1', { type: 'integer' });

const root = getJSONSchema('integerBasic1');
assert.isTrue(root.validate(42), 'validates an integer');
assert.isTrue(root.validate(-1), 'validates a negative integer');
assert.isFalse(root.validate(Math.PI), 'not validates a float');
assert.isTrue(root.validate('42'), 'not validates a string');
assert.isFalse(root.validate({}), 'does not validate an object');
assert.isFalse(root.validate([]), 'does not validate an array');
