import { Router } from "express";
import multer from "multer";
import UserController from "../controllers/user.controller";
import tokenRequired from "../middlewares/token-required.middleware";
import multerConfig from "../../config/multer.config";

const router: Router = Router();

router.get("/user/:_id", UserController.getUserById);

router.post("/user", UserController.register);
router.post("/user/login", UserController.login);
router.post("/user/logout", tokenRequired, UserController.logout);

router.post(
  "/user/avatar",
  tokenRequired,
  multer(multerConfig).single("file"),
  tokenRequired,
  UserController.setUserAvatar
);

router.delete("/user/avatar", tokenRequired, UserController.removeUserAvatar);

router.patch("/user", tokenRequired, UserController.update);

export default router;
