import { Router } from "express";
import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  getSortedPostsByDate,
} from "./post.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";

const router = Router();

router.post("/create", authMiddleware, createPost);
router.get("/get-all/:blog_id", authMiddleware, getAllPosts);
router.get("/get-by-id/:post_id", authMiddleware, getPostById);
router.put("/update/:post_id", authMiddleware, updatePost);
router.delete("/delete/:post_id", authMiddleware, deletePost);
router.get("/sort-by-date/:blog_id", authMiddleware, getSortedPostsByDate);

export default router;
