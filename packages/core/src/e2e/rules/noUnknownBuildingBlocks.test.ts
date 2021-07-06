import * as path from "path";
import { URL } from "url";
import { lint } from "../../lint/lint.js";

describe("noUnknownBuildingBlocks", () => {
  it("unknown-building-blocks", () => {
    const testFilePath = new URL(import.meta.url).pathname;

    const fixtureDirectoryPath = path.resolve(
      testFilePath,
      "../../../../../../fixtures/rules/no-unknown-building-blocks/unknown-building-blocks"
    );

    lint(fixtureDirectoryPath);
  });
});
