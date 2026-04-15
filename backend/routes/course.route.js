import { Router } from "express";
import {
    createCourse,
    getCourseById,
    getAllCourses,
    updateCourse,
    deleteCourse,
} from "../controllers/course.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import upload from "../middleware/multer.js";

const router = Router();

router.get("/", getAllCourses);
router.get("/:course_id", getCourseById);

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
