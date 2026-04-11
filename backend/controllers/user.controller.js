import User from "../models/user.model.js";

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
        const user_id = req.params.user_id;
        const user = await User.findById(user_id);
        if (user) {
            res.json(user);
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
        const users = await User.find(page, limit);
        res.json(users);
    } catch (err) {
        res.status(500).json({
            message: "Internal server error",
            error: err.message,
        });
    }
};

export { createUser, getUserById, getAllUsers };
