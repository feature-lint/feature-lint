import "zod";
import {
  AllowedDependenciesRuleConfig,
  allowedDependencyRuleDefinition,
} from "../rules/allowedDependencies.js";
import { noMissingFeatureTypesRuleDefinition } from "../rules/noMissingFeatureTypes.js";
import { noUnknownBuildingBlocksRuleDefinition } from "../rules/noUnknownBuildingBlocks.js";
import { noUnknownFeatureTypesRuleDefinition } from "../rules/noUnknownFeatureTypes.js";
import { RuleDefinition, RuleDefinitionType } from "./ruleDefinition.js";

export const FEATURE_TYPE_CONFIG_RULE_SCHEMA = AllowedDependenciesRuleConfig;

export const FEATURE_CONFIG_RULE_SCHEMA = AllowedDependenciesRuleConfig;

export const BUILDING_BLOCK_CONFIG_RULE_SCHEMA = AllowedDependenciesRuleConfig;

export const RULE_DEFINITIONS: RuleDefinition<any, any>[] = [
  allowedDependencyRuleDefinition,
];

export const IMPLICIT_RULE_DEFINITIONS: RuleDefinition<any, any>[] = [
  noUnknownFeatureTypesRuleDefinition,
  noMissingFeatureTypesRuleDefinition,
  noUnknownBuildingBlocksRuleDefinition,
];

export const getRuleDefinitionByNameAndType = <
  RULE_DEFINTION_TYPE extends RuleDefinitionType
>(
  ruleName: string,
  ruleDefinitionType: RULE_DEFINTION_TYPE
):
  | Extract<RuleDefinition<any, any>, { type: RULE_DEFINTION_TYPE }>
  | undefined => {
  for (const ruleDef of [...RULE_DEFINITIONS, ...IMPLICIT_RULE_DEFINITIONS]) {
    if (ruleDef.name === ruleName && ruleDef.type === ruleDefinitionType) {
      return ruleDef as any;
    }
  }
};
