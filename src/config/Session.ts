import ExpressSession from "express-session";
import ConnectRedis from "connect-redis";
import redis from "../Redis";
import { RedisSessionPrefix } from "../Prefixes";

const RedisStore: ConnectRedis.RedisStore = ConnectRedis(ExpressSession);

export default ExpressSession({
  store: new RedisStore({
    client: redis as any,
    prefix: RedisSessionPrefix
  }),
  name: "sid",
  secret: process.env.SESSION_SECRET as string,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "prod",
    maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
  }
});
