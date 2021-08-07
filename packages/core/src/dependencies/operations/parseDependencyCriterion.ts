export interface DependencyCriterion {
  type: "allow" | "deny";
  featureTypeNames: string[] | "*" | "&" | undefined;
  featureNames: string[] | "*" | "&" | undefined;
  buildingBlockNames: string[] | "*" | undefined;
}

export const parseDependencyCriterion = (
  rawSelector: string
): DependencyCriterion | undefined => {
  if (rawSelector.trim() === "*") {
    return {
      type: "allow",
      featureTypeNames: "*",
      featureNames: "*",
      buildingBlockNames: "*",
    };
  }

  if (rawSelector.trim() === "!*") {
    return {
      type: "deny",
      featureTypeNames: "*",
      featureNames: "*",
      buildingBlockNames: "*",
    };
  }

  const match = rawSelector
    .trim()
    .match(
      /^(!)?(?:(?:(?:{?([^:@*]+?|\*|&)}?)?(?::{?([^:@*]+?|\*|&)}?)?(?:@{?([^:@*]+?|\*)}?)?))$/
    );

  if (match === null) {
    return undefined;
  }

  const [
    ,
    typePattern,
    featurePattern,
    featureTypePattern,
    buildingBlockPattern,
  ] = match;

  const type = typePattern === undefined ? "allow" : "deny";

  const featureTypeNames = (() => {
    if (featureTypePattern === undefined) {
      return undefined;
    }

    if (featureTypePattern.trim() === "") {
      return undefined;
    }

    if (featureTypePattern === "*") {
      return "*";
    }

    if (featureTypePattern === "&") {
      return "&";
    }

    return featureTypePattern.split(",").map((rawName) => {
      return rawName.trim();
    });
  })();

  const featureNames = (() => {
    if (featurePattern === undefined) {
      return undefined;
    }

    if (featurePattern.trim() === "") {
      return undefined;
    }

    if (featurePattern === "*") {
      return "*";
    }

    if (featurePattern === "&") {
      return "&";
    }

    return featurePattern.split(",").map((rawName) => {
      return rawName.trim();
    });
  })();

  const buildingBlockNames = (() => {
    if (buildingBlockPattern === undefined) {
      return undefined;
    }

    if (buildingBlockPattern.trim() === "") {
      return undefined;
    }

    if (buildingBlockPattern === "*") {
      return "*";
    }

    return buildingBlockPattern.split(",").map((rawName) => {
      return rawName.trim();
    });
  })();

  return {
    type,
    featureTypeNames,
    featureNames,
    buildingBlockNames,
  };
};
