---
sidebar_position: 2
---

# Configuration File

The first thing to do after installing FeatureLint is to
create a configuration.

By default, FeatureLint scans a file called `.feature-lint.jsonc` in the root of the project.

```json
{
  "$schema": "https://raw.githubusercontent.com/feature-lint/feature-lint/pages/schema/feature-lint-v0.0.15.schema.json",
  "rootDir": "./src"
}
```

This file shall contain a json object, containing two attributes:

- \$schema: to specify which configuration options actually exist
- rootDir: This setting determines, in which folder feature-lint will ensure structure the feature-structure
