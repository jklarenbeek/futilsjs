
function compileDefaultControl(schemaObj, jsonSchema) {

}

export function compileObjectControl(schemaObj, jsonSchema) {
  const vars = getInputStringAttr(schemaObj, jsonSchema);
  if (vars == null) return undefined;

  const props = vars.props;
  const defval = props.value;

  // retrieve validator function
  const validate = schemaObj.validate;

  // cache constant id as schemapath for datalist
  const listid = Symbol(schemaObj.schemaPath);
  //const examples = getExampleStringValues(jsonSchema);

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
  return function renderObjectControl(data) {
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
