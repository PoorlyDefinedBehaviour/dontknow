import "dotenv/config";
const mongoose = require("../src/database/mongodb");

afterAll(async () => {
  await mongoose.connection.dropDatabase();
});
