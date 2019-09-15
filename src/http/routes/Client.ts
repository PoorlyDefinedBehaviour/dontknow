import express, { Router } from "express";
import ClientController from "../controllers/Client";
import sessionRequired from "../middlewares/SessionRequired";

const router: Router = express.Router();

router.get("/client", sessionRequired, ClientController.index);
router.get("/client/:_id", sessionRequired, ClientController.getById);

router.post("/client", sessionRequired, ClientController.register);

router.patch("/client/:_id", sessionRequired, ClientController.patch);

router.delete("/client/:_id", sessionRequired, ClientController.delete);

export default router;
