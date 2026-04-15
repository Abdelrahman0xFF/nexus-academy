import {
    createUser,
    getUserById,
    getAllUsers,
    updateUser,
    deleteUser,
} from "../controllers/user.controller.js";

import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import upload from "../middleware/multer.js";

const router = Router();

router.use(authenticate);

router.get("/", authorize("admin"), getAllUsers);
router.get("/:user_id", getUserById);
router.put("/:user_id", upload.single("avatar"), updateUser);
router.delete("/:user_id", authorize("admin"), deleteUser);

export default router;
