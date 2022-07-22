import { z } from "zod";
import { FeatureName } from "./FeatureName.js";
import { FeatureTypeName } from "./FeatureTypeName.js";

export const FeatureConfig = z.object({
  $schema: z.string().optional(),
  name: FeatureName.optional(),
  featureType: FeatureTypeName.optional(),
  defaultChildFeatureType: FeatureTypeName.optional(),
  childFeaturesOnly: z
    .boolean()
    .optional()
    .default(false),
  rules: z
    .array(z.any())
    .optional()
    .default([])
});

export type FeatureConfig = z.infer<typeof FeatureConfig>;

export const createEmptyFeatureConfig = (name: string): FeatureConfig => {
  return FeatureConfig.parse({ name });
};
