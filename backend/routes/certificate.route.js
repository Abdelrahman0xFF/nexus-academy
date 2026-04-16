import express from "express";
import {
    getCertificate,
    getAllUserCertificates,
    downloadCertificate,
} from "../controllers/certificate.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", authenticate, getAllUserCertificates);
router.get("/:course_id", authenticate, getCertificate);
router.get("/download/:course_id", authenticate, downloadCertificate);

export default router;
