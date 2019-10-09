import "dotenv/config";
import express, { Express } from "express";
import loadRoutes from "./utils/load-routes";
import cors from "cors";
import rateLimit from "./config/express-rate-limit.config";
import globalExceptionHandler from "./http/middlewares/global-exception-handler.middleware";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";

export const app: Express = express();

async function main(): Promise<void> {
  app.disable("X-Powered-By");
  app.use(morgan("combined"));
  app.use(helmet());
  app.use(compression());
  app.use(express.json());
  app.use(cors());
  app.use(rateLimit);
  app.use(globalExceptionHandler);

  loadRoutes(app);

  await app.listen(process.env.PORT!);
  console.log(`Server listening on PORT: ${process.env.PORT}`);
}
main();
