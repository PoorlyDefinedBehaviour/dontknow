"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const user_factory_1 = __importDefault(require("../factories/user.factory"));
const research_factory_1 = __importDefault(require("../factories/research.factory"));
const main_1 = require("../../src/main");
let mockUser;
let mockUserToken;
describe("research test suite", () => {
    beforeAll(async () => {
        const { body } = await supertest_1.default(main_1.server)
            .post("/api/v1/user")
            .send({ payload: user_factory_1.default.createOne() });
        mockUser = body.data.user;
        mockUserToken = body.data.token;
    });
    afterAll(async () => {
        await main_1.server.close();
    });
    test("create one research", async (done) => {
        supertest_1.default(main_1.server)
            .post("/api/v1/research")
            .set("Authorization", `Bearer ${mockUserToken}`)
            .send({ payload: research_factory_1.default.createOne() })
            .expect(201, done);
    });
    test("update one research", async (done) => {
        const { body: research } = await supertest_1.default(main_1.server)
            .post("/api/v1/research")
            .set("Authorization", `Bearer ${mockUserToken}`)
            .send({ payload: research_factory_1.default.createOne() });
        supertest_1.default(main_1.server)
            .patch(`/api/v1/research/${research.data._id}`)
            .set("Authorization", `Bearer ${mockUserToken}`)
            .send({ payload: research_factory_1.default.createOne() })
            .expect(200, done);
    });
    test("get one research by id", async (done) => {
        const { body: research } = await supertest_1.default(main_1.server)
            .post("/api/v1/research")
            .set("Authorization", `Bearer ${mockUserToken}`)
            .send({ payload: research_factory_1.default.createOne() });
        supertest_1.default(main_1.server)
            .get(`/api/v1/research/${research.data._id}`)
            .set("Authorization", `Bearer ${mockUserToken}`)
            .expect(200, done);
    });
    test("get all researchs by author id", async (done) => {
        await supertest_1.default(main_1.server)
            .post("/api/v1/research")
            .set("Authorization", `Bearer ${mockUserToken}`)
            .send({ payload: research_factory_1.default.createOne() });
        await supertest_1.default(main_1.server)
            .post("/api/v1/research")
            .set("Authorization", `Bearer ${mockUserToken}`)
            .send({ payload: research_factory_1.default.createOne() });
        const { body: researchResponseBody } = await supertest_1.default(main_1.server).get(`/api/v1/researchs/${mockUser._id}`);
        expect(researchResponseBody.data.length).toBeGreaterThan(0);
        done();
    });
    test("delete one research", async (done) => {
        const { body: research } = await supertest_1.default(main_1.server)
            .post("/api/v1/research")
            .set("Authorization", `Bearer ${mockUserToken}`)
            .send({ payload: research_factory_1.default.createOne() });
        supertest_1.default(main_1.server)
            .delete(`/api/v1/research/${research.data._id}`)
            .set("Authorization", `Bearer ${mockUserToken}`)
            .expect(204, done);
    });
});
