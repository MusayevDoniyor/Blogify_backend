import client from "../../config/db.config.js";
import {
  createBlogQuery,
  deleteBlogQuery,
  getBlogInfoQuery,
  getBlogUsersQuery,
  getMyBlogsQuery,
  getMyJoinedBlogsQuery,
  joinBlogQuery,
  leaveBlogQuery,
  searchBlogsQuery,
  updateBlogQuery,
} from "./blog.sql.js";
import {
  ICreateBlogDTO,
  IDeleteBlogDTO,
  IJoinLeaveBlogDTO,
  IUpdateBlogDTO,
} from "./blog.types.js";

export const createBlogService = async ({
  title,
  description,
  owner_id,
}: ICreateBlogDTO) => {
  const { rows } = await client.query(createBlogQuery, [
    title,
    description,
    owner_id,
  ]);
  return rows[0];
};

export const getMyBlogsService = async (owner_id: number) => {
  const { rows } = await client.query(getMyBlogsQuery, [owner_id]);
  return rows;
};

export const getMyJoinedBlogsService = async (user_id: number) => {
  const { rows } = await client.query(getMyJoinedBlogsQuery, [user_id]);
  return rows;
};

export const getBlogInfoService = async (blog_id: number) => {
  const { rows } = await client.query(getBlogInfoQuery, [blog_id]);
  return rows[0];
};

export const updateBlogService = async ({
  title,
  description,
  blog_id,
  owner_id,
}: IUpdateBlogDTO) => {
  const { rows } = await client.query(updateBlogQuery, [
    title,
    description,
    blog_id,
    owner_id,
  ]);
  return rows[0];
};

export const deleteBlogService = async ({
  blog_id,
  owner_id,
}: IDeleteBlogDTO) => {
  const { rows: existingBlog } = await client.query(
    `SELECT * FROM blogs WHERE id = $1 AND owner_id = $2`,
    [blog_id, owner_id]
  );

  if (existingBlog.length === 0) {
    return null;
  }

  const { rows } = await client.query(deleteBlogQuery, [blog_id, owner_id]);
  return rows[0];
};

export const searchBlogsService = async (keyword: string) => {
  const { rows } = await client.query(searchBlogsQuery, [`%${keyword}%`]);
  return rows;
};

export const joinBlogService = async ({
  blog_id,
  user_id,
}: IJoinLeaveBlogDTO) => {
  const { rows } = await client.query(joinBlogQuery, [blog_id, user_id]);
  return rows[0];
};

export const leaveBlogService = async ({
  blog_id,
  user_id,
}: IJoinLeaveBlogDTO) => {
  const { rows } = await client.query(leaveBlogQuery, [blog_id, user_id]);
  return rows[0];
};

export const getBlogUsersService = async (blog_id: number) => {
  const { rows } = await client.query(getBlogUsersQuery, [blog_id]);
  return rows;
};
