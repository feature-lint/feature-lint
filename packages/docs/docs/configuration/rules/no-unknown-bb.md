---
sidebar_position: 4
---

# No unknown Building blocks

The "no-unknown-building-blocks" ensures, that building blocks are known.

## Reasoning
There are usecases, where you want to ensure, that no "dead" folders exist, which are not 
managed by feature-lint. Therefore a rule `no-unknown-buildingblocks` exists.
This rule makes feature-lint fail, if it encounters folders, which it does not know about.

## Implementation
This rule is applicable to the root of the project.

```json
{
  "$schema": "https://raw.githubusercontent.com/feature-lint/feature-lint/pages/schema/feature-lint-v0.0.15.schema.json"
  "rootDir": "./src",
    "rules": [
      {
        "name": "no-unknown-building-blocks",
        "enabled": true
      }
    ]
}
```

This rule is **enabled=true** by default.

### Example
Given the following config:

```json
{
  "$schema": "https://raw.githubusercontent.com/feature-lint/feature-lint/pages/schema/feature-lint-v0.0.15.schema.json"
  "rootDir": "./src",
  "featureTypes": {
    "react": {
      "featureNameMatcher": "react-.*",
       "buildingBlocks": {
         "components": {}
       }
    }
  }
}
```

And the following tree:

```json
src/
   react-dialog/ // known feature-type: react
     components/ // known bb
     hooks/ // unknown bb: not specified in the configuration
```

Feature-lint would fail, if it encounters `hooks/`.
