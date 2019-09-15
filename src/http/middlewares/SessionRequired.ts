import { Response, NextFunction } from "express";
import RequestWithSession from "../../interfaces/RequestWithSession";
import { Unauthorized } from "../messages/Unauthorized";

export default (
  request: RequestWithSession,
  response: Response,
  next: NextFunction
) => {
  if (!request.session || !request.session.user_id) {
    return response.status(401).json(Unauthorized);
  }
  return next();
};
