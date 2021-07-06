import { ResolvedFeature } from "../resolve/model/ResolvedFeature";
import { ResolveState } from "../resolve/model/ResolveState";

export function getResolvedFeature(
  resolveState: ResolveState,
  featureName: string
): ResolvedFeature {
  const feature = resolveState.resolvedFeatureByName.get(featureName);

  if (feature === undefined) {
    throw new Error("Feature not found");
  }

  return feature;
}
