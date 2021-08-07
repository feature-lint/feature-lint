import { FinalDependencyCriterion } from "../model/FinalDependencyCriterion.js";

export const DEFAULT_VIOLATION_SCOPE = "feature";

export type ViolationScope = "buildingBlock" | "feature" | "featureType";

export const getViolationScopeFromCriterion = (
  criterion: FinalDependencyCriterion
): ViolationScope => {
  if (criterion.buildingBlockNames !== "*") {
    return "buildingBlock";
  }

  if (criterion.featureTypeNames !== "*") {
    return "featureType";
  }

  return DEFAULT_VIOLATION_SCOPE;
};
