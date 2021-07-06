import { printViolationTemplate } from "../render/printViolationTemplate.js";
import { ViolationPrinter } from "../render/ViolationPrinter.js";
import { ResolvedFeature } from "../resolve/model/ResolvedFeature.js";
import { FeatureRuleDefinition } from "../rule-registry/ruleDefinition.js";
import { Violation } from "../violation/model/Violation.js";

export interface NoMissingFeatureTypesViolationData {
  featureName: string;
}

export const createNoMissingFeatureTypesViolation = (
  featureName: string
): Violation<NoMissingFeatureTypesViolationData> => {
  return {
    name: "no-missing-feature-types",
    severity: "error",
    scope: "feature",
    data: {
      featureName,
    },
  };
};

const noMissingFeatureTypesViolationPrinter: ViolationPrinter<NoMissingFeatureTypesViolationData> =
  (printer, violation, resolveState) => {
    const { featureName } = violation.data;

    printViolationTemplate(
      printer,
      violation,
      printer.format`Feature {bold ${featureName}} has {bold no} feature type`,
      () => {
        const allFeatureTypesText =
          resolveState.resolvedRoot.config.featureTypes
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

  evaluate: (ruleConfig, resolveState, resolvedFeature) => {
    if (checkMissingFeatureType(resolvedFeature)) {
      return [createNoMissingFeatureTypesViolation(resolvedFeature.name)];
    }

    return [];
  },

  printViolation: noMissingFeatureTypesViolationPrinter,
};
