import mongoose from "mongoose";

mongoose.set("useCreateIndex", true);
mongoose.set("useFindAndModify", false);

mongoose.connect(
  /test/.test(process.env.NODE_ENV as string)
    ? (process.env.MONGOBD_TEST_URL as string)
    : (process.env.MONGODB_URL as string),
  {
    useCreateIndex: true,
    useNewUrlParser: true,
    keepAlive: true,
    keepAliveInitialDelay: 30000,
    useUnifiedTopology: true
  },
  (error: Error): void => {
    if (error) {
      throw error;
    }
  }
);

export default mongoose;
