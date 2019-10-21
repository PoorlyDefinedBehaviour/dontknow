"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const faker_1 = __importDefault(require("faker"));
class UserFactory {
}
exports.default = UserFactory;
UserFactory.createOne = () => ({
    firstName: `${faker_1.default.random.alphaNumeric(10)}-${Math.random()}`,
    lastName: `${faker_1.default.random.alphaNumeric(10)}-${Math.random()}`,
    email: faker_1.default.internet.email(),
    password: faker_1.default.internet.password()
});
UserFactory.createMany = (quantity) => Array(quantity)
    .fill(null)
    .map((_) => UserFactory.createOne());
