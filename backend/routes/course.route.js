import { Router } from "express";
import {
    createCourse,
    getCourseById,
    getAllCourses,
    getMyCourses,
    getCoursesByInstructorId,
    updateCourse,
    deleteCourse,
    getCourseContent,
} from "../controllers/course.controller.js";
import { getEnrollmentsByCourseId } from "../controllers/enrollment.controller.js";
import { getSectionsByCourseId } from "../controllers/section.controller.js";
import {
    authenticate,
    authorize,
    optionalAuthenticate,
} from "../middleware/auth.middleware.js";
import { verifyEnrollment } from "../middleware/enrollment.middleware.js";
import upload from "../middleware/multer.js";

const router = Router();

router.get("/", optionalAuthenticate, getAllCourses);

router.get("/my", authenticate, authorize("instructor"), getMyCourses);
router.get("/instructor/:instructor_id", optionalAuthenticate, getCoursesByInstructorId);

router.get("/:course_id", optionalAuthenticate, getCourseById);

router.get(
    "/:course_id/enrollments",
    authenticate,
    authorize("instructor", "admin"),
    getEnrollmentsByCourseId,
);

router.get("/:course_id/sections", optionalAuthenticate, getSectionsByCourseId);

router.get(
    "/:course_id/content",
    authenticate,
    verifyEnrollment,
    getCourseContent,
);

router.post(
    "/",
    authenticate,
    authorize("instructor"),
    upload.single("thumbnail"),
    createCourse,
);

router.put(
    "/:course_id",
    authenticate,
    authorize("instructor", "admin"),
    upload.single("thumbnail"),
    updateCourse,
);

router.delete(
    "/:course_id",
    authenticate,
    authorize("instructor", "admin"),
    deleteCourse,
);

export default router;
