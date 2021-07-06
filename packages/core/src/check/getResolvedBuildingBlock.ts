import { buildUniqueBuildingBlockName } from "../resolve/buildUniqueBuildingBlockName.js";
import { ResolveState } from "../resolve/model/ResolveState.js";

export function getResolvedBuildingBlock(
  resolveState: ResolveState,
  featureName: string,
  buildingBlockName: string
) {
  const buildingBlock = resolveState.resolvedBuildingBlockByUniqueName.get(
    buildUniqueBuildingBlockName(featureName, buildingBlockName)
  );

  if (buildingBlock === undefined) {
    throw new Error("Building block not found");
  }

  return buildingBlock;
}
