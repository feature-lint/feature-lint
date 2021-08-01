import ts from "typescript";

export type ResolvedModule =
  | ResolvedFeatureModule
  | ResolvedBuildingBlockModule
  | ResolvedRootModule;

export type ResolvedModuleType =
  | "rootModule"
  | "featureModule"
  | "buildingBlockModule";

interface DependencyModuleInfo {
  tsImportOrExportDeclaration: ts.ImportDeclaration | ts.ExportDeclaration;
}

interface CommonResolvedModule {
  thingyType: "module";

  // name: string | undefined;
  type: ResolvedModuleType;

  filePath: string;

  tsSourceFile: ts.SourceFile;

  dependencyModuleFilePaths: Set<string>;

  dependencyModuleInfoByFilePath: Map<string, DependencyModuleInfo>;

  dependentModuleFilesPaths: Set<string>;

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
