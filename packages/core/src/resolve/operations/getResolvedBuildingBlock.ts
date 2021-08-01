import { buildUniqueBuildingBlockName } from "./buildUniqueBuildingBlockName.js";
import { ResolveResult } from "../model/ResolveResult.js";

export function getResolvedBuildingBlock(
  resolveResult: ResolveResult,
  featureName: string,
  buildingBlockName: string
) {
  const buildingBlock = resolveResult.resolvedBuildingBlockByUniqueName.get(
    buildUniqueBuildingBlockName(featureName, buildingBlockName)
  );

  if (buildingBlock === undefined) {
    throw new Error("Building block not found");
  }

  return buildingBlock;
}
