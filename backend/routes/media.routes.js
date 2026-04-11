import { uploadMedia, streamMedia } from "../controllers/media.controller.js";
import multer from "multer";
import { Router } from "express";

const upload = multer({ dest: "temp_uploads/" });
const router = Router();

router.post("/upload", upload.single("file"), uploadMedia);
router.get("/stream/:fileId", streamMedia);

export default router;
