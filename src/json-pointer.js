export const JSONPointer_pathSeparator = '/';
export function JSONPointer_addFolder(path, folder) {
  // TODO: test folder name is valid
  path = path.trim();
  folder = folder.trim();
  if (path.length === 0) {
    return JSONPointer_pathSeparator + folder;
  }
  else if (path.indexOf(JSONPointer_pathSeparator, path.length - 1) === 0) {
    return path + folder;
  }
  else {
    return path + JSONPointer_pathSeparator + folder;
  }
}
export const JSONPointer_entrySeparator = ':';
export function JSONPointer_addEntry(path, entry) {
  // TODO: what the h@%$ll is that name again...
  return path + JSONPointer_entrySeparator + entry;
}
