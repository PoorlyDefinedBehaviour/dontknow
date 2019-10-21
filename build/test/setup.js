"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const mongo_1 = __importDefault(require("../src/database/mongo"));
beforeAll(async () => {
    await mongo_1.default.connection.dropDatabase();
});
