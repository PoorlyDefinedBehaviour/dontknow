import "dotenv/config";
import mongoose from "../src/database/mongodb";

afterAll(async () => {
  await mongoose.connection.dropDatabase();
});
