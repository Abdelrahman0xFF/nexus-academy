import { Router } from "express";
import {
    login,
    register,
    verifyOtp,
    me,
    changePassword,
} from "../controllers/auth.controller.js";
import upload from "../middleware/multer.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", upload.single("avatar"), register);
router.post("/verify-otp", verifyOtp);
router.post("/login", login);

router.get("/me", authenticate, me);
router.put("/change-password", authenticate, changePassword);

export default router;
