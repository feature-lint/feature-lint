import {
  getRuleDefinitionByNameAndType,
  RuleConfig,
} from "../registry/ruleRegistry.js";
import { ResolvedBuildingBlock } from "../resolve/model/ResolvedBuildingBlock.js";
import { ResolvedFeature } from "../resolve/model/ResolvedFeature.js";
import { ResolvedBuildingBlockModule } from "../resolve/model/ResolvedModule.js";
import { ResolveResult } from "../resolve/model/ResolveResult.js";
import { getResolvedBuildingBlock } from "../resolve/operations/getResolvedBuildingBlock.js";
import { getResolvedFeature } from "../resolve/operations/getResolvedFeature.js";
import { getResolvedModule } from "../resolve/operations/getResolvedModule.js";
import { RuleConfigByScope } from "../rule/model/RuleDefinition.js";

export function check(resolveResult: ResolveResult): void {
  // TODO: This should not be hardcoded here
  const checkFeature = (feature: ResolvedFeature) => {
    getRuleDefinitionByNameAndType("no-missing-feature-types", "feature")
      ?.evaluate({}, resolveResult, feature)
      ?.forEach((violation) => {
        feature.violations.add(violation);
      });

    getRuleDefinitionByNameAndType("no-unknown-feature-types", "feature")
      ?.evaluate({}, resolveResult, feature)
      ?.forEach((violation) => {
        feature.violations.add(violation);
      });

    getRuleDefinitionByNameAndType("wrong-feature-type-match", "feature")
      ?.evaluate({}, resolveResult, feature)
      ?.forEach((violation) => {
        feature.violations.add(violation);
      });

    for (const buildingBlockName of feature.buildingBlockNames) {
      const buildingBlock = getResolvedBuildingBlock(
        resolveResult,
        feature.name,
        buildingBlockName
      );

      checkBuildingBlock(feature, buildingBlock);
    }

    for (const childFeatureName of feature.childFeatureNames) {
      const childFeature =
        resolveResult.resolvedFeatureByName.get(childFeatureName)!;

      checkFeature(childFeature);
    }
  };

  const checkBuildingBlock = (
    feature: ResolvedFeature,
    buildingBlock: ResolvedBuildingBlock
  ) => {
    // TODO: This should not be hardcoded here
    getRuleDefinitionByNameAndType(
      "no-unknown-building-blocks",
      "buildingBlock"
    )
      ?.evaluate({}, resolveResult, buildingBlock)
      ?.forEach((violation) => {
        feature.violations.add(violation);
      });

    for (const moduleFilePath of buildingBlock.moduleFilePaths) {
      const module = getResolvedModule(resolveResult, moduleFilePath);

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
    type RuleConfigByRuleNameAndRuleScope = Partial<
      Record<RuleConfig["name"], RuleConfigByScope<RuleConfig>>
    >;

    const ruleConfigByRuleNameAndRuleScope: RuleConfigByRuleNameAndRuleScope =
      {};

    const featureTypeRules = feature.featureTypeConfig.rules;

    for (const featureTypeRule of featureTypeRules) {
      ruleConfigByRuleNameAndRuleScope[featureTypeRule.name] = {
        featureType: featureTypeRule,
        ...ruleConfigByRuleNameAndRuleScope[featureTypeRule.name],
      };
    }

    const featureRules = feature.featureConfig.rules;

    for (const featureRule of featureRules) {
      ruleConfigByRuleNameAndRuleScope[featureRule.name] = {
        feature: featureRule,
        ...ruleConfigByRuleNameAndRuleScope[featureRule.name],
      };
    }

    const buildingBlockRules = buildingBlock.buildingBlockConfig.rules;

    for (const buildingBlockRule of buildingBlockRules) {
      ruleConfigByRuleNameAndRuleScope[buildingBlockRule.name] = {
        buildingBlock: buildingBlockRule,
        ...ruleConfigByRuleNameAndRuleScope[buildingBlockRule.name],
      };
    }

    for (const [ruleName, ruleConfigByScope] of Object.entries(
      ruleConfigByRuleNameAndRuleScope
    )) {
      getRuleDefinitionByNameAndType(ruleName, "buildingBlockModule")
        ?.evaluate(ruleConfigByScope, resolveResult, module)
        ?.forEach((violation) => {
          feature.violations.add(violation);
        });
    }

    // TODO: This should not be hardcoded here
    getRuleDefinitionByNameAndType(
      "restricted-visibility",
      "buildingBlockModule"
    )
      ?.evaluate({}, resolveResult, module)
      ?.forEach((violation) => {
        feature.violations.add(violation);
      });
  };

  // TODO: Sort
  for (const featureName of resolveResult.resolvedRoot.featureNames) {
    const feature = getResolvedFeature(resolveResult, featureName);

    checkFeature(feature);
  }
}
