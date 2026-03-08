import express from "express";

const app = express();
app.use(express.json());

app.get("/api/hello", (req, res) => {
    res.json({ message: "HelloWorld" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`);
});
