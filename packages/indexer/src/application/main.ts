import { indexFileTree } from "../adapters/fs/index-filetree";
import { indexFeatureLintConfig } from "../adapters/core/indexFeatureLintConfig";
import { initialize } from "../models/sequelize";

var running = true;

function killProcess() {
  running = false;
}

process.on("SIGTERM", killProcess);
process.on("SIGINT", killProcess);
process.on("uncaughtException", function(e) {
  console.log("[uncaughtException] app will be terminated: ", e.stack);
  killProcess();
});

function run() {
  setTimeout(function() {
    if (running) run();
  }, 200);
}

export const indexProject = async () => {
  await initialize();
  await indexFileTree(
    "/Users/larskolpin-freese/workspace/feature-lint/packages/indexer/fixture"
  );
  await indexFeatureLintConfig(
    "/Users/larskolpin-freese/workspace/feature-lint/packages/indexer/fixture/.feature-lint.jsonc"
  );
};

indexProject();
//run();
