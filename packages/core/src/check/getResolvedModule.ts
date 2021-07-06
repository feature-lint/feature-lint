import { ResolvedModule } from "../resolve/model/ResolvedModule";
import { ResolveState } from "../resolve/model/ResolveState";

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
