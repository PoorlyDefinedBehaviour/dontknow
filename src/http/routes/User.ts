import express, { Router } from "express";

export const router: Router = express.Router();

import { UserController } from "../controllers/User";

router.get("/user", UserController.index);
router.get("/user/search", UserController.search);
router.get("/user/:_id", UserController.getById);

router.post("/user/register", UserController.register);
router.post("/user/logout", UserController.logout);
router.post("/user/login", UserController.login);
router.post("/user/forgot-password", UserController.forgotPassword);

router.patch("/user/change-password/:token", UserController.changePassword);
router.patch("/user", UserController.update);
router.delete("/user", UserController.delete);
