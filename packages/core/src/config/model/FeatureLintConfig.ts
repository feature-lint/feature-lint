import { z } from "zod";
import { ROOT_CONFIG_RULE_SCHEMA } from "../../registry/ruleRegistry.js";
import {
  UnnamedFeatureTypeConfig,
  FeatureTypeConfig,
} from "./FeatureTypeConfig.js";
import { FeatureTypeName } from "./FeatureTypeName.js";

export const FeatureTypes = z
  .array(FeatureTypeConfig)
  .or(z.record(UnnamedFeatureTypeConfig))
  .optional()
  .default([])
  .transform<FeatureTypeConfig[]>((rawFeatureTypes) => {
    if (Array.isArray(rawFeatureTypes)) {
      return rawFeatureTypes;
    }

    return Object.entries(rawFeatureTypes).map(
      ([featureTypeName, unnamedFeatureType]) => {
        const featureType: FeatureTypeConfig = {
          name: featureTypeName,
          ...unnamedFeatureType,
        };

        return featureType;
      }
    );
  });

export type FeatureTypes = z.infer<typeof FeatureTypes>;

export const FeatureLintConfig = z.object({
  $schema: z.string().optional(),

  rootDir: z.string().min(1).optional(),

  defaultFeatureType: FeatureTypeName.optional(),

  featureTypes: FeatureTypes,

  rules: z.array(ROOT_CONFIG_RULE_SCHEMA).optional().default([]),
});
// .refine(
//   (featureLintConfig) => {
//     if (featureLintConfig.defaultFeatureType === undefined) {
//       return true;
//     }

//     return featureLintConfig.featureTypes.some(
//       (featureType) =>
//         featureType.name === featureLintConfig.defaultFeatureType
//     );
//   },
//   (featureLintConfig) => {
//     return {
//       message: `defaultFeatureType refers to unknown feature type '${featureLintConfig.defaultFeatureType}'`,
//       path: ["defaultFeatureType"],
//     };
//   }
// );

export type FeatureLintConfig = z.infer<typeof FeatureLintConfig>;
