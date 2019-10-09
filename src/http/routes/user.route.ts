import { Router } from "express";
import UserController from "../controllers/user.controller";
import tokenRequired from "../middlewares/token-required.middleware";

const router: Router = Router();

router.post("/user", UserController.register);
router.post("/user/login", UserController.login);
router.post("/user/logout", tokenRequired, UserController.logout);

router.patch("/user", tokenRequired, UserController.update);

export default router;
