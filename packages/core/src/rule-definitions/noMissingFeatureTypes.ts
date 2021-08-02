import { printViolationTemplate } from "../rule/print/printViolationTemplate.js";
import { ViolationPrinter } from "../rule/model/ViolationPrinter.js";
import { ResolvedFeature } from "../resolve/model/ResolvedFeature.js";
import { FeatureRuleDefinition } from "../rule/model/RuleDefinition.js";
import { Violation } from "../rule/model/Violation.js";

export interface NoMissingFeatureTypesViolationData {
  featureName: string;
}

export const createNoMissingFeatureTypesViolation = (
  featureName: string
): Violation<NoMissingFeatureTypesViolationData> => {
  return {
    ruleName: "no-missing-feature-types",
    severity: "error",
    ruleScope: "feature",
    data: {
      featureName,
    },
  };
};

const noMissingFeatureTypesViolationPrinter: ViolationPrinter<NoMissingFeatureTypesViolationData> =
  (printer, violation, resolveResult) => {
    const { featureName } = violation.data;

    printViolationTemplate(
      printer,
      violation,
      printer.format`Feature {bold ${featureName}} has {bold no} feature type`,
      () => {
        const allFeatureTypesText =
          resolveResult.resolvedRoot.config.featureTypes
            .map((featureType) => {
              return printer.format`{bold ${featureType.name}}`;
            })
            .join(", ");

        if (allFeatureTypesText !== "") {
          printer.text`Feature {bold ${featureName}} must have feature type: ${allFeatureTypesText}`;
        }
      }
    );
  };

export const checkMissingFeatureType = (
  resolvedFeature: ResolvedFeature
): boolean => {
  return resolvedFeature.featureTypeName === undefined;
};

export const noMissingFeatureTypesRuleDefinition: FeatureRuleDefinition<
  {},
  NoMissingFeatureTypesViolationData
> = {
  name: "no-missing-feature-types",

  type: "feature",

  evaluate: (ruleConfig, resolveResult, resolvedFeature) => {
    if (checkMissingFeatureType(resolvedFeature)) {
      return [createNoMissingFeatureTypesViolation(resolvedFeature.name)];
    }

    return [];
  },

  printViolation: noMissingFeatureTypesViolationPrinter,
};
