import * as path from "path";
import { isSamePath } from "./samePath.js";

export function buildPathHierachy(
  aPath: string,
  rootDirectoryPath: string
): string[] {
  if (isSamePath(aPath, rootDirectoryPath)) {
    return [];
  }

  const hierarchy = [aPath];

  let currentPath = aPath;

  while (true) {
    const newCurrentPath = path.dirname(currentPath);

    if (isSamePath(newCurrentPath, currentPath)) {
      return hierarchy;
    }

    if (isSamePath(newCurrentPath, rootDirectoryPath)) {
      return hierarchy;
    }

    currentPath = newCurrentPath;

    hierarchy.unshift(currentPath);
  }
}
