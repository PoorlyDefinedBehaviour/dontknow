"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const token_required_middleware_1 = __importDefault(require("../middlewares/token-required.middleware"));
const research_controller_1 = __importDefault(require("../controllers/research.controller"));
const router = express_1.Router();
router.get("/researchs/:authorId", research_controller_1.default.findAllByAuthorId);
router.get("/research/:_id", research_controller_1.default.findById);
router.post("/research", token_required_middleware_1.default, research_controller_1.default.create);
router.patch("/research/:_id", token_required_middleware_1.default, research_controller_1.default.update);
router.delete("/research/:_id", token_required_middleware_1.default, research_controller_1.default.delete);
exports.default = router;
