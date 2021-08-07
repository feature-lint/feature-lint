export interface FinalDependencyCriterion {
  type: "allow" | "deny";
  /**
   * * = any
   * & = feature type of dependent module
   */
  featureTypeNames: string[] | "*" | "&";

  /**
   * * = any
   * & = feature of dependent module
   */
  featureNames: string[] | "*" | "&";

  /**
   * * = any
   */
  buildingBlockNames: string[] | "*";
}
