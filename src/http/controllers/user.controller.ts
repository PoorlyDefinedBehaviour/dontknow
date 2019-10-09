import UserService from "../services/user.service";
import { Request, Response } from "express";
import {
  UNPROCESSABLE_ENTITY,
  CREATED,
  UNAUTHORIZED,
  getStatusText,
  OK,
  BAD_REQUEST
} from "http-status-codes";

export default class UserController {
  public static register = async (
    request: Request,
    response: Response
  ): Promise<Response> => {
    const { ok, data, message } = await UserService.register(
      request.body.payload
    );
    if (!ok) {
      return response.status(UNPROCESSABLE_ENTITY).json({ message });
    }

    return response.status(CREATED).json({ data });
  };

  public static login = async (
    request: Request,
    response: Response
  ): Promise<Response> => {
    const { email, password } = request.body.payload;

    const { ok, data } = await UserService.login(email, password);
    if (!ok) {
      return response
        .status(UNAUTHORIZED)
        .json({ message: getStatusText(UNAUTHORIZED) });
    }

    return response.status(OK).json(data);
  };

  public static logout = async (
    request: Request,
    response: Response
  ): Promise<Response> => {
    const { ok } = await UserService.logout(request.body.tokenPayload);
    if (!ok) {
      return response
        .status(BAD_REQUEST)
        .json({ message: getStatusText(BAD_REQUEST) });
    }

    return response.send();
  };

  public static update = async (
    request: Request,
    response: Response
  ): Promise<Response> => {
    const userId = request.body.tokenPayload;
    const { payload } = request.body;

    const { ok, data: user } = await UserService.updateOne(userId, payload);
    if (!ok) {
      return response
        .status(BAD_REQUEST)
        .json({ message: getStatusText(BAD_REQUEST) });
    }

    return response.status(OK).json(user);
  };
}
