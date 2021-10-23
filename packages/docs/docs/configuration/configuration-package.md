---
sidebar_position: 1
---

# Getting Started

To setup feature-lint the first step is to install the package to the project.

```shell
npm install --save-dev @feature-lint/cli @feature-lint/core
```

After installing, it may be helpful to create a run-script inside the `package.json` to execute the command.

```json
{
  "name": "my-project",
  "version": "0.0.0",
  "private": true,
  "scripts": {
      "feature-lint": "feature-lint"
  },
  "devDependencies": {
    "@feature-lint/cli": "^0.0.15",
    "@feature-lint/core": "^0.0.15"
  }
}
```

The next step is to create a configuration-file to make the feature-lint magic happen. Therefore head to the next step
[Creating a configurations file](./create-configuration.md)
