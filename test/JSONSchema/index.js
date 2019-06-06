/* eslint-disable import/no-named-default */
/* eslint-disable no-console */
import {
  JSONSchemaDocument,
  JSONSchemaBoolean,
} from '__futilsjs';

import data from './examples/basic-person.json';

const doc = new JSONSchemaDocument();
doc.registerDefaultSchemaHandlers();
doc.loadSchema(data);

console.log(doc, new JSONSchemaBoolean());
