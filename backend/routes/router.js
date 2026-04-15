import { Router } from "express";
import mediaRoutes from "./media.route.js";
import userRoutes from "./user.route.js";
import authRoutes from "./auth.route.js";
import categoryRoutes from "./category.route.js";
import courseRoutes from "./course.route.js";
import sectionRoutes from "./section.route.js";
import lessonRoutes from "./lesson.route.js";

const router = Router();

router.use("/media", mediaRoutes);
router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/categories", categoryRoutes);
router.use("/courses", courseRoutes);
router.use("/sections", sectionRoutes);
router.use("/lessons", lessonRoutes);

export default router;
