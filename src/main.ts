import load from "process-env-loader";
load();

import express, { Response, NextFunction } from "express";
import { Express } from "express-serve-static-core";

import RateLimit from "express-rate-limit";

import ExpressSession from "express-session";
import ConnectRedis from "connect-redis";
import ioRedis from "ioredis";

import { LoadRoutes } from "./utils/LoadRoutes";
import { RedisSessionPrefix } from "./Prefixes";

async function main(): Promise<void> {
  const RedisStore: ConnectRedis.RedisStore = ConnectRedis(ExpressSession);

  const redis: ioRedis.Redis = new ioRedis();

  const app: Express = express();

  app.use(express.json());

  app.use(
    new RateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 1000 // limit each IP to 100 requests per windowMs
    })
  );

  app.use(
    ExpressSession({
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
    })
  );

  app.use(
    (request: any, _: any, next: NextFunction): void => {
      request.redis = redis;
      next();
    }
  );

  app.use(
    (_: any, response: Response, next: NextFunction): void => {
      response.header(
        "Access-Control-Allow-Origin",
        (process.env.ENV as string) === "prod"
          ? (process.env.FRONTEND_HOST as string)
          : "*"
      );
      response.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
      );
      next();
    }
  );

  LoadRoutes(app);

  await app.listen((process.env.PORT as unknown) as number);
  console.log(`Server listening on PORT: ${process.env.PORT}`);
}
main();
