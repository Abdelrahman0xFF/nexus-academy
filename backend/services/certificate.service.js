import fs from "fs";
import path from "path";
import { sendEmail } from "../utils/sendEmail.js";
import Certificate from "../models/certificate.model.js";

const templatePath = path.resolve("templates", "certificateEmail.html");

export const sendCertificateEmail = async (userId, courseId, downloadBaseUrl) => {
    try {
        const cert = await Certificate.getByStudentAndCourse(userId, courseId);
        if (!cert) {
            throw new Error("Certificate not found");
        }

        let html = await fs.promises.readFile(templatePath, "utf8");

        const studentName = `${cert.first_name} ${cert.last_name}`;
        const courseName = cert.course_name;
        const certificateId = `NEX-${cert.user_id}-${cert.course_id}`;
        const date = new Date(cert.issue_date).toLocaleDateString();
        const downloadUrl = `${downloadBaseUrl}/api/certificates/download/${cert.course_id}`;

        html = html
            .replace(/{{studentName}}/g, studentName)
            .replace(/{{courseName}}/g, courseName)
            .replace(/{{certificateId}}/g, certificateId)
            .replace(/{{date}}/g, date)
            .replace(/{{downloadUrl}}/g, downloadUrl);

        await sendEmail(cert.email, `Congratulations! You've earned a certificate for ${courseName}`, html);
        
        return true;
    } catch (error) {
        console.error("Failed to send certificate email:", error);
        throw error;
    }
};
