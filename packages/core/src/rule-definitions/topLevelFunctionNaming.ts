import * as z from "zod";
import { ResolvedBuildingBlockModule } from "../resolve/model/ResolvedModule.js";
import { ResolveResult } from "../resolve/model/ResolveResult.js";
import {
  BuildingBlockModuleRuleDefinition,
  RuleConfigByScope
} from "../rule/model/RuleDefinition.js";
import { Violation } from "../rule/model/Violation.js";
import { printViolationTemplate } from "../rule/print/printViolationTemplate.js";
import * as path from "path";

const RULE_NAME = "exported-top-level-function-name";

const ExportedTopLevelFunctionNameSchema = z.object({
  name: z.literal(RULE_NAME),
  regex: z.string()
});

export interface NameMatcherViolation {
  moduleName: string;
  regEx: string;
}

type NameMatcherRuleConfig = z.infer<typeof ExportedTopLevelFunctionNameSchema>;

export const topLevelFunctionNameMatcherRuleDefinition: BuildingBlockModuleRuleDefinition<
  typeof ExportedTopLevelFunctionNameSchema,
  NameMatcherViolation
> = {
  type: "buildingBlockModule",
  evaluate: function(
    ruleConfigByScope: RuleConfigByScope<NameMatcherRuleConfig>,
    resolveResult: ResolveResult,
    module: ResolvedBuildingBlockModule
  ): Violation<NameMatcherViolation>[] {
    ruleConfigByScope?.buildingBlock;
    const regEx = ruleConfigByScope.buildingBlock?.regex;
    const baseName = path.basename(module.filePath);

    return [];
  },
  name: RULE_NAME,
  printViolation: function(
    printer,
    violation: Violation<NameMatcherViolation>,
    resolveResult: ResolveResult
  ): void {
    const { data } = violation;

    const title = printer.format`Building block {bold ${data.moduleName}} must match {bold ${data.regEx}}`;

    printViolationTemplate(printer, violation, title, () => {});
  },
  configSchemaByScope: {
    buildingBlock: ExportedTopLevelFunctionNameSchema
  }
};
