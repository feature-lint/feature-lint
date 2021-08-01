import { ResolvedModule } from "../model/ResolvedModule";
import { ResolveResult } from "../model/ResolveResult";

export function getResolvedModule(
  resolveResult: ResolveResult,
  moduleFilePath: string
): ResolvedModule {
  const module = resolveResult.resolvedModuleByFilePath.get(moduleFilePath);

  if (module === undefined) {
    throw new Error("Module not found");
  }

  return module;
}
