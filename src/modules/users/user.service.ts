import client from "../../config/db.config.js";
import { IUser } from "../../types/user.types.js";
import {
  findUserByEmail,
  getMyProfileQuery,
  registerQuery,
} from "./user.sql.js";
import bcrypt from "bcryptjs";

export const checkUserExists = async (email: string, username: string) => {
  const { rows: emailRows } = await client.query(
    `SELECT id FROM users WHERE email = $1`,
    [email]
  );

  const { rows: usernameRows } = await client.query(
    `SELECT id FROM users WHERE username = $1`,
    [username]
  );

  return {
    emailExists: emailRows.length > 0,
    usernameExists: usernameRows.length > 0,
  };
};

export const getMyProfileService = async (userId: number) => {
  const { rows } = await client.query(getMyProfileQuery, [userId]);
  return rows[0];
};

export const registerService = async ({
  name,
  username,
  email,
  password,
}: IUser) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  const { rows } = await client.query(registerQuery, [
    name,
    username,
    email,
    hashedPassword,
  ]);
  return rows[0];
};

export const loginService = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const { rows } = await client.query(findUserByEmail, [email]);

  const user = rows[0];

  if (!user) return null;

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) return null;

  delete user.password;
  return user;
};
