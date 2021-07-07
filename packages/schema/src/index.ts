import { zodToJsonSchema } from "zod-to-json-schema";
import { writeFileSync, readFileSync } from "fs";
import { FeatureConfig, FeatureLintConfig } from "@feature-lint/core/config";
import { URL } from "url";
import * as path from "path";
import * as fs from "fs";

const FEATURE_CONFIG_SCHEMA_FILE_NAME = "feature.schema.json";
const ROOT_CONFIG_SCHEMA_FILE_NAME = "feature-lint.schema.json";

const packageJsonFilePath = path.resolve(
  new URL(import.meta.url).pathname,
  "../../package.json"
);

const packageJson = JSON.parse(readFileSync(packageJsonFilePath, "utf-8"));

const featureLintCoreVersion =
  packageJson.dependencies["@feature-lint/core"].split("^")[1];

const featureConfigJsonSchema = JSON.stringify(
  zodToJsonSchema(FeatureConfig, "feature")
);
const featureLintConfigJsonSchema = JSON.stringify(
  zodToJsonSchema(FeatureLintConfig, "feature-lint")
);

fs.mkdirSync("./dist/schema", { recursive: true });

writeFileSync(
  `./dist/schema/feature-v${featureLintCoreVersion}.schema.json`,
  featureConfigJsonSchema
);

writeFileSync(
  `./dist/schema/feature-lint-v${featureLintCoreVersion}.schema.json`,
  featureLintConfigJsonSchema
);
