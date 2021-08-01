import chalk from "chalk";
import { check } from "../check/check.js";
import { findFeatureLintConfigFilePath } from "../config/operations/findFeatureLintConfigFilePath.js";
import { readFeatureLintConfig } from "../config/operations/readFeatureLintConfig.js";
import { Printer } from "../printer/service/Printer.js";
import { VIOLATION_PRINTER } from "../registry/violationPrinterRegistry.js";
import { buildFeatureNameHierarchy } from "../resolve/operations/buildFeatureNameHierarchy.js";
import { findRootDirectoryPath } from "../resolve/operations/findRootDirectoryPath.js";
import { ResolvedFeature } from "../resolve/model/ResolvedFeature.js";
import { ResolveResult } from "../resolve/model/ResolveResult.js";
import { resolve } from "../resolve/resolve.js";
import {
  FeatureLintError,
  GenericFeatureLintError,
  UnexpectedFeatureLintError,
} from "../shared/model/FeautureLintError.js";
import { Failure, Result, Success } from "../shared/util/Result.js";
import { walkFeatures } from "./operations/walkFeatures.js";

interface LintResult {
  resolveResult: ResolveResult;
}

export const lint = (directoryPath: string) => {
  let lintResult: Result<LintResult, FeatureLintError>;

  try {
    lintResult = lint2(directoryPath);
  } catch (e) {
    lintResult = Failure(UnexpectedFeatureLintError(e.toString()));
  }

  if (!lintResult.successful) {
    const printer = Printer(chalk);

    printer.text`{bold FeatureLint:} Failed to analyze features and modules`;

    printer.blankLine();

    lintResult.error.print(printer);

    printer.print();

    return;
  }

  render(lintResult.data);
};

// TODO: Move of some of this to CLI
export const lint2 = (
  directoryPath: string
): Result<LintResult, FeatureLintError> => {
  const configFilePath = findFeatureLintConfigFilePath(directoryPath);

  if (configFilePath === undefined) {
    return Failure(
      GenericFeatureLintError("missing-config", "FeatureLint config not found")
    );
  }

  const featureLintConfigResult = readFeatureLintConfig(configFilePath);

  if (!featureLintConfigResult.successful) {
    return Failure(featureLintConfigResult.error);
  }

  const featureLintConfig = featureLintConfigResult.data;

  const rootDirectoryPathResult = findRootDirectoryPath(
    featureLintConfig,
    configFilePath
  );

  if (!rootDirectoryPathResult.successful) {
    return Failure(rootDirectoryPathResult.error);
  }

  const rootDirectoryPath = rootDirectoryPathResult.data;

  const resolveResult = resolve(
    featureLintConfig,
    configFilePath,
    rootDirectoryPath
  );

  if (!resolveResult.successful) {
    return Failure(resolveResult.error);
  }

  check(resolveResult.data);

  const lintResult: LintResult = {
    resolveResult: resolveResult.data,
  };

  return Success(lintResult);
};

const render = (lintState: LintResult) => {
  const { resolveResult } = lintState;

  const featuresCount = Array.from(
    resolveResult.resolvedFeatureByName.keys()
  ).length;

  const modulesCount = Array.from(
    resolveResult.resolvedModuleByFilePath.keys()
  ).length;

  const printer = Printer(chalk);

  printer.text`{bold FeatureLint:} Analyzing {bold ${featuresCount}} feature(s) and {bold ${modulesCount}} module(s)`;

  printer.blankLine(1);

  let totalViolationsCount = 0;
  let totalFeaturesWithViolationsCount = 0;

  walkFeatures(resolveResult, (feature) => {
    const printFeatureHeader = (
      feature: ResolvedFeature,
      violationCount: number
    ) => {
      const featurePath = buildFeatureNameHierarchy(
        feature.name,
        resolveResult
      ).join("/");

      // TODO: Undefined
      const featureType = feature.featureTypeName;

      printer.text`{underline Feature: {bold ${featurePath}} {dim (${featureType})} – Found {bold ${violationCount}} violations(s)}`;

      printer.blankLine();
    };

    const featureViolationsCount = Array.from(feature.violations.keys()).length;

    if (featureViolationsCount > 0) {
      totalFeaturesWithViolationsCount++;

      totalViolationsCount += featureViolationsCount;

      printFeatureHeader(feature, featureViolationsCount);

      for (const violation of feature.violations) {
        const violationPrinter = VIOLATION_PRINTER[violation.ruleName];

        if (violationPrinter === undefined) {
          throw new Error(
            `Violation printer not found for violation ${violation.ruleName}`
          );
        }

        violationPrinter(printer, violation, resolveResult);

        printer.blankLine();
      }

      printer.blankLine();
    }
  });

  if (totalViolationsCount > 0) {
    printer.text`{red Found ${totalViolationsCount} violation(s) in ${totalFeaturesWithViolationsCount} feature(s)}`;
  } else {
    printer.text`{green Found 0 violation(s) found}`;
  }

  printer.log();
};
