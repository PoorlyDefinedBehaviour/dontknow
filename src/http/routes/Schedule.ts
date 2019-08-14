import express, { Router } from "express";
export const router: Router = express.Router();

import { ScheduleController } from "../controllers/Schedule";

router.get("/schedule", ScheduleController.index);
router.get("/schedule/search", ScheduleController.search);
router.get("/schedule/:_id", ScheduleController.getById);

router.post("/schedule", ScheduleController.register);
