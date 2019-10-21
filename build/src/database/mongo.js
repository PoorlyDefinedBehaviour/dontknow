"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
mongoose_1.default.set("useCreateIndex", true);
mongoose_1.default.set("useFindAndModify", false);
mongoose_1.default.connect(/test/.test(process.env.NODE_ENV)
    ? process.env.MONGOBD_TEST_URL
    : process.env.MONGODB_URL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    keepAlive: true,
    keepAliveInitialDelay: 30000,
    useUnifiedTopology: true
}, (error) => {
    if (error) {
        throw error;
    }
});
exports.default = mongoose_1.default;
