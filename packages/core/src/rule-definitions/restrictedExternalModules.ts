import { z } from "zod";
import {
  ExternalModule,
  ResolvedBuildingBlockModule,
} from "../resolve/model/ResolvedModule.js";
import { getResolvedFeature } from "../resolve/operations/getResolvedFeature.js";
import {
  BuildingBlockModuleRuleDefinition,
  RuleConfigByScope,
} from "../rule/model/RuleDefinition.js";
import { RuleScope } from "../rule/model/RuleScope.js";
import { Violation } from "../rule/model/Violation.js";
import { printImportOrExportDeclaration } from "../rule/print/printImportOrExportDeclaration.js";
import { printViolationTemplate } from "../rule/print/printViolationTemplate.js";

const ExternalModuleCriterionConfig = z
  .string()
  .refine((rawCriterion) => {
    const rawPattern = (() => {
      if (rawCriterion.startsWith("!")) {
        return rawCriterion.slice(1);
      }

      return rawCriterion;
    })();

    try {
      new RegExp(rawPattern);

      return true;
    } catch (e) {
      return false;
    }
  })
  .transform((rawCriterion) => {
    const [type, rawPattern] = (() => {
      if (rawCriterion.startsWith("!")) {
        return ["deny", rawCriterion.slice(1)] as const;
      }

      return ["allow", rawCriterion] as const;
    })();

    return {
      type,
      pattern: new RegExp(rawPattern),
    };
  });

type ExternalModuleCriterionConfig = z.infer<
  typeof ExternalModuleCriterionConfig
>;

export const RestrictedExternalModulesRuleConfig = z.object({
  name: z.literal("restricted-external-modules"),

  criteria: z.array(ExternalModuleCriterionConfig),
});

export type RestrictedExternalModulesRuleConfig = z.infer<
  typeof RestrictedExternalModulesRuleConfig
>;

export interface RestrictedExternalModulesViolationData {
  violatingModule: ResolvedBuildingBlockModule;

  violationScope: RuleScope;

  externalModule: ExternalModule;
}

export const restrictedExternalModulesRuleDefinition: BuildingBlockModuleRuleDefinition<
  typeof RestrictedExternalModulesRuleConfig,
  RestrictedExternalModulesViolationData
> = {
  name: "restricted-external-modules",

  type: "buildingBlockModule",

  configSchemaByScope: {
    root: RestrictedExternalModulesRuleConfig,
    featureType: RestrictedExternalModulesRuleConfig,
    feature: RestrictedExternalModulesRuleConfig,
    buildingBlock: RestrictedExternalModulesRuleConfig,
  },

  evaluate: (ruleConfigByScope, resolveResult, resolvedModule) => {
    const violations: Violation<RestrictedExternalModulesViolationData>[] = [];

    const checkCriteria = (
      ruleConfigByScope: RuleConfigByScope<RestrictedExternalModulesRuleConfig>,
      externalModule: ExternalModule
    ): Violation<RestrictedExternalModulesViolationData> | undefined => {
      const ruleScopeOrder: RuleScope[] = [
        "root",
        "featureType",
        "feature",
        "buildingBlock",
      ];

      if (
        !ruleScopeOrder.some((ruleScope) => {
          return ruleConfigByScope[ruleScope] !== undefined;
        })
      ) {
        return;
      }

      let denyCriterionAndRuleScope:
        | [ExternalModuleCriterionConfig, RuleScope]
        | undefined = undefined;

      for (const ruleScope of ruleScopeOrder) {
        const criteria = ruleConfigByScope[ruleScope]?.criteria;

        if (criteria === undefined) {
          continue;
        }

        for (const criterion of criteria) {
          if (externalModule.name.match(criterion.pattern)) {
            if (criterion.type === "allow") {
              denyCriterionAndRuleScope = undefined;
            } else {
              denyCriterionAndRuleScope ??= [criterion, ruleScope];
            }
          }
        }
      }

      if (denyCriterionAndRuleScope === undefined) {
        return undefined;
      }

      return {
        ruleName: "restricted-external-modules",
        severity: "error",
        data: {
          violatingModule: resolvedModule,
          violationScope: denyCriterionAndRuleScope[1],
          externalModule,
        },
      };
    };

    for (const externalModule of resolvedModule.externalModuleByModuleName.values()) {
      const violation = checkCriteria(ruleConfigByScope, externalModule);

      if (violation) {
        violations.push(violation);
      }
    }

    return violations;
  },

  printViolation: (printer, violation, resolveResult) => {
    const { violatingModule, violationScope, externalModule } = violation.data;

    const feature = getResolvedFeature(
      resolveResult,
      violatingModule.featureName
    );

    const featureTypeName = feature.featureTypeName;

    const renderDependentMessagePart = () => {
      switch (violationScope) {
        case "root": {
          return printer.format`Project`;
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

    const title = printer.format`${renderDependentMessagePart()} must not import external module {bold ${
      externalModule.name
    }}`;

    printViolationTemplate(printer, violation, title, () => {
      printImportOrExportDeclaration(
        printer,
        violatingModule,
        externalModule.tsImportOrExportDeclaration
      );
    });
  },
};
