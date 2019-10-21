"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const express_rate_limit_config_1 = __importDefault(require("./config/express-rate-limit.config"));
const global_exception_handler_middleware_1 = __importDefault(require("./http/middlewares/global-exception-handler.middleware"));
const load_routes_1 = __importDefault(require("./utils/load-routes"));
const path_1 = require("path");
async function main() {
    const app = express_1.default();
    app.use(express_1.default.static(path_1.join(__dirname, "..", "public")));
    app.disable("X-Powered-By");
    app.use(morgan_1.default("combined"));
    app.use(helmet_1.default());
    app.use(compression_1.default());
    app.use(express_1.default.json());
    app.use(cors_1.default());
    app.use(express_rate_limit_config_1.default);
    app.use(global_exception_handler_middleware_1.default);
    load_routes_1.default(app);
    exports.server = await app.listen(process.env.PORT);
    console.log(`Server listening on PORT: ${process.env.PORT}`);
}
main();
