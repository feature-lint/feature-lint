import * as fs from "fs";
import { parse as parseJsonc, ParseError } from "jsonc-parser";
import {
  FeatureLintError,
  GenericFeatureLintError,
  ZodFeatureLintError,
} from "../../shared/model/FeautureLintError.js";
import { Failure, Result, Success } from "../../shared/util/Result.js";
import { FeatureLintConfig } from "../model/FeatureLintConfig.js";

export function readFeatureLintConfig(
  configFilePath: string
): Result<FeatureLintConfig, FeatureLintError> {
  let featureLintConfigJson: string;

  try {
    featureLintConfigJson = fs.readFileSync(configFilePath, {
      encoding: "utf-8",
    });
  } catch (e) {
    return Failure(
      GenericFeatureLintError(
        "missing-config",
        `Failed to read file ${configFilePath}`
      )
    );
  }

  // TODO: Should we ignore these?
  const parseErrors: ParseError[] = [];

  // TODO: try/catch
  const rawFeatureLintConfig = parseJsonc(
    featureLintConfigJson,
    parseErrors
  ) as unknown;

  const parseFeatureLintConfigResult =
    FeatureLintConfig.safeParse(rawFeatureLintConfig);

  if (!parseFeatureLintConfigResult.success) {
    return Failure(
      ZodFeatureLintError(
        "invalid-config",
        "Invalid FeatureLint config",
        parseFeatureLintConfigResult.error
      )
    );
  }

  return Success(parseFeatureLintConfigResult.data);
}
