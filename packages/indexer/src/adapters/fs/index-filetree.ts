import { walk } from "walk-file-tree";
import { File } from "../../models/file";
import * as fs from "fs";
import { Directory } from "../../models/directory";

type Path = string;
export const indexFileTree = async (indexRoot: Path) => {
  for await (const entry of walk({ directory: indexRoot })) {
    const isDirectory = fs.lstatSync(entry).isDirectory();
    if (isDirectory) {
      await Directory.create({
        path: entry
      });
    } else {
      await File.create({
        path: entry,
        filename: entry.substring(entry.lastIndexOf("/") + 1)
      });
    }
  }
};
