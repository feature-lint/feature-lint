import * as path from "path";
import { URL } from "url";
import { lint } from "../../lint/lint.js";

describe("restrictedVisibility", () => {
  it("building-blocks", () => {
    const testFilePath = new URL(import.meta.url).pathname;

    const fixtureDirectoryPath = path.resolve(
      testFilePath,
      "../../../../../../fixtures/rules/restricted-visibility/building-blocks"
    );

    lint(fixtureDirectoryPath);
  });

  it("building-blocks-public", () => {
    const testFilePath = new URL(import.meta.url).pathname;

    const fixtureDirectoryPath = path.resolve(
      testFilePath,
      "../../../../../../fixtures/rules/restricted-visibility/building-blocks-public"
    );

    lint(fixtureDirectoryPath);
  });

  it("features", () => {
    const testFilePath = new URL(import.meta.url).pathname;

    const fixtureDirectoryPath = path.resolve(
      testFilePath,
      "../../../../../../fixtures/rules/restricted-visibility/features"
    );

    lint(fixtureDirectoryPath);
  });

  it("features-public", () => {
    const testFilePath = new URL(import.meta.url).pathname;

    const fixtureDirectoryPath = path.resolve(
      testFilePath,
      "../../../../../../fixtures/rules/restricted-visibility/features-public"
    );

    lint(fixtureDirectoryPath);
  });
});
