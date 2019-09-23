import mongoose from "mongoose";

mongoose.set("useCreateIndex", true);
mongoose.set("useFindAndModify", false);

console.log(`db connecting to ${process.env.MONGODB_URL}`);
mongoose.connect(
  process.env.MONGODB_URL as string,
  {
    useCreateIndex: true,
    useNewUrlParser: true,
    keepAlive: true,
    keepAliveInitialDelay: 30000
  },
  (error: any): any => {
    if (error) {
      throw error;
    }
  }
);

export default mongoose;
