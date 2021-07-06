import { Printer } from "../printer/Printer.js";
import { Violation } from "../violation/model/Violation.js";

export const printViolationTemplate = (
  printer: Printer,
  violation: Violation,
  title: string,
  printText: () => void
) => {
  printer.indent();

  printer.text`{bgRed.black.bold  ERROR } ${title} {dim (${violation.name})}`;

  printer.indent();

  printer.blankLine();

  printText();

  printer.blankLine();

  printer.unindent();
  printer.unindent();
};

export const printGenericViolationTemplate = (
  printer: Printer,
  name: string | undefined,
  title: string,
  printText: () => void
) => {
  if (name) {
    printer.text`{bgRed.black.bold  ERROR } ${title} {dim (${name})}`;
  } else {
    printer.text`{bgRed.black.bold  ERROR } ${title}`;
  }

  printer.indent();

  printer.blankLine();

  printText();

  printer.blankLine();

  printer.unindent();
};
