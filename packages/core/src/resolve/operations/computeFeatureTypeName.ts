import { FeatureConfig } from "../../config/model/FeatureConfig.js";
import { ResolveResult } from "../model/ResolveResult.js";
import { buildFeatureNameHierarchy } from "./buildFeatureNameHierarchy.js";
import { getResolvedFeature } from "./getResolvedFeature.js";

export function computeFeatureTypeName(
  resolveResult: ResolveResult,
  featureConfig: FeatureConfig,
  parentFeatureName: string | undefined
): string | undefined {
  const featureLintConfig = resolveResult.resolvedRoot.config;

  // Explicit feature type is always preferred
  if (featureConfig.featureType !== undefined) {
    return featureConfig.featureType;
  }

  // Use default type for root features
  if (parentFeatureName === undefined) {
    return featureLintConfig.defaultFeatureType;
  }

  const findClosedDefaultChildFeatureTypeName = () => {
    const featureNameHierarchy = buildFeatureNameHierarchy(
      parentFeatureName,
      resolveResult
    ).reverse();

    for (const featureName of featureNameHierarchy) {
      const feature = getResolvedFeature(resolveResult, featureName);

      if (feature.featureConfig.defaultChildFeatureType === undefined) {
        continue;
      }

      return feature.featureConfig.defaultChildFeatureType;
    }
  };

  const defaultChildFeatureTypeName = findClosedDefaultChildFeatureTypeName();

  return defaultChildFeatureTypeName ?? featureLintConfig.defaultFeatureType;
}
