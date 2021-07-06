import * as fs from "fs";
import * as path from "path";
import { FeatureLintConfig } from "../config/model/FeatureLintConfig.js";
import {
  FeatureLintError,
  GenericFeatureLintError,
  UnexpectedFeatureLintError,
} from "../shared/model/FeautureLintError.js";
import { Failure, Result, Success } from "../shared/util/Result.js";
import { isSubPath } from "./util/isSubPath.js";

export function findRootDirectoryPath(
  featureLintConfig: FeatureLintConfig,
  configFilePath: string
): Result<string, FeatureLintError> {
  const configDirectoryPath = path.dirname(configFilePath);

  if (featureLintConfig.rootDir === undefined) {
    return Success(configDirectoryPath);
  }

  const rootDirectoryPath = path.resolve(
    configDirectoryPath,
    featureLintConfig.rootDir
  );

  if (!fs.lstatSync(rootDirectoryPath).isDirectory()) {
    return Failure(
      GenericFeatureLintError("invalid-config", "rootDir must be a directory")
    );
  }

  if (!isSubPath(configDirectoryPath, rootDirectoryPath)) {
    return Failure(
      GenericFeatureLintError(
        "invalid-config",
        "rootDir must be subdirectory of the config file directory"
      )
    );
  }

  return Success(rootDirectoryPath);
}
