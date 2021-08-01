import { printViolationTemplate } from "../rule/print/printViolationTemplate.js";
import { ViolationPrinter } from "../rule/model/ViolationPrinter.js";
import { ResolvedFeature } from "../resolve/model/ResolvedFeature.js";
import { ResolveResult } from "../resolve/model/ResolveResult.js";
import { FeatureRuleDefinition } from "../rule/model/RuleDefinition.js";
import { Violation } from "../rule/model/Violation.js";

export interface NoUnknownFeatureTypesViolationData {
  featureName: string;
  unknownFeatureTypeName: string;
}

export const createNoUnknownFeatureTypeViolation = (
  featureName: string,
  unknownFeatureTypeName: string
): Violation<NoUnknownFeatureTypesViolationData> => {
  return {
    ruleName: "no-unknown-feature-types",
    severity: "error",
    ruleScope: "feature",
    data: {
      featureName,
      unknownFeatureTypeName,
    },
  };
};

const noUnknownFeatureTypesViolationPrinter: ViolationPrinter<NoUnknownFeatureTypesViolationData> =
  (printer, violation, resolveResult) => {
    const { featureName, unknownFeatureTypeName } = violation.data;

    printViolationTemplate(
      printer,
      violation,
      printer.format`Feature {bold ${featureName}} has unknown feature type {bold ${unknownFeatureTypeName}}`,
      () => {
        const allFeatureTypesText =
          resolveResult.resolvedRoot.config.featureTypes
            .map((featureType) => {
              return printer.format`{bold ${featureType.name}}`;
            })
            .join(", ");

        if (allFeatureTypesText !== "") {
          printer.text`Feature {bold ${featureName}} may only have feature type: ${allFeatureTypesText}`;
        }
      }
    );
  };

export const checkUnknownFeatureType = (
  resolveResult: ResolveResult,
  resolvedFeature: ResolvedFeature
): boolean => {
  if (resolvedFeature.featureTypeName === undefined) {
    return false;
  }

  const known = resolveResult.resolvedRoot.config.featureTypes.find(
    (featureType) => {
      return featureType.name === resolvedFeature.featureTypeName;
    }
  );

  return !known;
};

export const noUnknownFeatureTypesRuleDefinition: FeatureRuleDefinition<
  {},
  NoUnknownFeatureTypesViolationData
> = {
  name: "no-unknown-feature-types",

  type: "feature",

  evaluate: (ruleConfig, resolveResult, resolvedFeature) => {
    if (!checkUnknownFeatureType(resolveResult, resolvedFeature)) {
      return [];
    }

    if (resolvedFeature.featureTypeName === undefined) {
      return [];
    }

    return [
      createNoUnknownFeatureTypeViolation(
        resolvedFeature.name,
        resolvedFeature.featureTypeName
      ),
    ];
  },

  printViolation: noUnknownFeatureTypesViolationPrinter,
};
