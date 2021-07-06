import * as path from "path";
import { URL } from "url";
import { lint } from "../../lint/lint.js";

describe("noMissingFeatureTypes", () => {
  it("no-default-type", () => {
    const testFilePath = new URL(import.meta.url).pathname;

    const fixtureDirectoryPath = path.resolve(
      testFilePath,
      "../../../../../../fixtures/rules/no-missing-feature-types/no-default-type"
    );

    lint(fixtureDirectoryPath);
  });
});
