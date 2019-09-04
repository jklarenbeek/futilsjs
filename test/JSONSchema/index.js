import {
  compileJSONSchema,
  getJSONSchema,
  // registerDefaultFormatCompilers,
} from '../../src/json';

import {
  assert,
} from './util';

// registerDefaultFormatCompilers();

assert.isTrue(compileJSONSchema('requiredOneOf1', {
  type: 'object',
  oneOf: [
    { required: ['foo', 'bar'] },
    { required: ['foo', 'baz'] },
  ],
}));

const root = getJSONSchema('requiredOneOf1');
assert.isFalse(root.validate({ bar: 2 }), 'one property is both invalid');
assert.isTrue(root.validate({ foo: 1, bar: 2 }), 'first oneOf valid');
assert.isTrue(root.validate({ foo: 3, baz: 4 }), 'second oneOf valid');
assert.isFalse(root.validate({ foo: 1, bar: 2, baz: 3 }), 'both oneOf match is invalid');
