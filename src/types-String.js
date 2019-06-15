
export function String_byteCount(str) {
  /**
   * console.info(
   *   new Blob(['😂']).size,                             // 4
   *   new Blob(['👍']).size,                             // 4
   *   new Blob(['😂👍']).size,                           // 8
   *   new Blob(['👍😂']).size,                           // 8
   *   new Blob(['I\'m a string']).size,                  // 12
   *
   *   // from Premasagar correction of Lauri's answer for
   *   // strings containing lone characters in the surrogate pair range:
   *   // https://stackoverflow.com/a/39488643/6225838
   *   new Blob([String.fromCharCode(55555)]).size,       // 3
   *   new Blob([String.fromCharCode(55555, 57000)]).size // 4 (not 6)
   * );
   *
   * nodejs => return Buffer.byteLength(string, 'utf8');
   */
  
  // return encodeURI(str).split(/%..|./).length - 1;
  return encodeURI(str).split(/%(?:u[0-9A-F]{2})?[0-9A-F]{2}|./).length - 1;
}

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
        return pattern;
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
