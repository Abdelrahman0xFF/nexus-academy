import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
    secure: true,
    host: "smtp.gmail.com",
    port: 465,
    auth: {
        user: process.env.OTP_EMAIL,
        pass: process.env.OTP_PASSWORD,
    },
});
