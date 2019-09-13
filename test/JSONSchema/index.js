import {
  compileJSONSchema,
  getJSONSchema,
  registerDefaultFormatCompilers,
} from '../../src/json';

import {
  assert,
} from './util';

registerDefaultFormatCompilers();

assert.isTrue(compileJSONSchema('bigintExclusiveMaximum1', {
  exclusiveMaximum: BigInt(42),
}));

const root = getJSONSchema('bigintExclusiveMaximum1');
assert.isTrue(root.validate(BigInt(32)), 'below the exclusiveMaximum is valid');
assert.isFalse(root.validate(BigInt(42)), 'boundary point is invalid');
assert.isFalse(root.validate(BigInt(52)), 'above the exclusiveMaximum is invalid');
assert.isTrue(root.validate('x'), 'ignores non-numbers');
