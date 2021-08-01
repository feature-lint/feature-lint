import * as path from "path";
import ts from "typescript";
import { ResolvedModule } from "../../resolve/model/ResolvedModule.js";
import { Printer } from "../../printer/service/Printer.js";

export function printImportOrExportOfDependency(
  printer: Printer,
  module: ResolvedModule,
  dependencyModule: ResolvedModule
) {
  const tsImportOrExportDeclaration = module.dependencyModuleInfoByFilePath.get(
    dependencyModule.filePath
  )!.tsImportOrExportDeclaration;

  let { line, character } = ts.getLineAndCharacterOfPosition(
    module.tsSourceFile,
    tsImportOrExportDeclaration.getStart(module.tsSourceFile)
  );

  printer.text`\n  At ${path.relative(process.cwd(), module.filePath)}:{dim ${
    line + 1
  }:${character + 1}}`;

  printer.blankLine();

  const tsPrinter = ts.createPrinter();

  printer.text`{dim ${line + 1} |} ${tsPrinter.printNode(
    ts.EmitHint.Unspecified,
    tsImportOrExportDeclaration,
    module.tsSourceFile
  )}`;
}
