import { Response, NextFunction } from "express";
import RequestWithSession from "../../interfaces/request-with-session.interface";
import { getStatusText, UNAUTHORIZED } from "http-status-codes";

export default (
  request: RequestWithSession,
  response: Response,
  next: NextFunction
) => {
  if (!request.session || !request.session.user_id) {
    return response.status(401).json({ message: getStatusText(UNAUTHORIZED) });
  }
  return next();
};
