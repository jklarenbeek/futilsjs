export function isFnEx(typeString) {
  return typeString === 'function';
}

export function isFn(obj) {
  return typeof obj === 'function';
}

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
