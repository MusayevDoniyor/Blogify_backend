import { Response } from "express";
import { IRequest } from "../../types/express.types.js";
import {
  getMyProfileService,
  registerService,
  loginService,
  checkUserExists,
} from "./user.service.js";
import { responser } from "../../utils/helper.js";
import { IUser } from "../../types/user.types.js";
import { signToken } from "../../utils/jwt.js";
import { setAccessTokenCookie } from "../../utils/cookies.js";

export const getMyProfile = async (req: IRequest, res: Response) => {
  try {
    const userId = req.user?.id as number;
    const user = await getMyProfileService(userId);

    return responser({ res, status: 200, data: user });
  } catch (error) {
    return responser({
      res,
      status: 500,
      error: "Internal Server Error",
    });
  }
};

export const register = async (req: IRequest, res: Response) => {
  try {
    const { name, username, email, password }: IUser = req.body;

    if (![name, username, email, password].every(Boolean)) {
      return responser({ res, status: 400, error: "All fields are required!" });
    }

    const { emailExists, usernameExists } = await checkUserExists(
      email,
      username
    );

    if (emailExists) {
      return responser({
        res,
        status: 409,
        error: "Email already exists!",
      });
    }

    if (usernameExists) {
      return responser({
        res,
        status: 409,
        error: "Username already exists!",
      });
    }

    const user = await registerService({
      name,
      username,
      email,
      password,
    });

    const access_token = signToken({ id: user?.id });
    setAccessTokenCookie(res, access_token);

    return responser({ res, status: 201, data: user });
  } catch (error) {
    return responser({
      res,
      status: 500,
      error: "Internal Server Error",
    });
  }
};

export const login = async (req: IRequest, res: Response): Promise<any> => {
  try {
    const { email, password }: { email: string; password: string } = req.body;

    if (!email || !password) {
      return responser({
        res,
        status: 400,
        error: "Email and password are required!",
      });
    }

    const user = await loginService({ email, password });

    if (!user) {
      return responser({ res, status: 401, error: "Invalid credentials!" });
    }

    const access_token = signToken({ id: user?.id });
    setAccessTokenCookie(res, access_token);

    return responser({ res, status: 200, data: user });
  } catch (error) {
    return responser({
      res,
      status: 500,
      error: "Internal Server Error" + error,
    });
  }
};
