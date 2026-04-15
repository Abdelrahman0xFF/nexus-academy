import { verifyJWTToken } from "../config/jwt.config.js";
import User from "../models/user.model.js";

const authenticate = async (req, res, next) => {
    try {
        const token =
            req.cookies?.token || req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Authentication required" });
        }

        const decoded = verifyJWTToken(token);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

const optionalAuthenticate = async (req, res, next) => {
    try {
        const token =
            req.cookies?.token || req.headers.authorization?.split(" ")[1];

        if (token) {
            const decoded = verifyJWTToken(token);
            const user = await User.findById(decoded.id);
            if (user) {
                req.user = user;
            }
        }
        next();
    } catch (err) {
        next();
    }
};

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                message: "Forbidden: You don't have enough permissions",
            });
        }
        next();
    };
};

export { authenticate, authorize, optionalAuthenticate };
