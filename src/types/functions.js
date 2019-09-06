import { isFn } from './core';

export function trueThat(whatever = true) {
  const that = true;
  return whatever === true || that;
}

export function falseThat(boring = true) {
  return false && boring;
}

export function undefThat(whatever = undefined) {
  return whatever !== undefined
    ? undefined
    : whatever;
}

export function fallbackFn(compiled, fallback = trueThat) {
  if (isFn(compiled)) return compiled;
  // eslint-disable-next-line no-unused-vars
  return isFn(fallback)
    ? fallback
    : trueThat;
}

export function addFunctionToArray(arr = [], fn) {
  if (fn == null) return arr;
  if (isFn(fn))
    arr.push(fn);
  else if (fn.constructor === Array) {
    for (let i = 0; i < fn.length; ++i) {
      if (isFn(fn[i]))
        arr.push(fn[i]);
    }
  }
  return arr;
}
