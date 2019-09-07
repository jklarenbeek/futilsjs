import {
  compileJSONSchema,
  getJSONSchema,
  // registerDefaultFormatCompilers,
} from '../../src/json';

import {
  assert,
} from './util';

// registerDefaultFormatCompilers();

assert.isTrue(compileJSONSchema('dependencies3', {
  dependencies: {
    foo: true,
    bar: false,
  },
}), 'compiling');
const root = getJSONSchema('dependencies3');
assert.isTrue(root.validate({ foo: 1 }), 'object with property having schema true is valid');
assert.isFalse(root.validate({ bar: 2 }), 'object with property having schema false is invalid');
assert.isFalse(root.validate({ foo: 1, bar: 2 }), 'object with both boolean properties is invalid');
assert.isTrue(root.validate({}), 'empty object is valid');
