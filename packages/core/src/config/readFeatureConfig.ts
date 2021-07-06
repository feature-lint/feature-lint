import * as fs from "fs";
import { FeatureConfig } from "./model/FeatureConfig.js";
import { parse as parseJsonc } from "jsonc-parser";

export function readFeatureConfig(
  featureConfigFilePath: string
): FeatureConfig {
  const featurConfigJson = fs.readFileSync(featureConfigFilePath, {
    encoding: "utf-8",
  });

  // TODO: try/catch
  const rawFeatureLintConfig = parseJsonc(featurConfigJson) as unknown;

  const parseFeatureConfigResult =
    FeatureConfig.safeParse(rawFeatureLintConfig);

  if (!parseFeatureConfigResult.success) {
    // TODO: Better error handling
    throw new Error(parseFeatureConfigResult.error.message);
  }

  return parseFeatureConfigResult.data;
}
