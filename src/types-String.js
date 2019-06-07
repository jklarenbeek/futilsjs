
export function String_createRegExp(pattern) {
  try {
    if (pattern != null) {
      if (pattern.constructor === String) {
        if (pattern[0] === '/') {
          const e = pattern.lastIndexOf('/');
          if (e >= 0) {
            const r = pattern.substring(1, e);
            const g = pattern.substring(e + 1);
            return new RegExp(r, g);
          }
        }
        return new RegExp(pattern);
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

export function String_encodeURI(str) {
  str = encodeURIComponent(str);
  return str.replace(/[!'()*]/g, function String_encodeURICallback(c) {
    return '%' + c.charCodeAt(0).toString(16);
  });
}

export function String_decodeURI(str) {
  str = str.replace(/%(27|28|29|2A)/ig, function String_decodeURICallback(s, h) {
    return String.fromCharCode(parseInt(h, 16));
  });
  return decodeURIComponent(str);
}
