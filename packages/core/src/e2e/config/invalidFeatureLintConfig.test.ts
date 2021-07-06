import * as path from "path";
import { URL } from "url";
import { lint } from "../../lint/lint.js";

describe("invalidFeatureLintConfig", () => {
  it("syntax-error", () => {
    const testFilePath = new URL(import.meta.url).pathname;

    const fixtureDirectoryPath = path.resolve(
      testFilePath,
      "../../../../../../fixtures/config/invalid-feature-lint-config/syntax-error"
    );

    lint(fixtureDirectoryPath);
  });
});
