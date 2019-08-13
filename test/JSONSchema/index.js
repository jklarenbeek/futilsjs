/* eslint-disable import/no-named-default */
/* eslint-disable no-console */
import {
  JSONSchemaDocument,
  JSONSchemaBooleanType,
// eslint-disable-next-line import/no-unresolved
} from '__futilsjs';

import data from './examples/basic-person.json';

const doc = new JSONSchemaDocument();
doc.registerDefaultSchemaHandlers();
doc.registerDefaultFormatCompilers();
doc.loadSchema(data);

console.log(doc, new JSONSchemaBooleanType());

const schemadoc = loadJSONSchema('http://localhost/contact.json');
const ContactForm = schemadoc.createComponent({ default: 'data' });

export default function () {
  return (<ContactForm />);
}

const docCache = new Map();
