// TODO: Rename to be more general
export type RuleScope = "root" | "featureType" | "feature" | "buildingBlock";

export const RULE_SCOPES: RuleScope[] = [
  "root",
  "featureType",
  "feature",
  "buildingBlock",
];

export const RULE_SCOPE_DEFAULT_PRECEDENCE: RuleScope[] = [
  "root",
  "featureType",
  "feature",
  "buildingBlock",
];
