import { Printer } from "../../printer/service/Printer.js";
import { Violation } from "../model/Violation.js";

export const printViolationTemplate = (
  printer: Printer,
  violation: Violation,
  title: string,
  printText: () => void
) => {
  printer.indent();

  printer.text`{bgRed.black.bold  ERROR } ${title} {dim (${violation.ruleName})}`;

  printer.indent();

  printer.blankLine();

  printText();

  printer.blankLine();

  printer.unindent();
  printer.unindent();
};
