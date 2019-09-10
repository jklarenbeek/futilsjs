
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

export function String_trimLeft(str, c) {
  let i = 0;
  while (str[i] === c) ++i;
  return i === 0 ? str : str.substring(i);
}

export function String_trimRight(str, c) {
  let l = str.length;
  while (c === str[--l]);
  return str.slice(0, l + 1);
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

export function String_fromSnakeToCamel(str) {
  throw new Error('not implemented', str);
}

export function String_fromCamelToSnake(str) {
  throw new Error('not implemented', str);
}

export function Letter_isEmptyOrWhiteSpace(str, i = 0) {
  if (str == null) return true;

  const c = str[i]; //.chatAt(i);
  return c === ' '
    || c === '\f'
    || c === '\n'
    || c === '\t'
    || c === '\v'
    || c === '\u00A0'
    || c === '\u1680​'
    || c === '\u180e'
    || c === '\u2000'
    || c === '​\u2001'
    || c === '\u2002'
    || c === '​\u2003'
    || c === '\u2004​'
    || c === '\u2005'
    || c === '\u2006'
    || c === '\u2008'
    || c === '​\u2009'
    || c === '\u200a'
    || c === '​\u2028'
    || c === '\u2029'
    || c === '​\u2028'
    || c === '\u2029'
    || c === '​\u202f'
    || c === '\u205f'
    || c === '​\u3000';
}

export function Letter_isSymbol(str, i = 0) {
  if (str == null) return false;
  const c = str[i];
  return c === '_'
    || c === '~'
    || c === '!'
    || c === '?'
    || c === '@'
    || c === '#'
    || c === '$'
    || c === '='
    || c === '%'
    || c === '^'
    || c === '&'
    || c === '|'
    || c === '+'
    || c === '-'
    || c === '*'
    || c === '/'
    || c === '('
    || c === ')'
    || c === '['
    || c === ']'
    || c === '{'
    || c === '}'
    || c === '<'
    || c === '>'
    || c === '.'
    || c === ','
    || c === ':'
    || c === ';'
    || c === '\"'
    || c === '\''
    || c === '\`'
    || c === '\\';
}

export function Letter_isUpperCase(str, i = 0) {
  throw new Error('not implemented', i);
}

export function Letter_isLowerCase(str, i = 0) {
  throw new Error('not implemented', i);
}

export function Letter_isTileCase(str, i = 0) {
  throw new Error('not implemented', i);
}

export function Letter_isModifierLetter(str, i = 0) {
  throw new Error('not implemented', i);
}

export function Letter_isOtherLetter(str, i = 0) {
  throw new Error('not implemented', i);
}

export function Letter_isNumberLetter(str, i = 0) {
  throw new Error('not implemented', i);
}
