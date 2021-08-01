import * as path from "path";
import { URL } from "url";
import { lint } from "../../lint/lint.js";

describe("allowedDependencies", () => {
  it("feature-type", () => {
    const testFilePath = new URL(import.meta.url).pathname;

    const fixtureDirectoryPath = path.resolve(
      testFilePath,
      "../../../../../../fixtures/rules/allowed-dependencies/feature-type"
    );

    lint(fixtureDirectoryPath);
  });

  it("feature", () => {
    const testFilePath = new URL(import.meta.url).pathname;

    const fixtureDirectoryPath = path.resolve(
      testFilePath,
      "../../../../../../fixtures/rules/allowed-dependencies/feature"
    );

    lint(fixtureDirectoryPath);
  });

  it("building-block", () => {
    const testFilePath = new URL(import.meta.url).pathname;

    const fixtureDirectoryPath = path.resolve(
      testFilePath,
      "../../../../../../fixtures/rules/allowed-dependencies/building-block"
    );

    lint(fixtureDirectoryPath);
  });
});
