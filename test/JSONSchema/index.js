import {
  compileJSONSchema,
  getJSONSchema,
  // registerDefaultFormatCompilers,
} from '../../src/json';

import {
  assert,
} from './util';

// registerDefaultFormatCompilers();

compileJSONSchema('constObject1', {
  const: { foo: 'bar', baz: 'bax' },
});
const root = getJSONSchema('constObject1');
assert.isTrue(root.validate({ foo: 'bar', baz: 'bax' }), 'same object is valid');
assert.isTrue(root.validate({ baz: 'bax', foo: 'bar' }), 'same object with different property order is valid');
assert.isFalse(root.validate({ foo: 'bar' }), 'another object is invalid');
assert.isFalse(root.validate([1, 2, 3]), 'another type is invalid');
