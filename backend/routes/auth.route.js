import { Router } from "express";
import { login, register, verifyOtp } from "../controllers/auth.controller.js";
import upload from "../middleware/multer.js";

const router = Router();

router.post("/register", upload.single("avatar"), register);
router.post("/verify-otp", verifyOtp);
router.post("/login", login);

export default router;
