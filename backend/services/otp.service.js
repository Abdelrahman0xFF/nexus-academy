import crypto from "crypto";
import { otpTemplate } from "../templates/otp.template.js";
import { hashPassword, comparePassword } from "../utils/hash.js";

export const generateAndSendOTP = async (email) => {
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpires = Date.now() + 5 * 60 * 1000;
    const hashedOtp = await hashPassword(otp);

    try {
        await otpTemplate(email, otp); 
    } catch (error) {
        console.error("Failed to send OTP email:", error);
        throw new Error("Failed to send OTP email");
    }

    return { hashedOtp, otpExpires };
};
