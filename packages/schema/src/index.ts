import { zodToJsonSchema } from "zod-to-json-schema";
import { writeFileSync } from "fs";
import { FeatureConfig, FeatureLintConfig } from "@feature-lint/core/config";

const FEATURE_CONFIG_SCHEMA_FILE_NAME = "feature.schema.json";
const ROOT_CONFIG_SCHEMA_FILE_NAME = "feature-lint.schema.json";

const featureConfigJsonSchema = JSON.stringify(
  zodToJsonSchema(FeatureConfig, "feature")
);
const featureLintConfigJsonSchema = JSON.stringify(
  zodToJsonSchema(FeatureLintConfig, "feature-lint")
);

writeFileSync(
  `./dist/${FEATURE_CONFIG_SCHEMA_FILE_NAME}`,
  featureConfigJsonSchema
);

writeFileSync(
  `./dist/${ROOT_CONFIG_SCHEMA_FILE_NAME}`,
  featureLintConfigJsonSchema
);
