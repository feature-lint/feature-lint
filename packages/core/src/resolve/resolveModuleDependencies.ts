import * as path from "path";
import ts from "typescript";
import { ResolveResult } from "./model/ResolveResult.js";
import { ResolvedModule } from "./model/ResolvedModule.js";
import { resolveFile } from "./resolveFile";

export function resolveModuleDependencies(
  resolveResult: ResolveResult,
  resolvedModule: ResolvedModule
) {
  const { tsProgram } = resolveResult.resolvedRoot;

  const { tsSourceFile, filePath } = resolvedModule;

  // TODO: Handle Dynamic imports and maybe even require?

  ts.forEachChild(tsSourceFile, (node) => {
    if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) {
      if (!node.moduleSpecifier) {
        return;
      }

      if (!ts.isStringLiteral(node.moduleSpecifier)) {
        return;
      }

      const { resolvedModule: resolvedTsModule } = ts.resolveModuleName(
        node.moduleSpecifier.text,
        tsSourceFile.fileName,
        tsProgram.getCompilerOptions(),
        ts.sys
      );

      if (resolvedTsModule === undefined) {
        return;
      }

      const { resolvedFileName, isExternalLibraryImport } = resolvedTsModule;

      // TODO: We might want to include them to implement restricted import rules
      if (isExternalLibraryImport) {
        return;
      }

      resolvedModule?.dependencyModuleFilePaths.add(
        path.normalize(resolvedFileName)
      );

      resolvedModule?.dependencyModuleInfoByFilePath.set(
        path.normalize(resolvedFileName),
        {
          tsImportOrExportDeclaration: node,
        }
      );

      const resolved = resolveFile(resolveResult, resolvedFileName);

      if (!resolved) {
        return;
      }

      resolveResult.resolvedModuleByFilePath
        .get(path.normalize(resolvedFileName))
        ?.dependentModuleFilesPaths.add(path.normalize(filePath));
    }
  });
}
