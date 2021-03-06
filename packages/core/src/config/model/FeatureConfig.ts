import { z } from "zod";
import { FEATURE_RULE_CONFIG_SCHEMA } from "../../registry/ruleRegistry.js";
import { FeatureName } from "./FeatureName.js";
import { FeatureTypeName } from "./FeatureTypeName.js";

export const FeatureConfig = z.object({
  $schema: z.string().optional(),
  name: FeatureName.optional(),
  featureType: FeatureTypeName.optional(),
  defaultChildFeatureType: FeatureTypeName.optional(),
  childFeaturesOnly: z.boolean().optional().default(false),
  rules: z.array(FEATURE_RULE_CONFIG_SCHEMA).optional().default([]),
});

export type FeatureConfig = z.infer<typeof FeatureConfig>;

export const createEmptyFeatureConfig = (name: string): FeatureConfig => {
  return FeatureConfig.parse({ name });
};
