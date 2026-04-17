import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { readFileSync } from "fs";
import router from "./routes/router.js";
import errorHandler from "./middleware/error.middleware.js";
import requestLogger from "./middleware/logger.middleware.js";

const swaggerDocument = JSON.parse(
    readFileSync(new URL("./swagger.json", import.meta.url)),
);

const app = express();
app.use(requestLogger);
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: "http://localhost:8081",
        credentials: true,
    }),
);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/api", router);

app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
