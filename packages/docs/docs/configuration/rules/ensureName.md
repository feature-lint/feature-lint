---
sidebar_position: 2
---

# Ensure Name

The ensure name ensures, that building blocks follow a specific naming pattern.

## Reasoning
In projects working with many persons beeing involved, it's neat to have all the persons adhere to some
naming conventions. This is where this rule can help.

## Implementation
The rule is applicable in the **building blocks** section of the configuration.
Its name is **ensure-name**. The rule takes a second parameter called **regEx** which determines
the pattern, a file in this specific building-block should have.

```json
{
  "$schema": "https://raw.githubusercontent.com/feature-lint/feature-lint/pages/schema/feature-lint-v0.0.15.schema.json"
  "rootDir": "./src",
  "featureTypes": {
    "angular": {
      "featureNameMatcher": "angular-.*",
      "buildingBlocks": {
        "service": {
          "rules": [
            {
              "name": "ensure-name",
              "regEx": ".*\\.service\\.ts"
            }
          ]
        },
        "components": {}
      }
    }
  }
}
```

The regEx is the [Regular Expression](https://regex101.com/) pattern, which is applied to each
of the files inside the corresponding building block directory.

The example from above therefore matches all files inside
```text
src/
  angular-dialog/
     services/
        my-dialog.service.ts // this parses the rule
        my-dialog.ts // this fails the rule
```

to match a `.service.ts` naming convention.
