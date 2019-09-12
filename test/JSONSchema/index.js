import {
  compileJSONSchema,
  getJSONSchema,
  registerDefaultFormatCompilers,
} from '../../src/json';

import {
  assert,
} from './util';

registerDefaultFormatCompilers();

compileJSONSchema('firi1', { format: 'iri' });
const root = getJSONSchema('firi1');
assert.isTrue(root.validate(undefined), 'undefined is true');
assert.isTrue(root.validate(null), 'null is true');
assert.isTrue(root.validate('http://ƒøø.ßår/?∂éœ=πîx#πîüx'), 'a valid IRI with anchor tag');
assert.isTrue(root.validate('http://ƒøø.com/blah_(wîkïpédiå)_blah#ßité-1'), 'a valid IRI with anchor tag and parantheses');
assert.isTrue(root.validate('http://ƒøø.ßår/?q=Test%20URL-encoded%20stuff'), 'a valid IRI with URL-encoded stuff');
assert.isTrue(root.validate('http://-.~_!$&\'()*+,;=:%40:80%2f::::::@example.com'), 'a valid IRI with many special characters');
assert.isTrue(root.validate('http://[2001:0db8:85a3:0000:0000:8a2e:0370:7334]'), 'a valid IRI based on IPv6');
assert.isFalse(root.validate('http://2001:0db8:85a3:0000:0000:8a2e:0370:7334'), 'an invalid IRI based on IPv6');
assert.isFalse(root.validate('/abc'), 'an invalid relative IRI Reference');
assert.isFalse(root.validate('\\\\WINDOWS\\filëßåré'), 'an invalid IRI');
assert.isFalse(root.validate('âππ'), 'an invalid IRI though valid IRI reference');
