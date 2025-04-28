import { Response } from "express";
import { IRequest } from "../../types/express.types.js";
import {
  createCommentService,
  getCommentsByPostIdService,
  updateCommentService,
  deleteCommentService,
} from "./comment.service.js";
import { responser } from "../../utils/helper.js";

export const createComment = async (
  req: IRequest,
  res: Response
): Promise<void> => {
  try {
    const { content } = req.body;
    const userId = req.user?.id as number;
    const postId = req.params.post_id as unknown as number;

    if (!postId || !content) {
      return responser({
        res,
        status: 400,
        error: "Post ID and content are required",
      });
    }

    try {
      const newComment = await createCommentService(postId, userId, content);
      return responser({
        res,
        status: 201,
        data: newComment,
      });
    } catch (error: any) {
      return responser({
        res,
        status: 404,
        error: error.message,
      });
    }
  } catch (error) {
    return responser({
      res,
      status: 500,
      error: "Internal server error",
    });
  }
};

export const getCommentsByPostId = async (req: IRequest, res: Response) => {
  try {
    const postId = req.params.post_id;

    if (!postId) {
      return responser({
        res,
        status: 400,
        error: "Post ID is required",
      });
    }

    const comments = await getCommentsByPostIdService(Number(postId));
    return responser({
      res,
      status: 200,
      data: comments,
    });
  } catch (error) {
    return responser({
      res,
      status: 500,
      error: "Internal server error",
    });
  }
};

export const updateComment = async (req: IRequest, res: Response) => {
  try {
    const { content } = req.body;
    const commentId = req.params.comment_id;
    const userId = req.user?.id;

    if (!content) {
      return responser({
        res,
        status: 400,
        error: "Content is required",
      });
    }

    const updatedComment = await updateCommentService(
      content,
      Number(commentId),
      Number(userId)
    );
    if (!updatedComment) {
      return responser({
        res,
        status: 403,
        error: "You can only edit your own comments",
      });
    }

    return responser({
      res,
      status: 200,
      data: updatedComment,
    });
  } catch (error) {
    return responser({
      res,
      status: 500,
      error: "Internal server error",
    });
  }
};

export const deleteComment = async (req: IRequest, res: Response) => {
  try {
    const commentId = req.params.comment_id;
    const userId = req.user?.id;

    const deletedComment = await deleteCommentService(
      Number(commentId),
      Number(userId)
    );
    if (!deletedComment) {
      return responser({
        res,
        status: 403,
        error: "You can only delete your own comments",
      });
    }

    return responser({
      res,
      status: 200,
      data: deletedComment,
    });
  } catch (error) {
    return responser({
      res,
      status: 500,
      error: "Internal server error",
    });
  }
};
