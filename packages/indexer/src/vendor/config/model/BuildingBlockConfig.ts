import { z } from "zod";
import { BuildingBlockName } from "./BuildingBlockName.js";

export const UnnamedBuildingBlockConfig = z.object({
  rules: z
    .array(z.any())
    .optional()
    .default([])
});

export const BuildingBlockConfig = UnnamedBuildingBlockConfig.extend({
  name: BuildingBlockName
});

export type BuildingBlockConfig = z.infer<typeof BuildingBlockConfig>;
