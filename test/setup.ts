import "dotenv/config";
import mongoose from "../src/database/mongo";

afterAll(async () => {
  await mongoose.connection.dropDatabase();
});
