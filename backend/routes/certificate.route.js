import express from "express";
import {
    getCertificate,
    getAllUserCertificates,
} from "../controllers/certificate.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", authenticate, getAllUserCertificates);
router.get("/:course_id", authenticate, getCertificate);

export default router;
