import { FeatureLintConfig } from "../config/model/FeatureLintConfig.js";
import { Result, Success } from "../shared/util/Result.js";
import { createTsProgram } from "./operations/createTsProgram.js";
import { ResolvedBuildingBlock } from "./model/ResolvedBuildingBlock.js";
import { ResolvedFeature } from "./model/ResolvedFeature.js";
import { ResolvedRoot } from "./model/ResolvedRoot.js";
import { ResolveResult } from "./model/ResolveResult.js";
import { isSamePath } from "./util/samePath.js";
import { walkDirectory } from "./util/walkDirectory.js";
import { resolveDirectory } from "./resolveDirectory";
import { resolveFile } from "./resolveFile";

export const resolve = (
  featureLintConfig: FeatureLintConfig,
  configFilePath: string,
  rootDirectoryPath: string
): Result<ResolveResult, any> => {
  const resolvedRoot: ResolvedRoot = {
    thingyType: "root",

    tsProgram: createTsProgram(configFilePath),

    featureNames: new Set(),

    config: featureLintConfig,

    configFilePath,
    rootDirectoryPath,

    violations: new Set(),

    moduleFilePaths: new Set(),
  };

  const resolveResult: ResolveResult = {
    resolvedRoot,

    resolvedFeatureByName: new Map(),
    resolvedBuildingBlockByUniqueName: new Map(),
    resolvedModuleByFilePath: new Map(),
  };

  walkDirectory(rootDirectoryPath, (aPath, isDirectory) => {
    if (isSamePath(rootDirectoryPath, aPath)) {
      return;
    }

    if (isDirectory) {
      resolveDirectory(resolveResult, aPath);
    } else {
      resolveFile(resolveResult, aPath);
    }
  });

  return Success(resolveResult);
};
