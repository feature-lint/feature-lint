import { AnotherFoo3BB1 } from "src/foo3/bb1/AnotherFoo3BB1.js"; // allowed
import { Bar1BB1 } from "src/bar1/bb1/Bar1BB1.js"; // not allowed
import { Bar1BB2 } from "src/bar1/bb2/Bar1BB2.js"; // allowed
import { Bar1BB3 } from "src/bar1/bb3/Bar1BB3.js"; // allowed

AnotherFoo3BB1;
Bar1BB1;
Bar1BB2;
Bar1BB3;

export const Foo3BB1 = {};
