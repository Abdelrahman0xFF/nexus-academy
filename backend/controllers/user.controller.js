import User from "../models/user.model.js";
import { updateUserSchema } from "../validators/user.validator.js";
import { uploadToDrive, deleteFromDrive } from "../services/drive.service.js";
import fs from "fs";

const createUser = async (req, res) => {
    try {
        const newUser = new User(req.body);
        const createdUser = await User.create(newUser);
        res.status(201).json(createdUser);
    } catch (err) {
        res.status(500).json({
            message: "Internal server error",
            error: err.message,
        });
    }
};

const getUserById = async (req, res) => {
    try {
        const { user_id } = req.params;

        if (req.user.role !== "admin" && req.user.user_id.toString() !== user_id) {
            return res.status(403).json({ message: "Forbidden: You can only access your own profile" });
        }

        const user = await User.findById(user_id);
        if (user) {
            const { user_id: _, hashed_password, otp, otp_expires, is_verified, ...userData } = user;
            res.status(200).json({ user: userData });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (err) {
        res.status(500).json({
            message: "Internal server error",
            error: err.message,
        });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const users = await User.find(Number(page), Number(limit));
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({
            message: "Internal server error",
            error: err.message,
        });
    }
};

const updateUser = async (req, res) => {
    try {
        const { user_id } = req.params;

        if (req.user.role !== "admin" && req.user.user_id.toString() !== user_id) {
            return res.status(403).json({ message: "Forbidden: You can only update your own profile" });
        }

        const existingUser = await User.findById(user_id);
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }

        if (req.user.role !== "admin" && req.body.role) {
            delete req.body.role;
        }

        const { error, value } = updateUserSchema.validate(req.body);
        if (error)
            return res.status(400).json({ message: error.details[0].message });

        const updateData = { ...value };

        if (req.file) {
            const uploadResult = await uploadToDrive(req.file);
            updateData.avatar_url = uploadResult.fileId;

            if (existingUser.avatar_url) {
                try {
                    await deleteFromDrive(existingUser.avatar_url);
                } catch (err) {
                    console.error("Failed to delete old avatar from drive:", err);
                }
            }
        }

        const result = await User.update(user_id, updateData);

        if (result) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (err) {
        res.status(500).json({
            message: "Internal server error",
            error: err.message,
        });
    } finally {
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
    }
};

const deleteUser = async (req, res) => {
    try {
        const { user_id } = req.params;

        const user = await User.findById(user_id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const result = await User.delete(user_id);

        if (result) {
            if (user.avatar_url) {
                try {
                    await deleteFromDrive(user.avatar_url);
                } catch (err) {
                    console.error("Failed to delete user avatar from drive:", err);
                }
            }
            res.status(200).json({ message: "User deleted successfully" });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (err) {
        res.status(500).json({
            message: "Internal server error",
            error: err.message,
        });
    }
};

export { createUser, getUserById, getAllUsers, updateUser, deleteUser };
