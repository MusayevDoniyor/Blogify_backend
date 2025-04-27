import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import {
  createBlog,
  deleteBlog,
  getBlogInfo,
  getBlogUsers,
  getMyBlogs,
  getMyJoinedBlogs,
  joinBlog,
  leaveBlog,
  searchBlogs,
  updateBlog,
} from "./blog.controller.js";

const router = Router();

router.post("/create", authMiddleware, createBlog);
router.get("/get-my-blogs", authMiddleware, getMyBlogs);
router.get("/get-my-joined-blogs", authMiddleware, getMyJoinedBlogs);
router.get("/get-blog-info/:blogId", authMiddleware, getBlogInfo);
router.put("/update/:blog_id", authMiddleware, updateBlog);
router.delete("/delete/:blog_id", authMiddleware, deleteBlog);
router.get("/search", authMiddleware, searchBlogs);
router.post("/join-blog/:blog_id", authMiddleware, joinBlog);
router.post("/leave-blog/:blog_id", authMiddleware, leaveBlog);
router.get("/:blogId/get-users", authMiddleware, getBlogUsers);

export default router;
