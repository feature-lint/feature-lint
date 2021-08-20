import { ResolvedModule } from "../resolve/model/ResolvedModule.js";
import { getResolvedFeature } from "../resolve/operations/getResolvedFeature.js";
import { getResolvedModule } from "../resolve/operations/getResolvedModule.js";
import { RootRuleDefinition } from "../rule/model/RuleDefinition.js";
import { Violation } from "../rule/model/Violation.js";
import { ViolationPrinter } from "../rule/model/ViolationPrinter.js";
import { printImportOrExportOfDependency } from "../rule/print/printImportOrExportOfDependency.js";
import { printViolationTemplate } from "../rule/print/printViolationTemplate.js";

interface CycleFeature {
  featureName: string;

  featureTypeName: string | undefined;

  sampleDependentModule: ResolvedModule;

  dependenyModuleCount: number;

  sampleDependencyModule: ResolvedModule;
}

export interface NoCyclicFeatureDependencyViolationData {
  cycle: CycleFeature[];
}

const noCyclicFeatureDependencyViolationPrinter: ViolationPrinter<NoCyclicFeatureDependencyViolationData> =
  (printer, violation, resolveResult) => {
    const { cycle } = violation.data;

    printViolationTemplate(
      printer,
      violation,
      printer.format`Cyclic dependency between ${cycle.length} features detected`,
      () => {
        printer.text`Detected dependency cycle:`;

        printer.blankLine();

        printer.indent();

        printer.text`${cycle
          .map(
            (cycleFeature) =>
              printer.format`{bold ${cycleFeature.featureName}} {dim (${
                cycleFeature.featureTypeName ?? "?"
              })}`
          )
          .join(" -> ")} -> ${printer.format`{bold ${
          cycle[0].featureName
        }} {dim (${cycle[0].featureTypeName ?? "?"})}`}`;

        printer.unindent();

        printer.blankLine();

        printer.text`Caused by these imported modules:`;

        // printer.indent();

        printer.blankLine();

        for (
          let cycleFeatureIndex = 0;
          cycleFeatureIndex < cycle.length;
          cycleFeatureIndex++
        ) {
          const cycleFeature = cycle[cycleFeatureIndex];

          printer.text`${cycleFeatureIndex + 1}. ${printer.format`{bold ${
            cycleFeature.featureName
          }} {dim (${cycleFeature.featureTypeName ?? "?"})}`}`;

          printer.blankLine();

          printer.indent();

          printImportOrExportOfDependency(
            printer,
            cycleFeature.sampleDependentModule,
            cycleFeature.sampleDependencyModule
          );

          if (cycleFeature.dependenyModuleCount > 1) {
            printer.blankLine();

            printer.text`and {bold ${
              cycleFeature.dependenyModuleCount - 1
            }} other imported module(s).`;

            printer.blankLine();
          }

          printer.unindent();

          printer.blankLine();
        }

        // printer.unindent();

        printer.blankLine();

        // printer.text`${JSON.stringify(violation)}`;
      }
    );
  };

export const noCyclicFeatureDependencyRuleDefinition: RootRuleDefinition<
  {},
  NoCyclicFeatureDependencyViolationData
> = {
  name: "no-cyclic-feature-dependency",

  type: "root",

  evaluate: (ruleConfig, resolveResult) => {
    const featureNames = Array.from(resolveResult.resolvedFeatureByName.keys());

    const getFeatureDependencies = (featureName: string): string[] => {
      return Array.from(
        getResolvedFeature(
          resolveResult,
          featureName
        ).dependencyModuleFilePathsByFeatureName.keys()
      );
    };

    const cycles = detectCycles(featureNames, getFeatureDependencies);

    const violations: Violation<NoCyclicFeatureDependencyViolationData>[] = [];

    for (const cycle of cycles) {
      const cyclesFeatures: CycleFeature[] = cycle.map((featureName, index) => {
        const feature = getResolvedFeature(resolveResult, featureName);

        const nextFeatureName = cycle[(index + 1) % cycle.length];

        const dependencyModuleFilePaths =
          feature.dependencyModuleFilePathsByFeatureName.get(nextFeatureName)!;

        const firstDependencyModuleFilePath = Array.from(
          dependencyModuleFilePaths.values()
        )[0];

        const firstDependencyModule = getResolvedModule(
          resolveResult,
          firstDependencyModuleFilePath
        );

        const firstDependentModuleFilePath = Array.from(
          firstDependencyModule.dependentModuleFilesPaths
        ).find((moduleFilePath) => {
          const module = getResolvedModule(resolveResult, moduleFilePath);

          if (!("featureName" in module)) {
            return false;
          }

          return module.featureName === featureName;
        })!;

        const firstDependentModule = getResolvedModule(
          resolveResult,
          firstDependentModuleFilePath
        );

        return {
          featureName,
          featureTypeName: feature.featureTypeName,
          sampleDependentModule: firstDependentModule,
          dependenyModuleCount: dependencyModuleFilePaths.size,
          sampleDependencyModule: firstDependencyModule,
        };
      });

      const violation: Violation<NoCyclicFeatureDependencyViolationData> = {
        ruleName: "no-cyclic-feature-dependency",
        ruleScope: "root",
        severity: "error",
        data: {
          cycle: cyclesFeatures,
        },
      };

      violations.push(violation);
    }

    return violations;
  },

  printViolation: noCyclicFeatureDependencyViolationPrinter,
};

export const detectCycles = (
  vertices: string[],
  getDependencyVertices: (vertex: string) => string[]
): Set<string[]> => {
  const stronglyConnectedComponents = computeStronglyConnectedComponents(
    vertices,
    getDependencyVertices
  );

  const allCycles = new Set<string[]>();

  for (const [rootVertex, vertexSet] of stronglyConnectedComponents.entries()) {
    // Ignore trivial strongly connected components
    if (vertexSet.size === 1) {
      continue;
    }

    computeElementaryCycles(
      rootVertex,
      Array.from(vertexSet),
      getDependencyVertices
    ).forEach((cycles) => {
      allCycles.add(cycles);
    });
  }

  return allCycles;
};

/**
 * Based on: https://en.wikipedia.org/w/index.php?title=Tarjan%27s_strongly_connected_components_algorithm&oldid=1037959811#The_algorithm_in_pseudocode
 */
export const computeStronglyConnectedComponents = (
  vertices: string[],
  getDependencyVertices: (vertex: string) => string[]
): Map<string, Set<string>> => {
  interface VertexInfo {
    index: number;
    lowlink: number;
    onStack: boolean;
  }

  const vertexInfoByVertex = new Map<string, VertexInfo>();

  const stronglyConnectedComponents: Map<string, Set<string>> = new Map();

  let index = 0;

  const vertexStack: string[] = [];

  const strongconnect = (vertex: string) => {
    const vertexInfo: VertexInfo = { index, lowlink: index, onStack: true };

    vertexInfoByVertex.set(vertex, vertexInfo);

    index++;

    vertexStack.push(vertex);

    for (const dependencyVertex of getDependencyVertices(vertex)) {
      if (!vertexInfoByVertex.has(dependencyVertex)) {
        strongconnect(dependencyVertex);

        const dependencyVertexInfo = vertexInfoByVertex.get(dependencyVertex)!;

        vertexInfo.lowlink = Math.min(
          vertexInfo.lowlink,
          dependencyVertexInfo.lowlink
        );
      } else if (vertexInfoByVertex.get(dependencyVertex)?.onStack) {
        const dependencyVertexInfo = vertexInfoByVertex.get(dependencyVertex)!;

        vertexInfo.lowlink = Math.min(
          vertexInfo.lowlink,
          dependencyVertexInfo.index
        );
      }
    }

    if (vertexInfo.lowlink === vertexInfo.index) {
      const newStronglyConnectedComponent = new Set<string>();

      while (true) {
        const otherVertex = vertexStack.pop()!;

        const otherVertexInfo = vertexInfoByVertex.get(otherVertex)!;

        otherVertexInfo.onStack = false;

        newStronglyConnectedComponent.add(otherVertex);

        if (otherVertex === vertex) {
          break;
        }
      }

      stronglyConnectedComponents.set(vertex, newStronglyConnectedComponent);
    }
  };

  for (const vertex of vertices) {
    if (!vertexInfoByVertex.has(vertex)) {
      strongconnect(vertex);
    }
  }

  return stronglyConnectedComponents;
};

class DefaultMap<KEY, VALUE> extends Map<KEY, VALUE> {
  constructor(private createDefaultValue: () => VALUE) {
    super();
  }

  get(key: KEY): VALUE {
    const value = super.get(key);

    if (super.has(key)) {
      return super.get(key)!;
    }

    const newValue = this.createDefaultValue();

    super.set(key, newValue);

    return newValue;
  }
}

/**
 * Based on: https://sci-hub.do/10.1137/0204007
 */
export const computeElementaryCycles = (
  startVertex: string,
  vertices: string[],
  getDependencyVertices: (vertex: string) => string[]
) => {
  const cycles = new Set<string[]>();

  const A = getDependencyVertices;
  const B = new DefaultMap<string, Set<string>>(() => new Set());

  const blocked = new DefaultMap<string, boolean>(() => false);

  let stack: string[] = [];

  let s = startVertex;

  const circuit = (v: string): boolean => {
    let f: boolean;

    const unblock = (u: string) => {
      blocked.set(u, false);

      for (const w of B.get(u)) {
        B.get(u).delete(w);

        if (blocked.get(w)) {
          unblock(w);
        }
      }
    };

    f = false;

    stack.push(v);

    blocked.set(v, true);

    for (const w of A(v)) {
      if (w === s) {
        cycles.add([...stack]);

        f = true;
      } else if (!blocked.get(w)) {
        if (circuit(w)) {
          f = true;
        }
      }
    }

    if (f) {
      unblock(v);
    } else {
      for (const w of A(v)) {
        if (!B.get(w).has(v)) {
          B.get(w).add(v);
        }
      }
    }

    const vIndex = stack.indexOf(v);

    stack.splice(vIndex, 1);

    return f;
  };

  circuit(s);

  return cycles;
};
