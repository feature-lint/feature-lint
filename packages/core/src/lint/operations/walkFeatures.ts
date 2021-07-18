import { ResolvedFeature } from "../../resolve/model/ResolvedFeature.js";
import { ResolveState } from "../../resolve/model/ResolveState.js";

export function walkFeatures(
  resolveState: ResolveState,
  featureHandler: (resolvedFeature: ResolvedFeature) => void
) {
  const walk = (feature: ResolvedFeature) => {
    featureHandler(feature);

    const childFeatureNames = [...feature.childFeatureNames].sort();

    for (const childFeatureName of childFeatureNames) {
      const childFeature =
        resolveState.resolvedFeatureByName.get(childFeatureName)!;

      walk(childFeature);
    }
  };

  for (const featureName of [
    ...resolveState.resolvedRoot.featureNames,
  ].sort()) {
    const feature = resolveState.resolvedFeatureByName.get(featureName)!;

    walk(feature);
  }
}
