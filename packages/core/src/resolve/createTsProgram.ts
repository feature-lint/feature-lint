import ts, { CreateProgramOptions } from "typescript";

export function createTsProgram(configFilePath: string): ts.Program {
  const tsConfigFilePath = ts.findConfigFile(configFilePath, ts.sys.fileExists);

  if (tsConfigFilePath === undefined) {
    throw new Error("No TypeScript config found");
  }

  const tsConfig = ts.getParsedCommandLineOfConfigFile(
    tsConfigFilePath,
    undefined,
    ts.sys as any
  );

  if (tsConfig === undefined) {
    throw new Error("Failed to parse TypeScript config");
  }

  const { fileNames, options, projectReferences } = tsConfig;

  const tsProgramOptions: CreateProgramOptions = {
    rootNames: fileNames,
    options,
  };

  if (projectReferences !== undefined) {
    tsProgramOptions.projectReferences = projectReferences;
  }

  const tsProgram = ts.createProgram(tsProgramOptions);

  return tsProgram;
}
