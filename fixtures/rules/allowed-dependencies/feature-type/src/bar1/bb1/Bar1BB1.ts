import { Bar2BB1 } from "src/bar2/bb1/Bar2BB1.js"; // allowed
import { Baz1BB1 } from "src/baz1/bb1/Baz1BB1.js"; // not allowed
import { Foo1BB1 } from "src/foo1/bb1/Foo1BB1.js"; // allowed
import { Foo2BB2 } from "src/foo2/bb2/Foo2BB2.js"; // not allowed

Bar2BB1;
Baz1BB1;
Foo1BB1;
Foo2BB2;

export const Bar1BB1 = {};
