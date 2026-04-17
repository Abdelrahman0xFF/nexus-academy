import { Router } from "express";
import {
    login,
    register,
    verifyOtp,
    resendOtp,
    me,
    changePassword,
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

router.get("/me", authenticate, me);
router.put(
    "/change-password",
    authenticate,
    validateRequest(changePasswordSchema),
    changePassword,
);

export default router;
