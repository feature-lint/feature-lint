import { ResolvedBuildingBlockModule } from "../../resolve/model/ResolvedModule.js";
import { ViolationScope } from "../operations/getViolationScopeFromCriterion.js";
import { FinalDependencyCriterion } from "./FinalDependencyCriterion.js";

export interface DependenciesViolationData {
  violatingModule: ResolvedBuildingBlockModule;

  violatingScope: ViolationScope;

  violatedModule: ResolvedBuildingBlockModule;

  violatedScope: ViolationScope;

  denyCriterion: FinalDependencyCriterion | undefined;
}
