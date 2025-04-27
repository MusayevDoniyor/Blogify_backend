import { Response } from "express";

export interface IResponseFunc {
  res: Response;
  status: number;
  error?: any;
  data?: any;
}
