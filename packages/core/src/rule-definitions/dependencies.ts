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

export const DependenciesRuleConfig = z.object({
  name: z.literal("dependencies"),

  criteria: z.array(DependencyCriterionConfig),
});

export type DependenciesRuleConfig = z.infer<typeof DependenciesRuleConfig>;

export const evaluate = (
  ruleConfigByScope: RuleConfigByScope<DependenciesRuleConfig>,
  resolveResult: ResolveResult,
  module: ResolvedBuildingBlockModule
): Violation<DependenciesViolationData>[] => {
  const violations: Violation<DependenciesViolationData>[] = [];

  for (const moduleFilePath of module.dependencyModuleFilePaths) {
    const dependencyModule = getResolvedModule(resolveResult, moduleFilePath);

    if (dependencyModule.type !== "buildingBlockModule") {
      continue;
    }

    const violation = checkCriteria(
      ruleConfigByScope,
      resolveResult,
      module,
      dependencyModule
    );

    if (violation !== undefined) {
      violations.push(violation);
    }
  }

  return violations;
};

export const dependenciesRuleDefinition: BuildingBlockModuleRuleDefinition<
  DependenciesRuleConfig,
  DependenciesViolationData
> = {
  name: "dependencies",

  type: "buildingBlockModule",

  evaluate,

  printViolation: (printer, violation, resolveResult) => {
    const {
      violatingModule,
      violatedModule: dependencyModule,
      violationScope: dependencyScope /* allowedDependencyNames */,
    } = violation.data;

    const feature = getResolvedFeature(
      resolveResult,
      violatingModule.featureName
    );

    const featureTypeName = feature.featureTypeName;

    const dependencyFeature = getResolvedFeature(
      resolveResult,
      dependencyModule.featureName
    );

    const dependencyFeatureTypeName = dependencyFeature.featureTypeName;

    const renderDependentMessagePart = () => {
      switch (violation.ruleScope) {
        case "root": {
          throw new Error("Not supported");
        }
        case "featureType": {
          return printer.format`Feature type {bold ${featureTypeName}}`;
        }
        case "feature": {
          return printer.format`Feature {bold ${violatingModule.featureName}}`;
        }
        case "buildingBlock": {
          return printer.format`Building block {bold ${violatingModule.buildingBlockName}}`;
        }
      }
    };

    const renderDependencyMessagePart = () => {
      switch (dependencyScope) {
        case "featureType": {
          return printer.format`feature type {bold ${dependencyFeatureTypeName}}`;
        }
        case "feature": {
          return printer.format`feature {bold ${dependencyModule.featureName}}`;
        }
        case "buildingBlock": {
          return printer.format`building block {bold ${dependencyModule.buildingBlockName}}`;
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

    const title = `${renderDependentMessagePart()} must not depend on ${renderDependencyMessagePart()}`;

    printViolationTemplate(printer, violation, title, () => {
      printImportOrExportOfDependency(
        printer,
        violatingModule,
        dependencyModule
      );

      printer.blankLine();

      /*       printer.text`${renderDependentMessagePart()} may only depend on ${renderDependencyTypeMessagePart()}: ${Array.from(
        allowedDependencyNames
      )
        .map((name) => printer.format`{bold ${name}}`)
        .join(", ")}`; */
    });
  },
};
