import { driveConfig, PARENT_FOLDER_ID } from "../config/drive.config.js";
import fs from "fs";

export const uploadToDrive = async (file) => {
    try {
        const response = await driveConfig.files.create({
            requestBody: {
                name: file.originalname,
                parents: [PARENT_FOLDER_ID],
            },
            media: {
                mimeType: file.mimetype,
                body: fs.createReadStream(file.path),
            },
            fields: "id",
        });

        const fileId = response.data.id;

        await driveConfig.permissions.create({
            fileId,
            requestBody: { role: "reader", type: "anyone" },
        });

        return { fileId };
    } finally {
        if (file.path && fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
        }
    }
};

export const getDriveStream = async (fileId, rangeHeader = null) => {
    const { data: metadata } = await driveConfig.files.get({
        fileId,
        fields: "size, mimeType",
    });

    const fileSize = parseInt(metadata.size, 10);
    const options = { fileId, alt: "media" };
    const requestConfig = { responseType: "stream" };

    if (rangeHeader) {
        const parts = rangeHeader.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1]
            ? parseInt(parts[1], 10)
            : Math.min(start + 10 ** 6 - 1, fileSize - 1);

        requestConfig.headers = { Range: `bytes=${start}-${end}` };
        return {
            streamConfig: { start, end, fileSize, mimeType: metadata.mimeType },
            options,
            requestConfig,
        };
    }

    return {
        streamConfig: { fileSize, mimeType: metadata.mimeType },
        options,
        requestConfig,
    };
};

export const deleteFromDrive = async (fileId) => {
    try {
        await driveConfig.files.delete({
            fileId: fileId,
        });
        return { message: "File deleted successfully" };
    } catch (error) {
        console.error("Error deleting file from drive: ", error);
        throw error;
    }
};
