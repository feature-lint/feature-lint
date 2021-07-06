import { AnotherFoo1BB3 } from "src/foo1/bb3/AnotherFoo1BB3.js"; // allowed
import { Bar1BB1 } from "src/bar1/bb1/Bar1BB1.js"; // allowed
import { Bar1BB2 } from "src/bar1/bb2/Bar1BB2.js"; // not allowed
import { Foo1BB1 } from "src/foo1/bb1/Foo1BB1.js"; // allowed
import { Foo1BB2 } from "src/foo1/bb2/Foo1BB2.js"; // not allowed

AnotherFoo1BB3;
Bar1BB1;
Bar1BB2;
Foo1BB1;
Foo1BB2;

export const Foo1BB3 = {};
