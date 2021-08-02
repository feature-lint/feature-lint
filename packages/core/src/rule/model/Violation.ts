import { RuleScope } from "./RuleScope.js";

export interface Violation<DATA = any> {
  ruleName: string;

  ruleScope: RuleScope;

  severity: "error" | "warning";

  data: DATA;
}
