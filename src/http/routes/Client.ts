import express, { Router } from "express";

export const router: Router = express.Router();

import { ClientController } from "../controllers/Client";

router.get("/client", ClientController.index);
router.get("/client/:_id", ClientController.getById);

router.patch("/client/:_id", ClientController.patch);

router.post("/client", ClientController.register);

router.delete("/client/:_id", ClientController.delete);
