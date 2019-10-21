"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = require("jsonwebtoken");
const http_status_codes_1 = require("http-status-codes");
const user_service_1 = __importDefault(require("../services/user.service"));
const decodeToken = async (bearerToken) => {
    try {
        const token = bearerToken.split(" ")[1];
        const payload = await jsonwebtoken_1.verify(token, process.env.JWT_SECRET);
        return { token, payload };
    }
    catch (ex) {
        console.error(ex);
        return null;
    }
};
const tokenRequired = async (request, response, next) => {
    const bearerToken = request.headers.authorization;
    const result = await decodeToken(bearerToken || "");
    if (!result || !result.payload) {
        return response
            .status(http_status_codes_1.UNAUTHORIZED)
            .json({ message: http_status_codes_1.getStatusText(http_status_codes_1.UNAUTHORIZED) });
    }
    const isTokenValid = await user_service_1.default.isTokenValid(result.payload.userId, result.token);
    if (!isTokenValid) {
        return response
            .status(http_status_codes_1.UNAUTHORIZED)
            .json({ message: http_status_codes_1.getStatusText(http_status_codes_1.UNAUTHORIZED) });
    }
    request.body.tokenPayload = result.payload.userId;
    return next();
};
exports.default = tokenRequired;
