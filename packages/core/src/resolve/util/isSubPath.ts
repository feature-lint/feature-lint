import * as path from "path";

// From https://stackoverflow.com/a/45242825
export function isSubPath(parentPath: string, childPath: string): boolean {
  const relative = path.relative(parentPath, childPath);

  return !!relative && !relative.startsWith("..") && !path.isAbsolute(relative);
}
