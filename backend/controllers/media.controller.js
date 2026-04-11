import fs from "fs";
import { driveService, PARENT_FOLDER_ID } from "../config/drive.config.js";

const uploadMedia = async (req, res) => {
    req.setTimeout(0);
    req.on("close", () => {
        if (!res.writableEnded && req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
    });

    try {
        if (!req.file) return res.status(400).send("No file uploaded.");

        const response = await driveService.files.create({
            requestBody: {
                name: req.file.originalname,
                parents: [PARENT_FOLDER_ID],
            },
            media: {
                mimeType: req.file.mimetype,
                body: fs.createReadStream(req.file.path),
            },
            fields: "id",
        });

        const fileId = response.data.id;
        await driveService.permissions.create({
            fileId,
            requestBody: { role: "reader", type: "anyone" },
        });

        const embedLink = req.file.mimetype.includes("video")
            ? `https://drive.google.com/file/d/${fileId}/preview`
            : `https://drive.google.com/uc?export=view&id=${fileId}`;

        if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        res.status(200).json({ fileId, embedLink });
    } catch (error) {
        console.error("Upload error details:", error);
        if (req.file && fs.existsSync(req.file.path))
            fs.unlinkSync(req.file.path);
        res.status(500).send("Upload failed.");
    }
};

const streamMedia = async (req, res) => {
    try {
        const { fileId } = req.params;
        const { range } = req.headers;

        const { data } = await driveService.files.get({
            fileId,
            fields: "size, mimeType",
        });
        const fileSize = parseInt(data.size, 10);
        const mimeType = data.mimeType;

        if (range) {
            const parts = range.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10);
            const end = parts[1]
                ? parseInt(parts[1], 10)
                : Math.min(start + 10 ** 6 - 1, fileSize - 1);

            res.writeHead(206, {
                "Content-Range": `bytes ${start}-${end}/${fileSize}`,
                "Accept-Ranges": "bytes",
                "Content-Length": end - start + 1,
                "Content-Type": mimeType,
            });

            const response = await driveService.files.get(
                { fileId, alt: "media" },
                {
                    responseType: "stream",
                    headers: { Range: `bytes=${start}-${end}` },
                },
            );

            req.on("close", () => response.data?.destroy());
            response.data
                .on(
                    "error",
                    (e) => e.message !== "Premature close" && console.error(e),
                )
                .pipe(res);
        } else {
            res.writeHead(200, {
                "Content-Length": fileSize,
                "Content-Type": mimeType,
            });
            const response = await driveService.files.get(
                { fileId, alt: "media" },
                { responseType: "stream" },
            );
            req.on("close", () => response.data?.destroy());
            response.data.on("error", console.error).pipe(res);
        }
    } catch (error) {
        if (!res.headersSent) res.status(500).send("Stream failed.");
    }
};

export { uploadMedia, streamMedia };
