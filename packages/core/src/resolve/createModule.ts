import * as path from "path";
import ts from "typescript";
import { ResolvedModule } from "./model/ResolvedModule.js";
import { ResolveResult } from "./model/ResolveResult.js";
import { ResolveState } from "./model/ResolveState";

export function createModule(
  resolveResult: ResolveResult,
  state: ResolveState,
  tsSourceFile: ts.SourceFile,
  moduleFilePath: string
): ResolvedModule {
  switch (state.type) {
    case "inRoot": {
      resolveResult.resolvedRoot.moduleFilePaths.add(moduleFilePath);

      return {
        thingyType: "module",

        type: "rootModule",

        tsSourceFile,

        externalModuleByModuleName: new Map(),

        filePath: path.normalize(moduleFilePath),

        dependencyModuleFilePaths: new Set(),
        dependencyModuleInfoByFilePath: new Map(),

        dependentModuleFilesPaths: new Set(),

        buildingBlockPrivate: false,

        featurePrivate: false,

        parentFeaturePrivate: undefined,

        siblingFeaturePrivate: undefined,
      };
    }
    case "inFeaturesFolder": {
      state.feature.moduleFilePaths.add(moduleFilePath);

      return {
        thingyType: "module",

        type: "featureModule",

        tsSourceFile,

        externalModuleByModuleName: new Map(),

        filePath: path.normalize(moduleFilePath),

        featureName: state.feature.name,

        dependencyModuleFilePaths: new Set(),
        dependencyModuleInfoByFilePath: new Map(),

        dependentModuleFilesPaths: new Set(),

        buildingBlockPrivate: false,

        // TODO
        featurePrivate: false,

        // TODO
        parentFeaturePrivate: undefined,

        // TODO
        siblingFeaturePrivate: undefined,
      };
    }
    case "inFeature": {
      state.feature.moduleFilePaths.add(moduleFilePath);

      return {
        thingyType: "module",

        type: "featureModule",

        tsSourceFile,

        externalModuleByModuleName: new Map(),

        filePath: path.normalize(moduleFilePath),

        featureName: state.feature.name,

        dependencyModuleFilePaths: new Set(),
        dependencyModuleInfoByFilePath: new Map(),

        dependentModuleFilesPaths: new Set(),

        buildingBlockPrivate: false,

        // TODO
        featurePrivate: false,

        // TODO
        parentFeaturePrivate: undefined,

        // TODO
        siblingFeaturePrivate: undefined,
      };
    }
    case "inBuildingBlock": {
      state.buildingBlock.moduleFilePaths.add(moduleFilePath);

      return {
        thingyType: "module",

        type: "buildingBlockModule",

        tsSourceFile,

        externalModuleByModuleName: new Map(),

        filePath: path.normalize(moduleFilePath),

        featureName: state.buildingBlock.featureName,
        buildingBlockName: state.buildingBlock.name,

        dependencyModuleFilePaths: new Set(),
        dependencyModuleInfoByFilePath: new Map(),

        dependentModuleFilesPaths: new Set(),

        buildingBlockPrivate: state.buildingBlockPrivate,

        featurePrivate: state.featurePrivate,

        parentFeaturePrivate: state.parentFeaturePrivate?.name,

        siblingFeaturePrivate: state.siblingFeaturePrivate?.name,
      };
    }
  }
}
