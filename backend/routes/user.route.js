import {
    createUser,
    getUserById,
    getAllUsers,
} from "../controllers/user.controller.js";
import { Router } from "express";

const router = Router();

router.get("/", getAllUsers);
router.get("/:user_id", getUserById);
router.post("/", createUser);

export default router;
