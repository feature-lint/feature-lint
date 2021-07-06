import * as fs from "fs";
import * as path from "path";

export function walkDirectory(
  startDirectoryPath: string,
  pathHandler: (leafPath: string, isDirectory: boolean) => void
) {
  const pathStack = [startDirectoryPath];

  while (true) {
    const aPath = pathStack.pop();

    if (aPath === undefined) {
      break;
    }

    // TODO: Handle error
    const pathStats = fs.statSync(aPath);

    const pathIsDirectory = pathStats.isDirectory();

    pathHandler(aPath, pathIsDirectory);

    if (pathIsDirectory) {
      // TODO: Handle error
      const childPaths = fs
        .readdirSync(aPath)
        .sort()
        .reverse()
        .map((childName) => {
          return path.join(aPath, childName);
        });

      pathStack.push(...childPaths);

      continue;
    }
  }
}
