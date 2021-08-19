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
import { noAncestorFeatureDependencyRuleDefinition } from "../rule-definitions/noAncestorFeatureDependency.js";
import {
  RestrictedExternalModulesRuleConfig,
  restrictedExternalModulesRuleDefinition,
} from "../rule-definitions/restrictedExternalModules.js";

export const ROOT_CONFIG_RULE_SCHEMA = z.union([
  RestrictedExternalModulesRuleConfig,
  RestrictedExternalModulesRuleConfig,
]);

export const FEATURE_TYPE_CONFIG_RULE_SCHEMA = z.union([
  DependenciesRuleConfig,
  DependentsRuleConfig,
  RestrictedExternalModulesRuleConfig,
]);

export const FEATURE_CONFIG_RULE_SCHEMA = z.union([
  DependenciesRuleConfig,
  DependentsRuleConfig,
  RestrictedExternalModulesRuleConfig,
]);

export const BUILDING_BLOCK_CONFIG_RULE_SCHEMA = z.union([
  DependenciesRuleConfig,
  DependentsRuleConfig,
  RestrictedExternalModulesRuleConfig,
]);

export const RULE_DEFINITIONS: RuleDefinition<any, any>[] = [
  dependenciesRuleDefinition,
  dependentsRuleDefinition,
  restrictedExternalModulesRuleDefinition,
];

export type RuleConfig =
  | DependenciesRuleConfig
  | DependentsRuleConfig
  | RestrictedExternalModulesRuleConfig;

export const IMPLICIT_RULE_DEFINITIONS: RuleDefinition<any, any>[] = [
  noAncestorFeatureDependencyRuleDefinition,
  noCyclicFeatureDependencyRuleDefinition,
  noMissingFeatureTypesRuleDefinition,
  noUnknownBuildingBlocksRuleDefinition,
  noUnknownFeatureTypesRuleDefinition,
  restrictedVisibilityRuleDefinition,
  wrongFeatureTypeMatchRuleDefinition,
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
