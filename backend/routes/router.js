import { Router } from "express";
import mediaRoutes from "./media.route.js";

const router = Router();

router.use("/media", mediaRoutes);

export default router;
