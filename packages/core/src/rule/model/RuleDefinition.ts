import { ResolvedBuildingBlock } from "../../resolve/model/ResolvedBuildingBlock.js";
import { ResolvedFeature } from "../../resolve/model/ResolvedFeature.js";
import { ResolvedBuildingBlockModule } from "../../resolve/model/ResolvedModule.js";
import { ResolveResult } from "../../resolve/model/ResolveResult.js";
import { RuleScope } from "./RuleScope.js";
import { Violation } from "./Violation.js";
import { ViolationPrinter } from "./ViolationPrinter.js";

export type RuleDefinitionType =
  | "feature"
  | "buildingBlock"
  | "buildingBlockModule"
  | "buildingBlockModule2";

export type RuleDefinition<RULE_CONFIG, VIOLATION_DATA> =
  | FeatureRuleDefinition<RULE_CONFIG, VIOLATION_DATA>
  | BuildingBlockRuleDefinition<RULE_CONFIG, VIOLATION_DATA>
  | BuildingBlockModuleRuleDefinition<RULE_CONFIG, VIOLATION_DATA>;

export interface BaseRuleDefinition<VIOLATION_DATA> {
  type: RuleDefinitionType;

  name: string;

  printViolation: ViolationPrinter<VIOLATION_DATA>;
}

export type RuleConfigByScope<RULE_CONFIG> = Partial<
  Record<RuleScope, RULE_CONFIG>
>;

export interface BuildingBlockModuleRuleDefinition<RULE_CONFIG, VIOLATION_DATA>
  extends BaseRuleDefinition<VIOLATION_DATA> {
  type: "buildingBlockModule";

  evaluate: (
    ruleConfigByScope: RuleConfigByScope<RULE_CONFIG>,
    resolveResult: ResolveResult,
    module: ResolvedBuildingBlockModule
  ) => Violation<VIOLATION_DATA>[];
}

export interface FeatureRuleDefinition<RULE_CONFIG, VIOLATION_DATA>
  extends BaseRuleDefinition<VIOLATION_DATA> {
  type: "feature";

  evaluate: (
    ruleConfig: RULE_CONFIG,
    resolveResult: ResolveResult,
    feature: ResolvedFeature
  ) => Violation<VIOLATION_DATA>[];
}

export interface BuildingBlockRuleDefinition<RULE_CONFIG, VIOLATION_DATA>
  extends BaseRuleDefinition<VIOLATION_DATA> {
  type: "buildingBlock";

  evaluate: (
    ruleConfig: RULE_CONFIG,
    resolveResult: ResolveResult,
    buildingBlock: ResolvedBuildingBlock
  ) => Violation<VIOLATION_DATA>[];
}
