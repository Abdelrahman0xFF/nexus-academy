import { uploadMedia, streamMedia } from "../controllers/media.controller.js";
import { Router } from "express";
import upload from "../middleware/multer.js";

const router = Router();

router.post("/upload", upload.single("file"), uploadMedia);
router.get("/stream/:fileId", streamMedia);

export default router;
