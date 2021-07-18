import * as path from "path";
import ts from "typescript";
import { findFeatureConfig } from "../config/operations/findFeatureConfig.js";
import { BuildingBlockConfig } from "../config/model/BuildingBlockConfig.js";
import { createEmptyFeatureConfig } from "../config/model/FeatureConfig.js";
import { FeatureLintConfig } from "../config/model/FeatureLintConfig.js";
import { FeatureTypeConfig } from "../config/model/FeatureTypeConfig.js";
import { Failure, Result, Success } from "../shared/util/Result.js";
import { buildUniqueBuildingBlockName } from "./operations/buildUniqueBuildingBlockName.js";
import { computeFeatureTypeName } from "./operations/computeFeatureTypeName.js";
import { createTsProgram } from "./operations/createTsProgram.js";
import { getUniqueBuildingBlockName } from "./operations/getUniqueBuildingBlockName.js";
import { ResolvedBuildingBlock } from "./model/ResolvedBuildingBlock.js";
import { ResolvedFeature } from "./model/ResolvedFeature.js";
import { ResolvedModule } from "./model/ResolvedModule.js";
import { ResolvedRoot } from "./model/ResolvedRoot.js";
import { ResolveState } from "./model/ResolveState.js";
import { buildPathHierachy as buildPathHierarchy } from "./util/buildPathHierachy.js";
import { isSubPath } from "./util/isSubPath.js";
import { isSamePath } from "./util/samePath.js";
import { walkDirectory } from "./util/walkDirectory.js";

type InRootState = {
  type: "inRoot";
};

type InFeatureState = {
  type: "inFeature";
  feature: ResolvedFeature;
};

type InFeatureFolderState = {
  type: "inFeatureFolder";
  feature: ResolvedFeature;
};

type InBuildingBlockState = {
  type: "inBuildingBlock";

  buildingBlock: ResolvedBuildingBlock;
};

const getFeatureTypeConfig = (
  featureLintConfig: FeatureLintConfig,
  featureTypeName: string | undefined
): FeatureTypeConfig => {
  const featureType = featureLintConfig.featureTypes.find((featureType) => {
    return featureType.name === featureTypeName;
  });

  if (featureType !== undefined) {
    return featureType;
  }

  return {
    // TODO: Better name for synthetic feature types
    name: "",

    buildingBlocks: [],

    rules: [],
  };
};

type State =
  | InRootState
  | InFeatureState
  | InFeatureFolderState
  | InBuildingBlockState;

export const resolve = (
  featureLintConfig: FeatureLintConfig,
  configFilePath: string,
  rootDirectoryPath: string
): Result<ResolveState, any> => {
  const tsProgram = createTsProgram(configFilePath);

  const resolvedRoot: ResolvedRoot = {
    featureNames: new Set(),

    config: featureLintConfig,

    configFilePath,
    rootDirectoryPath,

    violations: new Set(),
  };

  const resolveState: ResolveState = {
    resolvedRoot,

    resolvedFeatureByName: new Map(),
    resolvedBuildingBlockByUniqueName: new Map(),
    resolvedModuleByFilePath: new Map(),
  };

  walkDirectory(rootDirectoryPath, (aPath, isDirectory) => {
    if (isSamePath(rootDirectoryPath, aPath)) {
      return;
    }

    const resolveDirectory = (directoryPath: string): State => {
      const pathHierarchy = buildPathHierarchy(
        directoryPath,
        rootDirectoryPath
      );

      let state: State = { type: "inRoot" };

      // TODO: Use cache
      for (const hierarchyPath of pathHierarchy) {
        if (state.type === "inRoot") {
          const featureName = path.basename(hierarchyPath);

          const getOrCreateResolvedFeature = (): ResolvedFeature => {
            if (resolveState.resolvedFeatureByName.has(featureName)) {
              return resolveState.resolvedFeatureByName.get(featureName)!;
            }

            const featureConfig =
              findFeatureConfig(hierarchyPath) ??
              createEmptyFeatureConfig(featureName);

            const featureTypeName = computeFeatureTypeName(
              featureLintConfig,
              featureConfig
            );

            const featureTypeConfig = getFeatureTypeConfig(
              featureLintConfig,
              featureTypeName
            );

            const resolvedFeature: ResolvedFeature = {
              name: featureName,

              featureConfig,
              featureTypeConfig,

              featureTypeName,

              parentFeatureName: undefined,
              childFeatureNames: new Set(),

              buildingBlockNames: new Set(),

              moduleFilePaths: new Set(),

              violations: new Set(),
            };

            resolveState.resolvedFeatureByName.set(
              featureName,
              resolvedFeature
            );

            return resolvedFeature;
          };

          const resolvedFeature = getOrCreateResolvedFeature();

          resolvedRoot.featureNames.add(featureName);

          state = {
            type: "inFeature",
            feature: resolvedFeature,
          };

          continue;
        }

        if (state.type === "inFeatureFolder") {
          const featureName = path.basename(hierarchyPath);

          const getOrCreateResolvedFeature = (
            inFeatureFolderState: InFeatureFolderState
          ): ResolvedFeature => {
            if (resolveState.resolvedFeatureByName.has(featureName)) {
              return resolveState.resolvedFeatureByName.get(featureName)!;
            }

            const featureConfig =
              findFeatureConfig(hierarchyPath) ??
              createEmptyFeatureConfig(featureName);

            const featureTypeName = computeFeatureTypeName(
              featureLintConfig,
              featureConfig
            );

            const featureTypeConfig = getFeatureTypeConfig(
              featureLintConfig,
              featureTypeName
            );

            const resolvedFeature: ResolvedFeature = {
              name: featureName,

              featureConfig,
              featureTypeConfig,

              featureTypeName,

              parentFeatureName: inFeatureFolderState.feature.name,
              childFeatureNames: new Set(),

              buildingBlockNames: new Set(),

              moduleFilePaths: new Set(),

              violations: new Set(),
            };

            resolveState.resolvedFeatureByName.set(
              featureName,
              resolvedFeature
            );

            return resolvedFeature;
          };

          const resolvedFeature = getOrCreateResolvedFeature(state);

          state.feature.childFeatureNames.add(featureName);

          state = {
            type: "inFeature",
            feature: resolvedFeature,
          };

          continue;
        }

        if (state.type === "inFeature") {
          const directoryName = path.basename(hierarchyPath);

          // TODO: Read features folder name from config
          if (directoryName === "features") {
            state = {
              type: "inFeatureFolder",
              feature: state.feature,
            };

            continue;
          }

          const buildingBlockName = directoryName;

          const uniqueBuildingBlockName = buildUniqueBuildingBlockName(
            state.feature.name,
            buildingBlockName
          );

          const getOrCreateResolvedBuildingBlock = (
            inFeatureState: InFeatureState
          ): ResolvedBuildingBlock => {
            if (
              resolveState.resolvedBuildingBlockByUniqueName.has(
                uniqueBuildingBlockName
              )
            ) {
              return resolveState.resolvedBuildingBlockByUniqueName.get(
                uniqueBuildingBlockName
              )!;
            }

            const getBuildingBlockConfig = (
              feature: ResolvedFeature,
              buildingBlockName: string
            ): Result<BuildingBlockConfig, BuildingBlockConfig> => {
              const buildingBlock =
                feature.featureTypeConfig.buildingBlocks.find(
                  (buildingBlock) => {
                    return buildingBlock.name === buildingBlockName;
                  }
                );

              if (buildingBlock !== undefined) {
                return Success(buildingBlock);
              }

              return Failure({
                name: buildingBlockName,

                rules: [],
              });
            };

            const buildingBlockConfigResult = getBuildingBlockConfig(
              inFeatureState.feature,
              buildingBlockName
            );

            const resolvedBuildingBlock: ResolvedBuildingBlock = {
              name: directoryName,

              buildingBlockConfig: buildingBlockConfigResult.successful
                ? buildingBlockConfigResult.data
                : buildingBlockConfigResult.error,

              unknown: !buildingBlockConfigResult.successful,

              featureName: inFeatureState.feature.name,

              moduleFilePaths: new Set(),

              violations: new Set(),
            };

            resolveState.resolvedBuildingBlockByUniqueName.set(
              getUniqueBuildingBlockName(resolvedBuildingBlock),
              resolvedBuildingBlock
            );

            return resolvedBuildingBlock;
          };

          const resolvedBuildingBlock = getOrCreateResolvedBuildingBlock(state);

          state.feature.buildingBlockNames.add(resolvedBuildingBlock.name);

          state = {
            type: "inBuildingBlock",
            buildingBlock: resolvedBuildingBlock,
          };
        }
      }

      return state;
    };

    const resolveFile = (filePath: string): boolean => {
      if (resolveState.resolvedModuleByFilePath.has(path.normalize(filePath))) {
        return true;
      }

      if (!isSubPath(rootDirectoryPath, filePath)) {
        return false;
      }

      const directoryPath = path.dirname(filePath);

      const state = resolveDirectory(directoryPath);

      const tsSourceFile = tsProgram.getSourceFile(filePath);

      if (tsSourceFile === undefined) {
        return false;
      }

      const createResolvedModule = (): ResolvedModule | undefined => {
        switch (state.type) {
          case "inFeature": {
            state.feature.moduleFilePaths.add(filePath);

            return {
              type: "featureModule",

              tsSourceFile,

              filePath: path.normalize(filePath),

              featureName: state.feature.name,

              dependencyModuleFilePaths: new Set(),
              dependencyModuleInfoByFilePath: new Map(),

              dependentModuleFilesPaths: new Set(),
            };
          }
          case "inBuildingBlock": {
            state.buildingBlock.moduleFilePaths.add(filePath);

            return {
              type: "buildingBlockModule",

              tsSourceFile,

              filePath: path.normalize(filePath),

              featureName: state.buildingBlock.featureName,
              buildingBlockName: state.buildingBlock.name,

              dependencyModuleFilePaths: new Set(),
              dependencyModuleInfoByFilePath: new Map(),

              dependentModuleFilesPaths: new Set(),
            };
          }
        }

        return undefined;
      };

      const resolvedModule = createResolvedModule();

      if (resolvedModule === undefined) {
        return false;
      }

      resolveState.resolvedModuleByFilePath.set(filePath, resolvedModule);

      ts.forEachChild(tsSourceFile, (node) => {
        if (ts.isImportDeclaration(node)) {
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

          const { resolvedFileName, isExternalLibraryImport } =
            resolvedTsModule;

          if (isExternalLibraryImport) {
            return;
          }

          resolvedModule?.dependencyModuleFilePaths.add(
            path.normalize(resolvedFileName)
          );

          resolvedModule?.dependencyModuleInfoByFilePath.set(
            path.normalize(resolvedFileName),
            {
              tsImportDeclaration: node,
            }
          );

          const resolved = resolveFile(resolvedFileName);

          if (!resolved) {
            return;
          }

          resolveState.resolvedModuleByFilePath
            .get(path.normalize(resolvedFileName))
            ?.dependentModuleFilesPaths.add(path.normalize(filePath));
        }

        if (ts.isExportDeclaration(node)) {
          // TODO
        }
      });

      return true;
    };

    if (isDirectory) {
      resolveDirectory(aPath);
    } else {
      resolveFile(aPath);
    }

    // TODO: Build up a cache

    // TODO: Resolve module and analyse module dependencies
  });

  return Success(resolveState);
};
