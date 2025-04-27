import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { responser } from "../utils/helper.js";
import { IRequest } from "../types/express.types.js";

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
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: number;
    };

    req.user = decoded;
    next();
  } catch (error) {
    return responser({ res, status: 401, error: "Invalid token" });
  }
};
