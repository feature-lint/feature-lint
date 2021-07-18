import { getResolvedFeature } from "../resolve/operations/getResolvedFeature.js";
import { BuildingBlockName } from "../config/model/BuildingBlockName.js";
import { printViolationTemplate } from "../rule/print/printViolationTemplate.js";
import { ViolationPrinter } from "../rule/model/ViolationPrinter.js";
import {
  BuildingBlockRuleDefinition,
  FeatureRuleDefinition,
} from "../rule/model/RuleDefinition.js";
import { Violation } from "../rule/model/Violation.js";
import { checkMissingFeatureType } from "./noMissingFeatureTypes.js";
import { checkUnknownFeatureType } from "./noUnknownFeatureTypes.js";

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
    ruleScope: "feature",
    data: {
      featureName,
      unknownBuildingBlockName,
    },
  };
};

const noUnknownBuildingBlocksViolationPrinter: ViolationPrinter<NoUnknownBuildingBlocksViolationData> =
  (printer, violation, resolveState) => {
    const { featureName, unknownBuildingBlockName } = violation.data;

    printViolationTemplate(
      printer,
      violation,
      printer.format`Feature {bold ${featureName}} contains unknown building block {bold ${unknownBuildingBlockName}}`,
      () => {
        const knownBuildingBlocks = getResolvedFeature(
          resolveState,
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
  {},
  NoUnknownBuildingBlocksViolationData
> = {
  name: "no-unknown-building-blocks",

  type: "buildingBlock",

  evaluate: (ruleConfig, resolveState, resolvedBuildingBlock) => {
    const resolvedFeature = getResolvedFeature(
      resolveState,
      resolvedBuildingBlock.featureName
    );

    if (checkUnknownFeatureType(resolveState, resolvedFeature)) {
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
