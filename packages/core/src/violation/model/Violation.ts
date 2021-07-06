import { RuleScope } from "../../rule-registry/RuleScope.js";

export interface Violation<DATA = any> {
  name: string;

  scope: RuleScope;

  severity: "error" | "warning";

  data: DATA;
}
