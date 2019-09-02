import {
  compileJSONSchema,
  getJSONSchema,
  // registerDefaultFormatCompilers,
} from '../../src/json';

import {
  assert,
} from './util';

// registerDefaultFormatCompilers();

compileJSONSchema('bigintMulOf1', { multipleOf: BigInt(2) });

const root = getJSONSchema('bigintMulOf1');
assert.isTrue(root.validate(BigInt(10)), 'ten is multipleOf 2');
assert.isTrue(root.validate(10), 'forgive ten is a multipleOf 2 aswell');
assert.isFalse(root.validate(BigInt(7)), 'seven is not a multipleOf 2');
assert.isFalse(root.validate(7), 'forgive seven is not a multipleOf 2');
assert.isTrue(root.validate('7'), 'ignores a number string');
assert.isTrue(root.validate('foo'), 'ignores NaN string');
