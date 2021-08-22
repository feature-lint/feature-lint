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
import {
  createDefaultRuleConfig,
  createDefaultRuleConfigSchema,
} from "../rule/operations/createDefaultRuleConfigSchema.js";
import { printImportOrExportOfDependency } from "../rule/print/printImportOrExportOfDependency.js";
import { printViolationTemplate } from "../rule/print/printViolationTemplate.js";
import { z } from "zod";
import { isRuleEnabled } from "../rule/operations/isRuleEnabled.js";

const RULE_NAME = "no-ancestor-feature-dependency";

const RuleConfig = createDefaultRuleConfigSchema(RULE_NAME);

type RuleConfig = z.infer<typeof RuleConfig>;

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
  typeof RuleConfig,
  NoAncestorFeatureDependencyViolationData
> = {
  name: "no-ancestor-feature-dependency",

  type: "buildingBlockModule",

  configSchemaByScope: {
    root: RuleConfig,
  },

  defaultConfig: createDefaultRuleConfig(RULE_NAME),

  evaluate: (ruleConfigByScope, resolveResult, resolvedModule) => {
    if (!isRuleEnabled(ruleConfigByScope)) {
      return [];
    }

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
        ruleName: RULE_NAME,
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
