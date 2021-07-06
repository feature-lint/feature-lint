import {
  IMPLICIT_RULE_DEFINITIONS,
  RULE_DEFINITIONS,
} from "../rule-registry/ruleRegistry.js";
import { Violation } from "../violation/model/Violation.js";
import { printViolationTemplate } from "./printViolationTemplate.js";
import { ViolationPrinter } from "./ViolationPrinter.js";

const ruleViolationPrinters = Object.fromEntries(
  RULE_DEFINITIONS.map((rule) => {
    return [rule.name, rule.printViolation];
  })
);

const implicitRuleViolationPrinters = Object.fromEntries(
  IMPLICIT_RULE_DEFINITIONS.map((rule) => {
    return [rule.name, rule.printViolation];
  })
);

export const VIOLATION_PRINTER: Record<string, ViolationPrinter<any>> = {
  ...ruleViolationPrinters,
  ...implicitRuleViolationPrinters,
};
