---
sidebar_position: 5
---

# Declaring Rules
:::caution

This document is under construction

::: 

After understanding, what **features** and **building-blocks** are, are vital part of feature-lint is to ensure
rules, allowed relationships, between building blocks and features are adhered to.

To implement rules, you need to extend the configuration by adding a **rules** attribute on the
corresponding location.

```json
{
  "$schema": "https://raw.githubusercontent.com/feature-lint/feature-lint/pages/schema/feature-lint-v0.0.15.schema.json"
  "rootDir": "./src",
  "rules": [], // you can have rules here
  "featureTypes": {
    "rules": [],  // or here
    "angular": {
      "rules": [], // or here
      "featureNameMatcher": "angular-.*",
      "services": {
        "rules": [] // or here
      },
      "components": {
      }
    }
  }
}
```

Of course, not all rules make sense in every context. That's why some rules are only available in specific scopes.
The application is dependent of the specific rule.

As of now the following rules are accessible.

* dependencies
* ensureName

