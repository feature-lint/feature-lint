---
sidebar_position: 1
---

# Dependencies
A vital rule to ensure architectural decisions are beeing conformed with, is the dependency rule.
With the dependency rule it is possible to specify which features may import which building blocks
and what building blocks may import other building blocks from other features.

## Reasoning
From an architectural perspective it is essential to keep track of the dependencies and ensure that
dependency rules are not broken, which features or building-blocks may have.
Therefore we provide a **dependencies** rule, which gets applied to features and building-blocks and
ensures that no illegal imports are made.


## Implementation 
To configure the rules for building blocks, a small micro-syntax is available. This Syntax includes

* `*` matches every other building-block or feature
* `@` matches all building-blocks in the same feature
* `&` n/a
* `!` negates the expression

### FeatureType Dependencies
You can specify dependencies on feature-type level. Therefore you have to add a rules-attribute, to the corresponding
feature-type.

#### Example

### BuildingBlock Dependencies
#### Example
