import express from "express";
import {
  createComment,
  getCommentsByPostId,
  updateComment,
  deleteComment,
} from "./comment.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.post("/create/:post_id", authMiddleware, createComment);
router.get("/get-all/:post_id", getCommentsByPostId);
router.put("/update/:comment_id", authMiddleware, updateComment);
router.delete("/delete/:comment_id", authMiddleware, deleteComment);

export default router;
