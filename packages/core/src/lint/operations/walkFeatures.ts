import { ResolvedFeature } from "../../resolve/model/ResolvedFeature.js";
import { ResolveResult } from "../../resolve/model/ResolveResult.js";

export function walkFeatures(
  resolveResult: ResolveResult,
  featureHandler: (resolvedFeature: ResolvedFeature) => void
) {
  const walk = (feature: ResolvedFeature) => {
    featureHandler(feature);

    const childFeatureNames = [...feature.childFeatureNames].sort();

    for (const childFeatureName of childFeatureNames) {
      const childFeature =
        resolveResult.resolvedFeatureByName.get(childFeatureName)!;

      walk(childFeature);
    }
  };

  for (const featureName of [
    ...resolveResult.resolvedRoot.featureNames,
  ].sort()) {
    const feature = resolveResult.resolvedFeatureByName.get(featureName)!;

    walk(feature);
  }
}
