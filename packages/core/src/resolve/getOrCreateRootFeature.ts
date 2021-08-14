import * as path from "path";
import { createEmptyFeatureConfig } from "../config/model/FeatureConfig.js";
import { findFeatureConfig } from "../config/operations/findFeatureConfig.js";
import { getFeatureTypeConfig } from "../config/operations/getFeatureTypeConfig";
import { ResolvedFeature } from "./model/ResolvedFeature.js";
import { ResolveResult } from "./model/ResolveResult.js";
import { computeFeatureTypeName } from "./operations/computeFeatureTypeName.js";

export function getOrCreateRootFeature(
  resolveResult: ResolveResult,
  featureDirectoryPath: string
): ResolvedFeature {
  const simpleFeatureName = path.basename(featureDirectoryPath);

  const featureName = simpleFeatureName;

  if (resolveResult.resolvedFeatureByName.has(featureName)) {
    return resolveResult.resolvedFeatureByName.get(featureName)!;
  }

  const featureConfig =
    findFeatureConfig(featureDirectoryPath) ??
    createEmptyFeatureConfig(simpleFeatureName);

  const { featureTypeName, matchedFeatureTypeNames } = computeFeatureTypeName(
    resolveResult,
    featureConfig,
    simpleFeatureName,
    undefined
  );

  const featureTypeConfig = getFeatureTypeConfig(
    resolveResult.resolvedRoot.config,
    featureTypeName
  );

  const resolvedFeature: ResolvedFeature = {
    thingyType: "feature",

    name: featureName,

    simpleName: simpleFeatureName,

    featureConfig,
    featureTypeConfig,

    featureTypeName,
    matchedFeatureTypeNames,

    parentFeatureName: undefined,
    childFeatureNames: new Set(),

    buildingBlockNames: new Set(),

    moduleFilePaths: new Set(),

    violations: new Set(),
  };

  resolveResult.resolvedFeatureByName.set(featureName, resolvedFeature);

  return resolvedFeature;
}
