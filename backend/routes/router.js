import { Router } from "express";
import mediaRoutes from "./media.route.js";
import userRoutes from "./user.route.js";

const router = Router();

router.use("/media", mediaRoutes);
router.use("/users", userRoutes);

export default router;
