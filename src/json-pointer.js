/* eslint-disable eqeqeq */
import { String_trimLeft } from './types-String';


export const JSONPointer_pathSeparator = '/';
export const JSONPointer_fragmentSeparator = '#';

export function JSONPointer_addFolder(path, folder) {
  // TODO: test folder name is valid
  if (typeof path === 'string') {
    path = path.trim();
    folder = (folder || '').trim();
    if (path.length === 0) {
      return JSONPointer_pathSeparator + folder;
    }
    else if (path.indexOf(JSONPointer_pathSeparator, path.length - 1) === 0) {
      return path + folder;
    }
    else {
      return path + JSONPointer_pathSeparator + folder;
    }
  }
  return JSONPointer_pathSeparator;
}

export function JSONPointer_traverseFilterObjectBF(obj, id = '$ref', callback) {
  const qarr = [];

  // traverse tree breath first
  let current = obj;
  while (typeof current === 'object') {
    if (current.constructor === Array) {
      for (let i = 0; i < current.length; ++i) {
        const child = current[i];
        if (typeof child === 'object') {
          qarr.push(child);
        }
      }
    }
    else {
      const keys = Object.keys(current);
      for (let i = 0; i < keys.length; ++i) {
        const key = keys[i];
        if (key == id) {
          callback(current);
          continue;
        }
        const child = obj[key];
        if (typeof child === 'object') {
          qarr.push(child);
        }
      }
    }
    current = qarr.shift();
  }
}

function JSONPointer_createGetFunction(dst, id, next) {
  id = Number(id) || decodeURIComponent(id) || '';
  if (next) {
    const f = JSONPointer_compileGetPointer(next);
    if (f) {
      if (dst === 0 || dst === 1) { // BUG: dst === 0?
        return function JSONPointer_resursiveGetFunction(obj) {
          return typeof obj === 'object'
            ? f(obj[id])
            : f(obj);
        };
      }
      else if (dst > 1) { // WARNING
        // TODO: probably doesnt work!
        return function JSONPointer_traverseGetFunction(obj) {
          const qarr = [];
          JSONPointer_traverseFilterObjectBF(obj, id,
            function JSONPointer_traverseGetFunctionCallback(o) {
              qarr.push(f(o[id]));
            });
          return qarr;
        };
      }
    }
  }

  if (dst > 1) return function JSONPointer_defaultTraverseGetFunction(obj) {
    const qarr = [];
    JSONPointer_traverseFilterObjectBF(obj, id,
      function JSONPointer_defaultTraverseGetFunctionCallback(o) {
        qarr.push(o[id]);
      });
    return qarr;
  };
  else return function JSONPointer_defaultGetFunction(obj) {
    return (typeof obj === 'object') ? obj[id] : obj;
  };
}

export function JSONPointer_compileGetPointer(path) {
  path = typeof path === 'string' ? path : '';
  if (path === '') return function JSONPointer_compileGetRootFunction(obj) {
    return obj;
  };

  const token = String_trimLeft(path, JSONPointer_pathSeparator);
  const dist = path.length - token.length;
  const arr = [];
  let csr = 0;

  for (let i = 0; i < token.length; ++i) {
    const c = token[i];
    if (c === '/' && csr === 0) {
      const j = arr.length > 0 ? arr[0][0] : i;
      const ct = token.substring(0, j);
      const nt = token.substring(i);
      return JSONPointer_createGetFunction(dist, ct, nt);
    }
    else if (c === '[') { // TODO: handle index and conditionals
      arr[csr] = [i, -1];
      csr++;
    }
    else if (c === ']') {
      csr--; // TODO: add check < 0
      arr[csr][1] = i;
    }
  }

  const j = arr.length > 0 ? arr[0][0] : token.length;
  const ct = token.substring(0, j);
  return JSONPointer_createGetFunction(dist, ct, null);
}

export class JSONPointer {
  constructor(baseUri, pointer) {
    if (!pointer) {
      pointer = baseUri;
      baseUri = null;
    }

    pointer = typeof pointer !== 'string'
      ? ''
      : pointer;

    // trim whitespace left.
    pointer = pointer.replace(/^\s+/, '');

    // check if there is a baseUri and fragment in the pointer
    const baseIdx = pointer.indexOf(JSONPointer_fragmentSeparator);
    // rewrite baseUri and json pointer if so
    if (baseIdx > 0) baseUri = pointer.substring(0, baseIdx);
    if (baseIdx >= 0) pointer = pointer.substring(baseIdx + 1);

    // setup basic flags
    this.isFragment = baseIdx >= 0;
    this.isAbsolute = pointer[0] === JSONPointer_pathSeparator;

    // setup pointer
    this.baseUri = baseUri;
    this.pointer = pointer;
    this.get = JSONPointer_compileGetPointer(pointer);
  }

  toString() {
    return (this.baseUri || '')
      + (this.isFragment ? JSONPointer_fragmentSeparator : '')
      + this.pointer;
  }
}
