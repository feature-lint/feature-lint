---
sidebar_position: 1
---

# Dependencies

A vital rule to ensure architectural decisions are beeing conformed with, is the dependency rule. With the dependency
rule it is possible to specify which features may import which building blocks and what building blocks may import other
building blocks from other features.

## Reasoning

From an architectural perspective it is essential to keep track of the dependencies and ensure that dependency rules are
not broken, which features or building-blocks may have. Therefore we provide a **dependencies** rule, which gets applied
to features and building-blocks and ensures that no illegal imports are made.

## Implementation

To configure the rules for building blocks, a small micro-syntax is available. This Syntax includes

* `*` matches every other building-block or feature
* `@` prefixes building-block names.
* `:` prefixes feature-types names.
* `&` matches this building block
* `!` negates the expression


The general expression therefore is
`$feature:$featureType@$bb`
Where this expression means: in this feature there exists a featureType, which may import bb from exactly 
this feature-type. This match is allowed (Unless there is `!` before the expression).


### BuildingBlock Dependencies

Image the following structure:

```json
{
  "$schema": "https://raw.githubusercontent.com/feature-lint/feature-lint/pages/schema/feature-lint-v0.0.15.schema.json",
  "rootDir": "./src/features",
  "featureTypes": {
    "domain": {
      "featureNameMatcher": "domain-.*",
      "buildingBlocks": {
        "storage-technology": {},
        "business-logic": {}
      }
    }
  }
}
```

Problem Statement: You want to ensure, that the `storage-technology` cannot import anything from other BBs. 
This means in no typescript file inside the `storage-technology` folder shall have an `import from '../business-logic'`
statement.

The corresponding expression would be:

```json
{
  "buildingBlocks": {
    "storage-technology": {
      "rules": [
        {
          "name": "dependencies",
          "criteria": [
            // Shall not allow any import at all
            "!*",
            // But: inside the same feature-type (":&")
            // we can import other files from the BB ("@storage-technology")
            ":&@storage-technology"
          ]
        }
      ]
    },
    "business-logic": {
      "rules": [
        {
          "name": "dependencies",
          "criteria": [
            // Shall allow no import from other BBs at all
            // * means all BBs, ! negates the expression.
            "!*",
            // but: we can import storage-technology building-block
            "@storage-technology"
          ]
        }
      ]
    }
  }
}
```
The rules therefore are additive.

### Feature-types example
There are also usecases, where building-blocks may import other building-blocks from specifc 
feature-types.

Problem statement:
We have a react-feature-type and a domain-feature-type. react-components may import models from 
a domain-feature-type. We therefore maybe have a configuration like the following.

```json
{
  "$schema": "https://raw.githubusercontent.com/feature-lint/feature-lint/pages/schema/feature-lint-v0.0.15.schema.json",
  "rootDir": "./src/features",
  "featureTypes": {
    "react": {
      "components": {}
    },
    "domain": {
      "buildingBlocks": {
        "models": {},
        "do-not-import-from-react": {}
      }
    }
  }
}
```

We now want to ensure, that react-component can only import `models` from domain-features.

```json
{
  "buildingBlocks": {
    "react": {
      "components": {
        "rules": [
          {
            "name": "dependencies",
            "criteria": [
              // disallow all imports
              "!*",
              // but allow imports with the following matching criteria
              // ":domain": match all bbs from domain-feature-type
              // "@model": enable model import
              ":domain@models"
            ]
          }
        ]
      }
    },
    "domain": {
      // ...
    }
  }
}
```

