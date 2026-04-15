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
import fs from "fs";

const register = async (req, res) => {
    try {
        const { error } = registerSchema.validate(req.body);
        if (error)
            return res.status(400).json({ message: error.details[0].message });

        const existingUser = await User.findByEmail(req.body.email);
        if (existingUser) {
            if (!existingUser.is_verified) {
                const { hashedOtp, otpExpires } = await generateAndSendOTP(
                    req.body.email,
                );
                await User.updateOTP(req.body.email, hashedOtp, otpExpires);
                return res
                    .status(200)
                    .json({ message: "OTP resent. Please verify your email." });
            }
            return res.status(400).json({ message: "Email already in use" });
        }

        const hashedPassword = await hashPassword(req.body.password);

        let avatarUrl = null;
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

        res.status(200).json({
            message: "OTP sent. Please verify to complete registration.",
        });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    } finally {
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
    }
};

const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const user = await User.findByEmail(email);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (user.is_verified)
            return res.status(400).json({ message: "User already verified" });

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

            return res
                .status(400)
                .json({ message: "OTP expired. Please register again." });
        }

        const isOtpValid = await comparePassword(otp, user.otp);
        if (!isOtpValid)
            return res.status(400).json({ message: "Invalid OTP" });

        await User.verify(email);

        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

const login = async (req, res) => {
    try {
        const { error } = loginSchema.validate(req.body);
        if (error)
            return res.status(400).json({ message: error.details[0].message });

        const user = await User.findByEmail(req.body.email);
        if (!user)
            return res.status(401).json({ message: "Invalid credentials" });

        const match = await comparePassword(
            req.body.password,
            user.hashed_password,
        );
        if (!match)
            return res.status(401).json({ message: "Invalid credentials" });

        const token = generateJWTToken({
            id: user.user_id,
            role: user.role,
        });

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "Strict",
        });

        res.json({
            user: {
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                role: user.role,
                avatar_url: user.avatar_url,
                title: user.title,
                bio: user.bio,
                created_at: user.created_at,
            },
        });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

const logout = async (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logged out successfully" });
};

const me = async (req, res) => {
    try {
        const {
            user_id,
            hashed_password,
            otp,
            otp_expires,
            is_verified,
            ...userData
        } = req.user;
        res.json({ user: userData });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

const changePassword = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ message: "Request body is missing" });
        }

        const { error } = changePasswordSchema.validate(req.body);
        if (error)
            return res.status(400).json({ message: error.details[0].message });

        const { old_password, new_password } = req.body;
        const user = req.user;

        const match = await comparePassword(old_password, user.hashed_password);
        if (!match)
            return res.status(401).json({ message: "Invalid old password" });

        const hashedPassword = await hashPassword(new_password);
        await User.update(user.user_id, { hashed_password: hashedPassword });

        res.json({ message: "Password updated successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

export { register, login, verifyOtp, logout, me, changePassword };
