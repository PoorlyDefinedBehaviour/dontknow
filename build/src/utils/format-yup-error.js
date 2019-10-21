"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (error) => error.inner.map(({ path, message }) => ({
    path,
    message
}));
