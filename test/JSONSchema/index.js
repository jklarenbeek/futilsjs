/* eslint-disable import/no-named-default */
/* eslint-disable no-console */
import {
  compileJSONSchema,
  getJSONSchema,
  registerDefaultFormatCompilers,
// eslint-disable-next-line import/no-unresolved
} from '__futilsjs/json';

import data1 from './draft7/01.type.basic1.00.json';
import data2 from './draft7/05.object.props2.00.json';
import data2a from './draft7/05.object.props2.01.true.json';
import data2b from './draft7/05.object.props2.02.false.json';

registerDefaultFormatCompilers();

compileJSONSchema('01.type.basic1.00', data1);
compileJSONSchema('11.combining.allOf3.00', data2);

const doc1 = getJSONSchema('01.type.basic1.00');
console.log(doc1.baseUri, true, doc1.validate(42), doc1.errors);
console.log(doc1.baseUri, false, doc1.validate('42'), doc1.errors);

const doc2 = getJSONSchema('05.object.props2.00');
console.log(doc2.baseUri, true, doc2.validate(data2a), doc2.errors);
console.log(doc2.baseUri, false, doc2.validate(data2b), doc2.errors);
