import { BuildingBlockConfig } from "../config/model/BuildingBlockConfig.js";
import { Failure, Result, Success } from "../shared/util/Result.js";
import { getUniqueBuildingBlockName } from "./operations/getUniqueBuildingBlockName.js";
import { ResolvedBuildingBlock } from "./model/ResolvedBuildingBlock.js";
import { ResolvedFeature } from "./model/ResolvedFeature.js";
import { ResolveResult } from "./model/ResolveResult.js";
import { InFeatureResolveState } from "./model/ResolveState.js";

export function getOrCreateBuildingBlock(
  resolveResult: ResolveResult,
  inFeatureState: InFeatureResolveState,
  buildingBlockName: string,
  uniqueBuildingBlockName: string
): ResolvedBuildingBlock {
  if (
    resolveResult.resolvedBuildingBlockByUniqueName.has(uniqueBuildingBlockName)
  ) {
    return resolveResult.resolvedBuildingBlockByUniqueName.get(
      uniqueBuildingBlockName
    )!;
  }

  const getBuildingBlockConfig = (
    feature: ResolvedFeature,
    buildingBlockName: string
  ): Result<BuildingBlockConfig, BuildingBlockConfig> => {
    const buildingBlock = feature.featureTypeConfig.buildingBlocks.find(
      (buildingBlock) => {
        return buildingBlock.name === buildingBlockName;
      }
    );

    if (buildingBlock !== undefined) {
      return Success(buildingBlock);
    }

    return Failure({
      name: buildingBlockName,

      rules: [],
    });
  };

  const buildingBlockConfigResult = getBuildingBlockConfig(
    inFeatureState.feature,
    buildingBlockName
  );

  const resolvedBuildingBlock: ResolvedBuildingBlock = {
    thingyType: "buildingBlock",

    name: buildingBlockName,

    buildingBlockConfig: buildingBlockConfigResult.successful
      ? buildingBlockConfigResult.data
      : buildingBlockConfigResult.error,

    unknown: !buildingBlockConfigResult.successful,

    featureName: inFeatureState.feature.name,

    moduleFilePaths: new Set(),

    violations: new Set(),
  };

  resolveResult.resolvedBuildingBlockByUniqueName.set(
    getUniqueBuildingBlockName(resolvedBuildingBlock),
    resolvedBuildingBlock
  );

  return resolvedBuildingBlock;
}
