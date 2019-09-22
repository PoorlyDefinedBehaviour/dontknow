import express, { Router } from "express";
import UserController from "../controllers/User.controller";
import sessionRequired from "../middlewares/SessionRequired";

const router: Router = express.Router();

router.get("/user", UserController.index);
router.get("/user/search", UserController.search);
router.get("/user/:_id", UserController.getById);

router.post("/user/register", UserController.register);
router.post("/user/logout", UserController.logout);
router.post("/user/login", UserController.login);
router.post("/user/forgot-password", UserController.forgotPassword);

router.patch("/user/change-password/:token", UserController.changePassword);

router.patch("/user", sessionRequired, UserController.update);
router.delete("/user", sessionRequired, UserController.delete);

export default router;
