import { AnotherFoo1BB1 } from "src/foo1/bb1/AnotherFoo1BB1.js"; // allowed
import { Bar1BB1 } from "src/bar1/bb1/Bar1BB1.js"; // allowed
import { Bar2BB1 } from "src/bar2/bb1/Bar2BB1.js"; // allowed
import { Baz1BB1 } from "src/baz1/bb1/Baz1BB1.js"; // not allowed
import { Foo2BB1 } from "src/foo2/bb1/Foo2BB1.js"; // not allowed

AnotherFoo1BB1;
Bar1BB1;
Bar2BB1;
Baz1BB1;
Foo2BB1;

export const Foo1BB1 = {};