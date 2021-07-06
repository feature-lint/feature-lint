import { FeatureConfig } from "../config/model/FeatureConfig.js";
import { FeatureLintConfig } from "../config/model/FeatureLintConfig.js";

export function computeFeatureTypeName(
  featureLintConfig: FeatureLintConfig,
  featureConfig: FeatureConfig
): string | undefined {
  const featureTypeName =
    featureConfig?.featureType ?? featureLintConfig.defaultFeatureType;

  return featureTypeName;
}
