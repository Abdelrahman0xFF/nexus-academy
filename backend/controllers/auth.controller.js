import User from "../models/user.model.js";
import {
    registerSchema,
    loginSchema,
    changePasswordSchema,
} from "../validators/user.validator.js";
import { hashPassword, comparePassword } from "../utils/hash.js";
import { generateJWTToken } from "../config/jwt.config.js";
import { uploadToDrive, deleteFromDrive } from "../services/drive.service.js";
import { generateAndSendOTP } from "../services/otp.service.js";
import { successResponse, errorResponse } from "../utils/response.js";
import fs from "fs";

const register = async (req, res, next) => {
    let avatarUrl = null;
    try {
        const { error } = registerSchema.validate(req.body);
        if (error) return errorResponse(res, error.details[0].message, 400);

        const existingUser = await User.findByEmail(req.body.email);
        if (existingUser) {
            if (!existingUser.is_verified) {
                const { hashedOtp, otpExpires } = await generateAndSendOTP(
                    req.body.email,
                );
                await User.updateOTP(req.body.email, hashedOtp, otpExpires);
                return successResponse(
                    res,
                    null,
                    "OTP resent. Please verify your email.",
                );
            }
            return errorResponse(res, "Email already in use", 400);
        }

        const hashedPassword = await hashPassword(req.body.password);

        if (req.file) {
            const uploadResult = await uploadToDrive(req.file);
            avatarUrl = uploadResult.fileId;
        }

        const { hashedOtp, otpExpires } = await generateAndSendOTP(
            req.body.email,
        );

        await User.create({
            ...req.body,
            hashed_password: hashedPassword,
            avatar_url: avatarUrl,
            otp: hashedOtp,
            otp_expires: otpExpires,
            is_verified: false,
        });

        return successResponse(
            res,
            null,
            "OTP sent. Please verify to complete registration.",
        );
    } catch (err) {
        if (avatarUrl) {
            try {
                await deleteFromDrive(avatarUrl);
            } catch (cleanupErr) {
                console.error(
                    "Failed to cleanup uploaded avatar after error:",
                    cleanupErr,
                );
            }
        }
        next(err);
    } finally {
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
    }
};

const verifyOtp = async (req, res, next) => {
    try {
        const { email, otp } = req.body;

        const user = await User.findByEmail(email);
        if (!user) return errorResponse(res, "User not found", 404);

        if (user.is_verified)
            return errorResponse(res, "User already verified", 400);

        if (Date.now() > user.otp_expires) {
            const avatarUrl = user.avatar_url;
            await User.deleteUnverified(email);

            if (avatarUrl) {
                try {
                    await deleteFromDrive(avatarUrl);
                } catch (err) {
                    console.error(
                        "Failed to delete unverified user avatar from drive:",
                        err,
                    );
                }
            }

            return errorResponse(
                res,
                "OTP expired. Please register again.",
                400,
            );
        }

        const isOtpValid = await comparePassword(otp, user.otp);
        if (!isOtpValid) return errorResponse(res, "Invalid OTP", 400);

        await User.verify(email);

        return successResponse(res, null, "User registered successfully", 201);
    } catch (err) {
        next(err);
    }
};

const login = async (req, res, next) => {
    try {
        const { error } = loginSchema.validate(req.body);
        if (error) return errorResponse(res, error.details[0].message, 400);

        const user = await User.findByEmail(req.body.email);
        if (!user) return errorResponse(res, "Invalid credentials", 401);

        const match = await comparePassword(
            req.body.password,
            user.hashed_password,
        );
        if (!match) return errorResponse(res, "Invalid credentials", 401);

        const token = generateJWTToken({
            id: user.user_id,
            role: user.role,
        });

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "Strict",
        });

        return successResponse(
            res,
            {
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                role: user.role,
                avatar_url: user.avatar_url,
                title: user.title,
                bio: user.bio,
                created_at: user.created_at,
            },
            "Logged in successfully",
        );
    } catch (err) {
        next(err);
    }
};

const me = async (req, res, next) => {
    try {
        const {
            user_id,
            hashed_password,
            otp,
            otp_expires,
            is_verified,
            ...userData
        } = req.user;
        return successResponse(res, userData);
    } catch (err) {
        next(err);
    }
};

const changePassword = async (req, res, next) => {
    try {
        const { error } = changePasswordSchema.validate(req.body);
        if (error) return errorResponse(res, error.details[0].message, 400);

        const { old_password, new_password } = req.body;
        const user = req.user;

        const match = await comparePassword(old_password, user.hashed_password);
        if (!match) return errorResponse(res, "Invalid old password", 401);

        const hashedPassword = await hashPassword(new_password);
        await User.update(user.user_id, { hashed_password: hashedPassword });

        return successResponse(res, null, "Password updated successfully");
    } catch (err) {
        next(err);
    }
};

export { register, login, verifyOtp, me, changePassword };
