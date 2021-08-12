import * as path from "path";
import * as fs from "fs";
import { buildUniqueBuildingBlockName } from "./operations/buildUniqueBuildingBlockName.js";
import { ResolveResult } from "./model/ResolveResult.js";
import { buildPathHierachy as buildPathHierarchy } from "./util/buildPathHierachy.js";
import { getOrCreateRootFeature } from "./getOrCreateRootFeature";
import { getOrCreateChildFeature } from "./getOrCreateChildFeature";
import { getOrCreateBuildingBlock } from "./getOrCreateBuildingBlock";
import { ResolveState } from "./model/ResolveState";
import { ResolvedFeature } from "./model/ResolvedFeature.js";

export function resolveDirectory(
  resolveResult: ResolveResult,
  directoryPath: string
): ResolveState {
  const { resolvedRoot } = resolveResult;

  const { rootDirectoryPath } = resolvedRoot;

  const pathHierarchy = buildPathHierarchy(directoryPath, rootDirectoryPath);

  let state: ResolveState = { type: "inRoot" };

  for (const hierarchyPath of pathHierarchy) {
    if (state.type === "inRoot") {
      const resolvedFeature = getOrCreateRootFeature(
        resolveResult,
        hierarchyPath
      );

      resolvedRoot.featureNames.add(resolvedFeature.name);

      const featurePrivate =
        fs
          .lstatSync(path.join(hierarchyPath, "public"), {
            throwIfNoEntry: false,
          })
          ?.isDirectory() || false;

      state = {
        type: resolvedFeature.featureConfig.childFeaturesOnly
          ? "inFeaturesFolder"
          : "inFeature",

        feature: resolvedFeature,

        featurePrivate,

        siblingFeaturePrivate: undefined,

        parentFeaturePrivate: undefined,
      };

      continue;
    }

    if (state.type === "inFeaturesFolder") {
      const directoryName = path.basename(hierarchyPath);

      if (directoryName === "private") {
        state = {
          type: "inFeaturesFolder",

          feature: state.feature,

          siblingFeaturePrivate: state.feature,

          parentFeaturePrivate: state.parentFeaturePrivate,
        };

        continue;
      }

      if (directoryName === "public") {
        // TODO
        state = {
          type: "inFeaturesFolder",

          feature: state.feature,

          siblingFeaturePrivate: undefined,

          parentFeaturePrivate: state.parentFeaturePrivate,
        };

        continue;
      }

      const resolvedFeature = getOrCreateChildFeature(
        resolveResult,
        state,
        hierarchyPath
      );

      state.feature.childFeatureNames.add(resolvedFeature.name);

      const featurePrivate =
        fs
          .lstatSync(path.join(hierarchyPath, "public"), {
            throwIfNoEntry: false,
          })
          ?.isDirectory() || false;

      state = {
        type: resolvedFeature.featureConfig.childFeaturesOnly
          ? "inFeaturesFolder"
          : "inFeature",

        feature: resolvedFeature,

        featurePrivate,

        siblingFeaturePrivate: state.siblingFeaturePrivate,

        parentFeaturePrivate: state.parentFeaturePrivate,
      };

      continue;
    }

    if (state.type === "inFeature") {
      const directoryName = path.basename(hierarchyPath);

      if (directoryName === "private") {
        state = {
          type: "inFeature",

          feature: state.feature,

          featurePrivate: true,

          siblingFeaturePrivate: state.siblingFeaturePrivate,

          parentFeaturePrivate: state.parentFeaturePrivate,
        };

        continue;
      }

      if (directoryName === "public") {
        state = {
          type: "inFeature",

          feature: state.feature,

          featurePrivate: false,

          siblingFeaturePrivate: state.siblingFeaturePrivate,

          parentFeaturePrivate: state.parentFeaturePrivate,
        };

        continue;
      }

      // TODO: Read features folder name from config
      if (directoryName === "features") {
        const siblingFeaturePrivate: ResolvedFeature | undefined = fs
          .lstatSync(path.join(hierarchyPath, "public"), {
            throwIfNoEntry: false,
          })
          ?.isDirectory()
          ? state.feature
          : undefined;

        state = {
          type: "inFeaturesFolder",

          feature: state.feature,

          siblingFeaturePrivate,

          parentFeaturePrivate: state.featurePrivate
            ? state.feature
            : undefined,
        };

        continue;
      }

      const buildingBlockName = directoryName;

      const uniqueBuildingBlockName = buildUniqueBuildingBlockName(
        state.feature.name,
        buildingBlockName
      );

      const resolvedBuildingBlock = getOrCreateBuildingBlock(
        resolveResult,
        state,
        buildingBlockName,
        uniqueBuildingBlockName
      );

      state.feature.buildingBlockNames.add(resolvedBuildingBlock.name);

      // TODO: Extract
      const buildingBlockPrivate: boolean =
        fs
          .lstatSync(path.join(hierarchyPath, "public"), {
            throwIfNoEntry: false,
          })
          ?.isDirectory() || state.featurePrivate;

      state = {
        type: "inBuildingBlock",

        buildingBlock: resolvedBuildingBlock,

        isSubDirectory: false,

        buildingBlockPrivate,

        featurePrivate: state.featurePrivate,

        siblingFeaturePrivate: state.siblingFeaturePrivate,

        parentFeaturePrivate: state.parentFeaturePrivate,
      };

      continue;
    }

    if (state.type === "inBuildingBlock") {
      const directoryName = path.basename(hierarchyPath);

      if (!state.isSubDirectory) {
        state = {
          type: "inBuildingBlock",

          buildingBlock: state.buildingBlock,

          isSubDirectory: true,

          buildingBlockPrivate: state.buildingBlockPrivate,

          featurePrivate: state.featurePrivate,

          siblingFeaturePrivate: state.siblingFeaturePrivate,

          parentFeaturePrivate: state.parentFeaturePrivate,
        };
      }

      if (directoryName === "private") {
        state = {
          type: "inBuildingBlock",

          buildingBlock: state.buildingBlock,

          isSubDirectory: true,

          buildingBlockPrivate: true,

          featurePrivate: state.featurePrivate,

          siblingFeaturePrivate: state.siblingFeaturePrivate,

          parentFeaturePrivate: state.parentFeaturePrivate,
        };

        continue;
      }

      if (directoryName === "public") {
        state = {
          type: "inBuildingBlock",

          buildingBlock: state.buildingBlock,

          isSubDirectory: true,

          buildingBlockPrivate: false,

          featurePrivate: state.featurePrivate,

          siblingFeaturePrivate: state.siblingFeaturePrivate,

          parentFeaturePrivate: state.parentFeaturePrivate,
        };

        continue;
      }

      state = {
        type: "inBuildingBlock",

        buildingBlock: state.buildingBlock,

        isSubDirectory: true,

        buildingBlockPrivate: state.buildingBlockPrivate,

        featurePrivate: state.featurePrivate,

        siblingFeaturePrivate: state.siblingFeaturePrivate,

        parentFeaturePrivate: state.parentFeaturePrivate,
      };

      continue;
    }
  }

  return state;
}
