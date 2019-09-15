import express, { Router } from "express";
import StoreController from "../controllers/Store";
import sessionRequired from "../middlewares/SessionRequired";

const router: Router = express.Router();

router.get("/store", sessionRequired, StoreController.index);
router.get("/store/search", StoreController.search);
router.get("/store/:_id", StoreController.getById);

router.post("/store", sessionRequired, StoreController.register);

router.patch("/store", sessionRequired, StoreController.patch);

router.delete("/store/:_id", sessionRequired, StoreController.delete);

export default router;
