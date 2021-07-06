import { FeatureLintConfig } from "../../config/model/FeatureLintConfig.js";
import { Violation } from "../../violation/model/Violation.js";
import { ResolvedFeature } from "./ResolvedFeature";

export type ResolvedRoot = {
  featureNames: Set<ResolvedFeature["name"]>;

  config: FeatureLintConfig;

  configFilePath: string;
  rootDirectoryPath: string;

  violations: Set<Violation>;
};
