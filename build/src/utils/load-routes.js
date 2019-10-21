"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
exports.default = (app) => {
    const path = path_1.join(__dirname, "..", "http", "routes");
    const file_names = fs_1.readdirSync(path).map((name) => name.split(".")[0]);
    for (const file of file_names) {
        const { default: router } = require(path_1.join(path, `${file}.route`));
        app.use("/api/v1/", router);
    }
};
