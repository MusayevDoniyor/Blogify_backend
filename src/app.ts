import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import { responser } from "./utils/helper.js";

import UserRoutes from "./modules/users/user.routes.js";
import BlogRoutes from "./modules/blogs/blog.routes.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(cookieParser());

app.use("/api/v1/users", UserRoutes);

app.use("/api/v1/blogs", BlogRoutes);

app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    responser({
      res,
      status: 500,
      error: { message: "Internal Server Error", error: err.message },
    });
    next();
  }
);

export default app;
