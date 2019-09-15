import { Request, Response, NextFunction } from "express";
import { InternalServerError } from "../messages/InternalServerError";

export default (
  error: Error,
  _: Request,
  response: Response,
  __: NextFunction
): Response => {
  console.error(error);

  return /prod/gi.test(process.env.NODE_ENV as string)
    ? response.status(500).json({ message: InternalServerError })
    : response.status(500).json(error);
};
