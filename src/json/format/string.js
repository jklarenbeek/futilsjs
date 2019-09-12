/* eslint-disable function-paren-newline */
/* eslint-disable quote-props */
import {
  isStringType,
} from '../../types/core';

import {
  isStringRegExp,
  isStringUri,
  isStringUriRef,
  isStringUriTemplate,
  isStringJSONPointer,
  isStringJSONPointerUriFragment,
  isStringRelativeJSONPointer,
  isStringUrl,
  isStringEmail,
  isStringHostname,
  isStringIdnEmail,
  isStringIdnHostname,
  isStringIPv4,
  isStringIPv6,
  isStringUUID,
  isStringAlpha,
  isStringAlphaNumeric,
  isStringIdentier,
  isStringHexaDecimal,
  isStringNumeric,
} from '../../types/regexp';

function createStringFormatCompiler(formatName, isFormatTest) {
  return function compileStringFormat(schemaObj, jsonSchema) {
    if (jsonSchema.format !== formatName) return undefined;

    const addError = schemaObj.createSingleErrorHandler(
      'format',
      formatName,
    );
    if (addError == null) return undefined;

    return function validateStringFormat(data) {
      return isStringType(data)
        ? isFormatTest(data)
          || addError(data)
        : true;
    };
  };
}

export function isStringUpperCase(str) {
  return str === str.toUpperCase();
}

export function isStringLowerCase(str) {
  return str === str.toLowerCase();
}

export const formatCompilers = {
  'alpha': createStringFormatCompiler(
    'alpha', isStringAlpha),
  'alphanumeric': createStringFormatCompiler(
    'alphanumeric', isStringAlphaNumeric),
  'identifier': createStringFormatCompiler(
    'identifier', isStringIdentier),
  'hexadecimal': createStringFormatCompiler(
    'hexadecimal', isStringHexaDecimal),
  'numeric': createStringFormatCompiler(
    'numeric', isStringNumeric),
  'uppercase': createStringFormatCompiler(
    'uppercase', isStringUpperCase),
  'lowercase': createStringFormatCompiler(
    'lowercase', isStringLowerCase),
  'regex': createStringFormatCompiler(
    'regex', isStringRegExp),
  'uri': createStringFormatCompiler(
    'uri', isStringUri),
  'uri-reference': createStringFormatCompiler(
    'uri-reference', isStringUriRef),
  'uri-template': createStringFormatCompiler(
    'uri-template', isStringUriTemplate),
  'url': createStringFormatCompiler(
    'url', isStringUrl),
  'email': createStringFormatCompiler(
    'email', isStringEmail),
  'hostname': createStringFormatCompiler(
    'hostname', isStringHostname),
  'idn-email': createStringFormatCompiler(
    'idn-email', isStringIdnEmail),
  'idn-hostname': createStringFormatCompiler(
    'idn-hostname', isStringIdnHostname),
  'ipv4': createStringFormatCompiler(
    'ipv4', isStringIPv4),
  'ipv6': createStringFormatCompiler(
    'ipv6', isStringIPv6),
  'uuid': createStringFormatCompiler(
    'uuid', isStringUUID),
  'json-pointer': createStringFormatCompiler(
    'json-pointer', isStringJSONPointer),
  'json-pointer-uri-fragment': createStringFormatCompiler(
    'json-pointer-uri-fragment', isStringJSONPointerUriFragment),
  'relative-json-pointer': createStringFormatCompiler(
    'relative-json-pointer', isStringRelativeJSONPointer),
};
