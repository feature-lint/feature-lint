import { z } from "zod";
import { FEATURE_CONFIG_RULE_SCHEMA } from "../../registry/ruleRegistry.js";
import { AllowedDependenciesRuleConfig } from "../../rule-definitions/allowedDependencies.js";
import { FeatureName } from "./FeatureName.js";

export const FeatureConfig = z.object({
  $schema: z.string().optional(),
  name: FeatureName.optional(),
  featureType: z.string().min(1).optional(),
  // TODO: Implement this
  // defaultChildFeatureType: z.string().min(1).optional(),
  rules: z.array(FEATURE_CONFIG_RULE_SCHEMA).optional().default([]),
});

export type FeatureConfig = z.infer<typeof FeatureConfig>;

export const createEmptyFeatureConfig = (name: string): FeatureConfig => {
  return FeatureConfig.parse({ name });
};
