import * as path from "path";
import { createEmptyFeatureConfig } from "../config/model/FeatureConfig.js";
import { findFeatureConfig } from "../config/operations/findFeatureConfig.js";
import { getFeatureTypeConfig } from "../config/operations/getFeatureTypeConfig";
import { ResolvedFeature } from "./model/ResolvedFeature.js";
import { ResolveResult } from "./model/ResolveResult.js";
import { InFeaturesFolderResolveState } from "./model/ResolveState.js";
import { computeFeatureTypeName } from "./operations/computeFeatureTypeName.js";

export function getOrCreateChildFeature(
  resolveResult: ResolveResult,
  inFeatureFolderState: InFeaturesFolderResolveState,
  featureDirectoryPath: string
): ResolvedFeature {
  const simpleFeatureName = path.basename(featureDirectoryPath);

  const featureName = `${inFeatureFolderState.feature.name}/${simpleFeatureName}`;

  if (resolveResult.resolvedFeatureByName.has(featureName)) {
    return resolveResult.resolvedFeatureByName.get(featureName)!;
  }

  const featureConfig =
    findFeatureConfig(featureDirectoryPath) ??
    createEmptyFeatureConfig(featureName);

  const parentFeatureName = inFeatureFolderState.feature.name;

  const { featureTypeName, matchedFeatureTypeNames } = computeFeatureTypeName(
    resolveResult,
    featureConfig,
    simpleFeatureName,
    parentFeatureName
  );

  const featureTypeConfig = getFeatureTypeConfig(
    resolveResult.resolvedRoot.config,
    featureTypeName
  );

  const resolvedFeature: ResolvedFeature = {
    thingyType: "feature",

    name: featureName,

    simpleName: featureName,

    featureConfig,
    featureTypeConfig,

    featureTypeName,
    matchedFeatureTypeNames,

    parentFeatureName,
    childFeatureNames: new Set(),

    buildingBlockNames: new Set(),

    moduleFilePaths: new Set(),

    dependencyModuleFilePathsByFeatureName: new Map(),

    violations: new Set(),
  };

  resolveResult.resolvedFeatureByName.set(featureName, resolvedFeature);

  return resolvedFeature;
}
