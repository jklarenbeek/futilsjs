import {
  compileJSONSchema,
  getJSONSchema,
  registerDefaultFormatCompilers,
} from '../../src/json';

import {
  assert,
} from './util';

registerDefaultFormatCompilers();

compileJSONSchema('fidnemail1', { format: 'idn-email' });
const root = getJSONSchema('fidnemail1');
assert.isTrue(root.validate(undefined), 'undefined is true');
assert.isTrue(root.validate(null), 'null is true');
assert.isTrue(root.validate('실례@실례.테스트'), 'a valid idn e-mail (example@example.test in Hangul)');
assert.isFalse(root.validate('2962'), 'an invalid idn e-mail address');
