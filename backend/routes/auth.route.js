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
import { validateRequest } from "../middleware/validate.middleware.js";
import {
    registerSchema,
    loginSchema,
    changePasswordSchema,
} from "../validators/user.validator.js";

const router = Router();

router.post(
    "/register",
    upload.single("avatar"),
    validateRequest(registerSchema),
    register,
);
router.post("/verify-otp", verifyOtp);
router.post("/login", validateRequest(loginSchema), login);

router.get("/me", authenticate, me);
router.put(
    "/change-password",
    authenticate,
    validateRequest(changePasswordSchema),
    changePassword,
);

export default router;
