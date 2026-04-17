import fs from "fs";
import { errorResponse } from "../utils/response.js";

const errorHandler = (err, req, res, next) => {
    if (req.file && fs.existsSync(req.file.path)) {
        try { fs.unlinkSync(req.file.path); } catch (e) { console.error("Error deleting file:", e); }
    }
    if (req.files && Array.isArray(req.files)) {
        req.files.forEach((file) => {
            if (fs.existsSync(file.path)) {
                try { fs.unlinkSync(file.path); } catch (e) { console.error("Error deleting file:", e); }
            }
        });
    }

    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    return errorResponse(res, message, statusCode, err);
};

export default errorHandler;
