import Certificate from "../models/certificate.model.js";
import Enrollment from "../models/enrollment.model.js";
import { successResponse, errorResponse } from "../utils/response.js";
import fs from "fs";
import path from "path";
import asyncHandler from "../utils/asyncHandler.js";

export const getCertificate = asyncHandler(async (req, res) => {
    const { course_id } = req.params;
    const user_id = req.user.user_id;

    const enrolled = await Enrollment.isEnrolled(user_id, course_id);
    if (!enrolled) {
        return errorResponse(res, "Not enrolled in this course", 404);
    }

    const progress = await Enrollment.getProgress(user_id, course_id);
    if (progress < 95) {
        return errorResponse(res, "Progress must be at least 95% to get certificate", 403);
    }

    let cert = await Certificate.getByStudentAndCourse(user_id, course_id);
    if (!cert) {
        await Certificate.issue(user_id, course_id);
        cert = await Certificate.getByStudentAndCourse(user_id, course_id);
    }

    const templatePath = path.join(process.cwd(), 'templates', 'certificate.html');
    let template = fs.readFileSync(templatePath, 'utf8');

    template = template
        .replace('{{certificateId}}', `${cert.user_id}-${cert.course_id}`)
        .replace('{{studentName}}', `${cert.first_name} ${cert.last_name}`)
        .replace('{{courseName}}', cert.course_name)
        .replace('{{date}}', new Date(cert.issue_date).toLocaleDateString())
        .replace('{{instructorName}}', `${cert.inst_first} ${cert.inst_last}`);

    res.send(template);
});

export const getAllUserCertificates = asyncHandler(async (req, res) => {
    const user_id = req.user.user_id;
    const certs = await Certificate.getByStudent(user_id);
    return successResponse(res, certs);
});
