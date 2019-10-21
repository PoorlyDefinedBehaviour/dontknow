"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const crypto_1 = require("crypto");
const storageTypes = {
    local: multer_1.default.diskStorage({
        destination: `${process.cwd()}/public`,
        filename: (_, file, callback) => {
            crypto_1.randomBytes(16, (error, hash) => {
                if (error)
                    callback(error, "");
                const key = `${hash.toString("hex")}-${file.originalname}`;
                callback(null, key);
            });
        }
    }),
    limits: {
        fileSize: 2 * 1024 * 1024
    },
    fileFilter: (_, file, callback) => {
        const allowedMimes = [
            "image/jpeg",
            "image/pjpeg",
            "image/png",
            "image/gif"
        ];
        if (allowedMimes.includes(file.mimetype)) {
            callback(null, true);
        }
        else {
            callback(new Error("Invalid fyle type"));
        }
    }
};
const multerConfig = {
    dest: `${process.cwd()}/public`,
    storage: storageTypes["local"],
    limits: {
        fileSize: 2 * 1024 * 1024
    },
    fileFilter: (_, file, callback) => {
        const allowedMimes = [
            "image/jpeg",
            "image/pjpeg",
            "image/png",
            "image/gif"
        ];
        if (allowedMimes.includes(file.mimetype)) {
            callback(null, true);
        }
        else {
            callback(new Error("Invalid file type"));
        }
    }
};
exports.default = multerConfig;
