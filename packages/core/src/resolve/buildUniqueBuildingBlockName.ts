import { ResolvedBuildingBlock } from "./model/ResolvedBuildingBlock.js";
import { ResolvedFeature } from "./model/ResolvedFeature.js";

export function buildUniqueBuildingBlockName(
  featureName: ResolvedFeature["name"],
  buildingBlockName: ResolvedBuildingBlock["name"]
): string {
  return `${featureName}/${buildingBlockName}`;
}
