import * as fs from "fs";
import * as path from "path";

export const FEATURE_LINT_CONFIG_FILE_NAMES = [
  "feature-lint.jsonc",
  "feature-lint.json",
  ".feature-lint.jsonc",
  ".feature-lint.json",
];

export function findFeatureLintConfigFilePath(
  directoryPath: string
): string | undefined {
  const foundConfigFileName = FEATURE_LINT_CONFIG_FILE_NAMES.find(
    (configFileName) => {
      const configFilePath = path.join(directoryPath, configFileName);

      return fs.existsSync(configFilePath);
    }
  );

  if (!foundConfigFileName) {
    return undefined;
  }

  const foundConfigFilePath = path.join(directoryPath, foundConfigFileName);

  return foundConfigFilePath;
}
