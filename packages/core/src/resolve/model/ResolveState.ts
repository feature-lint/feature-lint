import { ResolvedBuildingBlock } from "./ResolvedBuildingBlock.js";
import { ResolvedFeature } from "./ResolvedFeature.js";

export type InRootResolveState = {
  type: "inRoot";
};

export type InFeatureResolveState = {
  type: "inFeature";

  feature: ResolvedFeature;

  featurePrivate: boolean;

  siblingFeaturePrivate: ResolvedFeature | undefined;

  parentFeaturePrivate: ResolvedFeature | undefined;
};

export type InFeaturesFolderResolveState = {
  type: "inFeaturesFolder";

  feature: ResolvedFeature;

  siblingFeaturePrivate: ResolvedFeature | undefined;

  parentFeaturePrivate: ResolvedFeature | undefined;
};

export type InBuildingBlockResolveState = {
  type: "inBuildingBlock";

  buildingBlock: ResolvedBuildingBlock;

  isSubDirectory: boolean;

  buildingBlockPrivate: boolean;

  featurePrivate: boolean;

  siblingFeaturePrivate: ResolvedFeature | undefined;

  parentFeaturePrivate: ResolvedFeature | undefined;
};

export type ResolveState =
  | InRootResolveState
  | InFeatureResolveState
  | InFeaturesFolderResolveState
  | InBuildingBlockResolveState;
