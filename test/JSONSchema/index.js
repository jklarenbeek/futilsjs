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
assert.isTrue(root.validate(undefined), 'undefined is valid');
assert.isTrue(root.validate(null), 'null is valid');
assert.isTrue(root.validate('foobar'), 'string is valid');
assert.isTrue(root.validate(1234), 'number is valid');
assert.isTrue(root.validate({ foo: 'bar' }), 'object is valid');
