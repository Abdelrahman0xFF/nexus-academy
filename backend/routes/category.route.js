import { Router } from "express";
import {
    createCategory,
    getCategoryById,
    getAllCategories,
    updateCategory,
    deleteCategory,
    getCoursesByCategory,
} from "../controllers/category.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", getAllCategories);
router.get("/:id", getCategoryById);
router.get("/:id/courses", getCoursesByCategory);

router.post("/", authenticate, authorize("admin"), createCategory);
router.put("/:id", authenticate, authorize("admin"), updateCategory);
router.delete("/:id", authenticate, authorize("admin"), deleteCategory);

export default router;
