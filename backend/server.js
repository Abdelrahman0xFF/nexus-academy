import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import router from "./routes/router.js";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: process.env.FRONTEND_BASE_URL || "http://localhost:5173",
        credentials: true,
    }),
);

app.use("/api", router);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
