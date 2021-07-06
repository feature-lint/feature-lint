import { Printer } from "../printer/Printer.js";
import { ResolveState } from "../resolve/model/ResolveState.js";
import { Violation } from "../violation/model/Violation.js";

export type ViolationPrinter<VIOLATION_DATA> = (
  printer: Printer,
  violation: Violation<VIOLATION_DATA>,
  resolveState: ResolveState
) => void;
