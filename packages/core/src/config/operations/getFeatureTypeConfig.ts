import { FeatureLintConfig } from "../model/FeatureLintConfig.js";
import { FeatureTypeConfig } from "../model/FeatureTypeConfig.js";

export function getFeatureTypeConfig(
  featureLintConfig: FeatureLintConfig,
  featureTypeName: string | undefined
): FeatureTypeConfig {
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
}
