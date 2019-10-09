import request from "supertest";
import UserFactory from "../factories/user.factory";
import ResearchFactory from "../factories/research.factory";
import { server } from "../../src/main";

describe("research test suite", () => {
  test("create one research", async (done) => {
    request(server)
      .post("/api/v1/user")
      .send({ payload: UserFactory.createOne() })
      .end((_, { text }) => {
        const token = JSON.parse(text).data.token;
        request(server)
          .post("/api/v1/research")
          .set("Authorization", `Bearer ${token}`)
          .send({ payload: ResearchFactory.createOne() })
          .expect(201, done);
      });
  });
  afterAll(async () => {
    await server.close();
  });
});
