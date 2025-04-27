import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { getMyProfile, login, register } from "../users/user.controller.js";
const router = Router();

router.get("/getProfile", authMiddleware, getMyProfile);
router.post("/register", register);
router.post("/login", login);

export default router;
