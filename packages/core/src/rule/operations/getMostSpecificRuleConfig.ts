import { RuleConfigByScope } from "../model/RuleDefinition.js";
import { RULE_SCOPE_DEFAULT_PRECEDENCE } from "../model/RuleScope.js";

export const getMostSpecificRuleConfig = <RULE_CONFIG>(
  ruleConfigByScope: RuleConfigByScope<RULE_CONFIG>,
  ruleScopePrecedence = RULE_SCOPE_DEFAULT_PRECEDENCE
): RULE_CONFIG => {
  for (const ruleScope of [...ruleScopePrecedence].reverse()) {
    const ruleConfig: RULE_CONFIG | undefined = ruleConfigByScope[ruleScope];

    if (ruleConfig === undefined) {
      continue;
    }

    return ruleConfig;
  }

  throw new Error("No rule config found. This is a bug.");
};
