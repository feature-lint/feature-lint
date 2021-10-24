
# Feature Lint
[![Build](https://github.com/feature-lint/feature-lint/actions/workflows/build-and-test.yml/badge.svg?branch=master)](https://github.com/feature-lint/feature-lint/actions/workflows/build-and-test.yml)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

Feature lint ensures your applications' structure is adhered to - by everyone!

# Documentation

The full documentation is available at [feature-lint.github.io](https://feature-lint.github.io/feature-lint).

# Reasoning
When working in team, the most important part is to ensure everything works, as the team decides to.
This makes tools, which automatically check decisions, a must.
These tools include eslint or prettier, which ensure the project is
following specific code formatting or styles.

The thing missing, is a tool, which ensures the folders are structured correctly, as well as ensuring 
dependencies beetween them. Also, from a architectural point of view, the team
decies on specific building blocks (e.g. services, entities, repositores etc.). This is when feature lint is born.

Feature-lint is a tool exactly tailored for this usecase: Specify building blocks and make everyone on the team follow the rules.

# Quick Start

Run 
```sh 
npm install --save-dev @feature-lint/cli @feature-lint/core
```

Create a file in the root of the project is a file named`.feature-lint.jsonc`.
This file contains the definition of a feature and its building blocks needed.

Example:

```json
{
  "$schema": "https://raw.githubusercontent.com/feature-lint/feature-lint/pages/schema/feature-lint-v0.0.15.schema.json",
  "rootDir": "./src/features",
  "featureTypes": {
    "react": {
      "featureNameMatcher": "react.*-",
      "buildingBlocks": {
        "components": {
          
        }
      }
    }
  }
}
```

# Licence
This project is licensed using the MIT Licence.
