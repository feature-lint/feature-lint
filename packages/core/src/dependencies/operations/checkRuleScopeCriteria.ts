import { ResolvedBuildingBlockModule } from "../../resolve/model/ResolvedModule.js";
import { FinalDependencyCriterion } from "../model/FinalDependencyCriterion.js";

export function checkRuleScopeCriteria(
  criteria: FinalDependencyCriterion[],
  dependentModule: ResolvedBuildingBlockModule,
  dependentFeatureTypeName: string | undefined,
  dependencyModule: ResolvedBuildingBlockModule,
  dependencyFeatureTypeName: string | undefined
): [boolean, FinalDependencyCriterion | undefined] {
  let allowed = true;

  let denyCriterion: FinalDependencyCriterion | undefined = undefined;

  for (const criterion of criteria) {
    const { featureNames, featureTypeNames, buildingBlockNames } = criterion;

    if (featureNames === "*") {
      // nothing to do
    } else if (featureNames === "&") {
      const matchesFeature =
        dependentModule.featureName === dependencyModule.featureName;

      if (!matchesFeature) {
        continue;
      }
    } else {
      const matchesFeatureName = featureNames.some((featureName) => {
        return featureName === dependencyModule.featureName;
      });

      if (!matchesFeatureName) {
        continue;
      }
    }

    if (featureTypeNames === "*") {
      // nothing do to
    } else if (featureTypeNames === "&") {
      const matchesFeatureType =
        dependentFeatureTypeName &&
        dependencyFeatureTypeName &&
        dependentFeatureTypeName === dependencyFeatureTypeName;

      if (!matchesFeatureType) {
        continue;
      }
    } else {
      const matchesFeatureTypeName =
        dependencyFeatureTypeName &&
        featureTypeNames.some((featureTypeName) => {
          return featureTypeName === dependencyFeatureTypeName;
        });

      if (!matchesFeatureTypeName) {
        continue;
      }
    }

    if (buildingBlockNames === "*") {
      // nothing to do
    } else {
      const matchesBuildingBlockName = buildingBlockNames.some(
        (buildingBlockName) => {
          return buildingBlockName === dependencyModule.buildingBlockName;
        }
      );

      if (!matchesBuildingBlockName) {
        continue;
      }
    }

    if (criterion.type === "allow") {
      denyCriterion = undefined;
      allowed = true;
    } else {
      denyCriterion ??= criterion;
      allowed = false;
    }
  }

  return [allowed, denyCriterion];
}
