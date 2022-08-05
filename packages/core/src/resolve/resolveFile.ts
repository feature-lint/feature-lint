import * as path from "path";
import { ResolveResult } from "./model/ResolveResult.js";
import { isSubPath } from "./util/isSubPath.js";
import { createModule } from "./createModule.js";
import { resolveDirectory } from "./resolveDirectory.js";
import { resolveModuleDependencies } from "./resolveModuleDependencies.js";
import { resolveModuleTopLevelFunctions } from "./resolveTopLevelFunctions";

export function resolveFile(
  resolveResult: ResolveResult,
  filePath: string
): boolean {
  const { tsProgram, rootDirectoryPath } = resolveResult.resolvedRoot;

  if (resolveResult.resolvedModuleByFilePath.has(path.normalize(filePath))) {
    return true;
  }

  if (!isSubPath(rootDirectoryPath, filePath)) {
    return false;
  }

  const directoryPath = path.dirname(filePath);

  const state = resolveDirectory(resolveResult, directoryPath);

  // TODO: Handle non-ts files in a graceful manner

  const tsSourceFile = tsProgram.getSourceFile(filePath);

  if (tsSourceFile === undefined) {
    return false;
  }

  const resolvedModule = createModule(
    resolveResult,
    state,
    tsSourceFile,
    filePath
  );

  resolveResult.resolvedModuleByFilePath.set(filePath, resolvedModule);

  resolveModuleDependencies(resolveResult, resolvedModule);
  resolveModuleTopLevelFunctions(resolveResult, resolvedModule);

  return true;
}
