
export function String_createRegExp(pattern) {
  try {
    if (pattern != null) {
      if (pattern.constructor === String) {
        const parts = pattern.split('/');
        let regex = pattern;
        let options = '';
        if (parts.length > 1) {
          regex = parts[1];
          options = parts[2];
        }
        return new RegExp(regex, options);
      }
      if (pattern.constructor === Array && pattern.length > 1) {
        return new RegExp(pattern[0], pattern[1]);
      }
      if (pattern.constructor === RegExp) {
        return pattern; // TODO: no checks here....
      }
    }
    return undefined;
  }
  catch (e) {
    return undefined;
  }
}

export function String_trimLeft(str, c) {
  let i = 0;
  while (str[i] === c) i++;
  return i === 0 ? str : str.substring(i);
}
