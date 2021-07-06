import { AnotherFoo1BB1 } from "src/foo1/bb1/AnotherFoo1BB1.js"; // allowed
import { Bar1BB1 } from "src/bar1/bb1/Bar1BB1.js"; // allowed
import { Bar2BB1 } from "src/bar2/bb1/Bar2BB1.js"; // allowed
import { Baz2BB1 } from "src/baz2/bb1/Baz2BB1.js"; // not allowed
import { Foo1BB2 } from "src/foo1/bb2/Foo1BB2.js"; // not allowed

AnotherFoo1BB1;
Bar1BB1;
Bar2BB1;
Baz2BB1;
Foo1BB2;

export const Foo1BB1 = {};
