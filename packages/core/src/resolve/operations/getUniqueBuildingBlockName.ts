import { ResolvedBuildingBlock } from "../model/ResolvedBuildingBlock.js";
import { buildUniqueBuildingBlockName } from "./buildUniqueBuildingBlockName.js";

export function getUniqueBuildingBlockName(
  resolvedBuildingBlock: ResolvedBuildingBlock
): string {
  return buildUniqueBuildingBlockName(
    resolvedBuildingBlock.featureName,
    resolvedBuildingBlock.name
  );
}
