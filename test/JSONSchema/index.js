import {
  compileJSONSchema,
  getJSONSchema,
  // registerDefaultFormatCompilers,
} from '../../src/json';

import {
  assert,
} from './util';

// registerDefaultFormatCompilers();

compileJSONSchema('tupleAddItems1', {
  type: 'array',
  items: [
    { type: 'number' },
    { type: 'string' },
    { type: 'string', enum: ['Street', 'Avenue', 'Boulevard'] },
    { type: 'string', enum: ['NW', 'NE', 'SW', 'SE'] },
  ],
});

const root = getJSONSchema('tupleAddItem1');
assert.isTrue(root.validate([1600, 'Pennsylvania', 'Avenue', 'NW']), 'valid address');
assert.isFalse(root.validate([24, 'Sussex', 'Drive']), 'invalid value at item 3');
assert.isFalse(root.validate(['Palais de l\'Élysée']), 'missing street number');
assert.isTrue(root.validate([10, 'Downing', 'Street']), 'does not need all items');
assert.isTrue(root.validate([1600, 'Pennsylvania', 'Avenue', 'NW', 'Washington']), 'additionalItems is default true');
