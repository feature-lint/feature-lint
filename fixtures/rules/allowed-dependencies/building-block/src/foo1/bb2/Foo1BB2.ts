import { AnotherFoo1BB2 } from "src/foo1/bb2/AnotherFoo1BB2.js"; // allowed
import { Bar1BB1 } from "src/bar1/bb1/Bar1BB1.js"; // allowed
import { Bar1BB2 } from "src/bar1/bb2/Bar1BB2.js"; // allowed
import { Bar2BB1 } from "src/bar2/bb1/Bar2BB1.js"; // not allowed
import { Foo1BB1 } from "src/foo1/bb1/Foo1BB1.js"; // not allowed

AnotherFoo1BB2;
Bar1BB1;
Bar1BB2;
Bar2BB1;
Foo1BB1;

export const Foo1BB2 = {};
