import {
  compileJSONSchema,
  getJSONSchema,
  registerDefaultFormatCompilers,
} from '../../src/json';

import {
  assert,
} from './util';

registerDefaultFormatCompilers();

compileJSONSchema('fdatetime1', { format: 'date-time' });
const root = getJSONSchema('fdatetime1');
assert.isTrue(root.validate(undefined), 'ignore undefined');
assert.isTrue(root.validate(null), 'ignore null');
assert.isTrue(root.validate(true), 'ignore boolean type');
assert.isTrue(root.validate(1), 'ignore number type');
assert.isTrue(root.validate({}), 'ignore object type');
assert.isTrue(root.validate([]), 'ignore array type');
assert.isTrue(root.validate('1963-06-19T08:30:06.283185Z'), 'a valid date-time string');
assert.isTrue(root.validate('1963-06-19T08:30:06Z'), 'a valid date-time string without second fraction');
assert.isTrue(root.validate('1937-01-01T12:00:27.87+00:20'), 'a valid date-time string with plus offset');
assert.isTrue(root.validate('1990-12-31T15:59:50.123-08:00'), 'a valid date-time string with minus offset');
assert.isFalse(root.validate('1990-02-31T15:59:60.123-08:00'), 'an invalid day in date-time string');
assert.isFalse(root.validate('1990-12-31T15:59:60-24:00'), 'an invalid offset in date-time string');
assert.isFalse(root.validate('06/19/1963 08:30:06 PST'), 'an invalid date-time string');
// assert.isTrue(root.validate('06/19/1963 08:30:06 PST'), 'a local date-time string');
assert.isTrue(root.validate('1963-06-19t08:30:06.283185z'), 'case-insensitive T and Z');
assert.isFalse(root.validate('2013-350T01:01:01'), 'only RFC3339 not all of ISO 8601 are valid');
