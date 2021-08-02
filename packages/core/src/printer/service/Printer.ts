import { Chalk } from "chalk";

export const Printer = (chalk: Chalk) => {
  let output = "";
  let indentLength = 0;

  let blankLineCount = 0;

  return {
    format: (...args: unknown[]): string => {
      return chalk(...args);
    },

    text: (...args: unknown[]) => {
      output += "\n".repeat(blankLineCount);

      blankLineCount = 0;

      output += " ".repeat(indentLength) + chalk(...args).trim() + "\n";
    },

    blankLine: (count = 1) => {
      if (blankLineCount < count) {
        blankLineCount = count;
      }
    },

    indent(count = 2) {
      indentLength += count;
    },

    unindent(count = 2) {
      indentLength = Math.max(0, indentLength - count);
    },

    print() {
      process.stdout.write(output);
    },

    log() {
      console.log(output);
    },
  };
};

export type Printer = ReturnType<typeof Printer>;
