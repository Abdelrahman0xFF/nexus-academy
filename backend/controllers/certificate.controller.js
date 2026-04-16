import Certificate from "../models/certificate.model.js";
import Enrollment from "../models/enrollment.model.js";
import { successResponse, errorResponse } from "../utils/response.js";
import fs from "fs";
import path from "path";
import asyncHandler from "../utils/asyncHandler.js";
import puppeteer from "puppeteer";

const generateCertificateHtml = async (user_id, course_id) => {
    let cert = await Certificate.getByStudentAndCourse(user_id, course_id);
    if (!cert) {
        await Certificate.issue(user_id, course_id);
        cert = await Certificate.getByStudentAndCourse(user_id, course_id);
    }

    const templatePath = path.join(process.cwd(), 'templates', 'certificate.html');
    let template = fs.readFileSync(templatePath, 'utf8');

    return template
        .replace('{{certificateId}}', `${cert.user_id}-${cert.course_id}`)
        .replace('{{studentName}}', `${cert.first_name} ${cert.last_name}`)
        .replace('{{courseName}}', cert.course_name)
        .replace('{{date}}', new Date(cert.issue_date).toLocaleDateString())
        .replace('{{instructorName}}', `${cert.inst_first} ${cert.inst_last}`);
};

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

    const html = await generateCertificateHtml(user_id, course_id);
    res.send(html);
});

export const downloadCertificate = asyncHandler(async (req, res) => {
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

    const html = await generateCertificateHtml(user_id, course_id);

    let browser;
    try {
        browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        
        // Use networkidle0 to ensure fonts/external resources are loaded
        await page.setContent(html, { waitUntil: 'networkidle0' });
        
        const pdfBuffer = await page.pdf({
            format: 'A4',
            landscape: true,
            printBackground: true,
            margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' }
        });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=certificate-${course_id}.pdf`);
        res.send(pdfBuffer);
    } catch (err) {
        console.error("PDF Generation Error:", err);
        return errorResponse(res, "Failed to generate PDF: " + err.message, 500);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
});

export const getAllUserCertificates = asyncHandler(async (req, res) => {
    const user_id = req.user.user_id;
    const certs = await Certificate.getByStudent(user_id);
    
    const certsWithLinks = certs.map(cert => ({
        ...cert,
        download_url: `/api/certificates/download/${cert.course_id}`
    }));

    return successResponse(res, certsWithLinks);
});
