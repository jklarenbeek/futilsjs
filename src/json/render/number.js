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


function getDefaultNumberValue(jsonSchema) {
  return (isNumberType(jsonSchema.const)
      && jsonSchema.const)
    || (isNumberType(jsonSchema.default)
      && jsonSchema.default)
    || (isArrayType(jsonSchema.enum)
      && isNumberType(jsonSchema.enum[0])
      && jsonSchema.enum[0]);
}

function getExampleNumberValues(jsonSchema) {
  const examples = getArrayTypeMinItems(jsonSchema.examples, 1);
  if (examples == null) return undefined;

  const list = [];
  for (let i = 0; i < examples.length; ++i) {
    const val = examples[i];
    if (isNumberType(val))
      list[list.length] = { value: val };
    else if (isObjectType(val) && isNumberType(val.value))
      list[list.length] = val;
  }

  if (list.length === 0)
    return undefined;

  return list;
}

function getInputNumberAttr(schemaObj, jsonSchema) {
  const control = isStringType(jsonSchema.control)
    ? { type: jsonSchema.control }
    : getObjectType(jsonSchema.control, {});

  if (schemaObj.hasMemberOfType('number') === false
    && control.type !== 'number'
    && control.type !== 'range')
    return undefined;

  const props = {};
  props.type = control.type || 'number';

  const required = (schemaObj.getMemberValue('required', false) !== false)
    || (schemaObj.getMemberValue('nullable', false) !== false)
    || (schemaObj.hasType('null') === false);
  if (required) props.required = true;

  if (jsonSchema.hasOwnProperty('readOnly'))
    props.readOnly = getBooleanType(jsonSchema.readOnly, true);

  const defval = getDefaultNumberValue(jsonSchema);
  if (defval) props.value = defval;

  const mulOf = schemaObj.getMemberValue('multipleOf');
  if (mulOf) props.step = mulOf;

  const max = schemaObj.getMemberValue('maximum');
  const emax = schemaObj.getMemberValue('exclusiveMaximum');
  if (max) props.maximum = max;
  else if (emax) props.maximum = emax - (mulOf || 1);

  const min = schemaObj.getMemberValue('minimum');
  const emin = schemaObj.getMemberValue('exclusiveMinimum');
  if (min) props.minimum = min;
  else if (emin) props.minimum = emin + (mulOf || 1);

  const high = getNumbishType(control.high);
  if (high) props.high = high;
  const optimum = getNumbishType(control.optimum);
  if (optimum) props.optimum = optimum;
  const low = getNumbishType(control.low);
  if (low) props.low = low;

  const placeholder = getStringType(control.placeholder);
  if (placeholder) props.placeholder = placeholder;

  return props;
}

export function compileInputNumber(schemaObj, jsonSchema) {
  const vars = getInputNumberAttr(schemaObj, jsonSchema);
  if (vars == null) return undefined;

  const props = vars.props;
  const defval = props.value;

  // retrieve validator function
  const validate = schemaObj.validate;

  // cache constant id as schemapath for datalist
  const listid = Symbol(schemaObj.schemaPath);
  const examples = getExampleNumberValues(jsonSchema);

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
  return function renderInputNumber(data) {
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
