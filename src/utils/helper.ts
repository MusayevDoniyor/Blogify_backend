import { IResponseFunc } from "../types/helper.types.js";

export const responser = ({
  res,
  status,
  error = null,
  data = null,
}: IResponseFunc) => {
  const statusMessages: Record<number, string> = {
    200: "Successfull",
    201: "Successfully created",
    400: "Bad request",
    401: "Unauthenticated",
    404: "Not found",
    409: "Conflict error",
    500: "Internal Server error",
  };

  res.status(status).json({
    success: !error,
    message: statusMessages[status] ?? "Unexpected responser status",
    error: error ?? undefined,
    data: data ?? undefined,
  });
};
