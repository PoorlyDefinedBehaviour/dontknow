"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongo_1 = __importDefault(require("../mongo"));
const researchSchema = new mongo_1.default.Schema({
    authors: {
        type: [mongo_1.default.Schema.Types.ObjectId],
        required: true,
        unique: false,
        select: true
    },
    title: {
        type: String,
        required: true,
        unique: false,
        select: true
    },
    summary: {
        type: String,
        required: true,
        unique: false,
        select: true
    },
    link: {
        type: String,
        required: false,
        unique: false,
        select: true
    }
}, {
    timestamps: true
});
exports.default = mongo_1.default.model("Research", researchSchema);
