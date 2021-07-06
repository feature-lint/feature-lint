import * as path from "path";
import { URL } from "url";
import { lint } from "../../lint/lint.js";

describe("invalidFeatureConfig", () => {
  it("syntax-error", () => {
    const testFilePath = new URL(import.meta.url).pathname;

    const fixtureDirectoryPath = path.resolve(
      testFilePath,
      "../../../../../../fixtures/config/invalid-feature-config/syntax-error"
    );

    lint(fixtureDirectoryPath);
  });
});
