import express from "express";
import {
    enroll,
    getProgress,
    getMyEnrollments,
    getInstructorStudents,
    getInstructorEnrollments,
    unenroll,
} from "../controllers/enrollment.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import { validateRequest } from "../middleware/validate.middleware.js";
import { enrollmentSchema } from "../validators/enrollment.validator.js";

const router = express.Router();

router.post("/", authenticate, validateRequest(enrollmentSchema), enroll);
router.get("/my", authenticate, getMyEnrollments);
router.get("/instructor/students", authenticate, authorize("instructor"), getInstructorStudents);
router.get("/instructor", authenticate, authorize("instructor"), getInstructorEnrollments);
router.get("/progress/:course_id", authenticate, getProgress);
router.delete("/", authenticate, authorize("admin", "instructor"), unenroll);

export default router;
