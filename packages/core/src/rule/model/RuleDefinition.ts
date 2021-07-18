import { ViolationPrinter } from "./ViolationPrinter.js";
import { ResolvedBuildingBlock } from "../../resolve/model/ResolvedBuildingBlock.js";
import { ResolvedFeature } from "../../resolve/model/ResolvedFeature.js";
import { ResolvedBuildingBlockModule } from "../../resolve/model/ResolvedModule.js";
import { ResolveState } from "../../resolve/model/ResolveState.js";
import { Violation } from "./Violation.js";
import { RuleScope } from "./RuleScope.js";

export type RuleDefinitionType =
  | "feature"
  | "buildingBlock"
  | "buildingBlockModule";

export type RuleDefinition<RULE_CONFIG, VIOLATION_DATA> =
  | FeatureRuleDefinition<RULE_CONFIG, VIOLATION_DATA>
  | BuildingBlockRuleDefinition<RULE_CONFIG, VIOLATION_DATA>
  | BuildingBlockModuleRuleDefinition<RULE_CONFIG, VIOLATION_DATA>;

export interface BaseRuleDefinition<VIOLATION_DATA> {
  type: RuleDefinitionType;

  name: string;

  printViolation: ViolationPrinter<VIOLATION_DATA>;
}

export interface BuildingBlockModuleRuleDefinition<RULE_CONFIG, VIOLATION_DATA>
  extends BaseRuleDefinition<VIOLATION_DATA> {
  type: "buildingBlockModule";

  evaluate: (
    ruleScope: RuleScope,
    ruleConfig: RULE_CONFIG,
    resolveState: ResolveState,
    module: ResolvedBuildingBlockModule
  ) => Violation<VIOLATION_DATA>[];
}

export interface FeatureRuleDefinition<RULE_CONFIG, VIOLATION_DATA>
  extends BaseRuleDefinition<VIOLATION_DATA> {
  type: "feature";

  evaluate: (
    ruleConfig: RULE_CONFIG,
    resolveState: ResolveState,
    feature: ResolvedFeature
  ) => Violation<VIOLATION_DATA>[];
}

export interface BuildingBlockRuleDefinition<RULE_CONFIG, VIOLATION_DATA>
  extends BaseRuleDefinition<VIOLATION_DATA> {
  type: "buildingBlock";

  evaluate: (
    ruleConfig: RULE_CONFIG,
    resolveState: ResolveState,
    buildingBlock: ResolvedBuildingBlock
  ) => Violation<VIOLATION_DATA>[];
}
