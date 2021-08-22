import { RuleScope } from "./RuleScope.js";

export interface Violation<DATA = any> {
  ruleName: string;

  severity: "error" | "warning";

  data: DATA;
}
