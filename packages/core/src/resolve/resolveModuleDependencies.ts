import * as path from "path";
import ts from "typescript";
import { ResolveResult } from "./model/ResolveResult.js";
import { ResolvedModule } from "./model/ResolvedModule.js";
import { resolveFile } from "./resolveFile.js";
import { getResolvedFeature } from "./operations/getResolvedFeature.js";
import { getResolvedModule } from "./operations/getResolvedModule.js";

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
        // TODO: This might be wrong, but this way we can still check against external modules even if they are not installed
        if (!node.moduleSpecifier.text.trim().startsWith(".")) {
          resolvedModule.externalModuleByModuleName.set(
            node.moduleSpecifier.text,
            {
              name: node.moduleSpecifier.text,
              tsImportOrExportDeclaration: node,
            }
          );
        }

        return;
      }

      const { resolvedFileName, isExternalLibraryImport } = resolvedTsModule;

      if (isExternalLibraryImport) {
        resolvedModule.externalModuleByModuleName.set(
          node.moduleSpecifier.text,
          { name: node.moduleSpecifier.text, tsImportOrExportDeclaration: node }
        );

        return;
      }

      const moduleFilepath = path.normalize(resolvedFileName);

      const resolved = resolveFile(resolveResult, resolvedFileName);

      if (!resolved) {
        return;
      }

      resolvedModule?.dependencyModuleFilePaths.add(moduleFilepath);

      resolvedModule?.dependencyModuleInfoByFilePath.set(moduleFilepath, {
        tsImportOrExportDeclaration: node,
      });

      const resolvedDependencyModule = getResolvedModule(
        resolveResult,
        moduleFilepath
      );

      if (
        "featureName" in resolvedModule &&
        "featureName" in resolvedDependencyModule &&
        resolvedModule.featureName !== resolvedDependencyModule.featureName
      ) {
        const resolvedFeature = getResolvedFeature(
          resolveResult,
          resolvedModule.featureName
        );

        const dependencyModuleFilesPaths =
          resolvedFeature.dependencyModuleFilePathsByFeatureName.get(
            resolvedDependencyModule.featureName
          ) ?? new Set();

        dependencyModuleFilesPaths.add(moduleFilepath);

        resolvedFeature.dependencyModuleFilePathsByFeatureName.set(
          resolvedDependencyModule.featureName,
          dependencyModuleFilesPaths
        );
      }

      resolvedDependencyModule.dependentModuleFilesPaths.add(
        path.normalize(filePath)
      );
    }
  });
}
