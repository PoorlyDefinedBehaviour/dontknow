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
const userRegisterSchema = yup.object().shape({
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    email: yup
        .string()
        .email()
        .required(),
    password: yup
        .string()
        .min(6, "Password must be at least 6 characters long")
        .max(255, "Password can't be longer than 255 characters")
        .required()
});
exports.default = userRegisterSchema;
