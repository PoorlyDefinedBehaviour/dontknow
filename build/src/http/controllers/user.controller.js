"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_service_1 = __importDefault(require("../services/user.service"));
const http_status_codes_1 = require("http-status-codes");
class UserController {
}
exports.default = UserController;
UserController.getUserById = async (request, response) => {
    const { _id } = request.params;
    const { data } = await user_service_1.default.findUserById(_id);
    return response.status(http_status_codes_1.OK).json({ data });
};
UserController.register = async (request, response) => {
    const { ok, data, message } = await user_service_1.default.register(request.body.payload);
    if (!ok) {
        return response.status(http_status_codes_1.UNPROCESSABLE_ENTITY).json({ message });
    }
    return response.status(http_status_codes_1.CREATED).json({ data });
};
UserController.login = async (request, response) => {
    const { email, password } = request.body.payload;
    const { ok, data } = await user_service_1.default.login(email, password);
    if (!ok) {
        return response
            .status(http_status_codes_1.UNAUTHORIZED)
            .json({ message: http_status_codes_1.getStatusText(http_status_codes_1.UNAUTHORIZED) });
    }
    return response.status(http_status_codes_1.OK).json({ data });
};
UserController.logout = async (request, response) => {
    const { ok } = await user_service_1.default.logout(request.body.tokenPayload);
    if (!ok) {
        return response
            .status(http_status_codes_1.BAD_REQUEST)
            .json({ message: http_status_codes_1.getStatusText(http_status_codes_1.BAD_REQUEST) });
    }
    return response.send();
};
UserController.setUserAvatar = async (request, response) => {
    const userId = request.body.tokenPayload;
    const { ok, data } = await user_service_1.default.setUserAvatar(userId, request.file);
    if (!ok) {
        return response
            .status(http_status_codes_1.BAD_REQUEST)
            .json({ message: http_status_codes_1.getStatusText(http_status_codes_1.BAD_REQUEST) });
    }
    return response.status(http_status_codes_1.OK).json({ data });
};
UserController.addExperience = async (request, response) => {
    const userId = request.body.tokenPayload;
    const { ok, message, data } = await user_service_1.default.addExperience(userId, request.body.payload);
    if (!ok) {
        return response.status(http_status_codes_1.UNPROCESSABLE_ENTITY).json({ message });
    }
    return response.status(http_status_codes_1.OK).json({ data });
};
UserController.removeExperience = async (request, response) => {
    const userId = request.body.tokenPayload;
    const { experienceId } = request.params;
    const { ok, message } = await user_service_1.default.removeExperience(userId, experienceId);
    if (!ok) {
        return response.status(http_status_codes_1.UNPROCESSABLE_ENTITY).json({ message });
    }
    return response.sendStatus(200);
};
UserController.removeUserAvatar = async (request, response) => {
    const userId = request.body.tokenPayload;
    const { ok } = await user_service_1.default.removeUserAvatar(userId);
    if (!ok) {
        return response
            .status(http_status_codes_1.BAD_REQUEST)
            .json({ message: http_status_codes_1.getStatusText(http_status_codes_1.BAD_REQUEST) });
    }
    return response
        .send(http_status_codes_1.NO_CONTENT)
        .json({ message: http_status_codes_1.getStatusText(http_status_codes_1.NO_CONTENT) });
};
UserController.update = async (request, response) => {
    const userId = request.body.tokenPayload;
    const { payload } = request.body;
    const { ok, data } = await user_service_1.default.updateOne(userId, payload);
    if (!ok) {
        return response
            .status(http_status_codes_1.BAD_REQUEST)
            .json({ message: http_status_codes_1.getStatusText(http_status_codes_1.BAD_REQUEST) });
    }
    return response.status(http_status_codes_1.OK).json(data);
};
