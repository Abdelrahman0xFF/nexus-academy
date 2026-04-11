import jwt from "jsonwebtoken";

const generateJWTToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "15d",
    });
};

export { generateJWTToken };
