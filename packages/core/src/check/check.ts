import { getRuleDefinitionByNameAndType } from "../registry/ruleRegistry.js";
import { ResolvedBuildingBlock } from "../resolve/model/ResolvedBuildingBlock.js";
import { ResolvedFeature } from "../resolve/model/ResolvedFeature.js";
import { ResolvedBuildingBlockModule } from "../resolve/model/ResolvedModule.js";
import { ResolveState } from "../resolve/model/ResolveState.js";
import { getResolvedBuildingBlock } from "../resolve/operations/getResolvedBuildingBlock.js";
import { getResolvedFeature } from "../resolve/operations/getResolvedFeature.js";
import { getResolvedModule } from "../resolve/operations/getResolvedModule.js";
import { RuleScope } from "../rule/model/RuleScope.js";
import { Violation } from "../rule/model/Violation.js";

export function check(resolveState: ResolveState): void {
  const checkFeature = (feature: ResolvedFeature) => {
    getRuleDefinitionByNameAndType("no-missing-feature-types", "feature")
      ?.evaluate({}, resolveState, feature)
      ?.forEach((violation) => {
        feature.violations.add(violation);
      });

    getRuleDefinitionByNameAndType("no-unknown-feature-types", "feature")
      ?.evaluate({}, resolveState, feature)
      ?.forEach((violation) => {
        feature.violations.add(violation);
      });

    for (const buildingBlockName of feature.buildingBlockNames) {
      const buildingBlock = getResolvedBuildingBlock(
        resolveState,
        feature.name,
        buildingBlockName
      );

      checkBuildingBlock(feature, buildingBlock);
    }

    for (const childFeatureName of feature.childFeatureNames) {
      const childFeature =
        resolveState.resolvedFeatureByName.get(childFeatureName)!;

      checkFeature(childFeature);
    }
  };

  const checkBuildingBlock = (
    feature: ResolvedFeature,
    buildingBlock: ResolvedBuildingBlock
  ) => {
    getRuleDefinitionByNameAndType(
      "no-unknown-building-blocks",
      "buildingBlock"
    )
      ?.evaluate({}, resolveState, buildingBlock)
      ?.forEach((violation) => {
        feature.violations.add(violation);
      });

    for (const moduleFilePath of buildingBlock.moduleFilePaths) {
      const module = getResolvedModule(resolveState, moduleFilePath);

      if (module.type !== "buildingBlockModule") {
        continue;
      }

      checkBuildingBlockModule(feature, buildingBlock, module);
    }
  };

  const checkBuildingBlockModule = (
    feature: ResolvedFeature,
    buildingBlock: ResolvedBuildingBlock,
    module: ResolvedBuildingBlockModule
  ) => {
    const featureTypeRules = feature.featureTypeConfig.rules;

    const featureRules = feature.featureConfig.rules;

    const buildingBlockRules = buildingBlock.buildingBlockConfig.rules;

    const evaluateBuildingBlockRule = (
      ruleScope: RuleScope,
      rule: any
    ): Violation[] => {
      const ruleDef = getRuleDefinitionByNameAndType(
        rule.name,
        "buildingBlockModule"
      );

      return ruleDef?.evaluate(ruleScope, rule, resolveState, module) ?? [];
    };

    const scopeAndRulesEntries: [RuleScope, any[]][] = [
      ["featureType", featureTypeRules],
      ["feature", featureRules],
      ["buildingBlock", buildingBlockRules],
    ];

    for (const [scope, rules] of scopeAndRulesEntries) {
      rules.forEach((rule) => {
        evaluateBuildingBlockRule(scope, rule).forEach((violation) => {
          feature.violations.add(violation);
        });
      });
    }
  };

  // TODO: Sort
  for (const featureName of resolveState.resolvedRoot.featureNames) {
    const feature = getResolvedFeature(resolveState, featureName);

    checkFeature(feature);
  }
}
