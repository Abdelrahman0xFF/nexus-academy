import { Router } from "express";
import {
    createLesson,
    getLessonDetails,
    updateLesson,
    deleteLesson,
    completeLesson
} from "../controllers/lesson.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import upload from "../middleware/multer.js";

const router = Router();

router.get("/:course_id/:section_order/:lesson_order", getLessonDetails);

router.post(
    "/",
    authenticate,
    authorize("instructor", "admin"),
    upload.single("video"),
    createLesson
);

router.put(
    "/:course_id/:section_order/:lesson_order",
    authenticate,
    authorize("instructor", "admin"),
    upload.single("video"),
    updateLesson
);

router.delete(
    "/:course_id/:section_order/:lesson_order",
    authenticate,
    authorize("instructor", "admin"),
    deleteLesson
);

router.post(
    "/:course_id/:section_order/:lesson_order/complete",
    authenticate,
    completeLesson
);

export default router;
