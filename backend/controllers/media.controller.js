import {
    uploadToDrive,
    getDriveStream,
    deleteFromDrive,
} from "../services/drive.service.js";
import { driveConfig } from "../config/drive.config.js";
import { successResponse, errorResponse } from "../utils/response.js";
import fs from "fs";
import asyncHandler from "../utils/asyncHandler.js";

export const uploadMedia = asyncHandler(async (req, res, next) => {
    req.setTimeout(0);
    if (!req.file) return errorResponse(res, "No file uploaded.", 400);

    req.setTimeout(0);
    const result = await uploadToDrive(req.file);

    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
    }

    return successResponse(res, result, "Media uploaded successfully", 201);
});

export const streamMedia = asyncHandler(async (req, res, next) => {
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

    const destroyStream = () => {
        if (response.data && !response.data.destroyed) {
            response.data.destroy();
        }
    };

    req.on("close", destroyStream);
    res.on("error", destroyStream);

    response.data
        .on("error", (e) => {
            if (e.message !== "Premature close") {
                console.error("Drive stream error:", e);
            }
            destroyStream();
        })
        .pipe(res);
});

export const deleteMedia = asyncHandler(async (req, res, next) => {
    const { fileId } = req.params;
    const result = await deleteFromDrive(fileId);
    return successResponse(res, result, "Media deleted successfully");
});
