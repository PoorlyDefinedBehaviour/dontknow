import request from "supertest";
import { app } from "../../src/main";
import UserFactory from "../factories/user.factory";

describe("user test suite", () => {
  test("register user", (done) => {
    request(app)
      .post("/api/v1/user")
      .send({ payload: UserFactory.createOne() })
      .expect(201, done);
  });

  test("login", (done) => {
    const user = UserFactory.createOne();

    request(app)
      .post("/api/v1/user")
      .send({ payload: user })
      .end((_, __) => {
        request(app)
          .post("/api/v1/user/login")
          .send({ payload: { email: user.email, password: user.password } })
          .expect(200, done);
      });
  });

  test("logout", (done) => {
    const user = UserFactory.createOne();

    request(app)
      .post("/api/v1/user")
      .send({ payload: user })
      .end((_, { text }) => {
        const token = JSON.parse(text).data.token;
        request(app)
          .post("/api/v1/user/logout")
          .set("Authorization", `Bearer ${token}`)
          .send()
          .expect(200, done);
      });
  });

  test("update one user", (done) => {
    const user = UserFactory.createOne();
    const newEmail = "newemail@newemail.com";

    request(app)
      .post("/api/v1/user")
      .send({ payload: user })
      .end((_, { text }) => {
        const token = JSON.parse(text).data.token;
        request(app)
          .patch("/api/v1/user")
          .set("Authorization", `Bearer ${token}`)
          .send({ payload: { email: newEmail } })
          .expect(200, done);
      });
  });
});
