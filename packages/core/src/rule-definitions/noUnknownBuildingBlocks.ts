import { z } from "zod";
import { getResolvedFeature } from "../resolve/operations/getResolvedFeature.js";
import { BuildingBlockRuleDefinition } from "../rule/model/RuleDefinition.js";
import { Violation } from "../rule/model/Violation.js";
import { ViolationPrinter } from "../rule/model/ViolationPrinter.js";
import {
  createDefaultRuleConfig,
  createDefaultRuleConfigSchema,
} from "../rule/operations/createDefaultRuleConfigSchema.js";
import { isRuleEnabled } from "../rule/operations/isRuleEnabled.js";
import { printViolationTemplate } from "../rule/print/printViolationTemplate.js";
import { checkMissingFeatureType } from "./noMissingFeatureTypes.js";
import { checkUnknownFeatureType } from "./noUnknownFeatureTypes.js";

const RULE_NAME = "no-unknown-building-blocks";

const RuleConfig = createDefaultRuleConfigSchema(RULE_NAME);

type RuleConfig = z.infer<typeof RuleConfig>;

export interface NoUnknownBuildingBlocksViolationData {
  featureName: string;
  unknownBuildingBlockName: string;
}

export const createNoUnknownBuildingBlockViolation = (
  featureName: string,
  unknownBuildingBlockName: string
): Violation<NoUnknownBuildingBlocksViolationData> => {
  return {
    ruleName: "no-unknown-building-blocks",
    severity: "error",
    data: {
      featureName,
      unknownBuildingBlockName,
    },
  };
};

const noUnknownBuildingBlocksViolationPrinter: ViolationPrinter<NoUnknownBuildingBlocksViolationData> =
  (printer, violation, resolveResult) => {
    const { featureName, unknownBuildingBlockName } = violation.data;

    printViolationTemplate(
      printer,
      violation,
      printer.format`Feature {bold ${featureName}} contains unknown building block {bold ${unknownBuildingBlockName}}`,
      () => {
        const knownBuildingBlocks = getResolvedFeature(
          resolveResult,
          featureName
        )
          .featureTypeConfig.buildingBlocks.map((buildingBlock) => {
            return buildingBlock.name;
          })
          .map((buildingBlockName) => {
            return printer.format`{bold ${buildingBlockName}}`;
          })
          .join(", ");

        printer.text`Feature {bold ${featureName}} may only contain building block: ${knownBuildingBlocks}`;
      }
    );
  };

export const noUnknownBuildingBlocksRuleDefinition: BuildingBlockRuleDefinition<
  typeof RuleConfig,
  NoUnknownBuildingBlocksViolationData
> = {
  name: RULE_NAME,

  type: "buildingBlock",

  configSchemaByScope: {
    root: RuleConfig,
  },

  defaultConfig: createDefaultRuleConfig(RULE_NAME),

  evaluate: (ruleConfigByScope, resolveResult, resolvedBuildingBlock) => {
    if (!isRuleEnabled(ruleConfigByScope)) {
      return [];
    }

    const resolvedFeature = getResolvedFeature(
      resolveResult,
      resolvedBuildingBlock.featureName
    );

    if (checkUnknownFeatureType(resolveResult, resolvedFeature)) {
      return [];
    }

    if (checkMissingFeatureType(resolvedFeature)) {
      return [];
    }

    if (!resolvedBuildingBlock.unknown) {
      return [];
    }

    return [
      createNoUnknownBuildingBlockViolation(
        resolvedBuildingBlock.featureName,
        resolvedBuildingBlock.name
      ),
    ];
  },

  printViolation: noUnknownBuildingBlocksViolationPrinter,
};
