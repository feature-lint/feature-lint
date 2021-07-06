import * as path from "path";

export function isSamePath(firstPath: string, secondPath: string) {
  return path.relative(firstPath, secondPath) === "";
}
