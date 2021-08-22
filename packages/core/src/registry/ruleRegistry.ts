import "zod";
import { ZodType } from "zod";
import { dependenciesRuleDefinition } from "../rule-definitions/dependencies.js";
import { dependentsRuleDefinition } from "../rule-definitions/dependents.js";
import { noAncestorFeatureDependencyRuleDefinition } from "../rule-definitions/noAncestorFeatureDependency.js";
import { noCyclicFeatureDependencyRuleDefinition } from "../rule-definitions/noCyclicFeatureDependency.js";
import { noMissingFeatureTypesRuleDefinition } from "../rule-definitions/noMissingFeatureTypes.js";
import { noUnknownBuildingBlocksRuleDefinition } from "../rule-definitions/noUnknownBuildingBlocks.js";
import { noUnknownFeatureTypesRuleDefinition } from "../rule-definitions/noUnknownFeatureTypes.js";
import { restrictedExternalModulesRuleDefinition } from "../rule-definitions/restrictedExternalModules.js";
import { restrictedVisibilityRuleDefinition } from "../rule-definitions/restrictedVisibility.js";
import { wrongFeatureTypeMatchRuleDefinition } from "../rule-definitions/wrongFeatureTypeMatch.js";
import {
  RuleDefinition,
  RuleDefinitionType,
} from "../rule/model/RuleDefinition.js";
import { isDefined } from "../shared/util/isDefined.js";

export const RULE_DEFINITIONS = [
  dependenciesRuleDefinition,
  dependentsRuleDefinition,
  restrictedExternalModulesRuleDefinition,
  noAncestorFeatureDependencyRuleDefinition,
  noCyclicFeatureDependencyRuleDefinition,
  noMissingFeatureTypesRuleDefinition,
  noUnknownBuildingBlocksRuleDefinition,
  noUnknownFeatureTypesRuleDefinition,
  restrictedVisibilityRuleDefinition,
  wrongFeatureTypeMatchRuleDefinition,
] as const;

const ROOT_RULE_CONFIG_SCHEMAS: ZodType<any>[] = RULE_DEFINITIONS.map(
  (ruleDefinition) => {
    return ruleDefinition.configSchemaByScope.root;
  }
).filter(isDefined);

export const ROOT_RULE_CONFIG_SCHEMA = ROOT_RULE_CONFIG_SCHEMAS.reduce(
  (previousSchema, currentSchema) => {
    return previousSchema.or(currentSchema);
  }
);

const FEATURE_TYPE_RULE_CONFIG_SCHEMAS: ZodType<any>[] = RULE_DEFINITIONS.map(
  (ruleDefinition) => {
    return ruleDefinition.configSchemaByScope.featureType;
  }
).filter(isDefined);

export const FEATURE_TYPE_RULE_CONFIG_SCHEMA =
  FEATURE_TYPE_RULE_CONFIG_SCHEMAS.reduce((previousSchema, currentSchema) => {
    return previousSchema.or(currentSchema);
  });

const FEATURE_RULE_CONFIG_SCHEMAS: ZodType<any>[] = RULE_DEFINITIONS.map(
  (ruleDefinition) => {
    return ruleDefinition.configSchemaByScope.feature;
  }
).filter(isDefined);

export const FEATURE_RULE_CONFIG_SCHEMA = FEATURE_RULE_CONFIG_SCHEMAS.reduce(
  (previousSchema, currentSchema) => {
    return previousSchema.or(currentSchema);
  }
);

const BUILDING_BLOCK_RULE_CONFIG_SCHEMAS: ZodType<any>[] = RULE_DEFINITIONS.map(
  (ruleDefinition) => {
    return ruleDefinition.configSchemaByScope.buildingBlock;
  }
).filter(isDefined);

export const BUILDING_BLOCK_RULE_CONFIG_SCHEMA =
  BUILDING_BLOCK_RULE_CONFIG_SCHEMAS.reduce((previousSchema, currentSchema) => {
    return previousSchema.or(currentSchema);
  });

export const getRuleDefinitionByNameAndType = <
  RULE_DEFINTION_TYPE extends RuleDefinitionType
>(
  ruleName: string,
  ruleDefinitionType: RULE_DEFINTION_TYPE
):
  | Extract<RuleDefinition<any, any>, { type: RULE_DEFINTION_TYPE }>
  | undefined => {
  for (const ruleDef of RULE_DEFINITIONS) {
    if (ruleDef.name === ruleName && ruleDef.type === ruleDefinitionType) {
      return ruleDef as any;
    }
  }
};
