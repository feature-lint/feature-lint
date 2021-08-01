import { Printer } from "../../printer/service/Printer.js";
import { ResolveResult } from "../../resolve/model/ResolveResult.js";
import { Violation } from "./Violation.js";

export type ViolationPrinter<VIOLATION_DATA> = (
  printer: Printer,
  violation: Violation<VIOLATION_DATA>,
  resolveResult: ResolveResult
) => void;
