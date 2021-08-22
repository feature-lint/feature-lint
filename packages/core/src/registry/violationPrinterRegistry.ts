import { ViolationPrinter } from "../rule/model/ViolationPrinter.js";
import { RULE_DEFINITIONS } from "./ruleRegistry.js";

const ruleViolationPrinters = Object.fromEntries(
  RULE_DEFINITIONS.map((rule) => {
    return [rule.name, rule.printViolation];
  })
);

export const VIOLATION_PRINTER: Record<string, ViolationPrinter<any>> = {
  ...ruleViolationPrinters,
};
