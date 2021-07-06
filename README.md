
# Feature Lint

Feature lint ensures your applications' architecture is adhered to - by everyone!


# The Why
When working in team, the most important part is to ensure everything works, as the team decides to.
This makes tools, which automatically check decisions, a must.
These tools include eslint or prettier, which ensure the project is
following specific code formatting or styles.

The thing missing, is a tool, which ensures the folders are structured correctly, as well as ensuring 
dependencies beetween them. Also, from a architectural point of view, the team
decies on specific building blocks (e.g. services, entities, repositores etc.). This is when feature lint is born.

Featurelint is a tool exactly tailored for this usecase: Specify building blocks and make everyone on the team follow the rules.

# Getting started

Run 
```sh 
npm install --save-dev @feature-lint/cli
```

to install feature lint to your project.

## Configure the project

The main file of the project is a file named`.feature-lint.jsonc`.
This file contains the definition of a feature and its building blocks needed.
An example may be

```json
{
  "rootDir": "./src/features",

  "featureTypes": {
    "domain": {
      "buildingBlocks": ["interaction", "models"]
    },
    "react-feature": {
      "buildingBlocks": ["components", "state-controller", "interaction-controller", "wired"]
    },
  }
}

```

Where root is the src folder of all the features inside the project.

