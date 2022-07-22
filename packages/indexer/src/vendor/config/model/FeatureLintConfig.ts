import { z } from "zod";
import {
  UnnamedFeatureTypeConfig,
  FeatureTypeConfig
} from "./FeatureTypeConfig";
import { FeatureTypeName } from "./FeatureTypeName";

export const FeatureTypes = z
  .array(FeatureTypeConfig)
  .or(z.record(UnnamedFeatureTypeConfig))
  .optional()
  .default([])
  .transform<FeatureTypeConfig[]>(rawFeatureTypes => {
    if (Array.isArray(rawFeatureTypes)) {
      return rawFeatureTypes;
    }

    return Object.entries(rawFeatureTypes).map(
      ([featureTypeName, unnamedFeatureType]) => {
        const featureType: FeatureTypeConfig = {
          name: featureTypeName,
          ...unnamedFeatureType
        };

        return featureType;
      }
    );
  });

export type FeatureTypes = z.infer<typeof FeatureTypes>;

export const FeatureLintConfig = z.object({
  $schema: z.string().optional(),

  rootDir: z
    .string()
    .min(1)
    .optional(),

  featuresDirName: z
    .string()
    .min(1)
    .optional()
    .default("features"),

  defaultFeatureType: FeatureTypeName.optional(),

  featureTypes: FeatureTypes,

  rules: z
    .array(z.any())
    .optional()
    .default([])
    // We are adding all default rules configs here (unless they configured by the user already)
    .transform(rawRuleConfigs => {
      const ruleConfigs = [...rawRuleConfigs];

      for (const ruleDefinition of [] as any[]) {
        if (ruleDefinition.defaultConfig === undefined) {
          continue;
        }

        const alreadyConfigured = rawRuleConfigs.some(ruleConfig => {
          return ruleConfig.name === ruleDefinition.name;
        });

        if (alreadyConfigured) {
          continue;
        }

        ruleConfigs.push(ruleDefinition.defaultConfig);
      }

      return ruleConfigs;
    })
});

export type FeatureLintConfig = z.infer<typeof FeatureLintConfig>;
