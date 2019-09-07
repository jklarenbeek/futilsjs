export const JSONPointer_pathSeparator = '/';

export function JSONPointer_concatPath(parent, key, ...extra) {
  if (extra.length > 0) {
    const all = [parent, key, ...extra];
    return all.join(JSONPointer_pathSeparator);
  }
  return parent + JSONPointer_pathSeparator + key;
}

// /* eslint-disable eqeqeq */
// import { String_trimLeft } from './types-String';


// export const JSONPointer_pathSeparator = '/';
// export const JSONPointer_fragmentSeparator = '#';

// export function JSONPointer_addFolder(pointer, folder) {
//   const isvalid = typeof pointer === 'string'
//     && (typeof folder === 'number'
//       || typeof folder === 'string');

//   if (isvalid) {
//     folder = String(folder);
//     if (folder.charAt(0) === '/') {
//       folder = folder.substring(1);
//     }
//     return pointer + JSONPointer_pathSeparator + folder;
//   }
// }

// export function JSONPointer_addRelativePointer(pointer, relative) {
//   const isvalid = typeof pointer === 'string'
//     && (typeof relative === 'number'
//       || typeof relative === 'string');

//   if (isvalid) {
//     if (pointer.charAt(0) === '/') {
//       if (typeof relative === 'string') {
//         const idx = String_indexOfEndInteger(0, relative);
//         if (idx > 0) {
//           const tokens = pointer.split('/');
//           tokens.shift();

//           const depth = tokens.length - Number(relative.substring(0, idx));
//           if (depth > 0) {
//             const parent = '/' + tokens.splice(0, depth).join('/');
//             const rest = relative.substring(idx);
//             return parent + JSONPointer_pathSeparator + rest;
//           }
//         }
//         else if (relative.charAt(0) === '/') {
//           return pointer + relative;
//         }
//         else {
//           return pointer + JSONPointer_pathSeparator + relative;
//         }
//       }
//       else { // typeof relative === 'number'
//         return pointer + JSONPointer_pathSeparator + String(relative);
//       }
//     }
//   }
//   return undefined;
// }

// export function JSONPointer_traverseFilterObjectBF(obj, id = '$ref', callback) {
//   const qarr = [];

//   // traverse tree breath first
//   let current = obj;
//   while (typeof current === 'object') {
//     if (current.constructor === Array) {
//       for (let i = 0; i < current.length; ++i) {
//         const child = current[i];
//         if (typeof child === 'object') {
//           qarr.push(child);
//         }
//       }
//     }
//     else {
//       const keys = Object.keys(current);
//       for (let i = 0; i < keys.length; ++i) {
//         const key = keys[i];
//         if (key == id) {
//           callback(current);
//           continue;
//         }
//         const child = obj[key];
//         if (typeof child === 'object') {
//           qarr.push(child);
//         }
//       }
//     }
//     current = qarr.shift();
//   }
// }

// function JSONPointer_createGetFunction(dst, id, next) {
//   id = Number(id) || decodeURIComponent(id) || '';
//   if (next) {
//     const f = JSONPointer_compileGetPointer(next);
//     if (f) {
//       if (dst === 0 || dst === 1) { // BUG: dst === 0?
//         return function JSONPointer_resursiveGetFunction(obj) {
//           return typeof obj === 'object'
//             ? f(obj[id])
//             : f(obj);
//         };
//       }
//       else if (dst > 1) { // WARNING
//         // TODO: probably doesnt work!
//         return function JSONPointer_traverseGetFunction(obj) {
//           const qarr = [];
//           JSONPointer_traverseFilterObjectBF(obj, id,
//             function JSONPointer_traverseGetFunctionCallback(o) {
//               qarr.push(f(o[id]));
//             });
//           return qarr;
//         };
//       }
//     }
//   }

//   if (dst > 1) return function JSONPointer_defaultTraverseGetFunction(obj) {
//     const qarr = [];
//     JSONPointer_traverseFilterObjectBF(obj, id,
//       function JSONPointer_defaultTraverseGetFunctionCallback(o) {
//         qarr.push(o[id]);
//       });
//     return qarr;
//   };
//   else return function JSONPointer_defaultGetFunction(obj) {
//     return (typeof obj === 'object') ? obj[id] : obj;
//   };
// }

// export function JSONPointer_compileGetPointer(path) {
//   path = typeof path === 'string' ? path : '';
//   if (path === '') return function JSONPointer_compileGetRootFunction(obj) {
//     return obj;
//   };

//   const token = String_trimLeft(path, JSONPointer_pathSeparator);
//   const dist = path.length - token.length;
//   const arr = [];
//   let csr = 0;

//   for (let i = 0; i < token.length; ++i) {
//     const c = token[i];
//     if (c === '/' && csr === 0) {
//       const j = arr.length > 0 ? arr[0][0] : i;
//       const ct = token.substring(0, j);
//       const nt = token.substring(i);
//       return JSONPointer_createGetFunction(dist, ct, nt);
//     }
//     else if (c === '[') { // TODO: handle index and conditionals
//       arr[csr] = [i, -1];
//       csr++;
//     }
//     else if (c === ']') {
//       csr--; // TODO: add check < 0
//       arr[csr][1] = i;
//     }
//   }

//   const j = arr.length > 0 ? arr[0][0] : token.length;
//   const ct = token.substring(0, j);
//   return JSONPointer_createGetFunction(dist, ct, null);
// }

// export function String_indexOfEndInteger(start = 0, search) {
//   if (typeof start === 'string') {
//     search = start;
//     start = 0;
//   }

//   if (typeof search === 'string') {
//     let i = start;
//     for (; i < search.length; ++i) {
//       if ((Number(search[i]) || false) === false) {
//         if ((i - start) > 0) {
//           return i;
//         }
//         else {
//           return -1;
//         }
//       }
//     }
//     if (i > 0) return i;
//   }
//   return -1;
// }

// export function JSONPointer_resolveRelative(pointer, relative) {
//   const idx = String_indexOfEndInteger(0, relative);
//   if (idx >= 0) {
//     const depth = relative.substring(0, idx);
//     const rest = relative.substring(idx);
//     const parent = JSONPointer_resolveRelative(pointer, Number(depth));
//     return JSONPointer_addFolder(parent, rest);
//   }
//   return pointer;
// }

// export class JSONPointer {
//   constructor(baseUri, basePointer, relative) {
//     if (!basePointer) {
//       basePointer = baseUri;
//       baseUri = null;
//     }
//     if (baseUri && !relative) {
//       if (Number(basePointer[0]) || false) {
//         relative = basePointer;
//         basePointer = baseUri;
//         baseUri = null;
//       }
//     }

//     basePointer = typeof pointer !== 'string'
//       ? ''
//       : basePointer;

//     // trim whitespace left.
//     basePointer = basePointer.replace(/^\s+/, '');

//     // check if there is a baseUri and fragment in the pointer
//     const baseIdx = basePointer.indexOf(JSONPointer_fragmentSeparator);
//     // rewrite baseUri and json pointer if so
//     if (baseIdx > 0) baseUri = basePointer.substring(0, baseIdx);
//     if (baseIdx >= 0) basePointer = basePointer.substring(baseIdx + 1);

//     if (!relative) {

//     }
//     // setup basic flags
//     this.isFragment = baseIdx >= 0;
//     this.isAbsolute = basePointer[0] === JSONPointer_pathSeparator;

//     // setup pointer
//     this.baseUri = baseUri;
//     this.basePointer = basePointer;

//     this.pointer = pointer;
//     this.relative = relative;
//     this.absolute = absolute;
//     this.get = JSONPointer_compileGetPointer(basePointer);
//   }

//   toString() {
//     return (this.baseUri || '')
//       + (this.isFragment ? JSONPointer_fragmentSeparator : '')
//       + this.pointer;
//   }
// }
