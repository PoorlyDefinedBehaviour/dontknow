"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
exports.default = (error, _, response, __) => {
    console.error(error);
    return /prod/gi.test(process.env.NODE_ENV)
        ? response
            .status(http_status_codes_1.INTERNAL_SERVER_ERROR)
            .json({ message: http_status_codes_1.getStatusText(http_status_codes_1.INTERNAL_SERVER_ERROR) })
        : response.status(http_status_codes_1.INTERNAL_SERVER_ERROR).json({ message: error });
};
