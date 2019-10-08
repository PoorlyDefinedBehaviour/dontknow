import request from "supertest";
import { app } from "../../src/main";

describe("user test suite", () => {
  test("register user", async (done) => {
    request(app)
      .get("/none")
      .expect(404);
  });
});
