import * as fs from "fs";
import * as path from "path";

export const FEATURE_CONFIG_FILE_NAMES = [
  "feature.jsonc",
  "feature.json",
  ".feature.jsonc",
  ".feature.json",
];

export function findFeatureConfigFilePath(
  featureDirectoryPath: string
): string | undefined {
  const foundConfigFileName = FEATURE_CONFIG_FILE_NAMES.find(
    (configFileName) => {
      const configFilePath = path.join(featureDirectoryPath, configFileName);

      return fs.existsSync(configFilePath);
    }
  );

  if (!foundConfigFileName) {
    return undefined;
  }

  const foundConfigFilePath = path.join(
    featureDirectoryPath,
    foundConfigFileName
  );

  return foundConfigFilePath;
}
