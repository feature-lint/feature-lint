import ts from "typescript";

export type ResolvedModule =
  | ResolvedFeatureModule
  | ResolvedBuildingBlockModule;

interface DependencyModuleInfo {
  tsImportDeclaration: ts.ImportDeclaration;
}

interface CommonResolvedModule {
  // name: string | undefined;
  filePath: string;

  tsSourceFile: ts.SourceFile;

  dependencyModuleFilePaths: Set<string>;

  dependencyModuleInfoByFilePath: Map<string, DependencyModuleInfo>;

  dependentModuleFilesPaths: Set<string>;
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
