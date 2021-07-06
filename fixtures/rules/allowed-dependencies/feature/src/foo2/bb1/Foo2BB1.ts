import { AnotherFoo2BB1 } from "src/foo2/bb1/AnotherFoo2BB1.js"; // allowed
import { Bar1BB1 } from "src/bar1/bb1/Bar1BB1.js"; // allowed
import { Bar2BB1 } from "src/bar2/bb1/Bar2BB1.js"; // not allowed
import { Foo1BB1 } from "src/foo1/bb1/Foo1BB1.js"; // not allowed

AnotherFoo2BB1;
Bar1BB1;
Bar2BB1;
Foo1BB1;

export const Foo2BB1 = {};
