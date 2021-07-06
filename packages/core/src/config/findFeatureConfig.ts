import { FeatureConfig } from "./model/FeatureConfig.js";
import { readFeatureConfig } from "./readFeatureConfig.js";
import { findFeatureConfigFilePath } from "./findFeatureConfigFilePath.js";

export function findFeatureConfig(
  featureDirectoryPath: string
): FeatureConfig | undefined {
  const featureConfigFilePath = findFeatureConfigFilePath(featureDirectoryPath);

  if (featureConfigFilePath === undefined) {
    return;
  }

  return readFeatureConfig(featureConfigFilePath);
}
