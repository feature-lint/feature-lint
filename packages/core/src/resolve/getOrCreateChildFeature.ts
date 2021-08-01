import { findFeatureConfig } from "../config/operations/findFeatureConfig.js";
import { createEmptyFeatureConfig } from "../config/model/FeatureConfig.js";
import { computeFeatureTypeName } from "./operations/computeFeatureTypeName.js";
import { ResolvedFeature } from "./model/ResolvedFeature.js";
import { ResolveResult } from "./model/ResolveResult.js";
import { getFeatureTypeConfig } from "../config/operations/getFeatureTypeConfig";
import { InFeaturesFolderResolveState } from "./model/ResolveState.js";

export function getOrCreateChildFeature(
  resolveResult: ResolveResult,
  inFeatureFolderState: InFeaturesFolderResolveState,
  featureName: string,
  featureDirectoryPath: string
): ResolvedFeature {
  if (resolveResult.resolvedFeatureByName.has(featureName)) {
    return resolveResult.resolvedFeatureByName.get(featureName)!;
  }

  const featureConfig =
    findFeatureConfig(featureDirectoryPath) ??
    createEmptyFeatureConfig(featureName);

  const featureTypeName = computeFeatureTypeName(
    resolveResult.resolvedRoot.config,
    featureConfig
  );

  const featureTypeConfig = getFeatureTypeConfig(
    resolveResult.resolvedRoot.config,
    featureTypeName
  );

  const resolvedFeature: ResolvedFeature = {
    thingyType: "feature",

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

  resolveResult.resolvedFeatureByName.set(featureName, resolvedFeature);

  return resolvedFeature;
}
