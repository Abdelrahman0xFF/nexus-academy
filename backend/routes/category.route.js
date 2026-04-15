import { Router } from "express";
import {
    createCategory,
    getCategoryById,
    getAllCategories,
    updateCategory,
    deleteCategory,
    getCoursesByCategory,
} from "../controllers/category.controller.js";
import {
    authenticate,
    authorize,
    optionalAuthenticate,
} from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", getAllCategories);
router.get("/:category_id", getCategoryById);
router.get("/:category_id/courses", optionalAuthenticate, getCoursesByCategory);

router.post("/", authenticate, authorize("admin"), createCategory);
router.put("/:category_id", authenticate, authorize("admin"), updateCategory);
router.delete(
    "/:category_id",
    authenticate,
    authorize("admin"),
    deleteCategory,
);

export default router;
