/* eslint-disable import/no-named-default */
/* eslint-disable no-console */
import {
  compileJSONSchema,
  getJSONSchema,
  // registerDefaultFormatCompilers,
// eslint-disable-next-line import/no-unresolved
} from '../../src/json';

// registerDefaultFormatCompilers();

compileJSONSchema('enumBasic3', {
  type: 'string',
  enum: ['red', 'amber', 'green', null, 42],
});

const root = getJSONSchema('enumBasic3');
console.log(root.validate('red'), 'red is a valid enum type');
console.log(root.validate(null), 'null will not be accepted!');
