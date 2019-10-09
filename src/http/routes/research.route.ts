import { Router } from "express";
import tokenRequired from "../middlewares/token-required.middleware";
import ResearchController from "../controllers/research.controller";

const router: Router = Router();

router.post("/research", tokenRequired, ResearchController.create);

export default router;
