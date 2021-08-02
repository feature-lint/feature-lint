import { ResolvedBuildingBlock } from "./ResolvedBuildingBlock";
import { ResolvedFeature } from "./ResolvedFeature";
import { ResolvedModule } from "./ResolvedModule";
import { ResolvedRoot } from "./ResolvedRoot";

export interface ResolveResult {
  resolvedRoot: ResolvedRoot;

  resolvedFeatureByName: Map<ResolvedFeature["name"], ResolvedFeature>;

  resolvedBuildingBlockByUniqueName: Map<
    // `${ResolvedFeature["name"]}/${ResolvedBuildingBlock["name"]}`,
    string,
    ResolvedBuildingBlock
  >;

  resolvedModuleByFilePath: Map<string, ResolvedModule>;
}
