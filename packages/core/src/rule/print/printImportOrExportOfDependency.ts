import * as path from "path";
import ts from "typescript";
import { ResolvedModule } from "../../resolve/model/ResolvedModule.js";
import { Printer } from "../../printer/service/Printer.js";
import { printImportOrExportDeclaration } from "./printImportOrExportDeclaration.js";

export function printImportOrExportOfDependency(
  printer: Printer,
  module: ResolvedModule,
  dependencyModule: ResolvedModule
) {
  const tsImportOrExportDeclaration = module.dependencyModuleInfoByFilePath.get(
    dependencyModule.filePath
  )!.tsImportOrExportDeclaration;

  return printImportOrExportDeclaration(
    printer,
    module,
    tsImportOrExportDeclaration
  );
}
