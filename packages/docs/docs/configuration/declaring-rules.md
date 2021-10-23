---
sidebar_position: 5
---

# Declaring Rules
:::caution

This document is under construction

::: 

After understanding, what **features** and **building-blocks** are, are vital part of feature-lint is to ensure
rules, allowed relationships, between building blocks and features are adhered to.

We there provide rules, which can be used.

* dependencies

## Dependencies
A vital rule to ensure architectural decisions are beeing conformed with, is the dependency rule.
With the dependency rule it is possible to specify which features may import which building blocks
and what building blocks may import other building blocks from other features.

To configure the rules for building blocks, a small micro-syntax is available. This Syntax includes

* `*` matches every other building-block or feature
* `@` matches all building-blocks in the same feature
* `&`
* `!` negates the expression

### FeatureType Dependencies
You can specify dependencies on feature-type level. Therefore you have to add a rules-attribute, to the corresponding
feature-type.

### BuildingBlock Dependencies





