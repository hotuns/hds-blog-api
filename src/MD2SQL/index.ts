import Db from "../glues/connection";
import fs from "fs";

import path from "path";
import shell from "shelljs";
import os from "os";

const rootPath = "/Users/hds/Documents/blog资源/《Python》笔记/ ";

// 打包 npm run build

export function md2sql() {
  fs.readdirSync(rootPath).forEach((file) => {
    const fullPath = path.join(rootPath, file);
    console.log(fullPath);
  });
}
