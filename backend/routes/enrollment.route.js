import express from "express";
import {
    enroll,
    getProgress,
    getMyEnrollments,
    unenroll,
} from "../controllers/enrollment.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { validateRequest } from "../middleware/validate.middleware.js";
import { enrollmentSchema } from "../validators/enrollment.validator.js";

const router = express.Router();

router.post("/", authenticate, validateRequest(enrollmentSchema), enroll);
router.get("/my", authenticate, getMyEnrollments);
router.get("/progress/:course_id", authenticate, getProgress);
router.delete("/:course_id", authenticate, unenroll);

export default router;
