/* eslint-disable import/no-named-default */
/* eslint-disable no-console */
import {
  compileJSONSchema,
  getJSONSchema,
  // registerDefaultFormatCompilers,
// eslint-disable-next-line import/no-unresolved
} from '../../src/json';

// registerDefaultFormatCompilers();

compileJSONSchema('objectProps1a', {
  type: 'object',
  properties: {
    number: { type: 'number' },
    street_name: { type: 'string' },
    street_type: { enum: ['Street', 'Avenue', 'Boulevard'] },
  },
});

const root = getJSONSchema('objectProps1a');
console.log(root.validate({
  number: 1600, street_name: 'Pennsylvania', street_type: 'Avenue',
}), 'valid typed address');
console.log(root.validate({
  number: '1600', street_name: 'Pennsylvania', street_type: 'Avenue',
}), 'invalid address number');
console.log(root.validate({ }), 'empty address object');
console.log(root.validate({
  number: 1600, street_name: 'Pennsylvania',
}), 'valid us address');
console.log(root.validate({
  number: 1600, street_name: 'Pennsylvania', street_type: 'Avenue', direction: 'NW',
}), 'additional properties is default true');
