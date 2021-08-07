import * as path from "path";
import { URL } from "url";
import { lint } from "../lint/lint.js";
import * as fs from "fs";

describe("fixtures", () => {
  const testFilePath = new URL(import.meta.url).pathname;

  const categoriesDirectoryPath = path.resolve(
    testFilePath,
    "../../../../../new-fixtures"
  );

  const allCategoryNames = fs.readdirSync(categoriesDirectoryPath);

  for (const categoryName of allCategoryNames) {
    const categoryDirectoryPath = path.join(
      categoriesDirectoryPath,
      categoryName
    );

    const allFixtureNames = fs.readdirSync(categoryDirectoryPath);

    for (const fixtureName of allFixtureNames) {
      it(`${categoryName} – ${fixtureName}`, () => {
        const fixtureDirectoryPath = path.join(
          categoryDirectoryPath,
          fixtureName
        );

        lint(fixtureDirectoryPath);
      });
    }
  }
});
