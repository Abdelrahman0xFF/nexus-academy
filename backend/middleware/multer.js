import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const folder = file.mimetype.startsWith("video/")
            ? "public/uploads/videos"
            : "public/uploads/images";

        fs.mkdirSync(folder, { recursive: true });
        cb(null, folder);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    },
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/gif",
            "video/mp4",
            "video/mpeg",
            "video/quicktime",
        ];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            throw new Error(
                "Unsupported file type. Only images and videos are allowed.",
                false,
            );
        }
    },
});

export default upload;
