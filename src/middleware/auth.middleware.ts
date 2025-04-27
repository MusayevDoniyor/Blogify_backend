import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { responser } from "../utils/helper.js";
import { IRequest } from "../types/express.types.js";
import { verifyToken } from "../utils/jwt.js";

interface UserPayload {
  id: number;
}

export const authMiddleware = async (
  req: IRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const token: string = req.cookies?.access_token;

  if (!token) {
    return responser({ res, status: 401, error: "Unauthorized" });
  }

  try {
    const decoded = verifyToken(token) as UserPayload;

    req.user = decoded;
    next();
  } catch (error: any) {
    if (error instanceof jwt.JsonWebTokenError) {
      return responser({ res, status: 401, error: "Invalid token" });
    }
    return responser({ res, status: 500, error: error.message });
  }
};
