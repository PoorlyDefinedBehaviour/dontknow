import express, { Router } from "express";
import StoreController from "../controllers/Store";

const router: Router = express.Router();

router.get("/store", StoreController.index);
router.get("/store/search", StoreController.search);
router.get("/store/:_id", StoreController.getById);

router.post("/store", StoreController.register);

router.patch("/store", StoreController.patch);

router.delete("/store/:_id", StoreController.delete);

export default router;
