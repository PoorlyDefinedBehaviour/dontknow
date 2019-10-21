"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const faker_1 = __importDefault(require("faker"));
class ResearchFactory {
}
exports.default = ResearchFactory;
ResearchFactory.createOne = () => ({
    title: `faker.random.alphaNumeric(10)-${Math.random()}`,
    summary: faker_1.default.random.alphaNumeric(10)
});
ResearchFactory.createMany = (quantity) => Array(quantity)
    .fill(null)
    .map((_) => ResearchFactory.createOne());
