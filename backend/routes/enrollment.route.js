import express from "express";
import {
    enroll,
    getProgress,
    getMyEnrollments,
    unenroll,
} from "../controllers/enrollment.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authenticate, enroll);
router.get("/my", authenticate, getMyEnrollments);
router.get("/progress/:course_id", authenticate, getProgress);
router.delete("/:course_id", authenticate, unenroll);

export default router;
