"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const yup = __importStar(require("yup"));
const researchRegisterSchema = yup.object().shape({
    title: yup
        .string()
        .min(5, "title must be at least 5 characters long")
        .max(255, "title can't be longer than 255 characters")
        .required(),
    summary: yup
        .string()
        .min(10, "Password must be at least 10 characters long")
        .max(500, "Password can't be longer than 500 characters")
        .required()
});
exports.default = researchRegisterSchema;
