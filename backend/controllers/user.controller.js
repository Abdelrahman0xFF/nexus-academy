import User from "../models/user.model.js";
import { updateUserSchema } from "../validators/user.validator.js";

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

        if (req.user.role !== "admin" && req.body.role) {
            delete req.body.role;
        }

        const { error, value } = updateUserSchema.validate(req.body);
        if (error)
            return res.status(400).json({ message: error.details[0].message });

        const result = await User.update(user_id, value);

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
    }
};

const deleteUser = async (req, res) => {
    try {
        const { user_id } = req.params;
        const result = await User.delete(user_id);

        if (result) {
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
