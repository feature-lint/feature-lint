import {
  DependencyCriterion,
  parseDependencyCriterion,
} from "./parseDependencyCriterion.js";

describe("dependencySelector", () => {
  type DependencySelectorByRawDependencySelector = {
    [selector: string]: DependencyCriterion;
  };

  const selectorByRawSelector: DependencySelectorByRawDependencySelector = {
    "*": {
      type: "allow",
      featureTypeNames: "*",
      featureNames: "*",
      buildingBlockNames: "*",
    },
    "f:ftype@bb": {
      type: "allow",
      featureTypeNames: ["ftype"],
      featureNames: ["f"],
      buildingBlockNames: ["bb"],
    },
    "!f:ftype@bb": {
      type: "deny",
      featureTypeNames: ["ftype"],
      featureNames: ["f"],
      buildingBlockNames: ["bb"],
    },
    "{f1,f2}:{ftype1,ftype2}@{bb1,bb2}": {
      type: "allow",
      featureTypeNames: ["ftype1", "ftype2"],
      featureNames: ["f1", "f2"],
      buildingBlockNames: ["bb1", "bb2"],
    },
    "!{f1,f2}:{ftype1,ftype2}@{bb1,bb2}": {
      type: "deny",
      featureTypeNames: ["ftype1", "ftype2"],
      featureNames: ["f1", "f2"],
      buildingBlockNames: ["bb1", "bb2"],
    },
    "f:ftype": {
      type: "allow",
      featureTypeNames: ["ftype"],
      featureNames: ["f"],
      buildingBlockNames: undefined,
    },
    ":ftype@bb": {
      type: "allow",
      featureTypeNames: ["ftype"],
      featureNames: undefined,
      buildingBlockNames: ["bb"],
    },
    "f@bb": {
      type: "allow",
      featureTypeNames: undefined,
      featureNames: ["f"],
      buildingBlockNames: ["bb"],
    },
    f: {
      type: "allow",
      featureTypeNames: undefined,
      featureNames: ["f"],
      buildingBlockNames: undefined,
    },
    ":ftype": {
      type: "allow",
      featureTypeNames: ["ftype"],
      featureNames: undefined,
      buildingBlockNames: undefined,
    },
    "@bb": {
      type: "allow",
      featureTypeNames: undefined,
      featureNames: undefined,
      buildingBlockNames: ["bb"],
    },
  };

  for (const [rawSelector, selector] of Object.entries(selectorByRawSelector)) {
    it(`${rawSelector}`, () => {
      expect(parseDependencyCriterion(rawSelector)).toEqual(selector);
    });
  }
});
