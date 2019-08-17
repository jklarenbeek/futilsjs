import {
  isFn,
  fallbackFn,
  trueThat,
} from './isFunctionType';

function compileSchemaBasic(owner, schema, addMember) {
  const fnType = fallbackFn(
    compileSchemaType(owner, schema, addMember),
  );
  const fnFormat = fallbackFn(
    compileSchemaFormat(owner, schema, addMember),
  );
  const fnEnumPrimitive = fallbackFn(
    compileEnumPrimitive(owner, schema, addMember),
  );
  const fnNumberRange = fallbackFn(
    compileNumberRange(owner, schema, addMember),
  );
  const fnNumberMultipleOf = fallbackFn(
    compileNumberMultipleOf(owner, schema, addMember),
  );
  const fnStringLength = fallbackFn(
    compileStringLength(owner, schema, addMember),
  );
  const fnStringPattern = fallbackFn(
    compileStringPattern(owner, schema, addMember),
  );
  const fnObjectBasic = fallbackFn(
    compileObjectBasic(owner, schema, addMember),
  );
  const fnArraySize = fallbackFn(
    compileArraySize(owner, schema, addMember),
  );

  return function validateSchemaObject(data, dataRoot) {
    const vType = fnType(data, dataRoot);
    const vFormat = fnFormat(data, dataRoot);
    const vEnumPrimitive = fnEnumPrimitive(data, dataRoot);
    const vNumberRange = fnNumberRange(data, dataRoot);
    const vNumberMultipleOf = fnNumberMultipleOf(data, dataRoot);
    const vStringLength = fnStringLength(data, dataRoot);
    const vStringPattern = fnStringPattern(data, dataRoot);
    const vObjectBasic = fnObjectBasic(data, dataRoot);
    const vArraySize = fnArraySize(data, dataRoot);
    return vType
      && vFormat
      && vEnumPrimitive
      && vNumberRange
      && vNumberMultipleOf
      && vStringLength
      && vStringPattern
      && vObjectBasic
      && vArraySize;
  };
}

function compileSchemaChildren(owner, schema, addMember, addChildSchema) {
  const fnObject = fallbackFn(
    compileObjectChildren(owner, schema, addMember, addChildSchema),
  );
  const fnMap = fallbackFn(
    compileMapChildren(owner, schema, addMember, addChildSchema),
  );
  const fnArray = fallbackFn(
    compileArrayChildren(owner, schema, addMember, addChildSchema),
  );
  const fnSet = fallbackFn(
    compileSetChildren(owner, schema, addMember, addChildSchema),
  );
  const fnTuple = fallbackFn(
    compileTupleChildren(owner, schema, addMember, addChildSchema),
  );

  return function validateSchemaChildren(data, dataRoot) {
    return fnObject(data, dataRoot)
      && fnMap(data, dataRoot)
      && fnArray(data, dataRoot)
      && fnSet(data, dataRoot)
      && fnTuple(data, dataRoot);
  };
}

function compileSchemaRecursive(owner, schema, schemaPath, dataPath, regfn, errfn) {
  if (!isPureObjectReally(schema)) {
    return trueThat;
  }

  const addMember = function addMember(key, expected, fn, ...grp) {
    const member = new SchemaValidationMember(
      owner,
      schema,
      schemaPath,
      dataPath,
      key, expected,
      fn, grp,
    );
    return regfn(member,
      function compileJSONSchema_addError(value, ...rest) {
        const data = rest.length > 0
          ? [value, ...rest]
          : value;
        errfn(member, data);
        return false;
      },
    );
  };

  const validateBasic = compileSchemaBasic(
    owner,
    schema,
    addMember);

  const addChild = function addChildSchema(key, childSchema, fn) {
    return compileSchemaRecursive(owner, _schema, _schemaPath, _dataPath, regfn, errfn);
  };

  const validateChildren = compileSchemaChildren(
    owner,
    schema,
    addMember,
    addChild);

  return function validateSchemaRecursive(data, dataRoot) {
    return validateBasic(data, dataRoot)
      && validateChildren(data, dataRoot);
  };
}

export function compileSchemaObject(owner, regCallback, errCallback) {
  const regfn = isFn(regCallback)
    ? regCallback
    // eslint-disable-next-line no-unused-vars
    : function regCallbackProxy(member, callback) {
      return callback;
    };
  const errfn = isFn(errCallback)
    ? errCallback
    // eslint-disable-next-line no-unused-vars
    : function errCallbackProxy(member = false, callback) {
      return member;
    };

  return compileSchemaRecursive(
    owner,
    owner.getRootSchema(),
    owner.getRootSchemaPath(),
    owner.getRootDataPath(),
    regfn,
    errfn,
  );
}
