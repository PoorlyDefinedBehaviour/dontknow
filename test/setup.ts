import "dotenv/config";
import mongoose from "../src/database/mongo";

beforeAll(async () => {
  await mongoose.connection.dropDatabase();
});
