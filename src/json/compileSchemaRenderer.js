import {
  JSONPointer_addFolder,
  JSONPointer_traverseFilterObjectBF,
  JSONPointer,
} from './json-pointer';

export class JSONSchemaXMLObject {
  constructor(schema) {
    this.schema = schema;
    const xml = getPureObject(schema.xml, {});
    this.name = getPureString(xml.name);
    this.namespace = getPureString(xml.namespace);
    this.prefix = getPureString(xml.prefix);
    this.attribute = getPureBool(xml.attribute, false);
    this.wrapped = getPureBool(xml.wrapped, false);
    this.attributes = getPureObject(xml.attributes);
  }
}


export function JSONSchema_expandSchemaReferences(json, baseUri, callback) {
  // in place merge of object members
  // TODO: circular reference check.
  JSONPointer_traverseFilterObjectBF(json, '$ref',
    function JSONSchema_expandSchemaReferencesCallback(obj) {
      const ref = obj.$ref;
      delete obj.$ref;
      const pointer = new JSONPointer(baseUri, ref);
      const root = (pointer.baseUri != baseUri)
        ? (isFn(callback)
          ? callback(baseUri)
          : json)
        : json;
      const source = pointer.get(root);
      const keys = Object.keys(source);
      for (let i = 0; i < keys.length; ++i) {
        const key = keys[i];
        obj[key] = source[key];
      }
    });
}
