import { Router } from "express";
import {
    createSection,
    updateSection,
    deleteSection,
} from "../controllers/section.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", authenticate, authorize("instructor", "admin"), createSection);

router.put(
    "/:course_id/:section_order",
    authenticate,
    authorize("instructor", "admin"),
    updateSection,
);

router.delete(
    "/:course_id/:section_order",
    authenticate,
    authorize("instructor", "admin"),
    deleteSection,
);

export default router;
