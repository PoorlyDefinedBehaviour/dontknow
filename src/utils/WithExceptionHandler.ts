import { Response, NextFunction } from "express";
import RequestWithSession from "../interfaces/RequestWithSession";

export default (fn: Function) => (
  request: RequestWithSession,
  response: Response,
  next: NextFunction
) => {
  try {
    fn(request, response);
    next();
  } catch (ex) {
    next(ex);
  }
};
