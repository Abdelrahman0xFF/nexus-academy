import express from "express";
import mediaRoutes from "./routes/media.routes.js";

const app = express();
app.use(express.json());

app.use("/api/media", mediaRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

console.log(`Server started on port ${PORT}`);
