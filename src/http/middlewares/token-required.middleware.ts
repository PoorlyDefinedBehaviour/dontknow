import { verify } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { UNAUTHORIZED, getStatusText } from "http-status-codes";
import UserService from "../services/user.service";
import { Maybe } from "../../typings/maybe";

const decodeToken = async (bearerToken: string) => {
  try {
    const token = bearerToken.split(" ")[1];
    const payload = await verify(token, process.env.JWT_SECRET!);
    return { token, payload };
  } catch (ex) {
    console.error(ex);
    return null;
  }
};

const tokenRequired = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const bearerToken: Maybe<string> = request.headers.authorization;
  if (!bearerToken) {
    return response
      .status(UNAUTHORIZED)
      .json({ message: getStatusText(UNAUTHORIZED) });
  }

  const result: any = await decodeToken(bearerToken);
  if (!result || !result.payload) {
    return response
      .status(UNAUTHORIZED)
      .json({ message: getStatusText(UNAUTHORIZED) });
  }

  const isTokenValid: boolean = await UserService.isTokenValid(
    result.payload.userId,
    result.token
  );

  if (!isTokenValid) {
    return response
      .status(UNAUTHORIZED)
      .json({ message: getStatusText(UNAUTHORIZED) });
  }

  request.body.tokenPayload = result.payload.userId;
  return next();
};

export default tokenRequired;
