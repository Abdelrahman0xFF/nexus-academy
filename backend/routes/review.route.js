import { Router } from "express";
import {
    createReview,
    getCourseReviews,
    updateReview,
    deleteReview,
} from "../controllers/review.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { validateRequest } from "../middleware/validate.middleware.js";
import { reviewSchema } from "../validators/review.validator.js";

const router = Router();

router.post("/:course_id", authenticate, validateRequest(reviewSchema), createReview);
router.put("/:course_id", authenticate, updateReview);
router.delete("/:course_id", authenticate, deleteReview);

export default router;