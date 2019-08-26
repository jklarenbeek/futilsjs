/* eslint-disable import/no-named-default */
/* eslint-disable no-console */
import {
  compileJSONSchema,
  getJSONSchema,
  // registerDefaultFormatCompilers,
// eslint-disable-next-line import/no-unresolved
} from '../../src/json';

// registerDefaultFormatCompilers();

compileJSONSchema('arrayContains1', {
  type: 'array',
  contains: {
    type: 'number',
  },
});
const root = getJSONSchema('arrayContains1');
console.log(root.validate([1, 2, 3, 4, 5]), 'All number array validates');
console.log(root.validate(['life', 'universe', 'everything', 42]), 'A single “number” is enough to make this pass');
console.log(root.validate(['life', 'universe', 'everything', 'forty-two']), 'But if we have no number, it fails');
