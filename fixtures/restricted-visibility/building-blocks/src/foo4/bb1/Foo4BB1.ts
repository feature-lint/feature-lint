import { Foo1BB1 } from "src/foo1/bb1/private/Foo1BB1.js"; // not allowed
import { Foo2BB1 } from "src/foo2/private/bb1/Foo2BB1.js"; // not allowed
import { Foo3BB1 } from "src/foo3/private/bb1/private/Foo3BB1.js"; // not allowed

Foo1BB1;
Foo2BB1;
Foo3BB1;

export const Foo4BB1 = {};
