/* eslint-disable object-curly-newline */
import {
  compileJSONSchema,
  getJSONSchema,
  registerDefaultFormatCompilers,
} from '../../src/json';

import {
  assert,
} from './util';

registerDefaultFormatCompilers();

compileJSONSchema('objectReq1', {
  type: 'object',
  properties: {
    name: { type: 'string' },
    email: { type: 'string' },
    address: { type: 'string' },
    telephone: { type: 'string' },
  },
  required: ['name', 'email'],
});

const root = getJSONSchema('objectReq1');
assert.isTrue(root.validate({
  name: 'William Shakespeare',
  email: 'bill@stratford-upon-avon.co.uk',
}), 'minimal required properties to validate');
assert.isTrue(root.validate({
  name: 'William Shakespeare',
  email: 'bill@stratford-upon-avon.co.uk',
  address: 'Henley Street, Stratford-upon-Avon, Warwickshire, England',
  authorship: 'in question',
}), 'required properties satisfied with addional properties');
assert.isFalse(root.validate({
  name: 'William Shakespeare',
  address: 'Henley Street, Stratford-upon-Avon, Warwickshire, England',
}), 'missing email address');
