import { Chalk } from "chalk";
import { ZodError } from "zod";
import { Printer } from "../../printer/Printer.js";
import { printGenericViolationTemplate } from "../../render/printViolationTemplate.js";

export interface FeatureLintError {
  type: string;

  print(printer: Printer): void;
}

export const GenericFeatureLintError = (
  name: string,
  message: string
): FeatureLintError => {
  return {
    type: "generic",

    print(printer) {
      return printGenericViolationTemplate(printer, name, message, () => {});
    },
  };
};

export const UnexpectedFeatureLintError = (
  message: string
): FeatureLintError => {
  return {
    type: "generic",

    print(printer) {
      return printGenericViolationTemplate(
        printer,
        "unexpected-error",
        message,
        () => {}
      );
    },
  };
};

export const ZodFeatureLintError = (
  name: "invalid-config" | "invalid-feature-config",
  message: string,
  zodError: ZodError
): FeatureLintError => {
  return {
    type: "zod",

    print(printer) {
      printGenericViolationTemplate(printer, name, message, () => {
        // TODO: Make this more useful
        const errors = zodError.flatten();

        for (const [key, text] of Object.entries(errors.formErrors)) {
          printer.text`* ${key}: ${text}`;
        }

        for (const [key, text] of Object.entries(errors.fieldErrors)) {
          printer.text`* ${key}: ${text}`;
        }

        // TODO: Print link to JSON schema
      });
    },
  };
};