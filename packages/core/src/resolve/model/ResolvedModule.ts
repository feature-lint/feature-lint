import ts from "typescript";
import { TopLevelFunction } from "../resolveTopLevelFunctions";

export type ResolvedModule =
  | ResolvedFeatureModule
  | ResolvedBuildingBlockModule
  | ResolvedRootModule;

export type ResolvedModuleType =
  | "rootModule"
  | "featureModule"
  | "buildingBlockModule";

export interface DependencyModuleInfo {
  tsImportOrExportDeclaration: ts.ImportDeclaration | ts.ExportDeclaration;
}

export interface ExternalModule {
  name: string;
  tsImportOrExportDeclaration: ts.ImportDeclaration | ts.ExportDeclaration;
}

interface CommonResolvedModule {
  thingyType: "module";

  // name: string | undefined;
  type: ResolvedModuleType;

  filePath: string;

  tsSourceFile: ts.SourceFile;

  externalModuleByModuleName: Map<string, ExternalModule>;

  dependencyModuleFilePaths: Set<string>;

  dependencyModuleInfoByFilePath: Map<string, DependencyModuleInfo>;

  dependentModuleFilesPaths: Set<string>;

  topLevelFunctions: Set<TopLevelFunction>;

  buildingBlockPrivate: boolean;

  featurePrivate: boolean;

  /**
   * It contains a Feature name.
   */
  parentFeaturePrivate: string | undefined;

  /**
   * It contains a Feature name.
   */
  siblingFeaturePrivate: string | undefined;
}

export interface ResolvedRootModule extends CommonResolvedModule {
  type: "rootModule";
}

export interface ResolvedFeatureModule extends CommonResolvedModule {
  type: "featureModule";

  featureName: string;
}

export interface ResolvedBuildingBlockModule extends CommonResolvedModule {
  type: "buildingBlockModule";

  featureName: string;
  buildingBlockName: string;
}
