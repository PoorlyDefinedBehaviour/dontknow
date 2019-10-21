"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
exports.default = new express_rate_limit_1.default({
    windowMs: 15 * 60 * 1000,
    max: 1000 // limit each IP to 100 requests per windowMs
});
