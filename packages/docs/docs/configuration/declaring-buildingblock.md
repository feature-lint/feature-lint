---
sidebar_position: 4
---

# Declaring a Building Block

Building-Blocks are smaller small units inside a feature. They are therefore a strict sub-part of a feature.
To declare a building block, just add an attribute to the specified feature-type with the name of the building block.

Taking the example from [before](./declaring-feature.md), you can specify different building blocks per framework.
While it may be desirable to have some components and hooks abstractions inside a react-feature, angular has its own 
concepts like services and directives.

:::caution

This structure is for demonstration  purposes only.
We do not strictly endorse this kind of structure for a real world problems, where you might want to find
real architectural building blocks instead of technical ones.

:::

````json
{
  "$schema": "https://raw.githubusercontent.com/feature-lint/feature-lint/pages/schema/feature-lint-v0.0.15.schema.json"
  "rootDir": "./src",
  "featureTypes": {
    "react": {
      "featureNameMatcher": "react-.*"
      "components": { // This line was added
        
      },
      "hooks": {
        
      }
    },
    "angular": {
      "featureNameMatcher": "angular-.*",
      "services": {
        
      },
      "components": {
        
      }
    }
  }
}

````

This creates a new building-block type inside a feature type. The resulting folder structure may look like the following:

```
package.json
src/
  react-foo/
    components/
    hooks/
  react-bar/
    components/
    hooks/
  react-baz/
    components/
    hooks/
  angular-foo/
    services/
    components/
  domain-abc/ 
    models/
```

With each having its own set of rules. Which is, where the real beauty of feature-lint lives.

So, feel free to skip to the [the Rules document](./declaring-rules.md), where we configure dependency rules for our
feature-types and building blocks.
