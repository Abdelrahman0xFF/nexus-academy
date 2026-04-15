import express from "express";
import { enroll, getProgress } from "../controllers/enrollment.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authenticate, enroll);
router.get("/progress/:course_id", authenticate, getProgress);

export default router;
