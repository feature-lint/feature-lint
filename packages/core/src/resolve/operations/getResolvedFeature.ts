import { ResolvedFeature } from "../model/ResolvedFeature";
import { ResolveResult } from "../model/ResolveResult";

export function getResolvedFeature(
  resolveResult: ResolveResult,
  featureName: string
): ResolvedFeature {
  const feature = resolveResult.resolvedFeatureByName.get(featureName);

  if (feature === undefined) {
    throw new Error("Feature not found");
  }

  return feature;
}
