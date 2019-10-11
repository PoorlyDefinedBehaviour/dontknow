import UserService from "../services/user.service";
import { Request, Response } from "express";
import {
  UNPROCESSABLE_ENTITY,
  CREATED,
  UNAUTHORIZED,
  getStatusText,
  OK,
  BAD_REQUEST,
  NO_CONTENT
} from "http-status-codes";

export default class UserController {
  public static getUserById = async (
    request: Request,
    response: Response
  ): Promise<Response> => {
    const { _id } = request.params;

    const { data } = await UserService.findUserById(_id);

    return response.status(OK).json({ data });
  };

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

    return response.status(OK).json({ data });
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

  public static setUserAvatar = async (
    request: Request,
    response: Response
  ): Promise<Response> => {
    const userId: string = request.body.tokenPayload;

    const { ok } = await UserService.setUserAvatar(userId, request.file);
    if (!ok) {
      return response
        .status(BAD_REQUEST)
        .json({ message: getStatusText(BAD_REQUEST) });
    }

    return response
      .send(NO_CONTENT)
      .json({ message: getStatusText(NO_CONTENT) });
  };

  public static removeUserAvatar = async (
    request: Request,
    response: Response
  ): Promise<Response> => {
    const userId: string = request.body.tokenPayload;

    const { ok } = await UserService.removeUserAvatar(userId);
    if (!ok) {
      return response
        .status(BAD_REQUEST)
        .json({ message: getStatusText(BAD_REQUEST) });
    }

    return response
      .send(NO_CONTENT)
      .json({ message: getStatusText(NO_CONTENT) });
  };

  public static update = async (
    request: Request,
    response: Response
  ): Promise<Response> => {
    const userId = request.body.tokenPayload;
    const { payload } = request.body;

    const { ok, data } = await UserService.updateOne(userId, payload);
    if (!ok) {
      return response
        .status(BAD_REQUEST)
        .json({ message: getStatusText(BAD_REQUEST) });
    }

    return response.status(OK).json(data);
  };
}
