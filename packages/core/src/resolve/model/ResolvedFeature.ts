import { FeatureConfig } from "../../config/model/FeatureConfig.js";
import { FeatureTypeConfig } from "../../config/model/FeatureTypeConfig.js";
import { Violation } from "../../rule/model/Violation.js";
import { ResolvedBuildingBlock } from "./ResolvedBuildingBlock";
import { ResolvedFeatureModule } from "./ResolvedModule.js";

export type ResolvedFeature = {
  thingyType: "feature";

  name: string;

  simpleName: string;

  featureConfig: FeatureConfig;

  featureTypeConfig: FeatureTypeConfig;

  featureTypeName: string | undefined;

  /**
   * The feature type names derived from a feature type's feature name matcher.
   */
  matchedFeatureTypeNames: string[];

  parentFeatureName: ResolvedFeature["name"] | undefined;
  childFeatureNames: Set<ResolvedFeature["name"]>;

  buildingBlockNames: Set<ResolvedBuildingBlock["name"]>;

  moduleFilePaths: Set<ResolvedFeatureModule["filePath"]>;

  dependencyModuleFilePathsByFeatureName: Map<string, Set<string>>;

  violations: Set<Violation>;
};
