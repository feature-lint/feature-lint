import { Foo11B11 } from "src/foo1/features/private/foo11/bb1/Foo11BB1.js"; // not allowed
import { Foo21BB1 } from "src/foo2/private/features/foo21/bb1/Foo21BB1.js"; // not allowed
import { Foo31BB1 } from "src/foo3/private/features/private/foo31/bb1/Foo31BB1.js"; // not allowed

Foo11B11;
Foo21BB1;
Foo31BB1;

export const Foo4BB1 = {};
