---
sidebar_position: 3
---

# Declaring a Feature
After creating a configuration file, the first thing you may want to do, is to declare the specified feature-types.
You can specify **feature-types** by adding a `featureTypes attribute to the root configuration.

For the following, imagine the following project structure.

```
package.json
src/
  react-foo
  react-bar
  react-baz
  vue-foo
  domain-abc
```

I this case, the project may consist of some features beeing implemented by react(react-), some by vue(vue), and some containing
pure javascript logic (domain). The first thing to do, is to delcare these feature types. 
To create a feature-type, a attribute **featureTypes** has to be added to the root config. This object contains 
different keys, corresponding to the name, the feature-type shall have. Following the example from above,
the following configuration gets created.

````json
{
  "$schema": "https://raw.githubusercontent.com/feature-lint/feature-lint/pages/schema/feature-lint-v0.0.15.schema.json"
  "rootDir": "./src",
  "featureTypes": {
    "react": { // This line was added
      
    },
    "vue": { // This line was added

    },
    "angular": { // This line was added

    },
    "domain": { // This line was added

    }
  }
}
````

This tells feature-lint, that there are essentially three types of possible feature-types: react, angular and domain.

## Make Feature-lint aware
The next step to do is, to tell that feature-lint which folder is of which feature-type. Therefore two ways exist:

### Option 1: Adding a name matcher for features
By adding a `featureNameMatcher`-attribute to the declared feature-type it is possible to make feature-lint infer the 
feature-type of a folder based on its name.
The `featureNameMatcher`-attribute takes an RegExpression to determine the feature type. Using this approach,
the resulting configuration file may look like the following:

````json
{
  "$schema": "https://raw.githubusercontent.com/feature-lint/feature-lint/pages/schema/feature-lint-v0.0.15.schema.json"
  "rootDir": "./src",
  "featureTypes": {
    "react": { 
      "featureNameMatcher": "react-.*" // This line was added
    },
    "angular": { 
      "featureNameMatcher": "angular-.*" // This line was added
    },
    "domain": { 
      "featureNameMatcher": "domain-.*"// This line was added
    }
  }
}
````




### Option 2: Declaring a feature using .feature.jsonc 
This option requires the file tree to add a file named `.feature.jsonc` to each folder inside the project.
   
```
package.json
src/
  react-foo/
    .feature.jsonc
  react-bar/
     .feature.jsonc
  react-baz/
     .feature.jsonc
  angular-foo/
     .feature.jsonc
  domain-abc/ 
     .feature.jsonc
```
This file may contain the information of the feature-type. The content of such file looks like this:

```json
{
  "$schema": "../../../../../../packages/schema/dist/feature.schema.json",

  "featureType": "react"
}
```




To get a full view of rules, which exist please consult [the rules document](./declaring-rules.md)
