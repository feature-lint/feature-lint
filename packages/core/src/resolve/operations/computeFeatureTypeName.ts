import { FeatureConfig } from "../../config/model/FeatureConfig.js";
import { ResolveResult } from "../model/ResolveResult.js";
import { buildFeatureNameHierarchy } from "./buildFeatureNameHierarchy.js";
import { getResolvedFeature } from "./getResolvedFeature.js";

interface ComputeFeatureTypeNameReturnValue {
  featureTypeName: string | undefined;
  matchedFeatureTypeNames: string[];
}

export function computeFeatureTypeName(
  resolveResult: ResolveResult,
  featureConfig: FeatureConfig,
  simpleFeatureName: string,
  parentFeatureName: string | undefined
): ComputeFeatureTypeNameReturnValue {
  const featureLintConfig = resolveResult.resolvedRoot.config;

  const matchedFeatureTypeNames = featureLintConfig.featureTypes
    .filter((featureType) => {
      const { featureNameMatcher } = featureType;

      if (featureNameMatcher === undefined) {
        return false;
      }

      return simpleFeatureName.match(featureNameMatcher) !== null;
    })
    .map((featureType) => {
      return featureType.name;
    });

  // Explicit feature type is always preferred
  if (featureConfig.featureType !== undefined) {
    return {
      featureTypeName: featureConfig.featureType,
      matchedFeatureTypeNames,
    };
  }

  if (matchedFeatureTypeNames.length === 1) {
    return {
      featureTypeName: matchedFeatureTypeNames[0],
      matchedFeatureTypeNames,
    };
  }

  // Use default type for root features
  if (parentFeatureName === undefined) {
    return {
      featureTypeName: featureLintConfig.defaultFeatureType,
      matchedFeatureTypeNames,
    };
  }

  const findClosedDefaultChildFeatureTypeName = () => {
    const featureNameHierarchy = buildFeatureNameHierarchy(
      parentFeatureName,
      resolveResult
    ).reverse();

    for (const ancestorFeatureName of featureNameHierarchy) {
      const feature = getResolvedFeature(resolveResult, ancestorFeatureName);

      if (feature.featureConfig.defaultChildFeatureType === undefined) {
        continue;
      }

      return feature.featureConfig.defaultChildFeatureType;
    }
  };

  const defaultChildFeatureTypeName = findClosedDefaultChildFeatureTypeName();

  return {
    featureTypeName:
      defaultChildFeatureTypeName ?? featureLintConfig.defaultFeatureType,
    matchedFeatureTypeNames,
  };
}
