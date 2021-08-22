import { ResolvedBuildingBlockModule } from "../../resolve/model/ResolvedModule.js";
import { ResolveResult } from "../../resolve/model/ResolveResult.js";
import { getResolvedFeature } from "../../resolve/operations/getResolvedFeature.js";
import { RuleConfigByScope } from "../../rule/model/RuleDefinition.js";
import { RuleScope } from "../../rule/model/RuleScope.js";
import { Violation } from "../../rule/model/Violation.js";
import { FinalDependencyCriterion } from "../model/FinalDependencyCriterion.js";
import {
  DEFAULT_VIOLATION_SCOPE,
  getViolationScopeFromCriterion,
  ViolationScope,
} from "./getViolationScopeFromCriterion.js";
import { checkRuleScopeCriteria } from "./checkRuleScopeCriteria.js";
import { DependenciesViolationData } from "../model/DependenciesViolationData.js";

export function checkCriteria(
  ruleConfigByScope: RuleConfigByScope<{
    criteria: FinalDependencyCriterion[];
  }>,
  resolveResult: ResolveResult,
  dependentModule: ResolvedBuildingBlockModule,
  dependencyModule: ResolvedBuildingBlockModule
): Violation<DependenciesViolationData> | undefined {
  const ruleScopeOrder: RuleScope[] = [
    "buildingBlock",
    "featureType",
    "feature",
  ];

  if (
    !ruleScopeOrder.some((ruleScope) => {
      return ruleConfigByScope[ruleScope] !== undefined;
    })
  ) {
    return;
  }

  const dependentFeatureTypeName = getResolvedFeature(
    resolveResult,
    dependentModule.featureName
  ).featureTypeName;

  const dependencyFeature = getResolvedFeature(
    resolveResult,
    dependencyModule.featureName
  );

  const dependencyFeatureTypeName = dependencyFeature.featureTypeName;

  let allAllowed = false;

  for (const ruleScope of ruleScopeOrder) {
    const criteria = ruleConfigByScope[ruleScope]?.criteria;

    if (criteria === undefined) {
      continue;
    }

    const [allowed, denyCriterion] = checkRuleScopeCriteria(
      criteria,
      dependentModule,
      dependentFeatureTypeName,
      dependencyModule,
      dependencyFeatureTypeName
    );

    if (denyCriterion !== undefined) {
      return {
        ruleName: "dependencies",
        severity: "error",
        data: {
          violatingModule: dependentModule,

          violatingScope:
            ruleScope === "root" ? DEFAULT_VIOLATION_SCOPE : ruleScope,

          violatedScope:
            denyCriterion !== undefined
              ? getViolationScopeFromCriterion(denyCriterion)
              : DEFAULT_VIOLATION_SCOPE,

          violatedModule: dependencyModule,

          denyCriterion: denyCriterion,
        },
      };
    }

    if (allowed) {
      allAllowed = true;
    }
  }

  if (allAllowed) {
    return;
  }

  return {
    ruleName: "dependencies",
    severity: "error",
    data: {
      violatingModule: dependentModule,

      violatingScope: ruleScopeOrder.find(
        (ruleScope) => ruleConfigByScope[ruleScope] !== undefined
      ) as ViolationScope,

      violatedScope: DEFAULT_VIOLATION_SCOPE,

      violatedModule: dependencyModule,

      denyCriterion: undefined,
    },
  };
}
