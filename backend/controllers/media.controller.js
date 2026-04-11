import { uploadToDrive, getDriveStream } from "../services/drive.service.js";
import { driveConfig } from "../config/drive.config.js";

export const uploadMedia = async (req, res) => {
    req.setTimeout(0);
    if (!req.file) return res.status(400).send("No file uploaded.");

    try {
        const result = await uploadToDrive(req.file);
        res.status(200).json(result);
    } catch (error) {
        console.error("Upload Error:", error);
        res.status(500).send("Upload failed.");
    }
};

export const streamMedia = async (req, res) => {
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
        if (!res.headersSent) res.status(500).send("Stream failed.");
    }
};
