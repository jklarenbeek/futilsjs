import {
  isNumberType,
  isStringType,
  isArrayType,
  isObjectType,
} from '../../types/core';

import {
  getNumbishType,
  getArrayTypeMinItems,
  getStringType,
  getObjectType,
  getBooleanType,
} from '../../types/getters';

import {
  h,
} from '../../vnode/base';

const Options = list => list.map(item => h('option', item));

const DataList = (id, list) => h('datalist',
  { id: id },
  Options(list));


function getDefaultStringValue(jsonSchema) {
  return (isStringType(jsonSchema.const)
      && jsonSchema.const)
    || (isStringType(jsonSchema.default)
      && jsonSchema.default)
    || (isArrayType(jsonSchema.enum)
      && isStringType(jsonSchema.enum[0])
      && jsonSchema.enum[0]);
}

function getExampleStringValues(jsonSchema) {
  const examples = getArrayTypeMinItems(jsonSchema.examples, 1);
  if (examples == null) return undefined;

  const list = [];
  for (let i = 0; i < examples.length; ++i) {
    const val = examples[i];
    if (isStringType(val))
      list[list.length] = { value: val };
    else if (isObjectType(val) && isStringType(val.value))
      list[list.length] = val;
  }

  if (list.length === 0)
    return undefined;

  return list;
}

function getInputStringAttr(schemaObj, jsonSchema) {
  const control = isStringType(jsonSchema.control)
    ? { type: jsonSchema.control }
    : getObjectType(jsonSchema.control, {});

  if (schemaObj.hasMemberOfType('string') === false
    && control.type !== 'text'
    && control.type !== 'search'
    && control.type !== 'tel'
    && control.type !== 'url'
    && control.type !== 'email'
    && control.type !== 'password')
    return undefined;

  const props = {};
  props.type = control.type || 'number';

  const required = (schemaObj.getMemberValue('required', false) !== false)
    || (schemaObj.getMemberValue('nullable', false) !== false)
    || (schemaObj.hasType('null') === false);
  if (required) props.required = true;

  if (jsonSchema.hasOwnProperty('readOnly'))
    props.readOnly = getBooleanType(jsonSchema.readOnly, true);

  const defval = getDefaultStringValue(jsonSchema);
  if (defval) props.value = defval;

  const minLength = schemaObj.getMemberValue('minLength');
  if (minLength) props.minLength = minLength;
  const maxLength = schemaObj.getMemberValue('maxLength');
  if (maxLength) props.maxLength = maxLength;
  const pattern = schemaObj.getMemberValue('pattern');
  if (pattern) props.pattern = pattern;

  const placeholder = getStringType(control.placeholder);
  if (placeholder) props.placeholder = placeholder;

  return props;
}

export function compileInputNumber(schemaObj, jsonSchema) {
  const vars = getInputStringAttr(schemaObj, jsonSchema);
  if (vars == null) return undefined;

  const props = vars.props;
  const defval = props.value;

  // retrieve validator function
  const validate = schemaObj.validate;

  // cache constant id as schemapath for datalist
  const listid = Symbol(schemaObj.schemaPath);
  const examples = getExampleStringValues(jsonSchema);

  // update state
  function Validated(state, value) {
    return value;
  }

  // event handler
  function targetValue(event) {
    const target = event.target;
    const value = getNumbishType(target.value);
    if (validate(value))
      target.setCustomValidity('');
    else
      target.setCustomValidity('TODO set error message');

    return value;
  }

  // return renderer
  return function renderInputString(data) {
    return [
      h('input', {
        ...props,
        list: listid,
        value: (data == null ? defval : data),
        onInput: [Validated, targetValue],
      }),
      examples && DataList(listid, examples),
    ];
  };
}
