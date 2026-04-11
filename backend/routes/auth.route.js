import { Router } from "express";
import { login, register } from "../controllers/auth.controller.js";
import upload from "../middleware/multer.js";

const router = Router();

router.post("/register", upload.single("avatar"), register);
router.post("/login", login);

export default router;
