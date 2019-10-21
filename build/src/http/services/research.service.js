"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const research_model_1 = __importDefault(require("../../database/models/research.model"));
const yup_validate_1 = __importDefault(require("../../utils/yup-validate"));
const user_service_1 = __importDefault(require("./user.service"));
const research_register_schema_1 = __importDefault(require("../../validation/schemas/research-register.schema"));
class ResearchService {
}
exports.default = ResearchService;
ResearchService.create = async (authorId, payload) => {
    const errors = await yup_validate_1.default(research_register_schema_1.default, payload);
    if (errors) {
        return { ok: false, message: errors };
    }
    const researchAlreadyCreatedByAuthor = await research_model_1.default.findOne({
        $and: [{ authors: authorId }, { title: payload.title }]
    });
    if (researchAlreadyCreatedByAuthor) {
        return { ok: false, message: "Research already registered by this user" };
    }
    const researchToBeCreated = {
        ...payload,
        authors: [authorId]
    };
    const research = await research_model_1.default.create(researchToBeCreated);
    await user_service_1.default.addResearch(authorId, research._id);
    return { ok: true, data: research };
};
ResearchService.findAllByAuthorId = async (authorId) => {
    const researches = await research_model_1.default.find({
        authors: authorId
    });
    return { ok: true, data: researches };
};
ResearchService.findById = async (researchId) => {
    const research = await research_model_1.default.findOne({
        _id: researchId
    });
    return { ok: true, data: research };
};
ResearchService.updateOne = async (authorId, researchId, payload) => {
    const research = await research_model_1.default.findOneAndUpdate({
        $and: [
            { authors: authorId },
            {
                _id: researchId
            }
        ]
    }, payload, { new: true });
    if (!research) {
        return { ok: false };
    }
    return { ok: true, data: research };
};
ResearchService.deleteOne = async (authorId, researchId) => {
    await research_model_1.default.deleteOne({
        $and: [{ _id: researchId, authors: authorId }]
    });
    return { ok: true };
};
