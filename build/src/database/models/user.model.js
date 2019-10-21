"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongo_1 = __importDefault(require("../mongo"));
const bcryptjs_1 = require("bcryptjs");
const userSchema = new mongo_1.default.Schema({
    token: {
        type: String,
        required: false,
        unique: false,
        select: false
    },
    avatar: {
        type: String,
        required: false,
        unique: false,
        select: true,
        default: "default-profile-picture.png"
    },
    firstName: {
        type: String,
        required: false,
        unique: false,
        select: true
    },
    lastName: {
        type: String,
        required: false,
        unique: false,
        select: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        select: true
    },
    password: {
        type: String,
        required: true,
        unique: false,
        select: false
    },
    summary: {
        type: String,
        required: false,
        unique: false,
        select: true
    },
    social_network_links: {
        type: [String],
        required: false,
        unique: false,
        select: true
    },
    experiences: [
        {
            id: {
                type: String,
                required: true,
                unique: true,
                select: true
            },
            title: {
                type: String,
                required: true,
                unique: false,
                select: true
            },
            from: {
                type: Date,
                required: true,
                unique: false,
                select: true
            },
            to: {
                type: Date,
                required: false,
                unique: false,
                select: true
            }
        }
    ],
    researches: {
        type: [mongo_1.default.Schema.Types.ObjectId],
        ref: "Research",
        required: false,
        unique: false,
        select: true,
        autopopulate: true
    }
}, {
    timestamps: true
}).plugin(require("mongoose-autopopulate"));
userSchema.pre("save", async function (next) {
    const password = this.get("password");
    if (password && this.isModified("password")) {
        this.set("password", await bcryptjs_1.hash(password, 10));
    }
    next();
});
exports.default = mongo_1.default.model("User", userSchema);
