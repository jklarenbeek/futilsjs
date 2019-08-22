export const JSONPointer_pathSeparator = '/';

export function JSONPointer_concatPath(parent, key, ...extra) {
  if (extra.length > 0) {
    const all = [parent, key, ...extra];
    return all.join(JSONPointer_pathSeparator);
  }
  return parent + JSONPointer_pathSeparator + key;
}
