import {
  compileJSONSchema,
  getJSONSchema,
  registerDefaultFormatCompilers,
} from '../../src/json';

import {
  assert,
} from './util';

registerDefaultFormatCompilers();

compileJSONSchema('fhostname2', { format: 'idn-hostname' });
const root = getJSONSchema('fhostname2');
assert.isTrue(root.validate(undefined), 'undefined is true');
assert.isTrue(root.validate(null), 'null is true');
assert.isTrue(root.validate('실례.테스트'), 'a valid hostname (example.test in Hangul)');
assert.isTrue(root.validate('a실례.테스트'), 'a valid first asci mixed hostname (example.test in Hangul)');
assert.isTrue(root.validate('실례.com'), 'a valid mixed hostname (example.test in Hangul)');
assert.isFalse(root.validate('〮실례.테스트'), 'illegal first char U+302E Hangul single dot tone mark');
assert.isFalse(root.validate('실〮례.테스트'), 'contains illegal char U+302E Hangul single dot tone mark');
assert.isFalse(root.validate('실실실실실실실실실실실실실실실실실실실실실실실실실실실실실실실실실실실실실실실실실실실실실실실실실실실실례례테스트례례례례례례례례례례례례례례례례례테스트례례례례례례례례례례례례례례례례례례례테스트례례례례례례례례례례례례테스트례례실례.테스트'), 'a host name with a component too long');
