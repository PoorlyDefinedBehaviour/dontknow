import Mongoose from "mongoose";

Mongoose.set("useCreateIndex", true);
Mongoose.set("useFindAndModify", false);

Mongoose.connect(
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

export default Mongoose;
