import { transporter } from "../config/otp.config.js";

export const sendEmail = async (to, subject, html, attachments = []) => {
    try {
        await transporter.sendMail({
            to: to,
            subject: subject,
            html: html,
            attachments: attachments,
        });
    } catch (e) {
        console.error(`Error sending email: ${e}`);
        throw e;
    }
};
