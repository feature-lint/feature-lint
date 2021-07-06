import * as path from "path";
import ts from "typescript";
import { z } from "zod";
import { BuildingBlockName } from "../config/model/BuildingBlockName.js";
import { FeatureName } from "../config/model/FeatureName.js";
import { FeatureTypeName } from "../config/model/FeatureTypeName.js";
import { printViolationTemplate } from "../render/printViolationTemplate.js";
import { ResolvedBuildingBlockModule } from "../resolve/model/ResolvedModule.js";
import { ResolveState } from "../resolve/model/ResolveState.js";
import { BuildingBlockModuleRuleDefinition } from "../rule-registry/ruleDefinition.js";
import { RuleScope } from "../rule-registry/RuleScope.js";
import { Violation } from "../violation/model/Violation.js";

export type AllowedDependencyType = "featureType" | "feature" | "buildingBlock";

const allowedDependencyTypeOrder: AllowedDependencyType[] = [
  "buildingBlock",
  "feature",
  "featureType",
];

export const FeatureTypeDependency = z.object({ featureType: FeatureTypeName });

export type FeatureTypeDependency = z.infer<typeof FeatureTypeDependency>;

export const FeatureDependency = z.object({ feature: FeatureName });

export type FeatureDependency = z.infer<typeof FeatureDependency>;

export const BuildingBlockDependency = z.object({
  buildingBlock: BuildingBlockName,
});

export type BuildingBlockDependency = z.infer<typeof BuildingBlockDependency>;

export type RawAllowedDependency = Partial<FeatureTypeDependency> &
  Partial<FeatureDependency> &
  Partial<BuildingBlockDependency>;

export type InternalAllowedDependency = {
  type: AllowedDependencyType;
  name: string;
};

export const AllowedDependency = z
  .union([FeatureTypeDependency, FeatureDependency, BuildingBlockDependency])
  .transform<InternalAllowedDependency>(
    (rawAllowedDependency: RawAllowedDependency) => {
      if (rawAllowedDependency.featureType) {
        return {
          type: "featureType",
          name: rawAllowedDependency.featureType,
        };
      }

      if (rawAllowedDependency.feature) {
        return {
          type: "feature",
          name: rawAllowedDependency.feature,
        };
      }

      if (rawAllowedDependency.buildingBlock) {
        return {
          type: "buildingBlock",
          name: rawAllowedDependency.buildingBlock,
        };
      }

      throw new Error("Not supported");
    }
  );

export type AllowedDependency = z.infer<typeof AllowedDependency>;

export const AllowedDependenciesRuleConfig = z.object({
  name: z.literal("allowed-dependencies"),

  dependencies: z.array(AllowedDependency),
});

export type AllowedDependenciesRuleConfig = z.infer<
  typeof AllowedDependenciesRuleConfig
>;

export interface RuleByScopeName<RULE> {
  root: RULE | undefined;
  featureType: RULE | undefined;
  feature: RULE | undefined;
  buildingBlock: RULE | undefined;
}

export type ViolationStatus = "allowed" | "notAllowed" | "alwaysAllowed";

export type ViolationByAllowedDependencyType = Record<
  AllowedDependencyType,
  { status: ViolationStatus; allowedDependencyNames: Set<string> }
>;

export interface AllowedDependenciesViolationData {
  module: ResolvedBuildingBlockModule;

  dependencyModule: ResolvedBuildingBlockModule;

  dependencyType: "featureType" | "feature" | "buildingBlock";

  allowedDependencyNames: Set<string>;
}

export const evaluate = (
  ruleScope: RuleScope,
  rule: AllowedDependenciesRuleConfig,
  resolveState: ResolveState,
  module: ResolvedBuildingBlockModule
): Violation[] => {
  const violations: Violation[] = [];

  for (const moduleFilePath of module.dependencyModuleFilePaths) {
    const dependencyModule =
      resolveState.resolvedModuleByFilePath.get(moduleFilePath)!;

    if (dependencyModule.type !== "buildingBlockModule") {
      continue;
    }

    const feature = resolveState.resolvedFeatureByName.get(module.featureName)!;

    const featureTypeName = feature.featureTypeName;

    const dependencyFeature = resolveState.resolvedFeatureByName.get(
      dependencyModule.featureName
    )!;

    const dependencyFeatureTypeName = dependencyFeature.featureTypeName;

    const violationsByAllowedDependencyType: ViolationByAllowedDependencyType =
      {
        featureType: {
          status: "alwaysAllowed",
          allowedDependencyNames: new Set(),
        },
        feature: {
          status: "alwaysAllowed",
          allowedDependencyNames: new Set(),
        },
        buildingBlock: {
          status: "alwaysAllowed",
          allowedDependencyNames: new Set(),
        },
      };

    const notAllowed = (allowedDependency: AllowedDependency) => {
      if (
        violationsByAllowedDependencyType[allowedDependency.type].status ===
        "allowed"
      ) {
        return;
      }

      violationsByAllowedDependencyType[allowedDependency.type].status =
        "notAllowed";

      violationsByAllowedDependencyType[
        allowedDependency.type
      ].allowedDependencyNames.add(allowedDependency.name);
    };

    const allowed = (allowedDependency: AllowedDependency) => {
      violationsByAllowedDependencyType[allowedDependency.type].status =
        "allowed";
    };

    const ignoreSelf = () => {
      switch (ruleScope) {
        case "featureType": {
          return featureTypeName === dependencyFeatureTypeName;
        }
        case "feature": {
          return module.featureName === dependencyFeature.name;
        }
        case "buildingBlock": {
          return (
            module.featureName === dependencyFeature.name &&
            module.buildingBlockName === dependencyModule.buildingBlockName
          );
        }
      }
    };

    for (const allowedDependency of rule.dependencies) {
      if (ignoreSelf()) {
        continue;
      }

      if (allowedDependency.type === "featureType") {
        if (allowedDependency.name !== dependencyFeatureTypeName) {
          notAllowed(allowedDependency);
        } else {
          allowed(allowedDependency);
        }
      }

      if (allowedDependency.type === "feature") {
        if (allowedDependency.name !== dependencyFeature.name) {
          notAllowed(allowedDependency);
        } else {
          allowed(allowedDependency);
        }
      }

      if (allowedDependency.type === "buildingBlock") {
        if (allowedDependency.name !== dependencyModule.buildingBlockName) {
          notAllowed(allowedDependency);
        } else {
          allowed(allowedDependency);
        }
      }
    }

    for (const allowedDependencyType of allowedDependencyTypeOrder) {
      if (
        violationsByAllowedDependencyType[allowedDependencyType].status !==
        "notAllowed"
      ) {
        continue;
      }

      const violation: Violation<AllowedDependenciesViolationData> = {
        name: rule.name,

        scope: ruleScope,

        severity: "error",

        data: {
          module,
          dependencyModule,
          dependencyType: allowedDependencyType,
          allowedDependencyNames:
            violationsByAllowedDependencyType[allowedDependencyType]
              .allowedDependencyNames,
        },
      };

      violations.push(violation);

      break;
    }
  }

  return violations;
};

export const allowedDependencyRuleDefinition: BuildingBlockModuleRuleDefinition<
  AllowedDependenciesRuleConfig,
  AllowedDependenciesViolationData
> = {
  name: "allowed-dependencies",

  type: "buildingBlockModule",

  evaluate,

  printViolation: (printer, violation, resolveState) => {
    const { module, dependencyModule, dependencyType, allowedDependencyNames } =
      violation.data;

    const feature = resolveState.resolvedFeatureByName.get(module.featureName)!;

    const featureTypeName = feature.featureTypeName;

    const dependencyFeature = resolveState.resolvedFeatureByName.get(
      dependencyModule.featureName
    )!;

    const dependencyFeatureTypeName = dependencyFeature.featureTypeName;

    const renderDependentMessagePart = () => {
      switch (violation.scope) {
        case "root": {
          throw new Error("Not supported");
        }
        case "featureType": {
          return printer.format`Feature type {bold ${featureTypeName}}`;
        }
        case "feature": {
          return printer.format`Feature {bold ${module.featureName}}`;
        }
        case "buildingBlock": {
          return printer.format`Building block {bold ${module.buildingBlockName}}`;
        }
      }
    };

    const renderDependencyMessagePart = () => {
      switch (dependencyType) {
        case "featureType": {
          return printer.format`feature type {bold ${dependencyFeatureTypeName}}`;
        }
        case "feature": {
          return printer.format`feature {bold ${dependencyModule.featureName}}`;
        }
        case "buildingBlock": {
          return printer.format`building block {bold ${dependencyModule.buildingBlockName}}`;
        }
      }
    };

    const renderDependencyTypeMessagePart = () => {
      switch (dependencyType) {
        case "featureType": {
          return "feature type";
        }
        case "feature": {
          return "feature";
        }
        case "buildingBlock": {
          return "building block";
        }
      }
    };

    const title = `${renderDependentMessagePart()} must not depend on ${renderDependencyMessagePart()}`;

    printViolationTemplate(printer, violation, title, () => {
      const tsImportDeclaration = module.dependencyModuleInfoByFilePath.get(
        dependencyModule.filePath
      )!.tsImportDeclaration;

      let { line, character } = ts.getLineAndCharacterOfPosition(
        module.tsSourceFile,
        tsImportDeclaration.getStart(module.tsSourceFile)
      );

      printer.text`\n  At ${path.relative(
        process.cwd(),
        module.filePath
      )}:{dim ${line + 1}:${character + 1}}`;

      printer.blankLine();

      const tsPrinter = ts.createPrinter();

      printer.text`{dim ${line + 1} |} ${tsPrinter.printNode(
        ts.EmitHint.Unspecified,
        tsImportDeclaration,
        module.tsSourceFile
      )}`;

      printer.blankLine();

      printer.text`${renderDependentMessagePart()} may only depend on ${renderDependencyTypeMessagePart()}: ${Array.from(
        allowedDependencyNames
      )
        .map((name) => printer.format`{bold ${name}}`)
        .join(", ")}`;
    });
  },
};
