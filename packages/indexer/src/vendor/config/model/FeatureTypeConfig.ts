import { z } from "zod";
import {
  BuildingBlockConfig,
  UnnamedBuildingBlockConfig
} from "./BuildingBlockConfig.js";
import { BuildingBlockName } from "./BuildingBlockName.js";
import { FeatureTypeName } from "./FeatureTypeName.js";

const BuildingBlocks = z
  .array(BuildingBlockConfig.or(BuildingBlockName))
  .or(z.record(UnnamedBuildingBlockConfig))
  .optional()
  .default([])
  .transform<BuildingBlockConfig[]>(rawBuildingBlocks => {
    if (Array.isArray(rawBuildingBlocks)) {
      return rawBuildingBlocks.map(rawBuildingBlock => {
        if (typeof rawBuildingBlock === "string") {
          const buildingBlock: BuildingBlockConfig = {
            name: rawBuildingBlock,

            rules: []
          };

          return buildingBlock;
        }

        return rawBuildingBlock;
      });
    }

    return Object.entries(rawBuildingBlocks).map(
      ([buildingBlockName, unnamedBuildingBlock]) => {
        const buildingBlock: BuildingBlockConfig = {
          name: buildingBlockName,

          ...unnamedBuildingBlock
        };

        return buildingBlock;
      }
    );
  });

export type BuildingBlocks = z.infer<typeof BuildingBlocks>;

export const UnnamedFeatureTypeConfig = z.object({
  buildingBlocks: BuildingBlocks,
  featureNameMatcher: z
    .string()
    .optional()
    .refine(
      rawMatcher => {
        if (rawMatcher === undefined) {
          return true;
        }

        try {
          new RegExp(rawMatcher);

          return true;
        } catch (e) {
          return false;
        }
      },
      { message: "Invalid pattern" }
    )
    .transform(rawMatcher => {
      if (rawMatcher === undefined) {
        return undefined;
      }

      return new RegExp(rawMatcher);
    }),
  rules: z
    .array(z.any())
    .optional()
    .default([])
});

export const FeatureTypeConfig = UnnamedFeatureTypeConfig.extend({
  name: FeatureTypeName
});

export type FeatureTypeConfig = z.infer<typeof FeatureTypeConfig>;
