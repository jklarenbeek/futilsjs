export const JSONPointer_pathSeparator = '/';
export function JSONPointer_addFolder(path, folder) {
  // TODO: test folder name is valid
  if (path === JSONPointer_pathSeparator) {
    return path + folder;
  }
}

