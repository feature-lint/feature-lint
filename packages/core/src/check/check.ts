import { getRuleDefinitionByNameAndType } from "../registry/ruleRegistry.js";
import { ResolvedBuildingBlock } from "../resolve/model/ResolvedBuildingBlock.js";
import { ResolvedFeature } from "../resolve/model/ResolvedFeature.js";
import { ResolvedBuildingBlockModule } from "../resolve/model/ResolvedModule.js";
import { ResolveResult } from "../resolve/model/ResolveResult.js";
import { getResolvedBuildingBlock } from "../resolve/operations/getResolvedBuildingBlock.js";
import { getResolvedFeature } from "../resolve/operations/getResolvedFeature.js";
import { getResolvedModule } from "../resolve/operations/getResolvedModule.js";
import { RuleConfigByScope } from "../rule/model/RuleDefinition.js";
import { RuleScope, RULE_SCOPES } from "../rule/model/RuleScope.js";

export function check(resolveResult: ResolveResult): void {
  // TODO: This should not be hardcoded here
  const checkFeature = (feature: ResolvedFeature) => {
    for (const [ruleName, ruleConfigByScope] of Object.entries(
      getFeatureRuleConfigByRuleNameAndRuleScope(resolveResult, feature.name)
    )) {
      getRuleDefinitionByNameAndType(ruleName, "feature")
        ?.evaluate(ruleConfigByScope, resolveResult, feature)
        ?.forEach((violation) => {
          feature.violations.add(violation);
        });
    }

    // getRuleDefinitionByNameAndType("no-missing-feature-types", "feature")
    //   ?.evaluate({}, resolveResult, feature)
    //   ?.forEach((violation) => {
    //     feature.violations.add(violation);
    //   });

    // getRuleDefinitionByNameAndType("no-unknown-feature-types", "feature")
    //   ?.evaluate({}, resolveResult, feature)
    //   ?.forEach((violation) => {
    //     feature.violations.add(violation);
    //   });

    // getRuleDefinitionByNameAndType("wrong-feature-type-match", "feature")
    //   ?.evaluate({}, resolveResult, feature)
    //   ?.forEach((violation) => {
    //     feature.violations.add(violation);
    //   });

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
    // getRuleDefinitionByNameAndType(
    //   "no-unknown-building-blocks",
    //   "buildingBlock"
    // )
    //   ?.evaluate({}, resolveResult, buildingBlock)
    //   ?.forEach((violation) => {
    //     feature.violations.add(violation);
    //   });

    for (const [ruleName, ruleConfigByScope] of Object.entries(
      getBuildingBlockRuleConfigByRuleNameAndRuleScope(
        resolveResult,
        feature.name,
        buildingBlock.name
      )
    )) {
      getRuleDefinitionByNameAndType(ruleName, "buildingBlock")
        ?.evaluate(ruleConfigByScope, resolveResult, buildingBlock)
        ?.forEach((violation) => {
          feature.violations.add(violation);
        });
    }

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
    for (const [ruleName, ruleConfigByScope] of Object.entries(
      getBuildingBlockRuleConfigByRuleNameAndRuleScope(
        resolveResult,
        feature.name,
        buildingBlock.name
      )
    )) {
      getRuleDefinitionByNameAndType(ruleName, "buildingBlockModule")
        ?.evaluate(ruleConfigByScope, resolveResult, module)
        ?.forEach((violation) => {
          feature.violations.add(violation);
        });
    }

    // TODO: This should not be hardcoded here
    // getRuleDefinitionByNameAndType(
    //   "restricted-visibility",
    //   "buildingBlockModule"
    // )
    //   ?.evaluate({}, resolveResult, module)
    //   ?.forEach((violation) => {
    //     feature.violations.add(violation);
    //   });

    // getRuleDefinitionByNameAndType(
    //   "no-ancestor-feature-dependency",
    //   "buildingBlockModule"
    // )
    //   ?.evaluate({}, resolveResult, module)
    //   ?.forEach((violation) => {
    //     feature.violations.add(violation);
    //   });
  };

  for (const [ruleName, ruleConfigByScope] of Object.entries(
    getRootRuleConfigByRuleNameAndRuleScope(resolveResult)
  )) {
    getRuleDefinitionByNameAndType(ruleName, "root")
      ?.evaluate(ruleConfigByScope, resolveResult)
      .forEach((violation) => {
        resolveResult.resolvedRoot.violations.add(violation);
      });
  }

  // getRuleDefinitionByNameAndType("no-cyclic-feature-dependency", "root")
  //   ?.evaluate({}, resolveResult)
  //   ?.forEach((violation) => {
  //     resolveResult.resolvedRoot.violations.add(violation);
  //   });

  // TODO: Sort
  for (const featureName of resolveResult.resolvedRoot.featureNames) {
    const feature = getResolvedFeature(resolveResult, featureName);

    checkFeature(feature);
  }
}

interface UnknownRuleConfig {
  name: string;
}

type RuleConfigByRuleNameAndRuleScope = {
  [ruleName: string]: RuleConfigByScope<UnknownRuleConfig>;
};

type RuleConfigsByRuleScope = Partial<Record<RuleScope, UnknownRuleConfig[]>>;

const convertToRuleConfigByRuleNameAndRuleScope = (
  ruleConfigsByRuleScope: RuleConfigsByRuleScope
): RuleConfigByRuleNameAndRuleScope => {
  const ruleConfigByRuleNameAndRuleScope: RuleConfigByRuleNameAndRuleScope = {};

  for (const ruleScope of RULE_SCOPES) {
    const ruleConfigs = ruleConfigsByRuleScope[ruleScope];

    if (ruleConfigs === undefined) {
      continue;
    }

    for (const ruleConfig of ruleConfigs) {
      ruleConfigByRuleNameAndRuleScope[ruleConfig.name] = {
        ...ruleConfigByRuleNameAndRuleScope[ruleConfig.name],

        [ruleScope]: ruleConfig,
      };
    }
  }

  return ruleConfigByRuleNameAndRuleScope;
};

const getRootRuleConfigByRuleNameAndRuleScope = (
  resolveResult: ResolveResult
): RuleConfigByRuleNameAndRuleScope => {
  return convertToRuleConfigByRuleNameAndRuleScope({
    root: getRootRuleConfigs(resolveResult),
  });
};

const getFeatureRuleConfigByRuleNameAndRuleScope = (
  resolveResult: ResolveResult,
  featureName: string
): RuleConfigByRuleNameAndRuleScope => {
  return convertToRuleConfigByRuleNameAndRuleScope({
    root: getRootRuleConfigs(resolveResult),
    featureType: getFeatureTypeRuleConfigs(resolveResult, featureName),
    feature: getFeatureRuleConfigs(resolveResult, featureName),
  });
};

const getBuildingBlockRuleConfigByRuleNameAndRuleScope = (
  resolveResult: ResolveResult,
  featureName: string,
  buildingBlockName: string
): RuleConfigByRuleNameAndRuleScope => {
  return convertToRuleConfigByRuleNameAndRuleScope({
    root: getRootRuleConfigs(resolveResult),
    featureType: getFeatureTypeRuleConfigs(resolveResult, featureName),
    feature: getFeatureRuleConfigs(resolveResult, featureName),
  });
};

const getRootRuleConfigs = (
  resolveResult: ResolveResult
): UnknownRuleConfig[] => {
  return resolveResult.resolvedRoot.config.rules;
};

const getFeatureTypeRuleConfigs = (
  resolveResult: ResolveResult,
  featureName: string
): UnknownRuleConfig[] => {
  const feature = getResolvedFeature(resolveResult, featureName);

  return feature.featureTypeConfig.rules;
};

const getFeatureRuleConfigs = (
  resolveResult: ResolveResult,
  featureName: string
): UnknownRuleConfig[] => {
  const feature = getResolvedFeature(resolveResult, featureName);

  return feature.featureConfig.rules;
};

const getBuildingBlockRuleConfigs = (
  resolveResult: ResolveResult,
  featureName: string,
  buildingBlockName: string
): UnknownRuleConfig[] => {
  const buildingBlock = getResolvedBuildingBlock(
    resolveResult,
    featureName,
    buildingBlockName
  );

  return buildingBlock.buildingBlockConfig.rules;
};
