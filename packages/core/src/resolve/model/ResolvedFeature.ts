import { FeatureConfig } from "../../config/model/FeatureConfig.js";
import { FeatureTypeConfig } from "../../config/model/FeatureTypeConfig.js";
import { Violation } from "../../rule/model/Violation.js";
import { ResolvedBuildingBlock } from "./ResolvedBuildingBlock";
import { ResolvedFeatureModule } from "./ResolvedModule.js";

export type ResolvedFeature = {
  name: string;

  featureConfig: FeatureConfig;

  featureTypeConfig: FeatureTypeConfig;

  /**
   * Either the default type from FeatureLint config or the type from feature config.
   *
   * May be undefined if feature type is missing altogether
   */
  featureTypeName: string | undefined;

  parentFeatureName: ResolvedFeature["name"] | undefined;
  childFeatureNames: Set<ResolvedFeature["name"]>;

  buildingBlockNames: Set<ResolvedBuildingBlock["name"]>;

  moduleFilePaths: Set<ResolvedFeatureModule["filePath"]>;

  violations: Set<Violation>;
};
