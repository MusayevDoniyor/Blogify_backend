import { Response } from "express";
import { IRequest } from "../../types/express.types.js";
import { responser } from "../../utils/helper.js";
import {
  createBlogService,
  deleteBlogService,
  getBlogInfoService,
  getBlogUsersService,
  getMyBlogsService,
  getMyJoinedBlogsService,
  joinBlogService,
  leaveBlogService,
  searchBlogsService,
  updateBlogService,
} from "./blog.service.js";
import client from "../../config/db.config.js";
import { checkIsMemberQuery } from "./blog.sql.js";

export const createBlog = async (req: IRequest, res: Response) => {
  try {
    const { title, description } = req.body;
    const owner_id = req.user?.id as number;

    if (!title) {
      return responser({ res, status: 400, error: "Title is required" });
    }

    const blog = await createBlogService({ title, description, owner_id });
    return responser({ res, status: 201, data: blog, error: null });
  } catch (error: any) {
    return responser({
      res,
      status: 500,
      error: { message: "Internal Server Error", error: error.message },
    });
  }
};

export const getMyBlogs = async (req: IRequest, res: Response) => {
  try {
    const ownerId = req.user?.id as number;
    const blogs = await getMyBlogsService(ownerId);
    return responser({ res, status: 200, data: blogs, error: null });
  } catch (error: any) {
    return responser({
      res,
      status: 500,
      error: { message: "Internal Server Error", error: error.message },
    });
  }
};

export const getMyJoinedBlogs = async (req: IRequest, res: Response) => {
  try {
    const userId = req.user?.id as number;
    const blogs = await getMyJoinedBlogsService(userId);
    if (!blogs) {
      return responser({ res, status: 404, error: "Joined blogs not found" });
    }
    return responser({ res, status: 200, data: blogs, error: null });
  } catch (error: any) {
    return responser({
      res,
      status: 500,
      error: { message: "Internal Server Error", error: error.message },
    });
  }
};

export const getBlogInfo = async (req: IRequest, res: Response) => {
  try {
    const blogId = Number(req.params.blogId);
    if (!blogId) {
      return responser({ res, status: 400, error: "Blog ID is required" });
    }

    const blog = await getBlogInfoService(blogId);
    if (!blog) {
      return responser({ res, status: 404, error: "Blog not found" });
    }

    return responser({ res, status: 200, data: blog, error: null });
  } catch (error: any) {
    return responser({
      res,
      status: 500,
      error: { message: "Internal Server Error", error: error.message },
    });
  }
};

export const updateBlog = async (req: IRequest, res: Response) => {
  try {
    const { title } = req.body;
    const blog_id = req.params.blog_id as unknown as number;
    const owner_id = req.user?.id as number;

    if (!blog_id || !title) {
      return responser({
        res,
        status: 400,
        error: "Blog ID and Title are required",
      });
    }

    const { rows: existingBlog } = await client.query(
      `SELECT description FROM blogs WHERE id = $1`,
      [blog_id]
    );

    if (existingBlog.length === 0) {
      return responser({
        res,
        status: 404,
        error: "Blog not found",
      });
    }

    const blog = await updateBlogService({
      title,
      description: req.body.description || existingBlog[0].description,
      blog_id,
      owner_id,
    });
    if (!blog) {
      return responser({
        res,
        status: 403,
        error: "You are not the owner of this blog",
      });
    }

    return responser({ res, status: 200, data: blog, error: null });
  } catch (error: any) {
    return responser({
      res,
      status: 500,
      error: { message: "Internal Server Error", error: error.message },
    });
  }
};

export const deleteBlog = async (req: IRequest, res: Response) => {
  try {
    const blog_id = req.params.blog_id as unknown as number;
    const owner_id = req.user?.id as number;

    if (!blog_id) {
      return responser({ res, status: 400, error: "Blog ID is required" });
    }

    // Attempt to delete the blog
    const blog = await deleteBlogService({ blog_id, owner_id });

    // If the blog is not found, or the user is not the owner, return an error
    if (!blog) {
      return responser({
        res,
        status: 403,
        error: "Blog not found or you are not the owner of this blog",
      });
    }

    return responser({ res, status: 200, data: blog, error: null });
  } catch (error: any) {
    return responser({
      res,
      status: 500,
      error: { message: "Internal Server Error", error: error.message },
    });
  }
};

export const searchBlogs = async (req: IRequest, res: Response) => {
  try {
    const keyword = req.query.keyword as string;
    if (!keyword) {
      return responser({ res, status: 400, error: "Keyword is required" });
    }

    const blogs = await searchBlogsService(keyword);
    return responser({ res, status: 200, data: blogs, error: null });
  } catch (error: any) {
    return responser({
      res,
      status: 500,
      error: { message: "Internal Server Error", error: error.message },
    });
  }
};

export const joinBlog = async (req: IRequest, res: Response) => {
  try {
    const blog_id = req.params.blog_id as unknown as number;
    const user_id = req.user?.id as number;

    if (!blog_id) {
      return responser({ res, status: 400, error: "Blog ID is required" });
    }

    const blogOwner = await client.query(
      `SELECT owner_id FROM blogs WHERE id = $1`,
      [blog_id]
    );
    if (blogOwner.rows[0].owner_id === user_id) {
      return responser({
        res,
        status: 400,
        error: "You are the owner of the blog and cannot join as a member",
      });
    }

    const { rows: existingMember } = await client.query(checkIsMemberQuery, [
      blog_id,
      user_id,
    ]);
    if (existingMember.length > 0) {
      return responser({
        res,
        status: 400,
        error: "You are already a member of this blog",
      });
    }
    const result = await joinBlogService({ blog_id, user_id });
    return responser({ res, status: 200, data: result, error: null });
  } catch (error: any) {
    return responser({
      res,
      status: 500,
      error: { message: "Internal Server Error", error: error.message },
    });
  }
};

export const leaveBlog = async (req: IRequest, res: Response) => {
  try {
    const blog_id = req.params.blog_id as unknown as number;
    const user_id = req.user?.id as number;

    if (!blog_id) {
      return responser({ res, status: 400, error: "Blog ID is required" });
    }

    const { rows: existingMember } = await client.query(checkIsMemberQuery, [
      blog_id,
      user_id,
    ]);
    if (!existingMember.length) {
      return responser({
        res,
        status: 400,
        error: "You are not a member of this blog",
      });
    }

    const result = await leaveBlogService({ blog_id, user_id });
    return responser({ res, status: 200, data: result, error: null });
  } catch (error: any) {
    return responser({
      res,
      status: 500,
      error: { message: "Internal Server Error", error: error.message },
    });
  }
};

export const getBlogUsers = async (req: IRequest, res: Response) => {
  try {
    const blogId = Number(req.params.blogId);
    if (!blogId) {
      return responser({ res, status: 400, error: "Blog ID is required" });
    }

    const users = await getBlogUsersService(blogId);
    return responser({ res, status: 200, data: users, error: null });
  } catch (error: any) {
    return responser({
      res,
      status: 500,
      error: { message: "Internal Server Error", error: error.message },
    });
  }
};
