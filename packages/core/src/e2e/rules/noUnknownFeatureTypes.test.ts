import * as path from "path";
import { URL } from "url";
import { lint } from "../../lint/lint.js";

describe("noUnknownFeatureTypes", () => {
  it("default-type", () => {
    const testFilePath = new URL(import.meta.url).pathname;

    const fixtureDirectoryPath = path.resolve(
      testFilePath,
      "../../../../../../fixtures/rules/no-unknown-feature-types/default-type"
    );

    lint(fixtureDirectoryPath);
  });

  it("no-default-type", () => {
    const testFilePath = new URL(import.meta.url).pathname;

    const fixtureDirectoryPath = path.resolve(
      testFilePath,
      "../../../../../../fixtures/rules/no-unknown-feature-types/no-default-type"
    );

    lint(fixtureDirectoryPath);
  });
});
