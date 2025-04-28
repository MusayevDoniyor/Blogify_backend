import { Response } from "express";
import {
  createPostService,
  getAllPostsService,
  getPostByIdAndIncrementViewService,
  updatePostService,
  deletePostService,
  getSortedPostsByDateService,
} from "./post.service.js";
import {
  ICreatePostDTO,
  IUpdatePostDTO,
  IDeletePostDTO,
} from "./post.types.js";
import { responser } from "../../utils/helper.js";
import { IRequest } from "../../types/express.types.js";

export const createPost = async (
  req: IRequest,
  res: Response
): Promise<void> => {
  try {
    const { blog_id, title, content } = req.body;
    const owner_id = req.user?.id as number;

    if (!blog_id || !title || !content) {
      return responser({
        res,
        status: 400,
        error: "Blog ID, title, and content are required",
      });
    }

    const postData: ICreatePostDTO = { blog_id, owner_id, title, content };
    const post = await createPostService(postData);

    return responser({ res, status: 201, data: post, error: null });
  } catch (error: any) {
    return responser({
      res,
      status: 500,
      error: { message: "Internal Server Error", error: error.message },
    });
  }
};

export const getAllPosts = async (
  req: IRequest,
  res: Response
): Promise<void> => {
  try {
    const blog_id = req.params.blog_id as unknown as number;

    if (!blog_id) {
      return responser({ res, status: 400, error: "Blog ID is required" });
    }

    const posts = await getAllPostsService(blog_id);

    return responser({ res, status: 200, data: posts, error: null });
  } catch (error: any) {
    return responser({
      res,
      status: 500,
      error: { message: "Internal Server Error", error: error.message },
    });
  }
};

export const getPostById = async (
  req: IRequest,
  res: Response
): Promise<void> => {
  try {
    const post_id = req.params.post_id as unknown as number;

    if (!post_id) {
      return responser({ res, status: 400, error: "Post ID is required" });
    }

    const post = await getPostByIdAndIncrementViewService(post_id);

    if (!post) {
      return responser({ res, status: 404, error: "Post not found" });
    }

    return responser({ res, status: 200, data: post, error: null });
  } catch (error: any) {
    return responser({
      res,
      status: 500,
      error: { message: "Internal Server Error", error: error.message },
    });
  }
};

export const updatePost = async (
  req: IRequest,
  res: Response
): Promise<void> => {
  try {
    const post_id = req.params.post_id as unknown as number;
    const owner_id = req.user?.id as number;
    const { title, content } = req.body;

    if (!title || !content) {
      return responser({
        res,
        status: 400,
        error: "Title and content are required",
      });
    }

    const postData: IUpdatePostDTO = { post_id, owner_id, title, content };
    const updatedPost = await updatePostService(postData);

    if (!updatedPost) {
      return responser({
        res,
        status: 403,
        error: "You are not the owner of this post",
      });
    }

    return responser({ res, status: 200, data: updatedPost, error: null });
  } catch (error: any) {
    return responser({
      res,
      status: 500,
      error: { message: "Internal Server Error", error: error.message },
    });
  }
};

export const deletePost = async (
  req: IRequest,
  res: Response
): Promise<void> => {
  try {
    const post_id = req.params.post_id as unknown as number;
    const owner_id = req.user?.id as number;

    const postData: IDeletePostDTO = { post_id, owner_id };
    const deletedPost = await deletePostService(postData);

    if (!deletedPost) {
      return responser({
        res,
        status: 403,
        error: "You are not the owner of this post",
      });
    }

    return responser({ res, status: 200, data: deletedPost, error: null });
  } catch (error: any) {
    return responser({
      res,
      status: 500,
      error: { message: "Internal Server Error", error: error.message },
    });
  }
};

export const getSortedPostsByDate = async (
  req: IRequest,
  res: Response
): Promise<void> => {
  try {
    const blog_id = req.params.blog_id as unknown as number;

    if (!blog_id) {
      return responser({ res, status: 400, error: "Blog ID is required" });
    }

    const posts = await getSortedPostsByDateService(blog_id);

    return responser({ res, status: 200, data: posts, error: null });
  } catch (error: any) {
    return responser({
      res,
      status: 500,
      error: { message: "Internal Server Error", error: error.message },
    });
  }
};
