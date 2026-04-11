import { Router } from "express";
import mediaRoutes from "./media.route.js";
import userRoutes from "./user.route.js";
import authRoutes from "./auth.route.js";

const router = Router();

router.use("/media", mediaRoutes);
router.use("/users", userRoutes);
router.use("/auth", authRoutes);

export default router;
