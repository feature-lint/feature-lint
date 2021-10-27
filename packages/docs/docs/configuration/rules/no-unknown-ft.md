---
sidebar_position: 3
---

# No  missing feature-types

The "no-missing-feature-types" ensures, that feature-types are known.

## Reasoning
There are usecases, where you want to ensure, that no "dead" folders exist, which are not 
managed by feature-lint. Therefore a rule `no-missing-feature-types exists.
This rule makes feature-lint fail, if it encounters feature-type folders, which it does not know about.

## Implementation
This rule is applicable to the root of the project.


```json
{
  "$schema": "https://raw.githubusercontent.com/feature-lint/feature-lint/pages/schema/feature-lint-v0.0.15.schema.json"
  "rootDir": "./src",
    "rules": [
      {
        "name": "no-missing-feature-types",
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
      "featureNameMatcher": "react-.*"
       // ...
    }
  }
}
```

And the following tree:

```json
src/
   this-is-not-known/ // feature-type not defined
   react-dialog/ // known feature-type: react
```

Feature-lint would fail, if it encounters `this-is-not-known`.
