import { z } from "zod";
import { parseDependencyCriterion } from "../operations/parseDependencyCriterion.js";
import { FinalDependencyCriterion } from "./FinalDependencyCriterion.js";

export const DependencyCriterionConfig = z
  .object({
    type: z
      .union([z.literal("allow"), z.literal("deny")])
      .optional()
      .default("allow"),
    buildingBlock: z
      .union([z.array(z.string()), z.string(), z.literal("*")])
      .optional()
      .default("*"),
    featureType: z
      .union([z.array(z.string()), z.string(), z.literal("*"), z.literal("&")])
      .optional()
      .default("*"),
    feature: z
      .union([z.array(z.string()), z.string(), z.literal("*"), z.literal("&")])
      .optional()
      .default("*"),
  })
  .or(z.string())
  .transform<FinalDependencyCriterion | undefined>((rawCriterion) => {
    if (typeof rawCriterion === "string") {
      const dependencySelector = parseDependencyCriterion(rawCriterion);

      if (dependencySelector === undefined) {
        return undefined;
      }

      const criterion: FinalDependencyCriterion = {
        type: dependencySelector.type,
        featureTypeNames:
          dependencySelector.featureTypeNames ??
          (dependencySelector.featureNames === undefined ? "&" : "*"),
        featureNames: dependencySelector.featureNames ?? "*",
        buildingBlockNames: dependencySelector.buildingBlockNames ?? "*",
      };

      return criterion;
    }

    const { type, buildingBlock, feature, featureType } = rawCriterion;

    const getBuildingBlockNames = () => {
      if (buildingBlock === "*") {
        return "*";
      }

      if (Array.isArray(buildingBlock)) {
        return buildingBlock;
      }

      return [buildingBlock];
    };

    const getFeatureNames = () => {
      if (feature === "*" || feature === "&") {
        return feature;
      }

      if (Array.isArray(feature)) {
        return feature;
      }

      return [feature];
    };

    const getFeatureTypeNames = () => {
      if (featureType === "*" || featureType === "&") {
        return featureType;
      }

      if (Array.isArray(featureType)) {
        return featureType;
      }

      return [featureType];
    };

    return {
      type,
      buildingBlockNames: getBuildingBlockNames(),
      featureNames: getFeatureNames(),
      featureTypeNames: getFeatureTypeNames(),
    };
  })
  .refine((rawCriterion) => {
    if (rawCriterion === undefined) {
      return false;
    }

    return true;
  })
  .transform<FinalDependencyCriterion>((rawCriterion) => {
    return rawCriterion!!;
  });
