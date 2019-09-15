import express, { Router } from "express";
import ScheduleController from "../controllers/Schedule";

const router: Router = express.Router();

router.get("/schedule", ScheduleController.index);
router.get("/schedule/search", ScheduleController.search);
router.get("/schedule/:_id", ScheduleController.getById);

router.post("/schedule", ScheduleController.register);

export default router;
