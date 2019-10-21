"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("../../database/models/user.model"));
const yup_validate_1 = __importDefault(require("../../utils/yup-validate"));
const bcryptjs_1 = require("bcryptjs");
const jsonwebtoken_1 = require("jsonwebtoken");
const fs_1 = require("fs");
const user_register_schema_1 = __importDefault(require("../../validation/schemas/user-register.schema"));
const add_experience_1 = __importDefault(require("../../validation/schemas/add-experience"));
const uuid_1 = require("uuid");
class UserService {
}
exports.default = UserService;
UserService.findUserById = async (userId) => {
    const user = await user_model_1.default.findOne({ _id: userId });
    return { ok: true, data: user };
};
UserService.setUserAvatar = async (userId, file) => {
    const user = await user_model_1.default.findOne({ _id: userId });
    user.avatar = file.filename;
    await user.save();
    return { ok: true, data: file.filename };
};
UserService.removeUserAvatar = async (userId) => {
    const user = await user_model_1.default.findOne({ _id: userId });
    const defaultProfileImage = "default-profile-picture.png";
    if (user.avatar == defaultProfileImage) {
        return { ok: true, data: user };
    }
    fs_1.unlink(`${process.cwd()}/public/${user.avatar}`, () => { });
    user.avatar = defaultProfileImage;
    await user.save();
    return { ok: true, data: user };
};
UserService.register = async (payload) => {
    const errors = await yup_validate_1.default(user_register_schema_1.default, payload);
    if (errors) {
        return { ok: false, message: errors };
    }
    const userExists = await user_model_1.default.findOne({
        email: payload.email
    });
    if (userExists) {
        return { ok: false, message: "Email already in use" };
    }
    const user = await user_model_1.default.create(payload);
    const token = await UserService.generateJWTToken(user._id);
    user.token = token;
    await user.save();
    user.password = "";
    user.token = "";
    return { ok: true, data: { user, token } };
};
UserService.login = async (email, password) => {
    const user = await user_model_1.default.findOne({
        email: email
    }).select("+password");
    if (!user) {
        return { ok: false };
    }
    const validPassword = await bcryptjs_1.compare(password, user.password);
    if (!validPassword) {
        return { ok: false };
    }
    const token = await UserService.generateJWTToken(user._id);
    user.token = token;
    await user.save();
    user.password = "";
    user.token = "";
    return { ok: true, data: { user, token } };
};
UserService.logout = async (userId) => {
    await user_model_1.default.findOneAndUpdate({ _id: userId }, { token: "" });
    return { ok: true };
};
UserService.addResearch = async (userId, researchId) => {
    const user = await user_model_1.default.findOne({ _id: userId });
    if (user) {
        user.researches.push(researchId);
        await user.save();
    }
};
UserService.addExperience = async (userId, payload) => {
    const errors = await yup_validate_1.default(add_experience_1.default, payload);
    if (errors) {
        return { ok: false, message: errors };
    }
    const user = await user_model_1.default.findOne({ _id: userId });
    const id = uuid_1.v4();
    if (user) {
        user.experiences.push({ ...payload, id });
        await user.save();
    }
    return { ok: true, data: { id } };
};
UserService.removeExperience = async (userId, experienceId) => {
    const user = await user_model_1.default.findOne({
        _id: userId
    });
    if (user) {
        user.experiences = user.experiences.filter((exp) => exp.id === experienceId);
        await user.save();
    }
    return { ok: true };
};
UserService.updateOne = async (userId, payload) => {
    const user = await user_model_1.default.findOneAndUpdate({ _id: userId }, { $set: payload }, {
        new: true
    });
    if (!user) {
        return { ok: false };
    }
    return { ok: true, data: user };
};
UserService.isTokenValid = async (userId, token) => {
    const user = await user_model_1.default.findOne({
        _id: userId
    }).select("+token");
    return user.token === token;
};
UserService.generateJWTToken = async (userId) => await jsonwebtoken_1.sign({ userId }, process.env.JWT_SECRET);
