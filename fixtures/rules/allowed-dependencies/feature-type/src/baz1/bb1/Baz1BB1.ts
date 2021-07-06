import { AnotherBaz1BB1 } from "src/baz1/bb1/AnotherBaz1BB1.js"; // allowed
import { Baz2BB1 } from "src/baz2/bb1/Baz2BB1.js"; // allowed
import { Foo1BB1 } from "src/foo1/bb1/Foo1BB1.js"; // not allowed
import { Foo2BB2 } from "src/foo2/bb2/Foo2BB2.js"; // allowed

AnotherBaz1BB1;
Baz2BB1;
Foo1BB1;
Foo2BB2;

export const Baz1BB1 = {};
