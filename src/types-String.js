import { isPureArray, isPureString } from './types-base';

export function createRegex(pattern) {
  try {
    if (isPureArray(pattern)) {
      return new RegExp(pattern[0], pattern[1]);
    }
    else if (isPureString(pattern)) {
      const parts = pattern.split('/');
      let regex = pattern;
      let options = '';
      if (parts.length > 1) {
        regex = parts[1];
        options = parts[2];
      }
      return new RegExp(regex, options);
    }
    return null;
  }
  catch (e) {
    return null;
  }
}
