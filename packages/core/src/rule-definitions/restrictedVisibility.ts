import { ResolvedBuildingBlockModule } from "../resolve/model/ResolvedModule.js";
import { buildFeatureNameHierarchy } from "../resolve/operations/buildFeatureNameHierarchy.js";
import { getResolvedFeature } from "../resolve/operations/getResolvedFeature.js";
import { getResolvedModule } from "../resolve/operations/getResolvedModule.js";
import { BuildingBlockModuleRuleDefinition } from "../rule/model/RuleDefinition.js";
import { Violation } from "../rule/model/Violation.js";
import { ViolationPrinter } from "../rule/model/ViolationPrinter.js";
import { printImportOrExportOfDependency } from "../rule/print/printImportOrExportOfDependency.js";
import { printViolationTemplate } from "../rule/print/printViolationTemplate.js";
import { z } from "zod";
import {
  createDefaultRuleConfig,
  createDefaultRuleConfigSchema,
} from "../rule/operations/createDefaultRuleConfigSchema.js";
import { isRuleEnabled } from "../rule/operations/isRuleEnabled.js";

const RULE_NAME = "restricted-visibility";

const RuleConfig = createDefaultRuleConfigSchema(RULE_NAME);

type RuleConfig = z.infer<typeof RuleConfig>;

type VisibilityType =
  | "buildingBlock"
  | "feature"
  | "parentFeature"
  | "siblingFeature";

export interface RestrictedVisibilityViolationData {
  /**
   * The module that casued the violation by importing a module that has restricted visibility.
   */
  violatingModule: ResolvedBuildingBlockModule;

  /**
   * That module that the restricted visibility that was violated.
   */
  restrictedModule: ResolvedBuildingBlockModule;

  visibilityType: VisibilityType;
}

const restrictedVisibilityViolationPrinter: ViolationPrinter<RestrictedVisibilityViolationData> =
  (printer, violation, resolveResult) => {
    const { violatingModule, restrictedModule, visibilityType } =
      violation.data;

    switch (visibilityType) {
      case "buildingBlock": {
        const renderViolatingMessagePart = (): string => {
          if (violatingModule.featureName === restrictedModule.featureName) {
            return printer.format`Building block {bold ${violatingModule.buildingBlockName}}`;
          } else {
            return printer.format`Feature {bold ${violatingModule.featureName}}`;
          }
        };

        const title = printer.format`${renderViolatingMessagePart()} must not depend on private building block {bold ${
          restrictedModule.buildingBlockName
        }}`;

        printViolationTemplate(printer, violation, title, () => {
          printImportOrExportOfDependency(
            printer,
            violatingModule,
            restrictedModule
          );

          printer.blankLine();

          printer.text`Only building blocks {bold ${restrictedModule.buildingBlockName}} in feature {bold ${restrictedModule.featureName}} may depend on it.`;
        });

        return;
      }

      case "feature": {
        const title = printer.format`Feature {bold ${violatingModule.featureName}} must not depend on private building block {bold ${restrictedModule.buildingBlockName}}`;

        printViolationTemplate(printer, violation, title, () => {
          printImportOrExportOfDependency(
            printer,
            violatingModule,
            restrictedModule
          );

          printer.blankLine();

          printer.text`Only feature {bold ${restrictedModule.featureName}} may depend on it.`;
        });

        return;
      }

      case "siblingFeature": {
        const title = printer.format`Feature {bold ${violatingModule.featureName}} must not depend on private feature {bold ${restrictedModule.featureName}}`;

        printViolationTemplate(printer, violation, title, () => {
          printImportOrExportOfDependency(
            printer,
            violatingModule,
            restrictedModule
          );

          printer.blankLine();

          const feature = getResolvedFeature(
            resolveResult,
            restrictedModule.featureName
          );

          printer.text`Only child features of {bold ${feature.parentFeatureName}} may depend on it.`;
        });

        return;
      }

      case "parentFeature": {
        const title = printer.format`Feature {bold ${violatingModule.featureName}} must not depend on private feature {bold ${restrictedModule.featureName}}`;

        printViolationTemplate(printer, violation, title, () => {
          printImportOrExportOfDependency(
            printer,
            violatingModule,
            restrictedModule
          );

          printer.blankLine();

          const feature = getResolvedFeature(
            resolveResult,
            restrictedModule.featureName
          );

          printer.text`Only feature {bold ${feature.parentFeatureName}} and its child features may depend on it.`;
        });

        return;
      }
    }
  };

export const restrictedVisibilityRuleDefinition: BuildingBlockModuleRuleDefinition<
  typeof RuleConfig,
  RestrictedVisibilityViolationData
> = {
  name: RULE_NAME,

  type: "buildingBlockModule",

  configSchemaByScope: {
    root: RuleConfig,
  },

  defaultConfig: createDefaultRuleConfig(RULE_NAME),

  evaluate: (ruleConfigByScope, resolveResult, module) => {
    if (!isRuleEnabled(ruleConfigByScope)) {
      return [];
    }

    const violations: Violation<RestrictedVisibilityViolationData>[] = [];

    for (const moduleFilePath of module.dependencyModuleFilePaths) {
      const dependencyModule = getResolvedModule(resolveResult, moduleFilePath);

      if (dependencyModule.type !== "buildingBlockModule") {
        continue;
      }

      const checkBuildingBlockPrivate = ():
        | Violation<RestrictedVisibilityViolationData>
        | undefined => {
        // TODO: Extract check method for this?
        if (
          dependencyModule.featureName === module.featureName &&
          dependencyModule.buildingBlockName === module.buildingBlockName
        ) {
          return;
        }

        if (dependencyModule.featureName === module.featureName) {
          if (dependencyModule.buildingBlockPrivate) {
            return {
              ruleName: RULE_NAME,
              severity: "error",
              data: {
                violatingModule: module,
                restrictedModule: dependencyModule,
                visibilityType: "buildingBlock",
              },
            };
          }
        }
      };

      const checkFeaturePrivate = ():
        | Violation<RestrictedVisibilityViolationData>
        | undefined => {
        if (
          dependencyModule.featureName === module.featureName &&
          dependencyModule.buildingBlockName === module.buildingBlockName
        ) {
          return;
        }

        if (dependencyModule.featureName !== module.featureName) {
          if (
            dependencyModule.featurePrivate ||
            dependencyModule.buildingBlockPrivate
          ) {
            return {
              ruleName: RULE_NAME,
              severity: "error",
              data: {
                violatingModule: module,
                restrictedModule: dependencyModule,
                visibilityType: dependencyModule.buildingBlockPrivate
                  ? "buildingBlock"
                  : "feature",
              },
            };
          }
        }
      };

      const checkSiblingFeaturePrivate = ():
        | Violation<RestrictedVisibilityViolationData>
        | undefined => {
        if (dependencyModule.siblingFeaturePrivate === undefined) {
          return;
        }

        const siblingFeaturePrivate = getResolvedFeature(
          resolveResult,
          dependencyModule.siblingFeaturePrivate
        );

        const feature = getResolvedFeature(resolveResult, module.featureName);

        // check if feature is child of parent private feature
        if (
          buildFeatureNameHierarchy(feature.name, resolveResult).includes(
            siblingFeaturePrivate.name
          ) &&
          siblingFeaturePrivate.name !== feature.name
        ) {
          return;
        }

        return {
          ruleName: RULE_NAME,
          severity: "error",
          data: {
            violatingModule: module,
            restrictedModule: dependencyModule,
            visibilityType: "siblingFeature",
          },
        };
      };

      const checkParentFeaturePrivate = ():
        | Violation<RestrictedVisibilityViolationData>
        | undefined => {
        if (dependencyModule.parentFeaturePrivate === undefined) {
          return;
        }

        const parentPrivateFeature = getResolvedFeature(
          resolveResult,
          dependencyModule.parentFeaturePrivate
        );

        const feature = getResolvedFeature(resolveResult, module.featureName);

        // check if feature is child of parent private feature or it is the parent private feature itself
        if (
          buildFeatureNameHierarchy(feature.name, resolveResult).includes(
            parentPrivateFeature.name
          )
        ) {
          return;
        }

        return {
          ruleName: RULE_NAME,
          severity: "error",
          data: {
            violatingModule: module,
            restrictedModule: dependencyModule,
            visibilityType: "parentFeature",
          },
        };
      };

      const buildingBlockPrivateViolation = checkBuildingBlockPrivate();

      if (buildingBlockPrivateViolation !== undefined) {
        violations.push(buildingBlockPrivateViolation);

        continue;
      }

      const featurePrivateViolation = checkFeaturePrivate();

      if (featurePrivateViolation !== undefined) {
        violations.push(featurePrivateViolation);

        continue;
      }

      const siblingFeaturePrivateViolation = checkSiblingFeaturePrivate();

      if (siblingFeaturePrivateViolation !== undefined) {
        violations.push(siblingFeaturePrivateViolation);

        continue;
      }

      const parentFeaturePrivateViolation = checkParentFeaturePrivate();

      if (parentFeaturePrivateViolation !== undefined) {
        violations.push(parentFeaturePrivateViolation);

        continue;
      }
    }

    return violations;
  },

  printViolation: restrictedVisibilityViolationPrinter,
};
