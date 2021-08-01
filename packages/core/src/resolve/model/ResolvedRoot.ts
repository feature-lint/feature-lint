import { FeatureLintConfig } from "../../config/model/FeatureLintConfig.js";
import { Violation } from "../../rule/model/Violation.js";
import { ResolvedFeature } from "./ResolvedFeature";
import { ResolvedFeatureModule } from "./ResolvedModule.js";
import * as ts from "typescript";

export type ResolvedRoot = {
  thingyType: "root";

  tsProgram: ts.Program;

  featureNames: Set<ResolvedFeature["name"]>;

  config: FeatureLintConfig;

  configFilePath: string;
  rootDirectoryPath: string;

  violations: Set<Violation>;

  moduleFilePaths: Set<ResolvedFeatureModule["filePath"]>;
};
