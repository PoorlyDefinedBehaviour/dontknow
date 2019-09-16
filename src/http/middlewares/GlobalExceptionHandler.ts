import { Request, Response, NextFunction } from "express";
import { getStatusText, INTERNAL_SERVER_ERROR } from "http-status-codes";

export default (
  error: Error,
  _: Request,
  response: Response,
  __: NextFunction
): Response => {
  console.error(error);

  return /prod/gi.test(process.env.NODE_ENV as string)
    ? response
        .status(INTERNAL_SERVER_ERROR)
        .json({ message: getStatusText(INTERNAL_SERVER_ERROR) })
    : response.status(INTERNAL_SERVER_ERROR).json(error);
};
