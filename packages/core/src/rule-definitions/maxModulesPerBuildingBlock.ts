import { BuildingBlockRuleDefinition } from "../rule/model/RuleDefinition.js";
import { z } from "zod";
import { getMostSpecificRuleConfig } from "../rule/operations/getMostSpecificRuleConfig.js";
import { Violation } from "../rule/model/Violation.js";
import { printViolationTemplate } from "../rule/print/printViolationTemplate.js";

const RULE_NAME = "max-modules-per-building-block";

const RuleConfig = z.object({
  name: z.literal(RULE_NAME),

  max: z.number().min(1),
});

export interface ViolationData {
  buildingBlockName: string;
  maxNumberOfModules: number;
  actualNumberOfModule: number;
}

export const maxModulesPerBuildingBlockRuleDefinition: BuildingBlockRuleDefinition<
  typeof RuleConfig,
  ViolationData
> = {
  name: RULE_NAME,

  type: "buildingBlock",

  configSchemaByScope: {
    root: RuleConfig,
    featureType: RuleConfig,
    feature: RuleConfig,
    buildingBlock: RuleConfig,
  },

  evaluate: (ruleConfigByScope, resolveResult, buildingBlock) => {
    const ruleConfig = getMostSpecificRuleConfig(ruleConfigByScope);

    if (buildingBlock.moduleFilePaths.size <= ruleConfig.max) {
      return [];
    }

    const violation: Violation<ViolationData> = {
      ruleName: RULE_NAME,
      severity: "error",
      data: {
        maxNumberOfModules: ruleConfig.max,
        actualNumberOfModule: buildingBlock.moduleFilePaths.size,
        buildingBlockName: buildingBlock.name,
      },
    };

    return [violation];
  },

  printViolation: (printer, violation, resolveResult) => {
    const { buildingBlockName, maxNumberOfModules, actualNumberOfModule } =
      violation.data;

    const title = printer.format`Building block {bold ${buildingBlockName}} must not contain more than {bold ${maxNumberOfModules}} modules`;

    printViolationTemplate(printer, violation, title, () => {
      printer.text`Building block {bold ${buildingBlockName}} contains {bold ${actualNumberOfModule}} modules exceeding the allowed maximum of {bold ${maxNumberOfModules}} modules`;
    });
  },
};
