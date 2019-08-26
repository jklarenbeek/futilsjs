/* eslint-disable import/no-named-default */
/* eslint-disable no-console */
import {
  compileJSONSchema,
  getJSONSchema,
  // registerDefaultFormatCompilers,
// eslint-disable-next-line import/no-unresolved
} from '../../src/json';

// registerDefaultFormatCompilers();

compileJSONSchema('propertyNames1', {
  type: 'oject',
  propertyNames: {
    pattern: '^[A-Za-z_][A-Za-z0-9_]*$',
  },
});

const root = getJSONSchema('propertyNames');
console.log(root.validate({ _a_proper_token_001: 'value' }), 'a valid id/key token');
console.log(root.validate({ '001 invalid': 'key' }), 'an invalid id/key token');
