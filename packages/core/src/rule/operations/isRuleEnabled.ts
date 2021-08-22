import { RuleConfigByScope } from "../model/RuleDefinition.js";
import { RULE_SCOPE_DEFAULT_PRECEDENCE } from "../model/RuleScope.js";

export const isRuleEnabled = (
  ruleConfigByScope: RuleConfigByScope<{ enabled: boolean }>,
  ruleScopePrecedence = RULE_SCOPE_DEFAULT_PRECEDENCE
): boolean => {
  let enabled = false;

  for (const ruleScope of ruleScopePrecedence) {
    const ruleScopeConfig = ruleConfigByScope[ruleScope];

    if (ruleScopeConfig === undefined) {
      continue;
    }

    enabled = ruleScopeConfig.enabled;
  }

  return enabled;
};
