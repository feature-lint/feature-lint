import { ResolvedBuildingBlock } from "./ResolvedBuildingBlock.js";
import { ResolvedFeature } from "./ResolvedFeature.js";
import { ResolvedFeatureModule, ResolvedModule } from "./ResolvedModule.js";
import { ResolvedRoot } from "./ResolvedRoot.js";

// TODO: Better name ;)
export type ResolvedThingy =
  | ResolvedRoot
  | ResolvedFeature
  | ResolvedBuildingBlock
  | ResolvedModule;
