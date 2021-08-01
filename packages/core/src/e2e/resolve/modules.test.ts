import * as path from "path";
import { URL } from "url";
import { lint } from "../../lint/lint.js";

describe("modules", () => {
  it("modules", () => {
    const testFilePath = new URL(import.meta.url).pathname;

    const fixtureDirectoryPath = path.resolve(
      testFilePath,
      "../../../../../../fixtures/resolve/modules/modules"
    );

    lint(fixtureDirectoryPath);
  });
});
