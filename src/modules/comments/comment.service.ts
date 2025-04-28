import client from "../../config/db.config.js";
import {
  createCommentQuery,
  deleteCommentQuery,
  getCommentsByPostIdQuery,
  updateCommentQuery,
} from "./comment.sql.js";

export const createCommentService = async (
  postId: number,
  userId: number,
  content: string
) => {
  const postExistsQuery = `SELECT * FROM posts WHERE id = $1`;
  const post = await client.query(postExistsQuery, [postId]);

  if (post.rows.length === 0) {
    throw new Error("Post not found");
  }

  const createCommentQuery = `
    INSERT INTO comments (post_id, user_id, content)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;

  const result = await client.query(createCommentQuery, [
    postId,
    userId,
    content,
  ]);
  return result.rows[0];
};

export const getCommentsByPostIdService = async (post_id: number) => {
  const { rows } = await client.query(getCommentsByPostIdQuery, [post_id]);
  return rows;
};

export const updateCommentService = async (
  content: string,
  commentId: number,
  userId: number
) => {
  const { rows } = await client.query(updateCommentQuery, [
    content,
    commentId,
    userId,
  ]);
  return rows[0];
};

export const deleteCommentService = async (
  commentId: number,
  userId: number
) => {
  const { rows } = await client.query(deleteCommentQuery, [commentId, userId]);
  return rows[0];
};
