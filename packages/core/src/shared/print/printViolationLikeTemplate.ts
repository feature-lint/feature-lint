import { Printer } from "../../printer/service/Printer.js";

export function printViolationLikeTemplate(
  printer: Printer,
  name: string | undefined,
  title: string,
  printText: () => void
) {
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
}
