import "zod";
import {
  AllowedDependenciesRuleConfig,
  allowedDependencyRuleDefinition,
} from "../rule-definitions/allowedDependencies.js";
import { noMissingFeatureTypesRuleDefinition } from "../rule-definitions/noMissingFeatureTypes.js";
import { noUnknownBuildingBlocksRuleDefinition } from "../rule-definitions/noUnknownBuildingBlocks.js";
import { noUnknownFeatureTypesRuleDefinition } from "../rule-definitions/noUnknownFeatureTypes.js";
import { restrictedVisibilityRuleDefinition } from "../rule-definitions/restrictedVisibility.js";
import {
  RuleDefinition,
  RuleDefinitionType,
} from "../rule/model/RuleDefinition.js";

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
  restrictedVisibilityRuleDefinition,
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
