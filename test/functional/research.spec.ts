import request from "supertest";
import UserFactory from "../factories/user.factory";
import ResearchFactory from "../factories/research.factory";
import { server } from "../../src/main";
import { IUser } from "../../src/database/models/user.model";

let mockUser: IUser;
let mockUserToken: string;

describe("research test suite", () => {
  beforeAll(async () => {
    const { body } = await request(server)
      .post("/api/v1/user")
      .send({ payload: UserFactory.createOne() });

    mockUser = body.data.user;
    mockUserToken = body.data.token;
  });

  afterAll(async () => {
    await server.close();
  });

  test("create one research", async (done) => {
    request(server)
      .post("/api/v1/research")
      .set("Authorization", `Bearer ${mockUserToken}`)
      .send({ payload: ResearchFactory.createOne() })
      .expect(201, done);
  });

  test("update one research", async (done) => {
    const { body: research } = await request(server)
      .post("/api/v1/research")
      .set("Authorization", `Bearer ${mockUserToken}`)
      .send({ payload: ResearchFactory.createOne() });

    request(server)
      .patch(`/api/v1/research/${research.data._id}`)
      .set("Authorization", `Bearer ${mockUserToken}`)
      .send({ payload: ResearchFactory.createOne() })
      .expect(200, done);
  });

  test("get one research by id", async (done) => {
    const { body: research } = await request(server)
      .post("/api/v1/research")
      .set("Authorization", `Bearer ${mockUserToken}`)
      .send({ payload: ResearchFactory.createOne() });

    request(server)
      .get(`/api/v1/research/${research.data._id}`)
      .set("Authorization", `Bearer ${mockUserToken}`)
      .expect(200, done);
  });

  test("get all researchs by author id", async (done) => {
    await request(server)
      .post("/api/v1/research")
      .set("Authorization", `Bearer ${mockUserToken}`)
      .send({ payload: ResearchFactory.createOne() });

    await request(server)
      .post("/api/v1/research")
      .set("Authorization", `Bearer ${mockUserToken}`)
      .send({ payload: ResearchFactory.createOne() });

    const { body: researchResponseBody } = await request(server).get(
      `/api/v1/researchs/${mockUser._id}`
    );

    expect(researchResponseBody.data.length).toBeGreaterThan(0);
    done();
  });

  test("delete one research", async (done) => {
    const { body: researchResponseBody } = await request(server)
      .post("/api/v1/research")
      .set("Authorization", `Bearer ${mockUserToken}`)
      .send({ payload: ResearchFactory.createOne() });

    request(server)
      .delete(`/api/v1/research/${researchResponseBody.data._id}`)
      .set("Authorization", `Bearer ${mockUserToken}`)
      .expect(204, done);
  });
});
