/* eslint-disable import/no-named-default */
/* eslint-disable no-console */
import {
  compileJSONSchema,
  getJSONSchema,
  // registerDefaultFormatCompilers,
// eslint-disable-next-line import/no-unresolved
} from '../../src/json';

// registerDefaultFormatCompilers();

compileJSONSchema('objectPatterns1', {
  type: 'object',
  patternProperties: {
    '^S_': { type: 'string' },
    '^I_': { type: 'integer' },
  },
  additionalProperties: false,
});

const root = getJSONSchema('objectPatterns1');
console.log(root.validate({ S_25: 'This is a string' }), 'key within pattern with string value');
console.log(root.validate({ I_42: 42 }), 'key within pattern with integer value');
console.log(root.validate({ S_0: 108 }), 'key with pattern but wrong value type');
console.log(root.validate({ I_42: '42' }), 'key integer within pattern but wrong value type');
console.log(root.validate({ keyword: 'value' }), 'wrong key value pair');
