import {
    uploadToDrive,
    getDriveStream,
    deleteFromDrive,
} from "../services/drive.service.js";
import { driveConfig } from "../config/drive.config.js";
import { successResponse, errorResponse } from "../utils/response.js";
import fs from "fs";

export const uploadMedia = async (req, res, next) => {
    req.setTimeout(0);
    if (!req.file) return errorResponse(res, "No file uploaded.", 400);

    try {
        req.setTimeout(0);
        const result = await uploadToDrive(req.file);
        return successResponse(res, result, "Media uploaded successfully", 201);
    } catch (error) {
        next(error);
    } finally {
        if (req.file && req.file.path && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
    }
};

export const streamMedia = async (req, res, next) => {
    try {
        const { fileId } = req.params;
        const { streamConfig, options, requestConfig } = await getDriveStream(
            fileId,
            req.headers.range,
        );

        if (req.headers.range) {
            const { start, end, fileSize, mimeType } = streamConfig;
            res.writeHead(206, {
                "Content-Range": `bytes ${start}-${end}/${fileSize}`,
                "Accept-Ranges": "bytes",
                "Content-Length": end - start + 1,
                "Content-Type": mimeType,
            });
        } else {
            res.writeHead(200, {
                "Content-Length": streamConfig.fileSize,
                "Content-Type": streamConfig.mimeType,
            });
        }

        const response = await driveConfig.files.get(options, requestConfig);
        req.on("close", () => response.data?.destroy());
        response.data
            .on(
                "error",
                (e) => e.message !== "Premature close" && console.error(e),
            )
            .pipe(res);
    } catch (error) {
        if (!res.headersSent) next(error);
    }
};

export const deleteMedia = async (req, res, next) => {
    try {
        const { fileId } = req.params;
        const result = await deleteFromDrive(fileId);
        return successResponse(res, result, "Media deleted successfully");
    } catch (error) {
        next(error);
    }
};
