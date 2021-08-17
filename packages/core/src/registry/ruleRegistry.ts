import "zod";
import { noMissingFeatureTypesRuleDefinition } from "../rule-definitions/noMissingFeatureTypes.js";
import { noUnknownBuildingBlocksRuleDefinition } from "../rule-definitions/noUnknownBuildingBlocks.js";
import { noUnknownFeatureTypesRuleDefinition } from "../rule-definitions/noUnknownFeatureTypes.js";
import { restrictedVisibilityRuleDefinition } from "../rule-definitions/restrictedVisibility.js";
import {
  RuleDefinition,
  RuleDefinitionType,
} from "../rule/model/RuleDefinition.js";
import { z } from "zod";
import {
  DependenciesRuleConfig,
  dependenciesRuleDefinition,
} from "../rule-definitions/dependencies.js";
import {
  DependentsRuleConfig,
  dependentsRuleDefinition,
} from "../rule-definitions/dependents.js";
import { wrongFeatureTypeMatchRuleDefinition } from "../rule-definitions/wrongFeatureTypeMatch.js";
import { noCyclicFeatureDependencyRuleDefinition } from "../rule-definitions/noCyclicFeatureDependency.js";

export const FEATURE_TYPE_CONFIG_RULE_SCHEMA = z.union([
  DependenciesRuleConfig,
  DependentsRuleConfig,
]);

export const FEATURE_CONFIG_RULE_SCHEMA = z.union([
  DependenciesRuleConfig,
  DependentsRuleConfig,
]);

export const BUILDING_BLOCK_CONFIG_RULE_SCHEMA = z.union([
  DependenciesRuleConfig,
  DependentsRuleConfig,
]);

export const RULE_DEFINITIONS: RuleDefinition<any, any>[] = [
  dependenciesRuleDefinition,
  dependentsRuleDefinition,
];

export type RuleConfig = DependenciesRuleConfig | DependentsRuleConfig;

export const IMPLICIT_RULE_DEFINITIONS: RuleDefinition<any, any>[] = [
  noUnknownFeatureTypesRuleDefinition,
  noMissingFeatureTypesRuleDefinition,
  noUnknownBuildingBlocksRuleDefinition,
  restrictedVisibilityRuleDefinition,
  wrongFeatureTypeMatchRuleDefinition,
  noCyclicFeatureDependencyRuleDefinition,
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
