#!/usr/bin/env node

import { lint, resolveOnly } from "@feature-lint/core/lint";

import { argv } from "process";

const createDot = (resolveResult: ReturnType<typeof resolveOnly>): string => {
  let dot = "digraph {\n";

  dot += "node [shape=box]\n";

  for (const featureName of resolveResult.resolvedFeatureByName.keys()) {
    dot += `"${featureName}"\n`;
  }

  for (const feature of resolveResult.resolvedFeatureByName.values()) {
    for (const dependencyFeatureName of feature.dependencyModuleFilePathsByFeatureName.keys()) {
      dot += `"${feature.name}" -> "${dependencyFeatureName}"\n`;
    }
  }

  dot += "}";

  return dot;
};

if (argv.length > 2) {
  if (argv[2] === "visualize") {
    const resolveResult = resolveOnly(process.cwd());

    console.log(createDot(resolveResult));

    process.exit(0);
  } else {
    console.error("Unknown command");

    process.exit(1);
  }
}

lint(process.cwd());
