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
const addExperienceSchema = yup.object().shape({
    title: yup
        .string()
        .min(5, "title must be at least 5 characters long")
        .max(255, "title can't be longer than 255 characters")
        .required(),
    from: yup.date().required(),
    to: yup.date()
});
exports.default = addExperienceSchema;
