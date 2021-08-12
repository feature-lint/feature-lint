import { z } from "zod";
import { DependenciesViolationData } from "../dependencies/model/DependenciesViolationData.js";
import { DependencyCriterionConfig } from "../dependencies/model/DependencyCriterionConfig.js";
import { checkCriteria } from "../dependencies/operations/checkCriteria.js";
import { ResolvedBuildingBlockModule } from "../resolve/model/ResolvedModule.js";
import { ResolveResult } from "../resolve/model/ResolveResult.js";
import { getResolvedFeature } from "../resolve/operations/getResolvedFeature.js";
import { getResolvedModule } from "../resolve/operations/getResolvedModule.js";
import {
  BuildingBlockModuleRuleDefinition,
  RuleConfigByScope,
} from "../rule/model/RuleDefinition.js";
import { Violation } from "../rule/model/Violation.js";
import { printImportOrExportOfDependency } from "../rule/print/printImportOrExportOfDependency.js";
import { printViolationTemplate } from "../rule/print/printViolationTemplate.js";

export const DependentsRuleConfig = z.object({
  name: z.literal("dependents"),

  criteria: z.array(DependencyCriterionConfig),
});

export type DependentsRuleConfig = z.infer<typeof DependentsRuleConfig>;

export const evaluate = (
  ruleConfigByScope: RuleConfigByScope<DependentsRuleConfig>,
  resolveResult: ResolveResult,
  module: ResolvedBuildingBlockModule
): Violation<DependenciesViolationData>[] => {
  const violations: Violation<DependenciesViolationData>[] = [];

  for (const moduleFilePath of module.dependentModuleFilesPaths) {
    const dependentModule = getResolvedModule(resolveResult, moduleFilePath);

    if (dependentModule.type !== "buildingBlockModule") {
      continue;
    }

    const violation = checkCriteria(
      ruleConfigByScope,
      resolveResult,
      module,
      dependentModule
    );

    if (violation !== undefined) {
      const actualViolation: Violation<DependenciesViolationData> = {
        ...violation,

        ruleName: "dependents",

        data: {
          ...violation?.data,

          violatedModule: violation.data.violatingModule,
          violatingModule: violation.data.violatedModule,
        },
      };

      violations.push(actualViolation);
    }
  }

  return violations;
};

export const dependentsRuleDefinition: BuildingBlockModuleRuleDefinition<
  DependentsRuleConfig,
  DependenciesViolationData
> = {
  name: "dependents",

  type: "buildingBlockModule",

  evaluate,

  printViolation: (printer, violation, resolveResult) => {
    const {
      violatingModule,
      violatedModule,
      violationScope: dependencyScope /* allowedDependencyNames */,
    } = violation.data;

    const feature = getResolvedFeature(
      resolveResult,
      violatingModule.featureName
    );

    const featureTypeName = feature.featureTypeName;

    const dependencyFeature = getResolvedFeature(
      resolveResult,
      violatedModule.featureName
    );

    const dependencyFeatureTypeName = dependencyFeature.featureTypeName;

    const renderDependentMessagePart = () => {
      switch (violation.ruleScope) {
        case "root": {
          throw new Error("Not supported");
        }
        case "featureType": {
          return printer.format`feature type {bold ${featureTypeName}}`;
        }
        case "feature": {
          return printer.format`feature {bold ${violatingModule.featureName}}`;
        }
        case "buildingBlock": {
          return printer.format`building block {bold ${violatingModule.buildingBlockName}}`;
        }
      }
    };

    const renderDependencyMessagePart = () => {
      switch (dependencyScope) {
        case "featureType": {
          return printer.format`Feature type {bold ${dependencyFeatureTypeName}}`;
        }
        case "feature": {
          return printer.format`Feature {bold ${violatedModule.featureName}}`;
        }
        case "buildingBlock": {
          return printer.format`Building block {bold ${violatedModule.buildingBlockName}}`;
        }
      }
    };

    // const renderDependencyTypeMessagePart = () => {
    //   switch (dependencyScope) {
    //     case "featureType": {
    //       return "feature type";
    //     }
    //     case "feature": {
    //       return "feature";
    //     }
    //     case "buildingBlock": {
    //       return "building block";
    //     }
    //   }
    // };

    const title = `${renderDependencyMessagePart()} must not be a dependency of ${renderDependentMessagePart()}`;

    printViolationTemplate(printer, violation, title, () => {
      printImportOrExportOfDependency(printer, violatingModule, violatedModule);

      printer.blankLine();

      /*       printer.text`${renderDependentMessagePart()} may only depend on ${renderDependencyTypeMessagePart()}: ${Array.from(
        allowedDependencyNames
      )
        .map((name) => printer.format`{bold ${name}}`)
        .join(", ")}`; */
    });
  },
};
