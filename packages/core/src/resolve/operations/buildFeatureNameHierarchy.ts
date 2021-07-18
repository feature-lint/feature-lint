import { ResolveState } from "../model/ResolveState.js";

export function buildFeatureNameHierarchy(
  featureName: string,
  resolveState: ResolveState
): string[] {
  const hierarchy: string[] = [featureName];

  let parentFeatureName: string | undefined = featureName;

  while (true) {
    parentFeatureName =
      resolveState.resolvedFeatureByName.get(
        parentFeatureName
      )?.parentFeatureName;

    if (parentFeatureName === undefined) {
      return hierarchy;
    }

    hierarchy.unshift(parentFeatureName);
  }
}
