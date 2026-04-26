import { Router } from "express";
import {
    createReview,
    getCourseReviews,
    getInstructorReviews,
    getReview,
    updateReview,
    deleteReview,
} from "../controllers/review.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import { validateRequest } from "../middleware/validate.middleware.js";
import { reviewSchema } from "../validators/review.validator.js";

const router = Router();

router.get("/instructor", authenticate, authorize("instructor"), getInstructorReviews);
router.get("/:course_id", getCourseReviews);
router.get("/:course_id/me", authenticate, getReview);
router.post(
    "/:course_id",
    authenticate,
    validateRequest(reviewSchema),
    createReview,
);
router.put("/:course_id", authenticate, updateReview);
router.delete("/:course_id", authenticate, deleteReview);

export default router;
