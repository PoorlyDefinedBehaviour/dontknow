"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const format_yup_error_1 = __importDefault(require("./format-yup-error"));
exports.default = async (schema, object) => {
    try {
        await schema.validate(object, { abortEarly: false });
        return null;
    }
    catch (ex) {
        return format_yup_error_1.default(ex);
    }
};
