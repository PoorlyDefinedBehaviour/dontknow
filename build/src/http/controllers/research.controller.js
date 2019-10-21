"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const research_service_1 = __importDefault(require("../services/research.service"));
const http_status_codes_1 = require("http-status-codes");
class ResearchController {
}
exports.default = ResearchController;
ResearchController.create = async (request, response) => {
    const userId = request.body.tokenPayload;
    const { ok, data, message } = await research_service_1.default.create(userId, request.body.payload);
    if (!ok) {
        return response.status(http_status_codes_1.UNPROCESSABLE_ENTITY).json({ message });
    }
    return response.status(http_status_codes_1.CREATED).json({ data });
};
ResearchController.findAllByAuthorId = async (request, response) => {
    const { authorId, authroId } = request.params;
    const { data } = await research_service_1.default.findAllByAuthorId(authorId || authroId);
    return response.status(http_status_codes_1.OK).json({ data });
};
ResearchController.findById = async (request, response) => {
    const { _id } = request.params;
    const { data } = await research_service_1.default.findById(_id);
    return response.status(http_status_codes_1.OK).json({ data });
};
ResearchController.findOne = async (request, response) => {
    const userId = request.body.tokenPayload;
    const { _id } = request.params;
    await research_service_1.default.deleteOne(userId, _id);
    return response.status(http_status_codes_1.NO_CONTENT).json();
};
ResearchController.update = async (request, response) => {
    const userId = request.body.tokenPayload;
    const { _id } = request.params;
    const { payload } = request.body;
    const { ok, data } = await research_service_1.default.updateOne(userId, _id, payload);
    if (!ok) {
        return response
            .status(http_status_codes_1.NOT_FOUND)
            .json({ message: http_status_codes_1.getStatusText(http_status_codes_1.NOT_FOUND) });
    }
    return response.status(http_status_codes_1.OK).json(data);
};
ResearchController.delete = async (request, response) => {
    const userId = request.body.tokenPayload;
    const { _id } = request.params;
    await research_service_1.default.deleteOne(userId, _id);
    return response.status(http_status_codes_1.NO_CONTENT).json();
};
