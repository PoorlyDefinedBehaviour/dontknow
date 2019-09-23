import load from "process-env-loader";
load();
import express from "express";
import { Express } from "express-serve-static-core";
import loadRoutes from "./utils/LoadRoutes";
import cors from "cors";
import rateLimit from "./config/RateLimit";
import sessionHandler from "./config/Session";
import globalExceptionHandler from "./http/middlewares/GlobalExceptionHandler";
import morgan from "morgan";

async function main(): Promise<void> {
  const app: Express = express();
  app.disable("X-Powered-By");
  app.use(morgan("combined"));
  app.use(express.json());
  app.use(cors());
  app.use(rateLimit);
  app.use(sessionHandler);
  app.use(globalExceptionHandler);

  loadRoutes(app);

  await app.listen(process.env.PORT!);
  console.log(`Server listening on PORT: ${process.env.PORT}`);
}
main();
