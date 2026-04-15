import User from "../models/user.model.js";
import { updateUserSchema } from "../validators/user.validator.js";
import { uploadToDrive, deleteFromDrive } from "../services/drive.service.js";
import { successResponse, errorResponse } from "../utils/response.js";
import fs from "fs";

const createUser = async (req, res, next) => {
    try {
        const newUser = new User(req.body);
        const createdUser = await User.create(newUser);
        return successResponse(res, createdUser, "User created successfully", 201);
    } catch (err) {
        next(err);
    }
};

const getUserById = async (req, res, next) => {
    try {
        const { user_id } = req.params;

        if (req.user.role !== "admin" && req.user.user_id.toString() !== user_id) {
            return errorResponse(res, "Forbidden: You can only access your own profile", 403);
        }

        const user = await User.findById(user_id);
        if (user) {
            const { user_id: _, hashed_password, otp, otp_expires, is_verified, ...userData } = user;
            return successResponse(res, userData);
        } else {
            return errorResponse(res, "User not found", 404);
        }
    } catch (err) {
        next(err);
    }
};

const getAllUsers = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const users = await User.find(Number(page), Number(limit));
        return successResponse(res, users);
    } catch (err) {
        next(err);
    }
};

const updateUser = async (req, res, next) => {
    let newAvatarUrl = null;
    try {
        const { user_id } = req.params;

        if (req.user.role !== "admin" && req.user.user_id.toString() !== user_id) {
            return errorResponse(res, "Forbidden: You can only update your own profile", 403);
        }

        const existingUser = await User.findById(user_id);
        if (!existingUser) {
            return errorResponse(res, "User not found", 404);
        }

        if (req.user.role !== "admin" && req.body.role) {
            delete req.body.role;
        }

        const { error, value } = updateUserSchema.validate(req.body);
        if (error)
            return errorResponse(res, error.details[0].message, 400);

        const updateData = { ...value };

        if (req.file) {
            const uploadResult = await uploadToDrive(req.file);
            newAvatarUrl = uploadResult.fileId;
            updateData.avatar_url = newAvatarUrl;
        }

        const result = await User.update(user_id, updateData);

        if (result) {
            if (newAvatarUrl && existingUser.avatar_url) {
                try {
                    await deleteFromDrive(existingUser.avatar_url);
                } catch (err) {
                    console.error("Failed to delete old avatar from drive:", err);
                }
            }
            return successResponse(res, result, "User updated successfully");
        } else {
            if (newAvatarUrl) {
                await deleteFromDrive(newAvatarUrl);
            }
            return errorResponse(res, "User not found", 404);
        }
    } catch (err) {
        if (newAvatarUrl) {
            try {
                await deleteFromDrive(newAvatarUrl);
            } catch (cleanupErr) {
                console.error("Failed to cleanup uploaded avatar after error:", cleanupErr);
            }
        }
        next(err);
    } finally {
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
    }
};

const deleteUser = async (req, res, next) => {
    try {
        const { user_id } = req.params;

        const user = await User.findById(user_id);
        if (!user) {
            return errorResponse(res, "User not found", 404);
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
            return successResponse(res, null, "User deleted successfully");
        } else {
            return errorResponse(res, "User not found", 404);
        }
    } catch (err) {
        next(err);
    }
};

export { createUser, getUserById, getAllUsers, updateUser, deleteUser };
