import express, { Router } from "express";
import ScheduleController from "../controllers/Schedule";
import sessionRequired from "../middlewares/SessionRequired";

const router: Router = express.Router();

router.get("/schedule", ScheduleController.index);
router.get("/schedule/search", ScheduleController.search);
router.get("/schedule/:_id", sessionRequired, ScheduleController.getById);

router.post("/schedule", sessionRequired, ScheduleController.register);

export default router;
