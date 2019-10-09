import request from "supertest";
import UserFactory from "../factories/user.factory";
import { server } from "../../src/main";

describe("user test suite", () => {
  test("register user", async (done) => {
    request(server)
      .post("/api/v1/user")
      .send({ payload: UserFactory.createOne() })
      .expect(201, done);
  });

  test("login", async (done) => {
    const user = UserFactory.createOne();

    request(server)
      .post("/api/v1/user")
      .send({ payload: user })
      .end((_, __) => {
        request(server)
          .post("/api/v1/user/login")
          .send({ payload: { email: user.email, password: user.password } })
          .expect(200, done);
      });
  });

  test("logout", async (done) => {
    const user = UserFactory.createOne();

    request(server)
      .post("/api/v1/user")
      .send({ payload: user })
      .end((_, { text }) => {
        const token = JSON.parse(text).data.token;
        request(server)
          .post("/api/v1/user/logout")
          .set("Authorization", `Bearer ${token}`)
          .send()
          .expect(200, done);
      });
  });

  test("update one user", async (done) => {
    const user = UserFactory.createOne();
    const newEmail = "newemail@newemail.com";

    request(server)
      .post("/api/v1/user")
      .send({ payload: user })
      .end((_, { text }) => {
        const token = JSON.parse(text).data.token;
        request(server)
          .patch("/api/v1/user")
          .set("Authorization", `Bearer ${token}`)
          .send({ payload: { email: newEmail } })
          .expect(200, done);
      });
  });

  afterAll(async () => {
    await server.close();
  });
});
