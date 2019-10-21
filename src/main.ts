import "dotenv/config";
import express, { Express } from "express";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import rateLimit from "./config/express-rate-limit.config";
import globalExceptionHandlerMiddleware from "./http/middlewares/global-exception-handler.middleware";
import loadRoutes from "./utils/load-routes";
import { join } from "path";

export let server: any;

async function main(): Promise<void> {
  const app: Express = express();
  app.use(express.static(join(__dirname, "..", "public")));
  app.disable("X-Powered-By");
  app.use(morgan("combined"));
  app.use(helmet());
  app.use(compression());
  app.use(express.json());
  app.use(cors());
  app.use(rateLimit);
  app.use(globalExceptionHandlerMiddleware);

  loadRoutes(app);

  server = await app.listen(process.env.PORT!);
  console.log(`Server listening on PORT: ${process.env.PORT}`);
}
main();
