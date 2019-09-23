import { readdirSync } from "fs";
import { join } from "path";

import { Express } from "express-serve-static-core";

export default (app: Express): void => {
  const path: string = join(__dirname, "..", "http", "routes");

  const file_names: string[] = readdirSync(path).map(
    (name: string): string => name.split(".")[0]
  );

  for (const file of file_names) {
    const { default: router } = require(join(path, `${file}.route`));
    app.use("/api/v1/", router);
  }
};
