import { BuildingBlockConfig } from "../../config/model/BuildingBlockConfig.js";
import { Violation } from "../../rule/model/Violation.js";
import { ResolvedBuildingBlockModule } from "./ResolvedModule.js";

export type ResolvedBuildingBlock = {
  name: string;

  featureName: string;

  buildingBlockConfig: BuildingBlockConfig;

  unknown: boolean;

  moduleFilePaths: Set<ResolvedBuildingBlockModule["filePath"]>;

  violations: Set<Violation>;
};
