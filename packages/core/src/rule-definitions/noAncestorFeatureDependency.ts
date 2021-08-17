import {
  ResolvedBuildingBlockModule,
  ResolvedFeatureModule,
} from "../resolve/model/ResolvedModule.js";
import { buildFeatureNameHierarchy } from "../resolve/operations/buildFeatureNameHierarchy.js";
import { getResolvedFeature } from "../resolve/operations/getResolvedFeature.js";
import { getResolvedModule } from "../resolve/operations/getResolvedModule.js";
import { BuildingBlockModuleRuleDefinition } from "../rule/model/RuleDefinition.js";
import { Violation } from "../rule/model/Violation.js";
import { ViolationPrinter } from "../rule/model/ViolationPrinter.js";
import { printImportOrExportOfDependency } from "../rule/print/printImportOrExportOfDependency.js";
import { printViolationTemplate } from "../rule/print/printViolationTemplate.js";

export interface NoAncestorFeatureDependencyViolationData {
  violatingModule: ResolvedBuildingBlockModule | ResolvedFeatureModule;

  violatedModule: ResolvedBuildingBlockModule | ResolvedFeatureModule;
}

const noAncestorFeatureDependencyViolationPrinter: ViolationPrinter<NoAncestorFeatureDependencyViolationData> =
  (printer, violation, resolveResult) => {
    const { violatingModule, violatedModule } = violation.data;

    const title = printer.format`Feature {bold ${violatingModule.featureName}} must not depend on ancestor feature {bold ${violatedModule.featureName}}`;

    printViolationTemplate(printer, violation, title, () => {
      printImportOrExportOfDependency(printer, violatingModule, violatedModule);
    });
  };

export const noAncestorFeatureDependencyRuleDefinition: BuildingBlockModuleRuleDefinition<
  {},
  NoAncestorFeatureDependencyViolationData
> = {
  name: "no-ancestor-feature-dependency",

  type: "buildingBlockModule",

  evaluate: (ruleConfig, resolveResult, resolvedModule) => {
    const violations: Violation<NoAncestorFeatureDependencyViolationData>[] =
      [];

    const feature = getResolvedFeature(
      resolveResult,
      resolvedModule.featureName
    );

    if (feature.parentFeatureName === undefined) {
      return [];
    }

    const featureHierarchy = buildFeatureNameHierarchy(
      feature.parentFeatureName,
      resolveResult
    );

    for (const dependencyModuleFilePath of resolvedModule.dependencyModuleFilePaths) {
      const dependencyModule = getResolvedModule(
        resolveResult,
        dependencyModuleFilePath
      );

      if (!("featureName" in dependencyModule)) {
        continue;
      }

      if (!featureHierarchy.includes(dependencyModule.featureName)) {
        continue;
      }

      const violation: Violation<NoAncestorFeatureDependencyViolationData> = {
        ruleName: "no-ancestor-feature-dependency",
        ruleScope: "feature",
        severity: "error",
        data: {
          violatingModule: resolvedModule,
          violatedModule: dependencyModule,
        },
      };

      violations.push(violation);
    }

    return violations;
  },

  printViolation: noAncestorFeatureDependencyViolationPrinter,
};
