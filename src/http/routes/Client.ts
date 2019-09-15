import express, { Router } from "express";
import ClientController from "../controllers/Client";

const router: Router = express.Router();

router.get("/client", ClientController.index);
router.get("/client/:_id", ClientController.getById);

router.patch("/client/:_id", ClientController.patch);

router.post("/client", ClientController.register);

router.delete("/client/:_id", ClientController.delete);

export default router;
