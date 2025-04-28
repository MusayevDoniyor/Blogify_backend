import client from "../../config/db.config.js";
import {
  createPostQuery,
  deletePostQuery,
  getAllPostsQuery,
  getPostByIdAndIncrementViewQuery,
  getSortedPostsByDateQuery,
  updatePostQuery,
} from "./post.sql.js";
import {
  ICreatePostDTO,
  IDeletePostDTO,
  IUpdatePostDTO,
} from "./post.types.js";

export const createPostService = async ({
  blog_id,
  owner_id,
  title,
  content,
}: ICreatePostDTO) => {
  const { rows } = await client.query(createPostQuery, [
    blog_id,
    owner_id,
    title,
    content,
  ]);
  return rows[0];
};

export const getAllPostsService = async (blog_id: number) => {
  const { rows } = await client.query(getAllPostsQuery, [blog_id]);
  return rows;
};

export const getPostByIdAndIncrementViewService = async (post_id: number) => {
  const { rows } = await client.query(getPostByIdAndIncrementViewQuery, [
    post_id,
  ]);
  return rows[0];
};

export const updatePostService = async ({
  title,
  content,
  post_id,
  owner_id,
}: IUpdatePostDTO) => {
  const { rows } = await client.query(updatePostQuery, [
    title,
    content,
    post_id,
    owner_id,
  ]);
  return rows[0];
};

export const deletePostService = async ({
  post_id,
  owner_id,
}: IDeletePostDTO) => {
  const { rows } = await client.query(deletePostQuery, [post_id, owner_id]);
  return rows[0];
};

export const getSortedPostsByDateService = async (blog_id: number) => {
  const { rows } = await client.query(getSortedPostsByDateQuery, [blog_id]);
  return rows;
};
