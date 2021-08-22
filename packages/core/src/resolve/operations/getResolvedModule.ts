import { ResolvedModule } from "../model/ResolvedModule.js";
import { ResolveResult } from "../model/ResolveResult.js";

export function getResolvedModule(
  resolveResult: ResolveResult,
  moduleFilePath: string
): ResolvedModule {
  const module = resolveResult.resolvedModuleByFilePath.get(moduleFilePath);

  if (module === undefined) {
    throw new Error(`Module "${moduleFilePath}" not found`);
  }

  return module;
}
