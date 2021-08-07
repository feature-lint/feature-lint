import { Foo1BB1 } from "src/foo1/bb1/Foo1BB1.js"; // not allowed
import { Foo2BB1 } from "src/foo2/bb1/Foo2BB1.js"; // not allowed
import { Foo3BB1 } from "src/foo3/public/bb1/Foo3BB1.js"; // not allowed

Foo1BB1;
Foo2BB1;
Foo3BB1;

export const Foo4BB1 = {};
