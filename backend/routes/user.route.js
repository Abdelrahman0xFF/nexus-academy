import {
    createUser,
    getUserById,
    getAllUsers,
    updateUser,
    deleteUser,
} from "../controllers/user.controller.js";

import { Router } from "express";

const router = Router();

router.get("/", getAllUsers);
router.get("/:user_id", getUserById);
router.post("/", createUser);
router.put("/:user_id", updateUser);
router.delete("/:user_id", deleteUser);

export default router;
