import { ResolveResult } from "./model/ResolveResult.js";
import { ResolvedModule } from "./model/ResolvedModule.js";

export function resolveModuleTopLevelFunctions(
  resolveResult: ResolveResult,
  resolvedModule: ResolvedModule
) {
  const { tsProgram } = resolveResult.resolvedRoot;
  const { tsSourceFile, filePath } = resolvedModule;

  console.log("RESOLVE ROP", filePath);
}

export type TopLevelFunction = {
  name: string;
  params: string[];
};
