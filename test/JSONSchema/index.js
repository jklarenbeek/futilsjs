import {
  compileJSONSchema,
  getJSONSchema,
  // registerDefaultFormatCompilers,
} from '../../src/json';

import {
  assert,
} from './util';

// registerDefaultFormatCompilers();

assert.isTrue(compileJSONSchema('emptyAnyOf1', {
  anyOf: [
    { type: 'number' },
    { },
  ],
}), 'compiling');

const root = getJSONSchema('emptyAnyOf1');
assert.isTrue(root.validate('foobar'), 'string is valid');
assert.isTrue(root.validate(1234), 'number is valid');
