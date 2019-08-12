import express, { Router } from "express";

export const router: Router = express.Router();

import { StoreController } from "../controllers/Store";

router.get("/store", StoreController.index);
router.get("/store/:_id", StoreController.getById);

router.post("/store", StoreController.register);
