export const JSONPointer_pathSeparator = '/';

export function JSONPointer_pathConcat(parent, key) {
  return parent + JSONPointer_pathSeparator + key;
}
