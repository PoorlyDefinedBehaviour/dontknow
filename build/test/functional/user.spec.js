"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const user_factory_1 = __importDefault(require("../factories/user.factory"));
const main_1 = require("../../src/main");
describe("user test suite", () => {
    afterAll(async () => {
        await main_1.server.close();
    });
    test("register user", (done) => {
        supertest_1.default(main_1.server)
            .post("/api/v1/user")
            .send({ payload: user_factory_1.default.createOne() })
            .expect(201, done);
    });
    test("get user by id", async (done) => {
        const { body } = await supertest_1.default(main_1.server)
            .post("/api/v1/user")
            .send({ payload: user_factory_1.default.createOne() });
        const { body: getUserResponseBody } = await supertest_1.default(main_1.server).get(`/api/v1/user/${body.data.user._id}`);
        expect(body.data.user._id).toBe(getUserResponseBody.data._id);
        done();
    });
    test("login", async (done) => {
        const user = user_factory_1.default.createOne();
        await supertest_1.default(main_1.server)
            .post("/api/v1/user")
            .send({ payload: user });
        supertest_1.default(main_1.server)
            .post("/api/v1/user/login")
            .send({ payload: { email: user.email, password: user.password } })
            .expect(200, done);
    });
    test("logout", async (done) => {
        const user = user_factory_1.default.createOne();
        const { body } = await supertest_1.default(main_1.server)
            .post("/api/v1/user")
            .send({ payload: user });
        supertest_1.default(main_1.server)
            .post("/api/v1/user/logout")
            .set("Authorization", `Bearer ${body.data.token}`)
            .send()
            .expect(200, done);
    });
    test("update one user", async (done) => {
        const user = user_factory_1.default.createOne();
        const newEmail = "newemail@newemail.com";
        const { body } = await supertest_1.default(main_1.server)
            .post("/api/v1/user")
            .send({ payload: user });
        supertest_1.default(main_1.server)
            .patch("/api/v1/user")
            .set("Authorization", `Bearer ${body.data.token}`)
            .send({ payload: { email: newEmail } })
            .expect(200, done);
    });
});
