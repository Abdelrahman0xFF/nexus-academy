import User from "../models/user.model.js";
import { registerSchema, loginSchema } from "../validators/user.validator.js";
import { hashPassword, comparePassword } from "../utils/hash.js";
import { generateJWTToken } from "../config/jwt.config.js";
import { uploadToDrive } from "../services/drive.service.js";
import fs from "fs";

const register = async (req, res) => {
    try {
        const { error } = registerSchema.validate(req.body);
        if (error)
            return res.status(400).json({ message: error.details[0].message });

        const existingUser = await User.findByEmail(req.body.email);
        if (existingUser)
            return res.status(400).json({ message: "Email already in use" });

        const hashedPassword = await hashPassword(req.body.password);

        let avatarUrl = null;
        if (req.file) {
            const uploadResult = await uploadToDrive(req.file);
            avatarUrl = uploadResult.fileId;
        }

        await User.create({
            ...req.body,
            hashed_password: hashedPassword,
            avatar_url: avatarUrl,
        });

        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    } finally {
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
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

export { register, login };
