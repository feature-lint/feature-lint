import { ResolvedBuildingBlock } from "../../resolve/model/ResolvedBuildingBlock.js";
import { ResolvedFeature } from "../../resolve/model/ResolvedFeature.js";
import { ResolvedBuildingBlockModule } from "../../resolve/model/ResolvedModule.js";
import { ResolveResult } from "../../resolve/model/ResolveResult.js";
import { RuleScope } from "./RuleScope.js";
import { Violation } from "./Violation.js";
import { ViolationPrinter } from "./ViolationPrinter.js";
import { z, ZodType } from "zod";

export type RuleDefinitionType =
  | "root"
  | "feature"
  | "buildingBlock"
  | "buildingBlockModule";

export type RuleDefinition<
  RULE_CONFIG_SCHEMA extends ZodType<any>,
  VIOLATION_DATA
> =
  | RootRuleDefinition<RULE_CONFIG_SCHEMA, VIOLATION_DATA>
  | FeatureRuleDefinition<RULE_CONFIG_SCHEMA, VIOLATION_DATA>
  | BuildingBlockRuleDefinition<RULE_CONFIG_SCHEMA, VIOLATION_DATA>
  | BuildingBlockModuleRuleDefinition<RULE_CONFIG_SCHEMA, VIOLATION_DATA>;

export interface BaseRuleDefinition<
  RULE_CONFIG_SCHEMA extends ZodType<any>,
  VIOLATION_DATA
> {
  type: RuleDefinitionType;

  name: string;

  printViolation: ViolationPrinter<VIOLATION_DATA>;

  configSchemaByScope: RuleConfigSchemaByScope<RULE_CONFIG_SCHEMA>;

  defaultConfig?: z.infer<RULE_CONFIG_SCHEMA> | undefined;
}

export type RuleConfigByScope<
  RULE_CONFIG,
  RULE_SCOPE extends RuleScope = RuleScope
> = Partial<Record<RULE_SCOPE, RULE_CONFIG>>;

export type RuleConfigSchemaByScope<
  RULE_CONFIG_SCHEMA extends ZodType<any>,
  RULE_SCOPE extends RuleScope = RuleScope
> = Partial<Record<RULE_SCOPE, RULE_CONFIG_SCHEMA>>;

export interface RootRuleDefinition<
  RULE_CONFIG_SCHEMA extends ZodType<any>,
  VIOLATION_DATA
> extends BaseRuleDefinition<RULE_CONFIG_SCHEMA, VIOLATION_DATA> {
  type: "root";

  evaluate: (
    ruleConfigByScope: RuleConfigByScope<z.infer<RULE_CONFIG_SCHEMA>, "root">,
    resolveResult: ResolveResult
  ) => Violation<VIOLATION_DATA>[];
}

export interface FeatureRuleDefinition<
  RULE_CONFIG_SCHEMA extends ZodType<any>,
  VIOLATION_DATA
> extends BaseRuleDefinition<RULE_CONFIG_SCHEMA, VIOLATION_DATA> {
  type: "feature";

  evaluate: (
    ruleConfigByScope: RuleConfigByScope<
      z.infer<RULE_CONFIG_SCHEMA>,
      "root" | "featureType" | "feature"
    >,
    resolveResult: ResolveResult,
    feature: ResolvedFeature
  ) => Violation<VIOLATION_DATA>[];
}

export interface BuildingBlockRuleDefinition<
  RULE_CONFIG_SCHEMA extends ZodType<any>,
  VIOLATION_DATA
> extends BaseRuleDefinition<RULE_CONFIG_SCHEMA, VIOLATION_DATA> {
  type: "buildingBlock";

  evaluate: (
    ruleConfigByScope: RuleConfigByScope<z.infer<RULE_CONFIG_SCHEMA>>,
    resolveResult: ResolveResult,
    buildingBlock: ResolvedBuildingBlock
  ) => Violation<VIOLATION_DATA>[];
}

export interface BuildingBlockModuleRuleDefinition<
  RULE_CONFIG_SCHEMA extends ZodType<any>,
  VIOLATION_DATA
> extends BaseRuleDefinition<RULE_CONFIG_SCHEMA, VIOLATION_DATA> {
  type: "buildingBlockModule";

  evaluate: (
    ruleConfigByScope: RuleConfigByScope<z.infer<RULE_CONFIG_SCHEMA>>,
    resolveResult: ResolveResult,
    module: ResolvedBuildingBlockModule
  ) => Violation<VIOLATION_DATA>[];
}
