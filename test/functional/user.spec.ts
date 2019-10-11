import request from "supertest";
import UserFactory from "../factories/user.factory";
import { server } from "../../src/main";

describe("user test suite", () => {
  afterAll(async () => {
    await server.close();
  });

  test("register user", (done) => {
    request(server)
      .post("/api/v1/user")
      .send({ payload: UserFactory.createOne() })
      .expect(201, done);
  });

  test("get user by id", async (done) => {
    const { body } = await request(server)
      .post("/api/v1/user")
      .send({ payload: UserFactory.createOne() });

    const { body: getUserResponseBody } = await request(server).get(
      `/api/v1/user/${body.data.user._id}`
    );

    expect(body.data.user._id).toBe(getUserResponseBody.data._id);
    done();
  });

  test("login", async (done) => {
    const user = UserFactory.createOne();

    await request(server)
      .post("/api/v1/user")
      .send({ payload: user });

    request(server)
      .post("/api/v1/user/login")
      .send({ payload: { email: user.email, password: user.password } })
      .expect(200, done);
  });

  test("logout", async (done) => {
    const user = UserFactory.createOne();

    const { body } = await request(server)
      .post("/api/v1/user")
      .send({ payload: user });

    request(server)
      .post("/api/v1/user/logout")
      .set("Authorization", `Bearer ${body.data.token}`)
      .send()
      .expect(200, done);
  });

  test("update one user", async (done) => {
    const user = UserFactory.createOne();
    const newEmail = "newemail@newemail.com";

    const { body } = await request(server)
      .post("/api/v1/user")
      .send({ payload: user });

    request(server)
      .patch("/api/v1/user")
      .set("Authorization", `Bearer ${body.data.token}`)
      .send({ payload: { email: newEmail } })
      .expect(200, done);
  });
});
