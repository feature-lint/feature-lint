import chalk from "chalk";
import { check } from "../check/check.js";
import { findFeatureLintConfigFilePath } from "../config/operations/findFeatureLintConfigFilePath.js";
import { readFeatureLintConfig } from "../config/operations/readFeatureLintConfig.js";
import { Printer } from "../printer/service/Printer.js";
import { VIOLATION_PRINTER } from "../registry/violationPrinterRegistry.js";
import { ResolvedFeature } from "../resolve/model/ResolvedFeature.js";
import { ResolveResult } from "../resolve/model/ResolveResult.js";
import { ResolveState } from "../resolve/model/ResolveState.js";
import { findRootDirectoryPath } from "../resolve/operations/findRootDirectoryPath.js";
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
    if (e instanceof Error) {
      lintResult = Failure(UnexpectedFeatureLintError(e));
    } else {
      lintResult = Failure(UnexpectedFeatureLintError(new Error(`${e}`)));
    }
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

export const resolveOnly = (directoryPath: string): ResolveResult => {
  const configFilePath = findFeatureLintConfigFilePath(directoryPath);

  if (configFilePath === undefined) {
    throw new Error("Failed");
  }

  const featureLintConfigResult = readFeatureLintConfig(configFilePath);

  if (!featureLintConfigResult.successful) {
    throw new Error("Failed");
  }

  const featureLintConfig = featureLintConfigResult.data;

  const rootDirectoryPathResult = findRootDirectoryPath(
    featureLintConfig,
    configFilePath
  );

  if (!rootDirectoryPathResult.successful) {
    throw new Error("Failed");
  }

  const rootDirectoryPath = rootDirectoryPathResult.data;

  const resolveResult = resolve(
    featureLintConfig,
    configFilePath,
    rootDirectoryPath
  );

  if (!resolveResult.successful) {
    throw new Error("Failed");
  }

  return resolveResult.data;
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

  const totalGlobalViolationsCount = resolveResult.resolvedRoot.violations.size;

  if (totalGlobalViolationsCount > 0) {
    printer.text`{underline Found {bold ${totalGlobalViolationsCount}} global violation(s)}`;

    printer.blankLine();

    for (const violation of resolveResult.resolvedRoot.violations) {
      const violationPrinter = VIOLATION_PRINTER[violation.ruleName];

      if (violationPrinter === undefined) {
        throw new Error(
          `Violation printer not found for violation ${violation.ruleName}`
        );
      }

      violationPrinter(printer, violation, resolveResult);

      printer.blankLine();
    }
  }

  let totalFeatureViolationsCount = 0;
  let totalFeaturesWithViolationsCount = 0;

  walkFeatures(resolveResult, (feature) => {
    const printFeatureHeader = (
      feature: ResolvedFeature,
      violationCount: number
    ) => {
      // TODO: Undefined
      const featureType = feature.featureTypeName;

      printer.text`{underline Feature: {bold ${feature.name}} {dim (${
        featureType ?? "?"
      })} – Found {bold ${violationCount}} violations(s)}`;

      printer.blankLine();
    };

    const featureViolationsCount = Array.from(feature.violations.keys()).length;

    if (featureViolationsCount > 0) {
      totalFeaturesWithViolationsCount++;

      totalFeatureViolationsCount += featureViolationsCount;

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

  if (totalFeatureViolationsCount > 0 || totalGlobalViolationsCount > 0) {
    // printer.text`{red Found {bold ${totalFeatureViolationsCount}} violation(s) in {bold ${totalFeaturesWithViolationsCount}} feature(s) and {bold ${totalGlobalViolationsCount}} global violation(s)}`;
    printer.text`{red Found {bold ${
      totalFeatureViolationsCount + totalGlobalViolationsCount
    }} violation(s)}`;
  } else {
    printer.text`{green Found 0 violation(s)}`;
  }

  printer.log();
};
