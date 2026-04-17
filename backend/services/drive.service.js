import { driveConfig, PARENT_FOLDER_ID } from "../config/drive.config.js";
import fs from "fs";

export const uploadToDrive = async (file, retries = 3) => {
    let lastError;
    for (let i = 0; i < retries; i++) {
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

            if (file.path && fs.existsSync(file.path)) {
                fs.unlinkSync(file.path);
            }

            return { fileId };
        } catch (error) {
            lastError = error;
            console.warn(`Drive upload failed, retrying (\${i + 1}/\${retries})...`);
            if (i < retries - 1) {
                await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
            }
        }
    }
    
    if (file.path && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
    }
    throw lastError;
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

        requestConfig.headers = { Range: `bytes=\${start}-\${end}` };
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

export const deleteFromDrive = async (fileId, retries = 3) => {
    let lastError;
    for (let i = 0; i < retries; i++) {
        try {
            await driveConfig.files.delete({
                fileId: fileId,
            });
            return { message: "File deleted successfully" };
        } catch (error) {
            lastError = error;
            if (error.code === 404) {
                return { message: "File already deleted or not found" };
            }
            console.warn(`Drive delete failed for \${fileId}, retrying (\${i + 1}/\${retries})...`);
            if (i < retries - 1) {
                await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
            }
        }
    }
    throw lastError;
};
