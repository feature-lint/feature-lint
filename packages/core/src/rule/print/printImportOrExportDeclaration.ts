import * as path from "path";
import ts from "typescript";
import { ResolvedModule } from "../../resolve/model/ResolvedModule.js";
import { Printer } from "../../printer/service/Printer.js";

export function printImportOrExportDeclaration(
  printer: Printer,
  module: ResolvedModule,
  tsImportOrExportDeclaration: ts.ImportDeclaration | ts.ExportDeclaration
) {
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
