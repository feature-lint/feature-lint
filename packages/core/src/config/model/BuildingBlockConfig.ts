import { z } from "zod";
import { BUILDING_BLOCK_RULE_CONFIG_SCHEMA } from "../../registry/ruleRegistry.js";
import { BuildingBlockName } from "./BuildingBlockName.js";

export const UnnamedBuildingBlockConfig = z.object({
  rules: z.array(BUILDING_BLOCK_RULE_CONFIG_SCHEMA).optional().default([]),
});

export const BuildingBlockConfig = UnnamedBuildingBlockConfig.extend({
  name: BuildingBlockName,
});

export type BuildingBlockConfig = z.infer<typeof BuildingBlockConfig>;
