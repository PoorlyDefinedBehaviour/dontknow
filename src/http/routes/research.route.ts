import { Router } from "express";
import tokenRequired from "../middlewares/token-required.middleware";
import ResearchController from "../controllers/research.controller";

const router: Router = Router();

router.get("/researchs/:authorId", ResearchController.findAllByAuthorId);
router.get("/research/:_id", ResearchController.findById);

router.post("/research", tokenRequired, ResearchController.create);

router.patch("/research/:_id", tokenRequired, ResearchController.update);

router.delete("/research/:_id", tokenRequired, ResearchController.delete);

export default router;
