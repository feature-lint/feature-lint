import { z } from "zod";
import { ResolvedFeature } from "../resolve/model/ResolvedFeature.js";
import {
  FeatureRuleDefinition,
  RuleConfigByScope,
} from "../rule/model/RuleDefinition.js";
import {
  RuleScope,
  RULE_SCOPE_DEFAULT_PRECEDENCE,
} from "../rule/model/RuleScope.js";
import { Violation } from "../rule/model/Violation.js";
import { ViolationPrinter } from "../rule/model/ViolationPrinter.js";
import {
  createDefaultRuleConfig,
  createDefaultRuleConfigSchema,
  DefaultRuleConfig,
} from "../rule/operations/createDefaultRuleConfigSchema.js";
import { isRuleEnabled } from "../rule/operations/isRuleEnabled.js";
import { printViolationTemplate } from "../rule/print/printViolationTemplate.js";

const RULE_NAME = "no-missing-feature-types";

const RuleConfig = createDefaultRuleConfigSchema(RULE_NAME);

type RuleConfig = z.infer<typeof RuleConfig>;

export interface NoMissingFeatureTypesViolationData {
  featureName: string;
}

export const createNoMissingFeatureTypesViolation = (
  featureName: string
): Violation<NoMissingFeatureTypesViolationData> => {
  return {
    ruleName: RULE_NAME,
    severity: "error",
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
  typeof RuleConfig,
  NoMissingFeatureTypesViolationData
> = {
  name: RULE_NAME,

  type: "feature",

  configSchemaByScope: {
    root: RuleConfig,
  },

  defaultConfig: createDefaultRuleConfig(RULE_NAME),

  evaluate: (ruleConfigByScope, resolveResult, resolvedFeature) => {
    if (!isRuleEnabled(ruleConfigByScope)) {
      return [];
    }

    if (checkMissingFeatureType(resolvedFeature)) {
      return [createNoMissingFeatureTypesViolation(resolvedFeature.name)];
    }

    return [];
  },

  printViolation: noMissingFeatureTypesViolationPrinter,
};
