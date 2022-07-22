import * as fs from "fs";
import { parse as parseJsonc, ParseError } from "jsonc-parser";
import { FeatureLintConfig } from "../../vendor/config/model/FeatureLintConfig";
import { UserDefinedFeature } from "../../models/user-defined-feature";
import { UserDefinedBuildingBlock } from "../../models/user-defined-building-block";

export const indexFeatureLintConfig = async (configPath: string) => {
  const featureLintConfigJson = fs.readFileSync(configPath, "utf-8");
  const rawFeatureLintConfig = parseJsonc(featureLintConfigJson, []) as unknown;
  const featureLintConfig = await FeatureLintConfig.parseAsync(
    rawFeatureLintConfig
  );

  indexFeatures(featureLintConfig);
  console.log(featureLintConfig);
};

const indexFeatures = (cfg: FeatureLintConfig) => {
  for (const feature of cfg.featureTypes) {
    UserDefinedFeature.create({
      name: feature.name,
      matcher: feature.featureNameMatcher?.source || ""
    });

    for (const bb of feature.buildingBlocks) {
      UserDefinedBuildingBlock.create({
        name: bb.name
      });
    }
  }
};
