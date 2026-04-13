import { transporter } from "../config/otp.config.js";

export const sendEmail = async (to, subject, html) => {
    try {
        await transporter.sendMail({
            to: to,
            subject: subject,
            html: html,
        });
    } catch (e) {
        console.error(`Error sending email: ${e}`);
        throw e;
    }
};
