import { getFeatureTypeConfig } from "../config/operations/getFeatureTypeConfig.js";
import { FeatureRuleDefinition } from "../rule/model/RuleDefinition.js";
import { Violation } from "../rule/model/Violation.js";
import { ViolationPrinter } from "../rule/model/ViolationPrinter.js";
import { printViolationTemplate } from "../rule/print/printViolationTemplate.js";

export interface WrongFeatureTypeMatchViolationData {
  simpleFeatureName: string;
  featureName: string;
  matchedFeatureTypeNames: string[];
  matchedFeatureTypes: SimpleFeatureType[];
  actualFeatureTypeName: string;
  featureTypeMatched: boolean;
}

const wrongFeatureTypeMatchViolationPrinter: ViolationPrinter<WrongFeatureTypeMatchViolationData> =
  (printer, violation, resolveResult) => {
    const {
      featureName,
      simpleFeatureName,
      actualFeatureTypeName,
      matchedFeatureTypeNames,
      matchedFeatureTypes,
      featureTypeMatched,
    } = violation.data;
    if (matchedFeatureTypeNames.length === 1 && !featureTypeMatched) {
      const title = printer.format`Feature {bold ${featureName}} has feature type {bold ${actualFeatureTypeName}} but matches feature type ${matchedFeatureTypeNames[0]}`;

      printViolationTemplate(printer, violation, title, () => {
        const matchedFeatureType = matchedFeatureTypes[0];

        printer.text`Feature name {bold ${simpleFeatureName}} matches pattern {bold /${matchedFeatureType.featureNameMatcher.source}/} and must have feature type {bold ${matchedFeatureType.name}} instead of feature type {bold ${actualFeatureTypeName}}`;
      });
    }

    if (matchedFeatureTypeNames.length > 1) {
      const title = printer.format`Feature {bold ${featureName}} has feature type {bold ${actualFeatureTypeName}} but matches multiple other feature types`;

      printViolationTemplate(printer, violation, title, () => {
        printer.text`Feature name {bold ${simpleFeatureName}} matches the following patterns`;

        printer.blankLine();

        for (const matchedFeatureType of matchedFeatureTypes) {
          printer.text`/{bold ${matchedFeatureType.featureNameMatcher.source}}/ (feature type {bold ${matchedFeatureType.name}})`;
        }

        printer.blankLine();

        printer.text`but must not match more than one feature type.`;
      });
    }
  };

interface SimpleFeatureType {
  name: string;
  featureNameMatcher: RegExp;
}

export const wrongFeatureTypeMatchRuleDefinition: FeatureRuleDefinition<
  {},
  WrongFeatureTypeMatchViolationData
> = {
  name: "wrong-feature-type-match",

  type: "feature",

  evaluate: (ruleConfig, resolveResult, resolvedFeature) => {
    const { featureTypeName, matchedFeatureTypeNames, simpleName, name } =
      resolvedFeature;

    const matchedFeatureTypes: SimpleFeatureType[] =
      matchedFeatureTypeNames.map((matchedFeatureTypeName) => {
        const featureType = getFeatureTypeConfig(
          resolveResult.resolvedRoot.config,
          matchedFeatureTypeName
        );

        return {
          name: featureType.name,
          featureNameMatcher: featureType.featureNameMatcher!,
        };
      });

    // This is handled by a different rule already
    if (featureTypeName === undefined) {
      return [];
    }

    const featureTypeMatched = matchedFeatureTypeNames.some(
      (matchedFeatureTypeName) => {
        return matchedFeatureTypeName === featureTypeName;
      }
    );

    const violation: Violation<WrongFeatureTypeMatchViolationData> = {
      ruleName: "wrong-feature-type-match",
      ruleScope: "root",
      severity: "error",
      data: {
        featureName: name,
        simpleFeatureName: simpleName,
        actualFeatureTypeName: featureTypeName,
        matchedFeatureTypeNames,
        matchedFeatureTypes,
        featureTypeMatched,
      },
    };

    if (matchedFeatureTypeNames.length === 1 && !featureTypeMatched) {
      return [violation];
    }

    if (matchedFeatureTypeNames.length > 1 && featureTypeMatched) {
      return [violation];
    }

    if (matchedFeatureTypeNames.length > 1 && !featureTypeMatched) {
      return [violation];
    }

    return [];

    // 0 match
    // 1 match, feature type is matched
    // 1 match, feature type is not matched
    // > 1 match, feature type matched
    // > 1 match, feature type is not matched

    return [];
  },

  printViolation: wrongFeatureTypeMatchViolationPrinter,
};
