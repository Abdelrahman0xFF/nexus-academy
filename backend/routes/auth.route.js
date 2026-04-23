import { Router } from "express";
import {
    login,
    register,
    verifyOtp,
    resendOtp,
    me,
    changePassword,
    logout,
    googleAuthCallback,
} from "../controllers/auth.controller.js";
import { imageUpload, fileCleanup } from "../middleware/multer.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { validateRequest } from "../middleware/validate.middleware.js";
import {
    registerSchema,
    loginSchema,
    resendOtpSchema,
    changePasswordSchema,
} from "../validators/user.validator.js";
import passport from "../config/passport.config.js";

const router = Router();

router.post(
    "/register",
    imageUpload.single("avatar"),
    fileCleanup,
    validateRequest(registerSchema),
    register,
);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", validateRequest(resendOtpSchema), resendOtp);
router.post("/login", validateRequest(loginSchema), login);
router.post("/logout", logout);

router.get("/me", authenticate, me);
router.put(
    "/change-password",
    authenticate,
    validateRequest(changePasswordSchema),
    changePassword,
);

// Google OAuth routes
router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] }),
);

router.get(
    "/google/callback",
    passport.authenticate("google", { session: false, failureRedirect: "/login" }),
    googleAuthCallback,
);

export default router;
