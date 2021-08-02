import { ResolveResult } from "../model/ResolveResult.js";

export function buildFeatureNameHierarchy(
  featureName: string,
  resolveResult: ResolveResult
): string[] {
  const hierarchy: string[] = [featureName];

  let parentFeatureName: string | undefined = featureName;

  while (true) {
    parentFeatureName =
      resolveResult.resolvedFeatureByName.get(
        parentFeatureName
      )?.parentFeatureName;

    if (parentFeatureName === undefined) {
      return hierarchy;
    }

    hierarchy.unshift(parentFeatureName);
  }
}
