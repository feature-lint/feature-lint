import { ResolvedModule } from "../model/ResolvedModule";
import { ResolveState } from "../model/ResolveState";

export function getResolvedModule(
  resolveState: ResolveState,
  moduleFilePath: string
): ResolvedModule {
  const module = resolveState.resolvedModuleByFilePath.get(moduleFilePath);

  if (module === undefined) {
    throw new Error("Module not found");
  }

  return module;
}
