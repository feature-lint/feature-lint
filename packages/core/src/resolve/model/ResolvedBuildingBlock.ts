import { BuildingBlockConfig } from "../../config/model/BuildingBlockConfig.js";
import { Violation } from "../../violation/model/Violation.js";
import { ResolvedBuildingBlockModule } from "./ResolvedModule.js";

export type ResolvedBuildingBlock = {
  name: string;

  featureName: string;

  buildingBlockConfig: BuildingBlockConfig;

  unknown: boolean;

  moduleFilePaths: Set<ResolvedBuildingBlockModule["filePath"]>;

  // TODO: We just add all violations. So this can be removed.
  violations: Set<Violation>;
};
