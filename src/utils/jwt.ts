import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const access_token_secret = process.env.JWT_SECRET as string;

export const signToken = (payload: object) => {
  return jwt.sign(payload, access_token_secret, {
    expiresIn: "2d",
  });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, access_token_secret);
};
