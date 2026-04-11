import User from "../models/user.model.js";
import { registerSchema, loginSchema } from "../validators/user.validator.js";
import { hashPassword, comparePassword } from "../utils/hash.js";
import { generateJWTToken } from "../config/jwt.config.js";
import { uploadToDrive } from "../services/drive.service.js";
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
            await User.deleteUnverified(email);
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
                id: user.user_id,
                email: user.email,
                role: user.role,
                avatar_url: user.avatar_url,
            },
        });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

export { register, login, verifyOtp };
